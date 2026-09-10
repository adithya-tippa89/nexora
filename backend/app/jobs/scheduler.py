import time
import logging
from app.config import settings
from app.database import SessionLocal
from app.services.job_collector import collect_jobs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


if __name__ == "__main__":
    interval_seconds = max(settings.JOB_COLLECTION_INTERVAL_HOURS, 1) * 60 * 60
    while True:
        db = SessionLocal()
        try:
            logger.info("Starting scheduled job collection")
            collect_jobs(db)
        except Exception:
            logger.exception("Scheduled job collection failed")
        finally:
            db.close()
        time.sleep(interval_seconds)
