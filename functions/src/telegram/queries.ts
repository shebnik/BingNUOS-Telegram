import {Telegraf} from "telegraf";

import {logger} from "firebase-functions";
import {queryTypes, weekdays} from "./constants";
import {courseSelectorMarkup, getGroupsMarkup} from "./markups";
import {Messages} from "./messages";
import {CustomContext} from "./telegram_bot";
import {Services} from "./services";

/**
 * @fileoverview Telegram queries
 */
export class Queries {
  /**
    * @description Callback query
    * @param {CustomContext} ctx - Telegram context
    * @return {Promise<void>}
    */
  static async callbackQuery(ctx: CustomContext): Promise<void> {
    if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
      const query: string = ctx.callbackQuery.data;

      if (query == queryTypes.courseSelector) {
        await ctx.editMessageText(
          Messages.selectCourse,
          courseSelectorMarkup,
        );
        return;
      }

      if (query.indexOf(queryTypes.course) != -1) {
        await ctx.editMessageText(Messages.loading);
        const groups =
          await ctx.db.getGroupsByCourse(query.replace("course", ""));
        await ctx.editMessageText(
          Messages.selectGroup,
          getGroupsMarkup(groups),
        );
        return;
      }

      if (ctx.chat == undefined) {
        return;
      }

      if (weekdays.indexOf(query) != -1) {
        await ctx.editMessageText(Messages.loading);
        const schedule =
          await Services.getScheduleByWeekday(ctx, query);
        if (schedule !== undefined) {
          ctx.deleteMessage();
          await ctx.reply(schedule);
        } else {
          await ctx.reply(
            Messages.selectCourse,
            courseSelectorMarkup,
          );
        }
        return;
      }

      if ((await ctx.db.getGroupIds()).indexOf(query) != -1) {
        await ctx.editMessageText(Messages.loading);
        await ctx.db.setTelegramUser(ctx.chat.id, query);
        const group = await ctx.db.getGroupById(query);
        // eslint-disable-next-line max-len
        ctx.editMessageText(`${Messages.selectedGroup} ${group}\n\n${Messages.help}`);
        return;
      }
    }
  }

  /**
    * @description Inline query
    * @param {CustomContext} ctx - Telegram context
    * @return {Promise<void>}
    */
  static async inlineQuery(ctx: CustomContext): Promise<void> {
    if (!ctx.inlineQuery) {
      logger.info("No inline query");
      return;
    }
  }

  /**
    * @description Constructor
    * @param {Telegraf<CustomContext>} bot - Telegram bot
    * @constructor
    */
  constructor(bot: Telegraf<CustomContext>) {
    bot.on("inline_query", Queries.inlineQuery);
    bot.on("callback_query", Queries.callbackQuery);
  }
}
