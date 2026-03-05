import { format } from "date-fns";

export const formatTravelDate = (date) => {

  if (!date) return "";

  return format(new Date(date), "do MMM yyyy");
};