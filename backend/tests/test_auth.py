import pytest
from datetime import date
from unittest.mock import patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models.role import Role
from app.models.user import User
from app.auth.password import hash_password
from app.job_sources.base import ExternalJob
from app.models.job import Job
from app.services.job_collector import collect_jobs

# In-memory database fixture for test isolation
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_test_db():
    """Setup clean tables and seed default roles before each test run."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Seed default system roles
    for r_name in ["student", "trainer", "employer", "admin"]:
        if not db.query(Role).filter(Role.name == r_name).first():
            db.add(Role(name=r_name))
    db.commit()
    
    # Pre-seed an admin account for RBAC comparison testing
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    if not db.query(User).filter(User.email == "admin@maharashtra.gov.in").first():
        admin_user = User(
            name="State Administrator",
            email="admin@maharashtra.gov.in",
            password_hash=hash_password("AdminSecurePass123!"),
            role_id=admin_role.id,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
    db.close()
    
    yield
    
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

# -------------------------------------------------------------
# Test 1: Register Student Account
# -------------------------------------------------------------
def test_1_register_student():
    payload = {
        "name": "Rohan Shinde",
        "email": "student@example.com",
        "password": "SecurePassword123!",
        "role": "student",
        "district": "Pune",
        "organization": "COEP Technical Campus"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "student@example.com"
    assert data["role"] == "student"
    assert data["name"] == "Rohan Shinde"
    assert "password" not in data
    assert "password_hash" not in data
    assert "id" in data

# -------------------------------------------------------------
# Test 2: Login with Correct Credentials -> JWT Token Returned
# -------------------------------------------------------------
def test_2_login_valid_credentials():
    # First register user
    client.post("/auth/register", json={
        "name": "Rohan Shinde",
        "email": "student@example.com",
        "password": "SecurePassword123!",
        "role": "student"
    })

    # Login
    response = client.post("/auth/login", json={
        "email": "student@example.com",
        "password": "SecurePassword123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "student@example.com"
    assert data["user"]["role"] == "student"

# -------------------------------------------------------------
# Test 3: Login with Incorrect Password -> 401 Unauthorized
# -------------------------------------------------------------
def test_3_login_incorrect_password():
    client.post("/auth/register", json={
        "name": "Rohan Shinde",
        "email": "student@example.com",
        "password": "SecurePassword123!",
        "role": "student"
    })

    response = client.post("/auth/login", json={
        "email": "student@example.com",
        "password": "WrongPasswordXYZ"
    })
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]

# -------------------------------------------------------------
# Test 4: Call /users/me without Token -> 401 Unauthorized
# -------------------------------------------------------------
def test_4_users_me_unauthorized():
    response = client.get("/users/me")
    assert response.status_code == 401

# -------------------------------------------------------------
# Test 5: Call /users/me with Valid JWT -> Safe User Profile
# -------------------------------------------------------------
def test_5_users_me_authenticated():
    client.post("/auth/register", json={
        "name": "Pooja Patil",
        "email": "pooja@example.com",
        "password": "MySecretPass999!",
        "role": "student",
        "district": "Nagpur"
    })

    login_res = client.post("/auth/login", json={
        "email": "pooja@example.com",
        "password": "MySecretPass999!"
    })
    token = login_res.json()["access_token"]

    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    profile = response.json()
    assert profile["email"] == "pooja@example.com"
    assert profile["name"] == "Pooja Patil"
    assert profile["role"] == "student"
    assert profile["district"] == "Nagpur"
    assert "password" not in profile
    assert "password_hash" not in profile

# -------------------------------------------------------------
# Test 6: Access Admin-Only Endpoint with Student Token -> 403 Forbidden
# -------------------------------------------------------------
def test_6_student_forbidden_from_admin_route():
    # Create student & obtain token
    client.post("/auth/register", json={
        "name": "Student User",
        "email": "student_rbac@example.com",
        "password": "Password123!",
        "role": "student"
    })
    login_res = client.post("/auth/login", json={
        "email": "student_rbac@example.com",
        "password": "Password123!"
    })
    student_token = login_res.json()["access_token"]

    # Student attempts to call admin-only endpoint
    response = client.get("/users/admin-only", headers={"Authorization": f"Bearer {student_token}"})
    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]

    # Admin calls admin-only endpoint -> 200 OK
    admin_login = client.post("/auth/login", json={
        "email": "admin@maharashtra.gov.in",
        "password": "AdminSecurePass123!"
    })
    admin_token = admin_login.json()["access_token"]
    admin_res = client.get("/users/admin-only", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_res.status_code == 200
    assert "administrative authority" in admin_res.json()["message"]

# -------------------------------------------------------------
# Test 7: Prevent Public Registration as Admin -> 400 Bad Request
# -------------------------------------------------------------
def test_7_prohibit_admin_registration():
    payload = {
        "name": "Malicious Actor",
        "email": "fakeadmin@example.com",
        "password": "HackerPass123!",
        "role": "admin"
    }
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 400
    assert "Public registration as admin is prohibited" in response.json()["detail"]

# -------------------------------------------------------------
# Additional Verification: Trainer & Employer Registration + Profile Update
# -------------------------------------------------------------
def test_trainer_and_employer_registration():
    # Trainer
    tr_res = client.post("/auth/register", json={
        "name": "Prof. Deshmukh",
        "email": "deshmukh@coep.ac.in",
        "password": "TrainerPassword123!",
        "role": "trainer",
        "organization": "Government Polytechnic Pune"
    })
    assert tr_res.status_code == 201
    assert tr_res.json()["role"] == "trainer"

    # Employer
    emp_res = client.post("/auth/register", json={
        "name": "Anand Kulkarni",
        "email": "anand@tatamotors.com",
        "password": "EmployerPass123!",
        "role": "employer",
        "organization": "Tata Motors Pune"
    })
    assert emp_res.status_code == 201
    assert emp_res.json()["role"] == "employer"

def test_duplicate_email_registration_rejected():
    payload = {
        "name": "User One",
        "email": "duplicate@example.com",
        "password": "Password123!",
        "role": "student"
    }
    res1 = client.post("/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]

def test_user_profile_update():
    client.post("/auth/register", json={
        "name": "Pre-Update Name",
        "email": "updater@example.com",
        "password": "Password123!",
        "role": "student",
        "district": "Pune"
    })

    login_res = client.post("/auth/login", json={
        "email": "updater@example.com",
        "password": "Password123!"
    })
    token = login_res.json()["access_token"]

    update_res = client.put(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"name": "Post-Update Name", "district": "Mumbai City"}
    )
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "Post-Update Name"
    assert update_res.json()["district"] == "Mumbai City"


def test_job_cleaning_and_idempotent_collection():
    db = TestingSessionLocal()
    source_job = ExternalJob(
        " Software Engineer ", " ABC Technologies ", "Pune, Maharashtra", " Build systems ",
        "full_time", date(2026, 9, 1), "test", "https://example.test/jobs/1", "job-1", ["Python"]
    )
    adapter = lambda: type("Adapter", (), {"fetch_jobs": lambda self: [source_job]})()
    with patch("app.services.job_collector.ADAPTERS", {"test": adapter}):
        first = collect_jobs(db, "test")
        second = collect_jobs(db, "test")
    job = db.query(Job).one()
    assert first["jobs_inserted"] == 1
    assert second["jobs_inserted"] == 0
    assert second["duplicates_skipped"] == 1
    assert job.company == "ABC Technologies"
    assert job.district == "Pune"
    assert job.state == "Maharashtra"
    db.close()


def test_jobs_api_filter_and_admin_collection_protection():
    db = TestingSessionLocal()
    db.add(Job(
        title="Python Engineer", company="Example", location="Pune, Maharashtra", district="Pune",
        state="Maharashtra", source="test", source_url="https://example.test/2", dedupe_key="two"
    ))
    db.commit()
    db.close()
    response = client.get("/jobs?state=Maharashtra&title=Python")
    assert response.status_code == 200
    assert response.json()["total"] == 1
    assert client.post("/jobs/collect").status_code == 401
