import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export function formatDateToKorean(dateInput) {
  if (!dateInput) {
    return "No date";
  }
  try {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .slice(0, -1);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error date";
  }
}

export function formatRelativeTime(dateInput) {
  if (!dateInput) {
    return "";
  }

  const targetDate = dayjs(dateInput);
  const now = dayjs();

  if (now.subtract(1, "day").isSame(targetDate, "day")) {
    return "어제";
  }

  if (now.diff(targetDate, "day") < 7) {
    return targetDate.fromNow();
  }

  return targetDate.format("YYYY.MM.DD");
}
