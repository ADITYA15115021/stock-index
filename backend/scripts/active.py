from sqlalchemy.orm import Session
from app.db.database import engine
from app.db.models import Indices


def get_active_indices():
    try:
        with Session(engine) as db:
            indices = db.query(Indices).filter(
                Indices.status == "active"
            ).all()

            return indices

    except Exception as e:
        print(f"[ACTIVE_INDICES] Failed to retrieve active indices: {e}")
        return None