import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {TelegramBot} from "./telegram/telegram_bot";

dotenv.config();
admin.initializeApp(functions.config().firebase);

export const telegram = new TelegramBot().getHandler();
