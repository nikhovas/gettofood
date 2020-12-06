#!/bin/bash

pip install -r requirements.txt
python -m pip install gunicorn
python manage.py makemigrations && python manage.py migrate GetToFood
gunicorn GetToFoodBackend.wsgi:application --bind 0.0.0.0:8000