import { formatDistanceToNowStrict } from "date-fns";
import { id } from "date-fns/locale";

export const formatRelativeTime = (dateString: string | Date | null): string => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "-";
  }

  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: id,
  });
};