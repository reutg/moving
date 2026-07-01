import { dayjs } from "@/lib/dayjs-utils";

const DEFAULT_DATE_FORMAT = "DD.MM.YYYY";

export const formatDate = (
  date: Date | string | number | null,
  format: string = DEFAULT_DATE_FORMAT,
): string => (date ? dayjs(date).format(format) : "");

export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

export const isFutureDate = (date: Date | string | number | null) => {
  return date ? dayjs(date).isAfter(dayjs(), "day") : false;
};

export const getDaysUntilDate = (date: Date | string | number | null) => {
  return date ? dayjs(date).diff(dayjs(), "day") : 0;
};
