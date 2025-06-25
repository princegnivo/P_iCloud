#!/bin/bash

# Démarrer le backend
echo "🚀 Starting backend server..."
node server.js &

# Démarrer le frontend (si vous utilisez Vite)
echo "💻 Starting frontend..."
vite preview --port 3000 &

# Démarrer Ngrok
echo "🔗 Starting Ngrok tunnel..."
ngrok http 3333 --authtoken $NGROK_AUTH

# Nettoyage
trap "killall node; echo '🛑 All processes stopped'; exit" SIGINT
wait
