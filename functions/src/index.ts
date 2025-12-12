import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();

export { createProjectWithDefaults } from "./createProjectWithDefaults";
export { onProjectDeleted } from "./onProjectDeleted";
export { stats } from "./stats";

export const helloWorld = onRequest((request, response): void => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
