from fastapi import APIRouter
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