import * as functions from "firebase-functions";
import { startPlaytomic } from "./playtomic";
import dotenv from 'dotenv';

dotenv.config();

export const startSchedulePadel = functions.pubsub
  .schedule("every 60 minutes")
  .timeZone("Europe/Amsterdam")
  .onRun(async () => {
    startPlaytomic();
  });
