import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {TelegramBot} from "./telegram/telegram_bot";
import {Cronjob} from "./cronjob/cronjob";
import {AdminApp} from "./firebase/admin_app";

dotenv.config();
admin.initializeApp(functions.config().firebase);

export const telegram = new TelegramBot().getHandler();
export const cronjob = new Cronjob().getHandler();

const adminApp = new AdminApp();
export const onCreateSchedulesGroup = adminApp.onCreateSchedulesGroup;
export const onDeleteSchedulesGroup = adminApp.onDeleteSchedulesGroup;
export const onUpdateSchedulesGroup = adminApp.onUpdateSchedulesGroup;
