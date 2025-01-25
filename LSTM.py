import json
from pymongo import MongoClient
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras import Input
import matplotlib.pyplot as plt
import sys



client = MongoClient("mongodb+srv://admin:admin@cluster0.q7c7d.mongodb.net/")

db = client['test6']  # Replace 'test6' with your database name
collection= db['test6']  # Replace 'test6/Documents' with your collection path


def main(idx):

    document = collection.find_one({"_id": "Tofas Turk Otomobil Fabrikasi AS (TOASO.IS)"}) # This could be input by the user.

    if not document:
        exit()
        print("Document not found!")
    financial_data = document.get("financial_data", [])

    net_income = [entry.get("Net Income after Tax") * 1000 for entry in financial_data]

    avg_fx_rate = [
        0.56070482758311, 0.544490961852967, 0.508310044597133, 0.494462263919206,
        0.452206603146424, 0.474177413272468, 0.462575539202325, 0.442372105418369,
        0.406648307989528, 0.375784800767892, 0.351297648245797, 0.344018942693085,
        0.340237567071696, 0.34535849569448, 0.33729812714329, 0.304981239229659,
        0.271058262806399, 0.2795402698049, 0.285019554240735, 0.263412150665172,
        0.262227293196205, 0.229606847123245, 0.180018392870494, 0.182540391485726,
        0.186413016510073, 0.170423848827034, 0.176381136401748, 0.172603415388191,
        0.163855582789115, 0.145751426915632, 0.138642212680062, 0.12726747293265,
        0.135461037880686, 0.119279731299897, 0.117154589253706, 0.092602268243084,
        0.071905374998437, 0.06376105329655, 0.055867646347722, 0.053777790994306,
        0.053016145824784, 0.048346346379593, 0.037393625694286, 0.035096041997406,
        0.032361556879349, 0.030909171136206
    ]

    reciprocal_avg_fx_rate = [1 / value if value != 0 else 0 for value in avg_fx_rate]

    inflation = [83.52489, 84.62625667, 85.52040333, 87.61184667, 90.21496667, 
    92.58143667, 93.41929333, 95.28688667, 96.95109, 99.74352667, 100.23984333, 
    103.06553333, 105.28746667, 106.6536, 108.29606667, 110.86336667, 116.04016667, 
    118.9145, 119.72676667, 124.46226667, 127.96846667, 134.12896667, 143.00003333, 
    152.30216667, 153.4483, 158.20556667, 162.34243333, 167.9989, 172.05513333, 176.63973333, 
    181.43536667, 190.69526667, 198.8846, 206.8231, 216.3875, 239.98693333, 307.8714, 
    360.01686667, 391.88366667, 425.67173333, 475.15653333, 505.55866667, 612.10866667, 
    692.671, 792.75093333, 870.94293333
    ]


    income_length = len(net_income)

    common_length = min(len(net_income), len(reciprocal_avg_fx_rate), len(inflation))
    net_income = net_income[-common_length:]
    reciprocal_avg_fx_rate = reciprocal_avg_fx_rate[-common_length:]
    inflation = inflation[-common_length:]

    #quarters = range(1, common_length + 1)

    #NO AI TILL HERE

    # Convert data to numpy arrays for convenience (reciprocal_avg_fx_rate, inflation, and net_income)
    data = np.array([reciprocal_avg_fx_rate, inflation, net_income]).T  # Input features
    target = np.array(net_income)  # The target variable is net income

    scaler = MinMaxScaler()
    data_scaled = scaler.fit_transform(data)

    target_scaled = MinMaxScaler().fit_transform(target.reshape(-1, 1))

    # Reshaping the data for LSTM (samples, timesteps, features)
    X = data_scaled  # Input features
    y = target_scaled  # Target variable (net income)

    # Split data into training and testing sets (80-20 split)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, shuffle=False)

    # Reshape for LSTM [samples, timesteps, features]
    X_train = X_train.reshape((X_train.shape[0], 1, X_train.shape[1]))
    X_test = X_test.reshape((X_test.shape[0], 1, X_test.shape[1]))

    # The data is now ready for use in training an LSTM model
    model = Sequential()

    model.add(Input(shape=(X_train.shape[1], X_train.shape[2])))
    model.add(LSTM(64, activation='relu'))
    model.add(Dense(32, activation='relu'))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train the model
    history = model.fit(X_train, y_train, epochs=100, batch_size=8, validation_data=(X_test, y_test), verbose=0)
    # Train the model

    # Make predictions
    with tf.device('/cpu:0'):
        y_pred = model.predict(X_test, verbose=0)

    # Inverse transform the predictions and actual values to their original scale
    scaler_target = MinMaxScaler().fit(target.reshape(-1, 1))  # Fitting scaler on target (net_income)
    y_pred_inv = scaler_target.inverse_transform(y_pred)
    y_test_inv = scaler_target.inverse_transform(y_test)

    #model.save('my_model.h5')  # creates a HDF5 file 'my_model.h5'

    
    
    output = {
        "predictions": y_pred_inv.tolist(),
        "actual": y_test_inv.tolist()
    }

    print(json.dumps(output))

    # mspe = np.mean(((y_test_inv - y_pred_inv) ** 2) / (y_test_inv ** 2))
    # mape = mean_absolute_percentage_error(y_test_inv, y_pred_inv) * 100
    # print(f"Mean Squared Percent Error (MSPE): {mspe:.4f}")
    # print(f"Mean Absolute Percentage Error (MAPE): {mape:.4f}%")


idx = sys.argv[1]
main(idx)