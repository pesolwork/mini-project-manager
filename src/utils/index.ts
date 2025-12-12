import type { TimestampLike } from "@/types";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

export const isTimestamp = (value: any): value is Timestamp =>
  value instanceof Timestamp;

export const isJsDate = (value: any): value is Date => value instanceof Date;

export const formatDate = (timestamp?: Timestamp | TimestampLike | Date) => {
  if (!timestamp) {
    return "";
  }

  if (isTimestamp(timestamp)) {
    return dayjs(timestamp.toDate()).format("YYYY-MM-DD");
  }

  if (isJsDate(timestamp)) {
    return dayjs(timestamp).format("YYYY-MM-DD");
  }

  return dayjs.unix(timestamp.seconds).format("YYYY-MM-DD");
};
