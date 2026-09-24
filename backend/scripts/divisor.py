from sqlalchemy.orm import Session

from app.db.models import IndexDivisor
from app.db.database import engine


def get_divisor(index_id) -> float | None:
    try:
        with Session(engine) as db:
            result = db.query(IndexDivisor).filter(
                IndexDivisor.index_id == index_id,
                IndexDivisor.effective_to.is_(None)
            ).first()

            if result is None:
                print(
                    f"[DIVISOR] No active divisor found "
                    f"for index_id={index_id}"
                )
                return None

            return result.divisor

    except Exception as e:
        print(
            f"[DIVISOR] Failed to retrieve divisor "
            f"for index_id={index_id}: {e}"
        )
        return None