"""
MySQL → JSON Export Script
===========================
Run this Python script on your VPS or locally to export all MySQL tables to JSON.
Then copy the mysql_export/ folder to your Node.js project root.

Requirements:
  pip install mysql-connector-python

Usage:
  python exportMysql.py
"""

import mysql.connector
import json
import os
from datetime import datetime, date

# ── Configuration ─────────────────────────────────────────────────────────────
DB_CONFIG = {
    'host':     '88.222.244.171',
    'user':     'ems_navicat',
    'password': 'Test@12345',
    'database': 'cms',
    'port':     3306,
    'charset':  'utf8mb4',
}

OUTPUT_DIR = './mysql_export'

# ── JSON Serializer for MySQL types ──────────────────────────────────────────
def serialize(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, bytes):
        return obj.decode('utf-8', errors='replace')
    return str(obj)


# ── Main Export ───────────────────────────────────────────────────────────────
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        print(f"✅ Connected to MySQL: {DB_CONFIG['host']}/{DB_CONFIG['database']}\n")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return

    # Get all tables
    cursor.execute("SHOW TABLES")
    tables = [list(row.values())[0] for row in cursor.fetchall()]
    print(f"📋 Found {len(tables)} tables to export\n")

    for table in tables:
        try:
            cursor.execute(f"SELECT * FROM `{table}`")
            rows = cursor.fetchall()

            # Convert MySQL types to JSON-serializable
            clean_rows = []
            for row in rows:
                clean_row = {}
                for key, value in row.items():
                    if isinstance(value, (datetime, date)):
                        clean_row[key] = value.isoformat()
                    elif isinstance(value, bytes):
                        clean_row[key] = value.decode('utf-8', errors='replace')
                    else:
                        clean_row[key] = value
                clean_rows.append(clean_row)

            output_path = os.path.join(OUTPUT_DIR, f'{table}.json')
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(clean_rows, f, ensure_ascii=False, indent=2, default=str)

            print(f"✅ {table}: {len(rows)} rows → {table}.json")

        except Exception as e:
            print(f"❌ Failed to export {table}: {e}")

    cursor.close()
    conn.close()

    print(f"\n{'=' * 50}")
    print(f"✅ Export complete! Files saved to: {OUTPUT_DIR}/")
    print("Next: Copy mysql_export/ to your Node.js server/ folder")
    print("Then run: node scripts/migrateToMongo.js")


if __name__ == '__main__':
    main()
