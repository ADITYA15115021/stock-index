from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from app.db.database import engine
from app.db.models import Indices, IndexValue, IndexDaily, IndexConstituent,Security, MarketData

from app.schemas.indices import IndexReponse

from datetime import datetime, timedelta, time
from dateutil.relativedelta import relativedelta
from zoneinfo import ZoneInfo
from fastapi import Query

router = APIRouter()


@router.get("/indices", response_model=list[IndexReponse])
def get_indices():
    try:
        with Session(engine) as db:
            indices = db.query(Indices).filter(Indices.status == "active").all()
            return indices

    except Exception as e:
        print(f"error in db query")  




@router.get("/indices/{indexId}")
def get_index(indexId: int):
    try:
        with Session(engine) as db:
            index = db.query(IndexValue).filter(
                IndexValue.index_id == indexId
            ).order_by(
                IndexValue.timestamp.desc()
            ).first()

            if index is None:
                return {"error": "Index value not found"}

            daily = db.query(IndexDaily).filter(
                IndexDaily.index_id == indexId
            ).order_by(
                IndexDaily.date.desc()
            ).first()

            if daily is None:
                return {
                    "index_value": index.index_value,
                    "timestamp": index.timestamp,
                    "open": None,
                    "close": daily.close,
                    "previous_close": None,
                    "high": None,
                    "low": None,
                    "change": None,
                    "change_percent": None
                }

            previous_daily = db.query(IndexDaily).filter(
                IndexDaily.index_id == indexId,
                IndexDaily.date < daily.date
            ).order_by(
                IndexDaily.date.desc()
            ).first()

            return {
                "index_value": index.index_value,
                "timestamp": index.timestamp,
                "open": daily.open,
                "close": daily.close,
                "previous_close": previous_daily.close,
                "high": daily.high,
                "low": daily.low,
                "change": daily.close - previous_daily.close,
                "change_percent": (
                    (daily.close - previous_daily.close)
                    / previous_daily.close
                ) * 100
            }

    except Exception as e:
        print(
            f"[GET_INDEX] Failed for index_id={indexId}: {e}",
            flush=True
        )



connected_clients = {}

@router.websocket("/indices/{indexId}/live")
async def index_live(websocket: WebSocket, indexId: int):
    await websocket.accept()

    if indexId not in connected_clients:
        connected_clients[indexId] = set()

    connected_clients[indexId].add(websocket)

    print(f"Client connected to index {indexId}")
    print(f"Connected clients: {len(connected_clients[indexId])}")

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        connected_clients[indexId].remove(websocket)

        if not connected_clients[indexId]:
            del connected_clients[indexId]

        print(f"Client disconnected from index {indexId}")
        print(f"Connected clients: {len(connected_clients.get(indexId, set()))}")                  



@router.get("/indices/{indexId}/constituents")
def get_index_constituents(indexId: int):
    try:
        with Session(engine) as db:
            constituents = db.query(IndexConstituent).filter(
                IndexConstituent.index_id == indexId
            ).all()

            result = []

            for constituent in constituents:
                security = db.query(Security).filter(
                    Security.id == constituent.security_id
                ).first()

                if security is None:
                    continue

                market_data = db.query(MarketData).filter(
                    MarketData.security_id == security.id
                ).order_by(
                    MarketData.timestamp.desc()
                ).first()

                result.append({
                    "security_id": security.id,
                    "symbol": security.symbol,
                    "name": security.name,
                    "market_cap": (
                        market_data.total_market_cap
                        if market_data else None
                    ),
                    "free_float_market_cap": (
                        market_data.free_float_market_cap
                        if market_data else None
                    ),
                    "weight": constituent.weight
                })

            return result

    except Exception as e:
        print(
            f"[GET_CONSTITUENTS] Failed for index_id={indexId}: {e}",
            flush=True
        )
        return {
            "error": "Failed to retrieve index constituents"
        }


@router.get("/indices/{indexId}/history")
def get_index_history(
    indexId: int,
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
            records = db.query(IndexValue).filter(
                IndexValue.index_id == indexId,
                IndexValue.timestamp >= start_datetime,
                IndexValue.timestamp < end_datetime
            ).order_by(
                IndexValue.timestamp.asc()
            ).all()

            return [
                {
                    "date": record.timestamp.astimezone(IST).strftime("%Y-%m-%d"),
                    "time": record.timestamp.astimezone(IST).strftime("%H:%M"),
                    "index_value": record.index_value
                }
                for record in records
            ]

    except Exception as e:
        print(
            f"[GET_INDEX_HISTORY] Failed for index_id={indexId}: {e}",
            flush=True
        )
        return {"error": "Failed to retrieve index history"}