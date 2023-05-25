/* eslint-disable max-len */

import moment from "moment";
import {lessonTimesDuration, translatedWeekDay} from "./constants";
import {Messages} from "./messages";
import {CustomContext} from "./telegram_bot";
import {FirestoreDatabase} from "../firebase/firestore_database";

/**
 * Services
 * @class
 * @abstract
 */
export class Services {
  /**
   * @description Get schedule by weekday
   * @param {CustomContext} ctx - Telegram context
   * @param {string} weekday - Weekday
   */
  public static async getScheduleByWeekday(ctx: CustomContext, weekday: string): Promise<string | undefined> {
    if (ctx.chat === undefined) {
      return;
    }
    const docId = await ctx.db.getGroupByUserId(ctx.chat.id);
    if (docId === undefined) {
      return Messages.selectGroupFirst;
    }
    const scheduleDoc = await ctx.firestore.getSchedule(docId);
    if (scheduleDoc === undefined) {
      return Messages.scheduleForGroupNotExists;
    }

    weekday = weekday.toLowerCase();

    const data = scheduleDoc.data();
    if (data === undefined) {
      return Messages.scheduleForGroupNotExists;
    }
    const scheduleInfo = data[weekday];
    if (scheduleInfo === null || scheduleInfo.length < 1) {
      return `Розклад на ${translatedWeekDay.get(weekday.toLowerCase())} відсутній`;
    }

    let res = `Розклад на ${translatedWeekDay.get(weekday.toLowerCase())}: \n\n`;
    scheduleInfo.sort((a: any, b: any) => a.number - b.number);
    scheduleInfo.forEach((item: any) => {
      let subject: any;
      if (item.isDivided) {
        subject = this.isEvenWeekInMonth() ? item.evenSubject : item.oddSubject;
      } else {
        subject = item.subject;
      }
      res += `${item.number} пара ${lessonTimesDuration[item.number - 1]} - ${subject.name}. Кабінет: ${subject.cabinet}. Викладач: ${subject.teacher}\n\n`;
    });
    return res;
  }

  /**
     * @description Get schedule by pair number
     * @param {string} group - Group
     * @param {string} weekday - Weekday
     * @param {number} pairNumber - Pair number
     * @return {Promise<string | undefined>}
     */
  public static async getScheduleByPairNumber(
    group: string, weekday: string, pairNumber: number):
        Promise<string | undefined> {
    const scheduleDoc = await new FirestoreDatabase().getSchedule(group);
    if (scheduleDoc === undefined || !scheduleDoc.exists) return;

    weekday = weekday.toLowerCase();
    const data = scheduleDoc.data();
    if (data === undefined) {
      return Messages.scheduleForGroupNotExists;
    }
    const scheduleInfo = data[weekday];
    if (scheduleInfo == undefined || scheduleInfo.length < 1) return;
    let subject;
    for (let i = 0; i < scheduleInfo.length; i++) {
      if (scheduleInfo[i].number == pairNumber) {
        subject = scheduleInfo[i];
        break;
      }
    }
    if (subject == undefined) return;

    let subjectInfo;
    if (subject.isDivided) {
      subjectInfo =
            this.isEvenWeekInMonth() ? subject.evenSubject : subject.oddSubject;
    } else {
      subjectInfo = subject.subject;
    }

    // eslint-disable-next-line max-len
    return `Наступна пара - ${subjectInfo.name}. Кабінет ${subjectInfo.cabinet}. Викладач: ${subjectInfo.teacher}`;
  }

  /**
    * @description isEvenWeekInMonth
    * @return {boolean}
    */
  public static isEvenWeekInMonth(): boolean {
    const currentDate = new Date();
    const currentWeekNumber = moment(currentDate).isoWeek();
    const currentMonth = currentDate.getMonth();

    const isFirstWeekOfMonth = currentWeekNumber <= 2;
    const isOddWeekInMonth = currentWeekNumber % 2 !== 0;
    const isEvenWeekInMonth = currentWeekNumber % 2 === 0;

    if (isFirstWeekOfMonth) {
      return false; // The first week of the month is always odd
    } else if (isOddWeekInMonth && currentMonth % 2 !== 0) {
      return true; // Odd weeks in odd months are even weeks in the month
    } else if (isEvenWeekInMonth && currentMonth % 2 === 0) {
      return true; // Even weeks in even months are even weeks in the month
    } else {
      return false; // All other weeks are odd weeks in the month
    }
  }
}
