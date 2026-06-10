export const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);
  // Check for invalid date
  if (isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};