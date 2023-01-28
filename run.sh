#! /bin/sh
gunicorn -b :5000 -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker main:app
