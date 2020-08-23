import './services/telegram-bot';

if (
  !process.env.CLIENT_EMAIL ||
  !process.env.PRIVATE_KEY ||
  !process.env.PROJECT_ID ||
  !process.env.BOT_TOKEN ||
  !process.env.DATABASE_NAME ||
  !process.env.HEROKU_URL
) {
  throw Error('Please set environment variables!');
}
