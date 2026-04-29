import 'dotenv/config';
import cron from 'node-cron';

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const TIMEZONE = process.env.TZ_NAME || 'America/Chicago';
// Cron: minute hour dom month dow  -> at :00 of 8,10,12,14,16,18,20,22
const SCHEDULE = process.env.CRON_SCHEDULE || '0 8,10,12,14,16,18,20,22 * * *';

if (!WEBHOOK_URL) {
  console.error('Missing SLACK_WEBHOOK_URL. Set it in your environment or .env file.');
  process.exit(1);
}

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
    hour12: true,
  }).format(date);
}

function buildMessage() {
  const now = formatTime();
  return {
    type: 'mrkdwn',
    text: `:clock10: *Time check-in:* it's ${now}. Log what you worked on the last 2 hours.`,
  };
}

async function postToSlack() {
  const payload = buildMessage();
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.text();
    if (!res.ok) {
      console.error(`[${new Date().toISOString()}] Slack error ${res.status}: ${body}`);
      return false;
    }
    console.log(`[${new Date().toISOString()}] Posted check-in (${formatTime()}) -> ${body}`);
    return true;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Network error posting to Slack:`, err);
    return false;
  }
}

if (process.argv.includes('--ping-now')) {
  const ok = await postToSlack();
  process.exit(ok ? 0 : 1);
}

if (!cron.validate(SCHEDULE)) {
  console.error(`Invalid CRON_SCHEDULE: "${SCHEDULE}"`);
  process.exit(1);
}

cron.schedule(SCHEDULE, postToSlack, { timezone: TIMEZONE });

console.log(`Time tracker running.`);
console.log(`  Schedule : ${SCHEDULE}`);
console.log(`  Timezone : ${TIMEZONE}`);
console.log(`  Local now: ${formatTime()}`);
console.log(`Press Ctrl+C to stop.`);
