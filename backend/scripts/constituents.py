from sqlalchemy.orm import Session

from app.db.database import engine
from app.db.models import IndexConstituent


def get_constituents(index_id):
    try:
        with Session(engine) as db:
            constituents = db.query(IndexConstituent).filter(
                IndexConstituent.index_id == index_id
            ).all()

            return constituents

    except Exception as e:
        print(
            f"[CONSTITUENTS] Failed to retrieve constituents "
            f"for index_id={index_id}: {e}"
        )
        return None