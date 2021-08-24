import { formatDistanceStrict } from "date-fns";

export const formatDistanceAbr = (date: Date, baseDate: Date) => {
  const distance = formatDistanceStrict(date, baseDate);

  const distanceSplit = distance.split(" ");
  const value = distanceSplit[0];
  const unit = distanceSplit[1];

  return unit && unit.length > 0 ? `${value}${unit[0]}` : distance;
};
