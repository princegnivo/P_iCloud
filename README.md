# P_iCloud
PhishBait - Plateforme Éducative de Simulation de Phishing
⚠️ Avertissement : Ce projet est conçu exclusivement à des fins éducatives et de recherche en cybersécurité. Toute utilisation malveillante est strictement interdite.

📌 Table des Matières
Objectif

Fonctionnalités

Structure du Projet

Prérequis

Installation

Configuration

Utilisation

Sécurité

Légalité

Contribution

🎯 Objectif
Ce projet simule une attaque de phishing pour :
✅ Éduquer sur les techniques de phishing modernes
✅ Tester les mesures de sécurité des systèmes
✅ Former les équires à la détection de menaces

Public cible :

Professionnels de la cybersécurité

Équipes SOC (Security Operations Center)

Étudiants en informatique

✨ Fonctionnalités
Frontend (React)
🖥 Interface réaliste (clone iCloud)

🔐 Formulaire de connexion avec 2FA simulé

🛡 Détection des DevTools/Inspecteurs

📛 Protection contre les captures d'écran

Backend (Node.js/Express)
🔒 Chiffrement AES-256 des logs

📊 Journalisation des activités (IP, User-Agent, etc.)

⏱ Rate Limiting (5 requêtes/15 min)

🗑 Auto-nettoyage des logs après 7 jours

Sécurité Avancée
🕵️ Fingerprinting (détection des bots)

🍯 Honeypot invisible

📡 CSP (Content Security Policy) stricte

🔄 Rotation automatique des logs

📂 Structure du Projet
bash
phishbait-educatif/
├── public/                  # Fichiers statiques
│   ├── index.html           # HTML sécurisé
│   └── sw.js                # Service Worker
├── src/
│   ├── components/          # Composants React
│   │   └── LoginForm.jsx    # Formulaire de phishing
│   └── main.jsx             # Point d'entrée
├── server/
│   ├── server.js            # Backend principal
│   ├── security.js          # Utilitaires de chiffrement
│   └── logging.js           # Gestion des logs
├── logs/                    # Logs chiffrés (auto-nettoyés)
├── scripts/
│   ├── phishbait.sh         # Script de démarrage
│   └── decrypt_logs.sh      # Déchiffrement des logs
├── .env.example             # Configuration environnement
├── LICENSE                  # Licence GPLv3
└── README.md                # Ce fichier
⚙️ Prérequis
Node.js v18+

NPM/Yarn

Ngrok (pour les tunnels HTTPS)

Git

🚀 Installation
bash
# 1. Cloner le dépôt
git clone https://github.com/votre-utilisateur/phishbait-educatif.git
cd phishbait-educatif

# 2. Installer les dépendances
npm install
npm install --prefix server

# 3. Configurer l'environnement
cp .env.example .env
nano .env  # Éditez avec vos clés SECRET_KEY et API_TOKEN
🔧 Configuration
Modifiez .env :

env
# Backend
SECRET_KEY="votre_clé_aes_256_ici"  # Générer via : openssl rand -hex 32
API_TOKEN="votre_token_jwt"
IV="votre_vecteur_initialisation"   # 16 caractères

# Frontend
VITE_API_URL="http://localhost:3333"
💻 Utilisation
bash
# Démarrer le backend
npm run server

# Démarrer le frontend (dev)
npm run dev

# Lancer Ngrok (dans un nouveau terminal)
ngrok http 3333
Accès :

Frontend : http://localhost:3000

Backend : http://localhost:3333

Tunnel Ngrok : https://<votre-url-ngrok>.ngrok.io

🛡 Sécurité
Mesures Implémentées
Fonctionnalité	Description	Niveau de Protection
Chiffrement AES-256-GCM	Logs illisibles sans clé	🔴 Haute
Rate Limiting	Blocage après 5 tentatives	🟠 Moyenne
Détection DevTools	Alerte en cas d'inspection	🔴 Haute
Honeypot	Piège à bots invisible	🟢 Basse
Recommandations
🔥 Ne jamais utiliser en production

🏴‍☠️ Toujours obtenir une autorisation écrite pour les tests

🗑 Supprimer les logs après utilisation

⚖️ Légalité
Ce projet est couvert par la licence GPLv3 avec des restrictions supplémentaires :

Interdiction d'utilisation malveillante

Obligation d'informer les cibles lors de tests légitimes

Responsabilité pénale en cas d'abus

📜 Consultez LEGAL.md pour plus de détails.

🤝 Contribution
Les contributions sont bienvenues sous conditions :

Ouvrir une issue pour discuter des changements

Signer un contrat de non-responsabilité

Respecter les règles éthiques

Exécutez les tests avant de soumettre un PR :

bash
npm test
📌 Note finale : Ce projet est maintenu à des fins académiques. Les mainteneurs déclinent toute responsabilité en cas d'usage abusif.

https://img.shields.io/badge/License-GPLv3-red.svg
https://img.shields.io/badge/For-Educational_Use_Only-blue

ℹ️ Besoin d'aide ?
Ouvrez une issue GitHub.

