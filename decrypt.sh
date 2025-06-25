#!/bin/bash
KEY=$(cat .env)
IV=${KEY:0:16}
while read -r line; do
    echo $line | openssl enc -d -aes-256-cbc -iv $IV -K $KEY -base64 2>/dev/null
done < logs/credentials.enc
