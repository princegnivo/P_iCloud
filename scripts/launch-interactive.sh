#!/bin/bash
# Menu stylisé avec ASCII Art
echo -e "\e[34m"
cat << "EOF"
  ___ _     _   _       ___ _    _ _ 
 | _ \ |___| |_| |_ ___| _ \ |__| | |
 |  _/ / -_)  _|  _/ -_)  _/ / _` |_|
 |_| |_\___|\__|\__\___|_| |_\__,_(_)
EOF
echo -e "\e[0m"

PS3=$'\e[1;36mChoisissez une action : \e[0m'
options=(
  "Lancer en mode démo"
  "Voir les logs chiffrés"
  "Envoyer un test Telegram"
  "Nettoyer les traces"
  "Quitter"
)

select opt in "${options[@]}"; do
  case $opt in
    "Lancer en mode démo")
      gnome-terminal -- bash -c "cd client && npm run dev" &
      xterm -e "cd server && node server.js" &
      ;;
    "Voir les logs chiffrés")
      less -r logs/credentials.enc | ccat --color=always
      ;;
    "Envoyer un test Telegram")
      curl -X POST http://localhost:3333/api/test-telegram \
        -H "Authorization: Bearer $(cat .env | grep TELEGRAM_KEY | cut -d '=' -f2)"
      ;;
    "Nettoyer les traces")
      bash server/auto-wipe.sh --secure
      ;;
    "Quitter")
      pkill -f "node server.js"
      exit 0
      ;;
    *) echo -e "\e[31mOption invalide\e[0m";;
  esac
done
