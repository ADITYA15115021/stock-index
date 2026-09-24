from scripts.active import get_active_indices
from scripts.constituents import get_constituents
from scripts.market_data import get_market_data
from scripts.divisor import get_divisor
from scripts.add_index import add_index_value
from scripts.add_index_daily import add_index_daily
from datetime import datetime

def index_calculation():
    try:
        active_indices = get_active_indices()

        if active_indices is None:
            print("[ACTIVE_INDICES] Failed to retrieve active indices")
            return

        for index in active_indices:
            print(f"[INDEX] Starting calculation for index_id={index.id}")

            constituents = get_constituents(index.id)

            if constituents is None:
                print(
                    f"[CONSTITUENTS] Failed for index_id={index.id}"
                )
                continue

            total_ffmc = 0

            for security in constituents:
                data = get_market_data(security.security_id)

                if data is None:
                    print(
                        f"[INDEX_CALCULATION] Aborted for index_id={index.id}: "
                        f"market data failed for security_id={security.security_id}"
                    )
                    break

                print(
                    f"[INDEX_CALCULATION] Market data collected "
                    f"for security_id={security.security_id}",
                    flush=True
                )

                total_ffmc += data.free_float_market_cap

            else:
                divisor = get_divisor(index.id)

                if divisor is None:
                    print(
                        f"[DIVISOR] Failed for index_id={index.id}"
                    )
                    continue

                index_value = total_ffmc / divisor

                result = add_index_value(
                    index,
                    index_value,
                    total_ffmc,
                    divisor
                )

                if result["status"] == "success":
                    print(
                        f"[INDEX_VALUE] Successfully created "
                        f"for index_id={index.id}"
                    )

                    daily_result = add_index_daily(
                        index,
                        index_value
                    )

                    if daily_result["status"] == "success":
                        print(
                            f"[INDEX_DAILY] Successfully updated "
                            f"for index_id={index.id}"
                        )
                else:
                    print(
                        f"[INDEX_VALUE] Failed to store "
                        f"for index_id={index.id}"
                    )

    except Exception as e:
        print(
            f"[INDEX_CALCULATION] Unexpected failure: {e}"
        )