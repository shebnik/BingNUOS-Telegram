import {getDatabase} from "firebase-admin/database";
// import {getFirestore} from "firebase-admin/firestore";
import * as functions from "firebase-functions";

/**
 * @fileoverview Firebase Admin App
 */
export class AdminApp {
  // private firestore = getFirestore();
  private db = getDatabase();
  private groupsRef = this.db.ref("/groups");


  public onCreateSchedulesGroup = functions
    .region("europe-west1").firestore
    .document("schedules/{docId}")
    .onCreate(async (snap, context) => {
      const docId = context.params.docId;
      const group = snap.data().group;
      functions.logger.info(`[onCreateSchedulesGroup] Created group: ${group}`);
      await this.groupsRef.child(docId).set({
        docId: docId,
        group: group,
      });
    });


  public onDeleteSchedulesGroup = functions
    .region("europe-west1").firestore
    .document("schedules/{docId}")
    .onDelete(async (snap, context) => {
      const docId = context.params.docId;
      const group = snap.data().group;

      functions.logger.info(`[onDeleteSchedulesGroup] Deleted group: ${group}`);
      await this.groupsRef.child(docId).remove();
    });

  public onUpdateSchedulesGroup = functions
    .region("europe-west1").firestore
    .document("schedules/{docId}")
    .onUpdate(async (snap, context) => {
      const docId = context.params.docId;
      const oldGroup = snap.before.data().group;
      const newGroup = snap.after.data().group;

      functions.logger.info(
        `[onUpdateSchedulesGroup] Updated group: ${oldGroup} -> ${newGroup}`,
      );
      await this.groupsRef.child(docId).update({
        docId: docId,
        group: newGroup,
      });
    });
}
