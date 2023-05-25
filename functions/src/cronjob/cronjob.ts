import * as functions from "firebase-functions";
import {Telegraf} from "telegraf";
import {lessonTimes, times} from "../telegram/constants";
import {RealtimeDatabase} from "../firebase/realtime_database";
import {Services} from "../telegram/services";

/**
 * @fileoverview Cronjob class
 */
export class Cronjob {
  private date: Date;
  private bot: Telegraf;
  /**
     * @description Constructor
     * @constructor
     * @public
     */
  constructor() {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) {
      console.error("Missing BOT_TOKEN environment variable");
      process.exit(1);
    }
    this.date = new Date();
    this.bot = new Telegraf(botToken);
  }
  /**
   * @description Get handler
   * @return {functions.HttpsFunction}
   */
  public getHandler(): functions.HttpsFunction {
    return functions
      .region("europe-west1")
      .https.onRequest(async (req, res): Promise<void> => {
        functions.logger.info("Cronjob started");
        await this.sendSchedules();
        res.sendStatus(200);
      });
  }
  /**
     * @description Send schedules
     * @return {Promise<void>}
     */
  private async sendSchedules(): Promise<void> {
    const weekday = this.date.toLocaleString("en", {
      timeZone: "Europe/Kiev",
      weekday: "long",
    }).toLowerCase();
    if (weekday === "saturday" || weekday === "sunday") return;

    const time = this.date.toLocaleString("uk", {
      timeZone: "Europe/Kiev",
      hour: "numeric",
      minute: "numeric",
    });
    const number = times.findIndex((e) => e === time);

    functions.logger.log(
      `${times[number]} - will send schedule $weekday on ${number + 1} lesson`,
    );

    if (number === -1) return;

    const subscribedUsers = await new RealtimeDatabase().getSubscribedUsers();

    for (const [group, userIds] of subscribedUsers) {
      let message =
            await Services.getScheduleByPairNumber(group, weekday, number + 1);
      if (message === undefined) continue;
      message += `\n\nПочаток ${number + 1} пары о ${lessonTimes[number]}`;

      for (const uid of userIds) {
        functions.logger.log(message);
        await this.sendMessage(uid, message);
      }
    }
  }
  /**
   * @description Send message
   * @param {string} uid - User id
   * @param {string} message - Message
   * @return {Promise<void>}
   */
  private async sendMessage(uid: string, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(uid, message);
  }
}
