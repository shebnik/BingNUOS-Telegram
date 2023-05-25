import {database} from "firebase-admin";
import {logger} from "firebase-functions/v1";

interface GroupData {
  docId: string;
  group: string;
}

/**
 * @fileoverview Realtime database
 * @class RealtimeDatabase
 * @description Realtime database
 */
export class RealtimeDatabase {
  private database: database.Database;

  private groupsRef: database.Reference;
  private usersRef: database.Reference;

  /**
   * @description Constructor
   * @constructor
  */
  constructor() {
    this.database = database();
    this.groupsRef = this.database.ref("/groups");
    this.usersRef = this.database.ref("/users");
  }

  /**
   * @description Get database
   * @return {database.Database}
   * @public
   */
  public getDatabase(): database.Database {
    return this.database;
  }

  /**
   * @description Get groups reference
   * @param {number} chatId - Chat id
   * @return {database.Reference}
   */
  private telegramUserRef(chatId: number) : database.Reference {
    return this.database.ref(`/users/${chatId}`);
  }

  /**
   * @description Get group reference
   * @param {string} id - Document id
   * @return {database.Reference}
   */
  private groupRef(id: string): database.Reference {
    return this.database.ref(`/groups/${id}`);
  }

  /**
   * @description Get groups by course
   * @param {string} course - Course
   * @return {{group: string, docId: string}[]} - docId, group
   */
  public async getGroupsByCourse(course: string):
    Promise<{group: string, docId: string}[]> {
    logger.info(`Getting groups by course ${course}`);
    const snapshot = await this.groupsRef.get();
    const groupList: {group: string, docId: string}[] =
      Object.entries(snapshot.toJSON() ?? {})
        .map(([id, data]: [string, GroupData]) => ({id, ...data}))
        .filter(({group}) => group.charAt(0) === course)
        .sort((a, b) => a.group.localeCompare(b.group))
        .map(({group, docId}) => ({group, docId}));

    return groupList;
  }

  /**
   * @description Get group ids
   * @return {string[]} - Group ids
   */
  public async getGroupIds(): Promise<string[]> {
    logger.info("Getting group ids");
    const snapshot = await this.groupsRef.get();
    const groupIds: string[] =
      Object.entries(snapshot.toJSON() ?? {})
        .map(([id, data]: [string, GroupData]) => ({id, ...data}))
        .map(({docId}) => docId);

    return groupIds;
  }

  /**
   * @description Get group by id
   * @param {string} id - Group id
   * @return {string} - Group
   */
  public async getGroupById(id: string): Promise<string> {
    logger.info(`Getting group by id ${id}`);
    const json = (await this.groupRef(id).get()).toJSON();
    if (json && "group" in json) {
      return json.group as string;
    }
    logger.error(`Group with id ${id} not found`);
    return "";
  }

  /**
   * @description Set telegram user
   * @param {number} chatId - Chat id
   * @param {string} groupId - Group id
   */
  public async setTelegramUser(chatId: number, groupId: string): Promise<void> {
    logger.info(`Setting telegram user ${chatId} to group ${groupId}`);
    await this.telegramUserRef(chatId).set({
      "chatId": chatId,
      "group": groupId,
      "subscribed": false,
    });
  }

  /**
   * @description Get telegram user
   * @param {number} chatId - Chat id
   * @return {string} - Group id
   */
  public async getGroupByUserId(chatId: number): Promise<string | undefined> {
    logger.info(`Getting group by user id ${chatId}`);
    const json = (await this.telegramUserRef(chatId).get()).toJSON();
    if (json && "group" in json) {
      return json.group as string;
    }
    logger.error(`Group with user id ${chatId} not found`);
    return undefined;
  }

  /**
   * @description Check if user exists
   * @param {number} id - User id
   */
  public async userExists(id: number): Promise<boolean> {
    return (await this.telegramUserRef(id).get()).exists();
  }

  /**
    * @description update user subscription
    * @param {number} id - User id
    * @param {boolean} newSubscription - New subscription
    * @return {Promise<void>}
    */
  public async updateUserSubscription(id: number, newSubscription: boolean):
    Promise<void> {
    logger.info(`Updating user ${id} subscription to ${newSubscription}`);
    await this.telegramUserRef(id).update({
      "subscribed": newSubscription,
    });
  }

  /**
   * @description Get subscribed users
   * @return {Promise<Map<string, number[]>>}
   */
  public async getSubscribedUsers() {
    const users = (await this.usersRef.get()).toJSON();
    if (!users) {
      return new Map();
    }
    const subscribedUsers = new Map();
    Object.values(users)
      .filter((u) => u.subscribed === true)
      .forEach((u) => {
        if (subscribedUsers.has(u.group)) {
          subscribedUsers.set(
            u.group,
            [...subscribedUsers.get(u.group), u.chatId],
          );
        } else {
          subscribedUsers.set(u.group, [u.chatId]);
        }
      });
    return subscribedUsers;
  }
}
