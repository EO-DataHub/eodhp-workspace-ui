import { DateTime } from 'luxon';

const format = 'yyyy-MM-dd HH:mm:ss';

export const convertUTCToLocalTime = (date: string): string => {
  return DateTime.fromISO(date).toLocal().toFormat(format);
};

export const displayUTCTime = (date: string): string => {
  return DateTime.fromISO(date).toUTC().toFormat(format);
};
