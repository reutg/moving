import dayjs from "dayjs";

const DEFAULT_DATE_FORMAT = "DD.MM.YYYY";

export const formatDate = (
  date: Date | string | number,
  format: string = DEFAULT_DATE_FORMAT,
): string => dayjs(date).format(format);
