import pandas as pd
from evds import evdsAPI
from datetime import datetime
import requests
import json
import sys
import os


# Telegram API bilgileri
BOT_TOKEN = "8196978921:AAEFd3yQJugMVaLPkEszczzt1PnMylZVZ4I"
CHAT_ID = "6466409546"

def get_today_date():
    return datetime.now().strftime('%d-%m-%Y')

api_key = 'FMSssRJJxa'
evds = evdsAPI(api_key)

series = [
    'TP.DK.USD.A.YTL', 'TP.DK.EUR.A.YTL', 'TP.DK.GBP.A.YTL',
    'TP.AB.B6', 'TP.MK.LON.YTL', 'TP.DB.B01', 'TP.KFE.TR',
    'TP.ENFBEK.PKA12ENF', 'TP.MT210AGS.TRY.MT01', 'TP.MT210AGS.TRY.MT05',
]

start_date = '01-01-2023'
end_date = get_today_date()

data = evds.get_data(series, startdate=start_date, enddate=end_date)

# Tarih sütununu işleme
def process_date_column(df):
    def parse_date(value):
        try:
            # Öncelikle '%d-%m-%Y' formatını dene
            return pd.to_datetime(value, format='%d-%m-%Y')
        except ValueError:
            try:
                # '%Y-Q%d' formatı için dönüştür
                return pd.to_datetime(value + '-01', format='%Y-Q%q-%d')
            except ValueError:
                # Dönüştürülemezse NaT ata
                return pd.NaT

    df['Tarih'] = df['Tarih'].apply(parse_date)
    return df

data = process_date_column(data)

# Tarihi sıralayın ve ileriye doğru doldurun
data = data.sort_values(by='Tarih').ffill()

# Son geçerli veri
latest_data = data.iloc[-1]

def send_telegram_message(text):
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": text}
    try:
        requests.post(url, json=payload)
    except Exception as e:
        print(f"Telegram bağlantı hatası: {e}")

message = f"""
Son Güncel Veriler:
Tarih: {get_today_date()}
USD: {latest_data['TP_DK_USD_A_YTL']}
EUR: {latest_data['TP_DK_EUR_A_YTL']}
GBP: {latest_data['TP_DK_GBP_A_YTL']}
Toplam Rezerv: {latest_data['TP_AB_B6']}
Ons Altın: {latest_data['TP_MK_LON_YTL']}
Brüt Dış Borç: {latest_data['TP_DB_B01']}
Konut Fiyat Endeksi: {latest_data['TP_KFE_TR']}
Sene Sonu Beklenen Enflasyon: {latest_data['TP_ENFBEK_PKA12ENF']}
Gecelik Borçlanma Faizi: {latest_data['TP_MT210AGS_TRY_MT01']}
Ortalama Yıllık Faiz Oranı: {latest_data['TP_MT210AGS_TRY_MT05']}
"""

def get_all_data_as_json():
    all_data = {
        "date":get_today_date(),
        "values": {
            "USD": round(latest_data['TP_DK_USD_A_YTL'], 3),
            "EUR": round(latest_data['TP_DK_EUR_A_YTL'], 3),
            "GBP": round(latest_data['TP_DK_GBP_A_YTL'], 3),
            "ToplamRezerv": round(latest_data['TP_AB_B6'] / 1_000, 2),
            "OnsAltin": round(latest_data['TP_MK_LON_YTL'], 2),
            "BrutDisBorc": round(latest_data['TP_DB_B01'] / 1_000, 2),
            "KonutFiyatEndeksi": round(latest_data['TP_KFE_TR'], 2),
            "SeneSonuEnflasyon": round(latest_data['TP_ENFBEK_PKA12ENF'], 2),
            "GecelikBorclanmaFaizi": round(latest_data['TP_MT210AGS_TRY_MT01'], 2),
            "OrtalamaYillikFaiz": round(latest_data['TP_MT210AGS_TRY_MT05'], 2),
        }
    }
    return json.dumps(all_data, indent=4)

# JSON çıktısını fonksiyonla alın
json_output = get_all_data_as_json()
with open('./data.json', 'w') as f:
    f.write(json_output)

send_telegram_message(message)