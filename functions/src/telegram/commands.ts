import {logger} from "firebase-functions/v1";
import {Telegraf} from "telegraf";
import {courseSelectorMarkup, scheduleSelectorMarkup} from "./markups";
import {CustomContext} from "./telegram_bot";
import {Messages} from "./messages";
import {weekdays} from "./constants";
import {Services} from "./services";

/**
 * @fileoverview Telegram commands
 */
export class Commands {
  /**
   * @description Constructor
   * @param {Telegraf<CustomContext>} bot - Telegram bot
   * @constructor
   */
  constructor(bot: Telegraf<CustomContext>) {
    bot.command(["start", "group"], this.group);
    bot.command(weekdays, this.schedule);
    bot.command("schedule", this.scheduleMenu);
    bot.command("subscribe", this.subscribe);
    bot.command("unsubscribe", this.unsubscribe);
  }

  /**
   * @description Group command
   * @param {CustomContext} ctx - Telegram context
   */
  async group(ctx: CustomContext) {
    logger.info("Group command");
    return await ctx.reply(
      Messages.selectCourse,
      courseSelectorMarkup,
    );
  }

  /**
   * @description Schedule command
   * @param {CustomContext} ctx - Telegram context
   */
  async schedule(ctx: CustomContext): Promise<void> {
    logger.info("Schedule command");
    if (ctx.chat &&
      await ctx.db.userExists(ctx.chat.id) &&
      ctx.message && "text" in ctx.message) {
      const weekDay = ctx.message.text.toString().replace("/", "");
      const schedule = await Services.getScheduleByWeekday(ctx, weekDay);
      if (schedule != undefined) {
        await ctx.reply(schedule);
        return;
      }
    }
    await ctx.reply(Messages.selectCourse, courseSelectorMarkup);
  }

  /**
   * @description Schedule menu command
   * @param {CustomContext} ctx - Telegram context
   * @return {Promise<void>}
   */
  async scheduleMenu(ctx: CustomContext): Promise<void> {
    logger.info("Schedule menu command");
    if (ctx.chat && await ctx.db.userExists(ctx.chat.id)) {
      await ctx.reply(
        Messages.selectWeekday,
        scheduleSelectorMarkup,
      );
      return;
    }
    await ctx.reply(Messages.selectCourse, courseSelectorMarkup);
  }

  /**
   * @description Subscribe command
   * @param {CustomContext} ctx - Telegram context
   * @return {Promise<void>}
   */
  async subscribe(ctx: CustomContext): Promise<void> {
    logger.info("Subscribe command");
    if (ctx.chat && await ctx.db.userExists(ctx.chat.id)) {
      await ctx.db.updateUserSubscription(ctx.chat.id, true);
      await ctx.reply(Messages.youSubscribed);
      return;
    }
    await ctx.reply(Messages.selectCourse, courseSelectorMarkup);
  }

  /**
   * @description Unsubscribe command
   * @param {CustomContext} ctx - Telegram context
   * @return {Promise<void>}
   */
  async unsubscribe(ctx: CustomContext): Promise<void> {
    logger.info("Unsubscribe command");
    if (ctx.chat && await ctx.db.userExists(ctx.chat.id)) {
      await ctx.db.updateUserSubscription(ctx.chat.id, false);
      await ctx.reply(Messages.youUnsubscribed);
      return;
    }
    await ctx.reply(Messages.selectCourse, courseSelectorMarkup);
  }
}
