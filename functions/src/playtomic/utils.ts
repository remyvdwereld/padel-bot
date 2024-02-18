import dayjs from "dayjs";
import type { Tenant } from "./types";
import { RAINBOW_COLORS } from "../config";

export const createHyperlink = (tenant:Tenant, date:string) => {
  const link = `https://playtomic.io/${tenant?.tenant_uid}/${tenant.tenant_id}?q=PADEL~${date}`;
  return `[Klik hier om te reserveren](${link})`;
};

export const createTimeRange = (
  dateString: string, timeString: string, minutesToAdd: number
): string => {
  // Create a UTC date object
  const dateTimeString = `${dateString}T${timeString}.000Z`;
  const startTime = dayjs(dateTimeString);
  // Create endTime date object by adding minutesToAdd.
  const endTime = startTime.add(minutesToAdd, "minute");

  return `${startTime.format("HH:mm")} - ${endTime.format("HH:mm")}`;
};

export const createFormattedDate = (inputDate:string) => {
  const daysOfWeek = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
  const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

  const date = new Date(inputDate);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek} ${dayOfMonth} ${month} ${year}`;
};

const decimalColors = RAINBOW_COLORS.map((color) => parseInt(color.substring(1), 16));

export type DateObject = {
  date: string; // Assuming "date" is a string formatted as "YYYY-MM-DD"
  color: number; // Assuming "color" is a string representing a color
};

export const getDates = (periodInDays: number, preferredDaysOfTheWeek: number[]) => {
  const currentDate = dayjs();
  // Get the end date which is 'periodInDays' days from now
  const endDate = currentDate.add(periodInDays, "day");

  // Initialize an array to store the dates
  const datesArray: DateObject[] = [];

  // Loop through the dates from current date to end date
  let currentDateIterator = currentDate;
  let colorIndex = 0;
  while (currentDateIterator.isBefore(endDate)) {
    // Check if the current date's day of the week is in the preferred days
    if (preferredDaysOfTheWeek.includes(currentDateIterator.day())) {
      // Add the date to the array
      const newDate = currentDateIterator.clone();
      datesArray.push({
        date: newDate.format("YYYY-MM-DD"),
        color: decimalColors[colorIndex],
      }); // Clone the date to avoid mutating the original date
    }
    // Move to the next day
    currentDateIterator = currentDateIterator.add(1, "day");
    if (colorIndex < decimalColors.length) {
      colorIndex++;
    }
  }
  return datesArray;
};
