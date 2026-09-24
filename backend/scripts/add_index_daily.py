from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy.orm import Session

from app.db.database import engine
from app.db.models import IndexDaily


IST = ZoneInfo("Asia/Kolkata")


def add_index_daily(index, index_value):
    try:
        today = datetime.now(IST).date()

        with Session(engine) as db:

            daily = db.query(IndexDaily).filter(
                IndexDaily.index_id == index.id,
                IndexDaily.date == today
            ).first()

            if daily is None:
                daily = IndexDaily(
                    index_id=index.id,
                    date=today,
                    open=index_value,
                    high=index_value,
                    low=index_value,
                    close=index_value,
                    change=0,
                    change_percent=0
                )

                db.add(daily)

            else:
                daily.high = max(daily.high, index_value)
                daily.low = min(daily.low, index_value)
                daily.close = index_value

            db.commit()

            return {
                "status": "success"
            }

    except Exception as e:
        print(
            f"[INDEX_DAILY] Failed to update "
            f"for index_id={index.id}: {e}",
            flush=True
        )

        return {
            "status": "failed"
        }