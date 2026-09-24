import requests
from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy.orm import Session

from app.db.database import engine
from app.db.models import Security, MarketData


def get_market_data(security_id):

    try:
        with Session(engine) as db:

            security = db.query(Security).filter(
                Security.id == security_id
            ).first()

            if security is None:
                print(
                    f"[SECURITY] Security not found "
                    f"for security_id={security_id}"
                )
                return None

            data = get_data(security)

            if data is None:
                print(
                    f"[MARKET_DATA] Failed to collect market data "
                    f"for security_id={security_id}, "
                    f"symbol={security.symbol}"
                )
                return None

            db.add(data)
            db.commit()
            db.refresh(data)

            return data

    except Exception as e:
        print(
            f"[MARKET_DATA_DB] Failed to store market data "
            f"for security_id={security_id}: {e}"
        )
        return None


def get_data(security):

    symbol = security.symbol

    try:
        url = "https://www.nseindia.com/api/NextApi/apiClient/GetQuoteApi"

        headers = {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
            "Referer": "https://www.nseindia.com/"
        }

        session = requests.Session()

        session.get(
            "https://www.nseindia.com/",
            headers=headers,
            timeout=10
        )

        params = {
            "functionName": "getSymbolData",
            "marketType": "N",
            "series": "EQ",
            "symbol": symbol
        }

        response = session.get(
            url,
            params=params,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        trade_info = data["equityResponse"][0]["tradeInfo"]

        market_data = MarketData(
            security_id=security.id,
            timestamp=datetime.now(ZoneInfo("Asia/Kolkata")),
            last_price=trade_info["lastPrice"],
            total_market_cap=trade_info["totalMarketCap"] / 10_000_000,
            free_float_market_cap=trade_info["ffmc"] / 10_000_000,
            impact_cost=trade_info["impactCost"],
            issued_size=trade_info["issuedSize"]
        )

        return market_data

    except requests.RequestException as e:
        print(
            f"[NSE_REQUEST] NSE request failed "
            f"for symbol={symbol}: {e}"
        )
        return None

    except (KeyError, IndexError, TypeError, ValueError) as e:
        print(
            f"[NSE_RESPONSE] Invalid NSE response "
            f"for symbol={symbol}: {e}"
        )
        return None

    except Exception as e:
        print(
            f"[NSE_DATA] Failed to process NSE data "
            f"for symbol={symbol}: {e}"
        )
        return None