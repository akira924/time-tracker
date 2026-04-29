# Time Tracker → Slack

Posts a check-in message to a Slack channel every 2 hours from **8 AM to 10 PM CDT**, every day.

The schedule fires at: `08:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00, 22:00` America/Chicago time (auto handles CDT/CST DST switches).

## Setup

```powershell
npm install
copy .env.example .env
# then edit .env and paste your Slack webhook URL
```

## Run

```powershell
npm start
```

The process must stay running for the cron to fire. Leave it open in a terminal, or run it under a process manager (e.g. `pm2`, NSSM, Windows Task Scheduler with `node index.js`).

## Test the webhook now

Sends a single check-in immediately and exits — handy to verify Slack is wired up:

```powershell
npm run test:ping
```

## Configure

All knobs live in `.env`:

| Variable             | Default                                | Purpose                                                     |
| -------------------- | -------------------------------------- | ----------------------------------------------------------- |
| `SLACK_WEBHOOK_URL`  | _(required)_                           | Slack Incoming Webhook URL.                                 |
| `TZ_NAME`            | `America/Chicago`                      | IANA timezone the cron fires in.                            |
| `CRON_SCHEDULE`      | `0 8,10,12,14,16,18,20,22 * * *`       | Cron expression. Edit to change cadence or window.          |

### Cron quick reference

```
 ┌──────── minute (0–59)
 │ ┌────── hour   (0–23)
 │ │ ┌──── day of month (1–31)
 │ │ │ ┌── month (1–12)
 │ │ │ │ ┌ day of week (0–7, 0 & 7 = Sun)
 0 8,10,12,14,16,18,20,22 * * *
```

To run only on weekdays, change the last field to `1-5`:
`0 8,10,12,14,16,18,20,22 * * 1-5`
