import {Context, Telegraf} from "telegraf";
import {Update} from "typegram";

/**
 * @fileoverview Telegram commands
 */
export class Commands {
  /**
   * @description Constructor
   * @param {Telegraf<Context<Update>>} bot - Telegram bot
   * @constructor
   */
  constructor(bot: Telegraf<Context<Update>>) {
    bot.command("start", Commands.start);
    bot.command("language", Commands.language);
  }

  /**
   * @description Start command
   * @param {Context<Update>} ctx - Telegram context
   */
  static async start(ctx: Context<Update>) {
    await ctx.reply("Welcome! Select a language /language");
  }

  /**
   * @description Language command
   * @param {Context<Update>} ctx - Telegram context
   */
  static async language(ctx: Context<Update>) {
    await ctx.reply("Select a language", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "English 🇬🇧",
              callback_data: "en",
            },
            {
              text: "Українська 🇺🇦",
              callback_data: "uk",
            },
            {
              text: "Русский 🏳️",
              callback_data: "ru",
            },
          ],
        ],
      },
    });
  }
}
