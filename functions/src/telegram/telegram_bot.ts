import * as functions from "firebase-functions";
import {Context, Telegraf} from "telegraf";

import {Commands} from "./commands";
import {Queries} from "./queries";

import {RealtimeDatabase} from "../firebase/realtime_database";
import {FirestoreDatabase} from "../firebase/firestore_database";

export interface CustomContext extends Context {
  db: RealtimeDatabase;
  firestore: FirestoreDatabase;
}

/**
 * @fileoverview Telegram bot
 */
export class TelegramBot {
  private bot: Telegraf<CustomContext>;

  /**
   * @description Constructor
   * @constructor
   */
  constructor() {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      console.error("Missing BOT_TOKEN environment variable");
      process.exit(1);
    }
    this.bot = new Telegraf(botToken);
    this.bot.use(async (ctx, next) => {
      const customContext = ctx as CustomContext;
      customContext.db = new RealtimeDatabase();
      customContext.firestore = new FirestoreDatabase();
      await next();
    });
    this.init();
  }

  /**
   * @description Initialize bot
   */
  private init() {
    functions.logger.info("Initializing bot");
    this.bot.catch(this.catch);
    new Commands(this.bot);
    new Queries(this.bot);
  }

  /**
   * @description Get bot handler
   * @return {functions.HttpsFunction} - Bot handler webhook
   */
  public getHandler(): functions.HttpsFunction {
    return functions
      .region("europe-west1")
      .https.onRequest((req, res) => {
        this.bot.handleUpdate(req.body, res);
      });
  }

  /**
   * @description Catch errors
   * @param {unknown} err - Error
   * @param {Context} ctx - Telegram context
   */
  private catch(err: unknown, ctx: Context) {
    functions.logger.error(`Telegram bot error: ${err}`);
    ctx.reply("Something went wrong");
  }
}
