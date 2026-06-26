import dayjs from "dayjs";

const DEFAULT_DATE_FORMAT = "DD.MM.YYYY";

export const formatDate = (
  date: Date | string | number,
  format: string = DEFAULT_DATE_FORMAT,
): string => dayjs(date).format(format);

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
