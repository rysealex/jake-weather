from flask import Blueprint, jsonify, request
import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo 
import os
from dotenv import load_dotenv

api_bp = Blueprint('api', __name__, url_prefix='/api')

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

@api_bp.route("/weather-data/<latitude>/<longitude>", methods=['GET'])
def get_weather_data(latitude, longitude):

    # Read query parameters
    cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
    retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
    openmeteo = openmeteo_requests.Client(session = retry_session)
    current_time = None

    # Returns the row of hourly_df closest to the current hour but not in the future.
    if current_time is None:
        current_time = datetime.now(ZoneInfo("America/Los_Angeles"))  # Use UTC to match Open-Meteo timestamps

    url = os.getenv('OPEN_METEO_URL')

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "hourly": "temperature_2m,weather_code",
        "models": "gfs_seamless",
        "temperature_unit":"fahrenheit",
    }

    try:
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]

        # Process hourly weather data
        hourly = response.Hourly()
        hourly_temperature_2m = hourly.Variables(0).ValuesAsNumpy()
        hourly_weather_data = hourly.Variables(1).ValuesAsNumpy()

        hourly_data = {
            "date": pd.date_range(
                start=pd.to_datetime(hourly.Time(), unit= "s", utc=True).tz_convert("America/Los_Angeles"),
                end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True).tz_convert("America/Los_Angeles"),
                freq=pd.Timedelta(seconds=hourly.Interval()),
                inclusive="left"
            ),
            "temperature_2m": hourly_temperature_2m.tolist(),
            "weather_code": hourly_weather_data.tolist(),
        }

        df = pd.DataFrame(hourly_data)
        
        weekly_closest = []
        for i in range(7):
            day = (current_time + timedelta(days=i)).date()

            # filtering the row
            day_rows = df[df['date'].dt.date == day]

            # pick the closest hour <= target_hour
            candidate_rows = day_rows[day_rows['date'].dt.hour <= current_time.hour]
            if not candidate_rows.empty:
                # last one before target_hour
                closest_row = candidate_rows.iloc[-1]
                closest_row['date'] = closest_row['date'].strftime('%Y-%m-%d %H:%M:%S %Z')
                weekly_closest.append(closest_row.to_dict())

        if not weekly_closest:
            return jsonify({"error" : "Cannot find current time"}), 500
    
        return jsonify({
            "latitude": response.Latitude(),
            "longitude": response.Longitude(),
            "elevation": response.Elevation(),
            "utc_offset_seconds": response.UtcOffsetSeconds(),
            "weekly": weekly_closest,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500