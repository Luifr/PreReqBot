import { ISubject } from './models';

import admin from 'firebase-admin';
import { readJsonFile } from './helpers/file-sytem';

const serviceAccount: { projectId: string, privateKey: string, clientEmail: string } = {
  clientEmail: process.env.CLIENT_EMAIL!,
  privateKey: process.env.PRIVATE_KEY!,
  projectId: process.env.PROJECT_ID!
};

const databaseName = process.env.DATABASE_NAME;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${databaseName}.firebaseio.com`
});

export const db = admin.firestore();

export const map = require('../jupiter/maps/bcc.js');
export const grade: { [code: string]: ISubject } = readJsonFile('./jupiter/grade/bcc');
