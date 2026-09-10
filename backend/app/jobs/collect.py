from app.database import SessionLocal
from app.services.job_collector import collect_jobs


if __name__ == "__main__":
    db = SessionLocal()
    try:
        print(collect_jobs(db))
    finally:
        db.close()