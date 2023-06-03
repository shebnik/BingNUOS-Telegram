import {firestore} from "firebase-admin";
import {logger} from "firebase-functions/v1";

/**
 * @fileoverview FirestoreDatabase class
 */
export class FirestoreDatabase {
  private firestore: FirebaseFirestore.Firestore;
  private schedulesRef: FirebaseFirestore.CollectionReference;
  /**
     * @description Constructor
     * @constructor
     * @public
     */
  constructor() {
    this.firestore = firestore();
    this.schedulesRef = this.firestore.collection("schedules");
  }

  /**
     * @description Get schedule document reference
     * @param {string} group - Group
     * @return {firestore.DocumentReference}
     */
  private scheduleDocRef(group: string): firestore.DocumentReference {
    return this.schedulesRef.doc(group);
  }

  /**
     * @description Get firestore
     * @return {FirebaseFirestore.Firestore}
     */
  public getFirestore(): FirebaseFirestore.Firestore {
    return this.firestore;
  }

  /**
     * @description Get schedule
     * @param {string} group - Group
     * @return {Promise<firestore.DocumentSnapshot | undefined>}
     */
  public async getSchedule(group: string):
    Promise<firestore.DocumentSnapshot | undefined> {
    const doc = await this.scheduleDocRef(group).get();
    if (!doc.exists) {
      logger.error(`Schedule for group ${group} does not exist`);
      return undefined;
    }
    return doc;
  }
}
