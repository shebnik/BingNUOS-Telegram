import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {TelegramBot} from "./telegram/telegram_bot";
import {Cronjob} from "./cronjob/cronjob";
import {AdminApp} from "./firebase/admin_app";
import {FlutterFunctions} from "./firebase/flutter_functions";

dotenv.config();
admin.initializeApp(functions.config().firebase);

export const telegramBot = new TelegramBot().getHandler();
export const cronjob = new Cronjob().getHandler();

export const onCreateSchedulesGroup = new AdminApp().onCreateSchedulesGroup;
export const onDeleteSchedulesGroup = new AdminApp().onDeleteSchedulesGroup;
export const onUpdateSchedulesGroup = new AdminApp().onUpdateSchedulesGroup;

export const registerUser = new FlutterFunctions().registerUser;
export const removeUser = new FlutterFunctions().removeUser;
