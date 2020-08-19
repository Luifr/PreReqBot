process.env['NTBA_FIX_319'] = 1 as any;

import fs from 'fs';
import admin from 'firebase-admin';
import TelegramBot from 'node-telegram-bot-api';

import { onMessage } from './onMessage';

let PORT = +process.env.PORT! || 3000;
const isProd = process.env.NODE_ENV === 'production';

let serviceAccount: { projectId: string, privateKey: string, clientEmail: string };
let environmentConfig: { firebaseUrl: string, herokuUrl: string, botToken: string };

let bot: TelegramBot;

if (isProd) {
	if (
		!process.env.CLIENTE_MAIL ||
		!process.env.PRIVATE_KEY ||
		!process.env.PROJECT_ID ||
		!process.env.BOT_TOKEN ||
		!process.env.FIREBASE_URL ||
		!process.env.HEROKU_URL
	) {
		throw Error('Please set environment variables!');
	}

	serviceAccount = {
		clientEmail: process.env.CLIENTE_MAIL,
		privateKey: process.env.PRIVATE_KEY,
		projectId: process.env.PROJECT_ID
	}

	environmentConfig = {
		botToken: process.env.BOT_TOKEN,
		firebaseUrl: process.env.FIREBASE_URL,
		herokuUrl: process.env.HEROKU_URL
	}

	bot = new TelegramBot(environmentConfig.botToken, { webHook: { port: PORT } });
	bot.setWebHook(`${environmentConfig.herokuUrl}/bot${environmentConfig.botToken}`);
}
else {

	try {
		serviceAccount = JSON.parse(fs.readFileSync('./config/adminsdk.json', 'utf8'));
		environmentConfig = JSON.parse(fs.readFileSync('./config/environment.json', 'utf8'));
	}
	catch {
		throw Error('Please setup the configuration files');
	}

	bot = new TelegramBot(environmentConfig.botToken, { polling: true });
}


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: environmentConfig.firebaseUrl
});
// const db = admin.firestore();

bot.on('message', async (msg) => {
	await onMessage(bot, msg);
});
