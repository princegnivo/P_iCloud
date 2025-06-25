#!/bin/bash
# Menu interactif
PS3='Choisissez une option : '
options=("Lancer le serveur" "Voir les logs" "Envoyer un test Telegram" "Quitter")
select opt in "${options[@]}"; do
  case $opt in
    "Lancer le serveur")
      bash ./scripts/start_services.sh
      ;;
    "Voir les logs")
      termux-open ../logs/credentials.enc
      ;;
    "Envoyer un test Telegram")
      curl -X POST http://localhost:3333/test-telegram
      ;;
    "Quitter")
      break
      ;;
    *) echo "Option invalide";;
  esac
done
