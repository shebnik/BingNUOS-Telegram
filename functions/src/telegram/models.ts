export interface Schedule {
    group: string;
    monday: Subject[];
    tuesday: Subject[];
    wednesday: Subject[];
    thursday: Subject[];
    friday: Subject[];
}

export interface Subject {
    number: number;
    isDivided: boolean;
    evenSubject: SubjectInfo;
    oddSubject: SubjectInfo;
    subject: SubjectInfo;
}

export interface SubjectInfo {
    name: string;
    cabinet: string;
    teacher: string;
}

/**
 * @description Get schedule by weekday
 * @param {Schedule} schedule - Schedule document
 * @param {string} weekday - Weekday
 * @return {Subject[]}
 * @name getScheduleByWeekday
 */
export function getScheduleByWeekday(schedule: Schedule, weekday: string)
    : Subject[] {
  const lowercaseWeekday = weekday.toLowerCase();
  switch (lowercaseWeekday) {
  case "monday":
    return schedule.monday;
  case "tuesday":
    return schedule.tuesday;
  case "wednesday":
    return schedule.wednesday;
  case "thursday":
    return schedule.thursday;
  case "friday":
    return schedule.friday;
  default:
    // Handle the case where an invalid weekday string is provided
    throw new Error(`Invalid weekday: ${weekday}`);
  }
}
