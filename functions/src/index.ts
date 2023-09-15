import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
import {TelegramBot} from "./telegram/telegram_bot";
import {Cronjob} from "./cronjob/cronjob";
import {AdminApp} from "./firebase/admin_app";
import {FlutterFunctions} from "./firebase/flutter_functions";
const serviceAccount = require("./serviceAccountKey.json");

dotenv.config();

const databaseURL = process.env.DATABASE_URL;
if (!databaseURL) {
  console.error("Missing firebase environment variable");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

export const telegramBot = new TelegramBot().getHandler();
export const cronjob = new Cronjob().getHandler();

export const onCreateSchedulesGroup = new AdminApp().onCreateSchedulesGroup;
export const onDeleteSchedulesGroup = new AdminApp().onDeleteSchedulesGroup;
export const onUpdateSchedulesGroup = new AdminApp().onUpdateSchedulesGroup;

export const registerUser = new FlutterFunctions().registerUser;
export const removeUser = new FlutterFunctions().removeUser;
