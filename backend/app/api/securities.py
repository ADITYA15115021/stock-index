from datetime import datetime, timedelta, time
from dateutil.relativedelta import relativedelta
from zoneinfo import ZoneInfo
from fastapi import APIRouter, Query
from sqlalchemy.orm import Session

from app.db.database import engine
from app.db.models import Security, MarketData

router = APIRouter()

@router.get("/securities/{securityId}")
def get_security(securityId: int):
    try:
        with Session(engine) as db:

            security = db.query(Security).filter(
                Security.id == securityId
            ).first()

            if security is None:
                return {
                    "error": "Security not found"
                }

            market_data = db.query(MarketData).filter(
                MarketData.security_id == securityId
            ).order_by(
                MarketData.timestamp.desc()
            ).first()

            if market_data is None:
                return {
                    "security_id": security.id,
                    "symbol": security.symbol,
                    "name": security.name,
                    "exchange": security.exchange,
                    "series": security.series,
                    "market_data": None
                }

            return {
                "security_id": security.id,
                "symbol": security.symbol,
                "name": security.name,
                "exchange": security.exchange,
                "series": security.series,
                "last_price": market_data.last_price,
                "total_market_cap": market_data.total_market_cap,
                "free_float_market_cap": market_data.free_float_market_cap,
                "impact_cost": market_data.impact_cost,
                "issued_size": market_data.issued_size,
                "timestamp": market_data.timestamp
            }

    except Exception as e:
        print(
            f"[GET_SECURITY] Failed for security_id={securityId}: {e}",
            flush=True
        )
        return {
            "error": "Failed to retrieve security data"
        }


@router.get("/securities/{securityId}/history")
def get_security_history(
    securityId: int,
    period: str = Query("1D")
):
    try:
        IST = ZoneInfo("Asia/Kolkata")
        today = datetime.now(IST).date()

        if period == "1D":
            start_date = today
        elif period == "1W":
            start_date = today - timedelta(days=6)
        elif period == "1M":
            start_date = today - relativedelta(months=1)
        elif period == "3M":
            start_date = today - relativedelta(months=3)
        elif period == "6M":
            start_date = today - relativedelta(months=6)
        elif period == "1Y":
            start_date = today - relativedelta(years=1)
        else:
            return {"error": "Invalid period"}

        start_datetime = datetime.combine(
            start_date,
            time.min,
            tzinfo=IST
        )

        end_datetime = datetime.combine(
            today + timedelta(days=1),
            time.min,
            tzinfo=IST
        )

        with Session(engine) as db:
            records = db.query(MarketData).filter(
                MarketData.security_id == securityId,
                MarketData.timestamp >= start_datetime,
                MarketData.timestamp < end_datetime
            ).order_by(
                MarketData.timestamp.asc()
            ).all()

            return [
                {
                    "date": record.timestamp.astimezone(IST).strftime("%Y-%m-%d"),
                    "time": record.timestamp.astimezone(IST).strftime("%H:%M"),
                    "last_price": record.last_price
                }
                for record in records
            ]

    except Exception as e:
        print(
            f"[GET_SECURITY_HISTORY] Failed for security_id={securityId}: {e}",
            flush=True
        )
        return {"error": "Failed to retrieve security history"}