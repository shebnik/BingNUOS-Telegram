# BingNUOS Telegram
Telegram Bot written in TypeScript and deployed on Firebase Functions

## Build Setup

1. Create a new bot using BotFather
    ``` bash
    /newbot
    ```

2. Copy your bot token and write it in functions folder .env 
    ``` bash
    BOT_TOKEN=<your_bot_token>
    ```
    Note: To load .env, you need to run ```firebase deploy``` command first.

3. Install dependencies
    ``` bash
    npm install -g firebase-tools
    npm install -g firebase-functions
    npm install -g firebase-admin
    npm install -g typescript
    npm install -g cpy-cli
    npm install -g ngrok
    npm install dotenv
    npm install npm-run-all
    ```

4. Initialize Firebase Project
    ``` bash
    firebase init
    ```

5. Setup webhook
    ``` bash
    curl -F "url=https://europe-west1-<your_project_id>.firebaseapp.com/telegramBot" https://api.telegram.org/bot<your_bot_token>/setWebhook
    ```
    For local testing, use ngrok to expose your local server to the internet:
    ``` bash
    ngrok http 5001
    ```
    Then, use the ngrok url to set the webhook. Example:
    ``` bash
    https://api.telegram.org/bot<your_bot_token>/setWebhook?url=https://<ngrok_id>.ngrok.io/<your_project_id>/europe-west1/telegramBot
    ```

6. Build typescript
    ``` bash
    cd functions | tsc --watch
    ```

7. Test locally
    ``` bash
    firebase serve --only functions
    ```

8. Deploy to firebase
    ``` bash
    firebase deploy --only functions
    ```
