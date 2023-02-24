# BingNUOS-Telegram
Telegram Bot deployed on Firebase Functions

## Build Setup

``` bash
# install dependencies
npm install -g firebase-tools
npm install -g firebase-functions
npm install -g firebase-admin
npm install -g typescript

# initialize firebase project
firebase init

# build typescript
cd functions && tsc

# test locally
firebase serve --only functions

# deploy to firebase
firebase deploy --only functions
```
