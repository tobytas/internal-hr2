function resetHours(date) {
    date.setHours(0, 0, 0, 0);
}

function dateUniformString(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1 + '').padStart(2, '0') + '-' + (date.getDate() + '').padStart(2, '0');
}

function getWeekFirstDay(date, weekInterval) {
    const mon = date.getDate() + (weekInterval * 7) - (date.getDay() || 7) + 1; //last Sunday + 1 = Monday
    const monDate = new Date(new Date(date).setDate(mon));
    return dateUniformString(monDate);
}

function getWeekLastDay(date, weekInterval) {
    const sun = date.getDate() + (weekInterval * 7) - (date.getDay() || 7) + 7; //last Sunday + 7 = next Sunday
    const sunDate = new Date(new Date(date).setDate(sun));
    return dateUniformString(sunDate);
}

function getMonthFirstDay(date, monthInterval) {
    const firstDate = new Date(date.getFullYear(), date.getMonth() + monthInterval, 1);
    return dateUniformString(firstDate);
}

function getMonthLastDay(date, monthInterval) {
    const lastDate = new Date(date.getFullYear(), date.getMonth() + monthInterval + 1, 0);
    return dateUniformString(lastDate);
}

function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; //hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((date1 - date2) / oneDay));
}

function isoWeekNumber(date) {
    const date1900_01_07 = new Date(1900, 0, 7);
    const daysSince1900_01_07 = daysBetween(date1900_01_07, date);
    const dayNumber = daysSince1900_01_07 % 7 + 1;

    const d = new Date(date);
    const dateForYear = new Date(d.setDate(d.getDate() + (8 - dayNumber) % 7 - 3));
    const year = dateForYear.getFullYear();
    const year_01_01 = new Date(year, 0, 1);

    return Math.floor((daysBetween(year_01_01, date) + (daysBetween(new Date(1900, 0, 7), year_01_01) % 7 + 2) % 7 - 3) / 7 + 1);
}

function isoWeekNumber2(date) {
    //Copy date so don't modify original
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    //Set to nearest Thursday: current date + 4 - current day number
    //Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    //Get first day of year
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    //Calculate full weeks to nearest Thursday
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

export {getWeekFirstDay, getWeekLastDay, getMonthFirstDay, getMonthLastDay, dateUniformString, isoWeekNumber, isoWeekNumber2}