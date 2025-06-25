#!/bin/bash
# CONFIG
WEBSITE_DIR="your-website"
PORT=5555
NGROK_AUTH="your-ngrok-auth-token"

# Démarrer PHP
start_server() {
    php -S 0.0.0.0:$PORT -t $WEBSITE_DIR > /dev/null 2>&1 &
    PHP_PID=$!
    echo "🌐 Serveur PHP démarré (PID: $PHP_PID) sur le port $PORT"
}

# Démarrer Ngrok
start_ngrok() {
    ngrok http --authtoken $NGROK_AUTH $PORT > /dev/null 2>&1 &
    NGROK_PID=$!
    sleep 5
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')
    echo "🔗 URL Ngrok : $NGROK_URL"
}

# Nettoyage
cleanup() {
    kill $PHP_PID $NGROK_PID 2>/dev/null
    echo -e "\n🛑 Serveurs arrêtés. Logs disponibles dans logs/"
}

# Main
trap cleanup SIGINT
start_server
start_ngrok
echo "Appuyez sur Ctrl+C pour arrêter"
while true; do sleep 1; done
