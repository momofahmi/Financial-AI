import sys
import json
import pandas as pd
from datetime import datetime

def safe_get_value(df, row, col):
    """safe"""
    try:
        value = df.iloc[row, col]
        return value if pd.notna(value) else None
    except IndexError:
        return None

def convert_to_date(value):
    """Convert value to a datetime object if possible, otherwise return None."""
    try:
        return pd.to_datetime(value).isoformat()  # Convert to ISO 8601 format
    except Exception:
        return None

def process_excel(file_path):
    df = pd.read_excel(file_path, header=None)
    
    general_info = {
        'Company Name': safe_get_value(df, 1, 1),
        'Country of Exchange': safe_get_value(df, 2, 1),
        'Country of Headquarters': safe_get_value(df, 3, 1),
        'TRBC Industry Group': safe_get_value(df, 4, 1),
        'CF Template': safe_get_value(df, 5, 1),
        'Consolidation Basis': safe_get_value(df, 6, 1),
        'Scaling': safe_get_value(df, 7, 1),
        'Period': safe_get_value(df, 8, 1),
        'Export Date': convert_to_date(safe_get_value(df, 9, 1))  # Convert to ISO format
    }
    
    financial_data = []
    date_row = 11
    for col in range(1, df.shape[1]):
        raw_date = str(safe_get_value(df, date_row, col)).strip()

        if ' ' in raw_date:
            raw_date = raw_date.split(' ')[0]

        data_entry = {
            'Date': convert_to_date(raw_date),  # Convert to ISO format
            'Standardized Currency': safe_get_value(df, 12, col),
            'Revenue from Goods & Services': safe_get_value(df, 17, col),
            'Revenue from Business Activities - Total': safe_get_value(df, 39, col),
            'Cost of Operating Revenue': safe_get_value(df, 41, col),
            'Gross Profit - Industrials/Property - Total': safe_get_value(df, 60, col),
            'Operating Expenses - Total': safe_get_value(df, 84, col),
            'Operating Profit before Non-Recurring Income/Expense': safe_get_value(df, 86, col),
            'Income before Taxes': safe_get_value(df, 153, col),
            'Net Income after Tax': safe_get_value(df, 171, col),
            'Earnings before Interest, Taxes, Depreciation & Amortization (EBITDA)': safe_get_value(df, 273, col)
        }
        financial_data.append(data_entry)
    

    return {
        'general_info': general_info,
        'financial_data': financial_data
    }

if __name__ == "__main__":
    file_path = sys.argv[1]
    result = process_excel(file_path)

    # Use `default=str` to handle any non-serializable objects in JSON
    print(json.dumps(result))
