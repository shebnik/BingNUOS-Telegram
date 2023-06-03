import {getFirestore} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * @fileoverview FlutterFunctions
 */
export class FlutterFunctions {
  private firestore = getFirestore();
  /**
   * @description Register user to Firebase Auth and Firestore
   * @param data.name User name
   * @param data.email User email
   * @param context
   */
  public registerUser = functions
    .region("europe-west1").https
    .onCall(async (data) => {
      try {
        const name = data.name;
        const email = data.email;
        const password = Math.random().toString(36).slice(-8);
        functions.logger.info(`[registerUser] email: ${email}`);
        const user = await admin.auth().createUser({
          email: email,
          password: password,
        });
        await this.firestore.collection("users").doc(user.uid).set({
          email: email,
          moderationGroups: data.moderationGroups,
          name: name,
          role: "moderator",
          userId: user.uid,
        });
        return true;
      } catch (error) {
        functions.logger.error(error);
        return error;
      }
    },
    );
  /**
   * @description Delete user from Firebase Auth and Firestore
   * @param data.uid User ID
   * @param context
   */
  public removeUser = functions
    .region("europe-west1").https
    .onCall(async (data) => {
      try {
        const uid = data.uid;
        functions.logger.info(`[removeUser] uid: ${uid}`);
        await admin.auth().deleteUser(uid);
        await this.firestore.collection("users").doc(uid).delete();
        return true;
      } catch (error) {
        functions.logger.error(error);
        return error;
      }
    },
    );
}
