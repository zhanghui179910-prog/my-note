import requests
from datetime import datetime
import time
import csv
from decimal import Decimal
import os

# ===================== 配置 =====================

ADDRESS = "TMofoe4QfwjuFc5cic6SRQcG8iqdnEA6Ne"
TRONGRID_API_KEY = "512f0be9-f3d8-45be-8902-6ecc07fca48c"

BASE_URL = "https://api.trongrid.io/v1/accounts"
SAVE_DIR = os.path.join(os.getcwd(), "TronData")
os.makedirs(SAVE_DIR, exist_ok=True)

HEADERS = {
    "TRON-PRO-API-KEY": TRONGRID_API_KEY
}

# ===================== 请求函数 =====================

def fetch_page(endpoint, fingerprint=None):
    url = f"{BASE_URL}/{ADDRESS}/{endpoint}"
    params = {
        "limit": 200,
        "only_confirmed": "true",
        "order_by": "block_timestamp,desc"
    }

    if fingerprint:
        params["fingerprint"] = fingerprint

    try:
        r = requests.get(url, headers=HEADERS, params=params, timeout=15)

        if r.status_code == 404:
            print(f"⚠️ 接口不存在: {endpoint}")
            return [], None

        if r.status_code != 200:
            print("❌ 请求失败:", r.status_code)
            return [], None

        data = r.json()
        return data.get("data", []), data.get("meta", {}).get("fingerprint")

    except Exception as e:
        print("❌ 网络异常:", e)
        return [], None


def crawl_all(endpoint):
    print(f"\n📦 正在抓取 {endpoint}")
    all_data = []
    fingerprint = None
    page = 1

    while True:
        print(f"  第 {page} 页")
        records, fingerprint = fetch_page(endpoint, fingerprint)

        if not records:
            break

        all_data.extend(records)

        if not fingerprint:
            break

        page += 1
        time.sleep(1)

    print(f"  ✅ 共获取 {len(all_data)} 条")
    return all_data


# ===================== 保存函数 =====================

def save_trx_csv(records, filename):
    if not records:
        return

    path = os.path.join(SAVE_DIR, filename)

    total_in = Decimal("0")
    total_out = Decimal("0")

    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["时间", "方向", "金额(TRX)", "From", "To", "TxID"])

        for tx in records:

            ts = tx.get("block_timestamp", 0)
            dt = datetime.utcfromtimestamp(ts / 1000)
            time_str = dt.strftime("%Y-%m-%d %H:%M:%S")

            from_addr = tx.get("from", "")
            to_addr = tx.get("to", "")
            txid = tx.get("txID", tx.get("transaction_id", ""))

            raw_value = Decimal(tx.get("raw_data", {}).get("contract", [{}])[0]
                                .get("parameter", {})
                                .get("value", {})
                                .get("amount", 0))

            amount = raw_value / Decimal(1_000_000)

            is_in = to_addr.lower() == ADDRESS.lower()

            if is_in:
                total_in += amount
                amount_display = amount
                direction = "转入"
            else:
                total_out += amount
                amount_display = -amount
                direction = "转出"

            writer.writerow([
                time_str,
                direction,
                f"{amount_display:,.6f}",
                from_addr,
                to_addr,
                txid
            ])

    print(f"💾 已保存 {filename}")
    print(f"   总转入: {total_in:,.2f} TRX")
    print(f"   总转出: {total_out:,.2f} TRX")


def save_trc20_csv(records, filename):
    if not records:
        return

    path = os.path.join(SAVE_DIR, filename)

    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["时间", "方向", "金额", "代币", "From", "To", "TxID"])

        for tx in records:
            ts = tx.get("block_timestamp", 0)
            dt = datetime.utcfromtimestamp(ts / 1000)
            time_str = dt.strftime("%Y-%m-%d %H:%M:%S")

            value = Decimal(tx.get("value", "0"))
            decimals = int(tx.get("token_info", {}).get("decimals", 6))
            symbol = tx.get("token_info", {}).get("symbol", "TRC20")

            amount = value / Decimal(10 ** decimals)

            from_addr = tx.get("from", "")
            to_addr = tx.get("to", "")
            txid = tx.get("transaction_id", "")

            is_in = to_addr.lower() == ADDRESS.lower()
            direction = "转入" if is_in else "转出"

            writer.writerow([
                time_str,
                direction,
                f"{amount:,.6f}",
                symbol,
                from_addr,
                to_addr,
                txid
            ])

    print(f"💾 已保存 {filename}")


# ===================== 主程序 =====================

if __name__ == "__main__":

    print("====================================")
    print("TRON 数据导出工具")
    print("地址:", ADDRESS)
    print("保存目录:", SAVE_DIR)
    print("====================================")

    # TRX 主交易
    trx = crawl_all("transactions")
    save_trx_csv(trx, "TRX_transactions.csv")

    # TRC20
    trc20 = crawl_all("transactions/trc20")
    save_trc20_csv(trc20, "TRC20_transfers.csv")

    print("\n🎉 导出完成")
    print("文件位置:", SAVE_DIR)
