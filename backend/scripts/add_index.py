from datetime import datetime
from sqlalchemy.orm import Session
from zoneinfo import ZoneInfo
from app.db.models import IndexValue
from app.db.database import engine


def add_index_value(index, index_value, total_ffmc, divisor):
    try:
        with Session(engine) as db:
            data = IndexValue(
                index_id=index.id,
                timestamp=datetime.now(ZoneInfo("Asia/Kolkata")),
                index_value=index_value,
                total_free_float_market_cap=total_ffmc,
                divisor=divisor
            )

            db.add(data)
            db.commit()

            return {
                "status": "success"
            }

    except Exception as e:
        print(
            f"[INDEX_VALUE] Failed to store index value "
            f"for index_id={index.id}: {e}"
        )

        return {
            "status": "failed"
        }