process.env['NTBA_FIX_319'] = 1 as any;

import TelegramBot from 'node-telegram-bot-api';

import { config } from 'dotenv';
config();

import { onMessage } from './services/on-message';

let PORT = +process.env.PORT! || 3000;
const isProd = process.env.NODE_ENV === 'production';


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

const botToken = process.env.BOT_TOKEN;
const herokuUrl = process.env.HEROKU_URL;

let bot: TelegramBot;
if (isProd) {
	bot = new TelegramBot(botToken, { webHook: { port: PORT } });
	bot.setWebHook(`${herokuUrl}/bot${botToken}`);
}
else {
	bot = new TelegramBot(botToken, { polling: true });
}


bot.on('message', async (msg) => {
	await onMessage(bot, msg);
});

bot.on('document', (doc) => {
	onDocument(bot, doc);
});

import admin from 'firebase-admin';
import { onDocument } from './services/on-document';

const serviceAccount: { projectId: string, privateKey: string, clientEmail: string } = {
	clientEmail: process.env.CLIENT_EMAIL!,
	privateKey: process.env.PRIVATE_KEY!,
	projectId: process.env.PROJECT_ID!
}

const databaseName = process.env.DATABASE_NAME;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: `https://${databaseName}.firebaseio.com`
});

export const db = admin.firestore();