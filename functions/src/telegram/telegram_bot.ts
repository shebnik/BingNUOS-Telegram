import * as functions from "firebase-functions";
import {Context, Telegraf} from "telegraf";

import {Commands} from "./commands";

/**
 * @fileoverview Telegram bot
 */
export class TelegramBot {
  private bot: Telegraf<Context>;

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
    this.init();
  }

  /**
   * @description Initialize bot
   */
  private init() {
    new Commands(this.bot);
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
}
