import requests
from datetime import datetime
import time
import json
import csv
from decimal import Decimal  # 用于精确金额计算

# ===================== 配置部分 =====================
TRONGRID_API_KEY = "512f0be9-f3d8-45be-8902-6ecc07fca48c"  # 请替换为你的有效 Trongrid API Key

ADDRESS = "TMofoe4QfwjuFc5cic6SRQcG8iqdnEA6Ne"  # 你的 TRON 地址（大小写敏感）

BASE_URL = f"https://api.trongrid.io/v1/accounts/{ADDRESS}/transactions/trc20"

HEADERS = {
    "TRON-PRO-API-KEY": TRONGRID_API_KEY,
    "Accept": "application/json",
    "User-Agent": "TronUSDTTracker/1.0"
}

# 是否在金额列显示正负号（收入正、支出负）
SHOW_SIGNED_AMOUNT = True   # 改为 False 则只显示正金额

# ===================== 函数定义 =====================
def fetch_page(fingerprint=None, limit=100):
    params = {
        "limit": limit,
        "only_confirmed": "true",
        "order_by": "block_timestamp,desc"
    }
    if fingerprint:
        params["fingerprint"] = fingerprint

    try:
        response = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=15)
        print(f"状态码: {response.status_code} | 页码: 当前页")
        if response.status_code != 200:
            print("错误响应:", response.text[:400])
            return [], None

        data = response.json()
        transfers = data.get("data", [])
        next_fingerprint = data.get("meta", {}).get("fingerprint")
        print(f"本页获取 {len(transfers)} 条记录 | 有下一页: {bool(next_fingerprint)}")
        return transfers, next_fingerprint

    except Exception as e:
        print(f"请求异常: {e}")
        return [], None


# ===================== 主程序 =====================
if __name__ == "__main__":
    print(f"正在查询地址: {ADDRESS}")
    print("使用 Trongrid API 获取 TRC20 转账记录（USDT 为主）...\n")

    all_transfers = []
    fingerprint = None
    page = 1

    while True:
        print(f"--- 第 {page} 页 ---")
        transfers, next_fp = fetch_page(fingerprint)
        
        if transfers:
            all_transfers.extend(transfers)
            # 预览前 3 条
            for tx in transfers[:3]:
                ts = datetime.fromtimestamp(tx.get("block_timestamp", 0) / 1000)
                amount = int(tx["value"]) / 1_000_000
                symbol = tx.get("token_info", {}).get("symbol", "Unknown")
                print(f"{ts.strftime('%Y-%m-%d %H:%M:%S')} | {amount:,.6f} {symbol}")
        else:
            break

        fingerprint = next_fp
        if not fingerprint:
            print("\n已获取所有分页数据")
            break

        page += 1
        time.sleep(1.2)  # 避免频率限制

    total_count = len(all_transfers)
    print(f"\n总共获取 {total_count} 条 TRC20 转账记录")

    if not all_transfers:
        print("没有数据，程序结束。")
        exit()

    # ===================== 保存文件 =====================
    # 1. 保存原始 JSON
    with open("trc20_transfers.json", "w", encoding="utf-8") as f:
        json.dump(all_transfers, f, ensure_ascii=False, indent=2)
    print("已保存原始数据 → trc20_transfers.json")

    # 2. 保存整理后的 CSV
    csv_filename = "trc20_transfers.csv"
    with open(csv_filename, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        # 表头
        writer.writerow(["时间 (UTC)", "方向", "金额 (USDT)", "From", "To", "Transaction ID"])

        total_in = Decimal('0')
        total_out = Decimal('0')

        for tx in all_transfers:
            ts = datetime.fromtimestamp(tx.get("block_timestamp", 0) / 1000)
            time_str = ts.strftime("%Y-%m-%d %H:%M:%S")

            is_incoming = tx["to"].lower() == ADDRESS.lower()
            direction = "转入" if is_incoming else "转出"

            value = Decimal(tx["value"])
            amount = value / Decimal('1000000')  # USDT 6 decimals

            if is_incoming:
                total_in += amount
                signed_amount = amount
            else:
                total_out += amount
                signed_amount = -amount

            display_amount = f"{signed_amount:,.6f}" if SHOW_SIGNED_AMOUNT else f"{amount:,.6f}"

            from_addr = tx.get("from", "")
            to_addr = tx.get("to", "")
            txid = tx.get("transaction_id", "")

            writer.writerow([time_str, direction, display_amount, from_addr, to_addr, txid])

    print(f"已保存整理表格 → {csv_filename}（建议用 Excel 打开）")

    # ===================== 简单统计 =====================
    net_amount = total_in - total_out
    print("\n=== 统计汇总 ===")
    print(f"转入笔数   : {sum(1 for tx in all_transfers if tx['to'].lower() == ADDRESS.lower())} 笔")
    print(f"转出笔数   : {sum(1 for tx in all_transfers if tx['from'].lower() == ADDRESS.lower())} 笔")
    print(f"总转入金额 : {total_in:,.6f} USDT")
    print(f"总转出金额 : {total_out:,.6f} USDT")
    print(f"净额变化   : {net_amount:,.6f} USDT  ({'净流入' if net_amount > 0 else '净流出' if net_amount < 0 else '持平'})")

    print("\n程序执行完毕。")