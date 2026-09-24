import time
from datetime import datetime, time as dt_time
from zoneinfo import ZoneInfo
from scripts.index_calculation import index_calculation


IST = ZoneInfo("Asia/Kolkata")
MARKET_OPEN = dt_time(9, 15)
MARKET_CLOSE = dt_time(15, 30)


while True:
    now = datetime.now(IST).time()

    if MARKET_OPEN <= now <= MARKET_CLOSE:
        print(f"Running index calculation at {now}")
        index_calculation()

        time.sleep(30 * 60)

    else:
        time.sleep(60)