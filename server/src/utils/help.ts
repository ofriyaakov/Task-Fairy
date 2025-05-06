import Holidays from "date-holidays";

const hd = new Holidays("IL");

export function isHolidayOrSaturday(date: Date): boolean {
    const myDate = new Date(date);
    
  if (myDate.getDay() === 6) return true;

  const holidays = hd.getHolidays(myDate.getFullYear());

  return holidays.some(h => {
    const d = new Date(h.date);
    return (
      d.getFullYear() === myDate.getFullYear() &&
      d.getMonth()    === myDate.getMonth() &&
      d.getDate()     === myDate.getDate()
    );
  });
}
