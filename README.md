# Padel-Bot

A bot that sends a Discord message when a padel court is available, found by specific variables.

## Start locally

Create an .env file with a DISCORD_WEBHOOK_URL variable. This webhook can be created in Discord. Go to your Channel settings, click on Integrations and select Webhook.

```
cd functions

npm i

npm run dev
```


## How to deploy?

This app is deployed as a Firebase Function with an hourly schedule.

```
npm run deploy
```
