var AVDate = (function () {
    "use strict";

    var DAYNAMES = {
        en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        sv: ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"]
    };

    var MONTHNAMES = {
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        sv: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"]
    };

    function weekStart(date, isSunday) {
        var days = date.getDay(),
            retDate = new Date(date);

        retDate.setDate(date.getDate() - sundayCorrect(days, isSunday));
        retDate.setHours(0, 0, 0);
        return retDate;
    }

    function adjacentWeekStart(date, weeks, isSunday) {
        return dateWeeksAfterDate(weekStart(date, isSunday), weeks);
    }

    function dateWeeksAfterDate(date, weeks) {
        var d = new Date(date);
        d.setDate(d.getDate() + 7 * weeks);
        return d;
    }

    function weeklyDatesBetweenDates(startDate, duration, recurrence, endDate) {
        if (endDate - startDate > (3600 * 1000 * 24 * 300)) {
            //limit is 300 days
            return null;
        }
        var dates = [];
        while (endDate - startDate > duration * 60 * 1000) {
            dates.push(new Date(startDate));
            startDate = dateWeeksAfterDate(startDate, recurrence);
        }
        return dates;
    }

    function nextWeekStart(date, isSunday) {
        return adjacentWeekStart(date, 1, isSunday);
    }

    function previousWeekStart(date, isSunday) {
        return adjacentWeekStart(date, -1, isSunday);
    }

    function sameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    function isToday(date) {
        return sameDay(date, new Date());
    }

    function dayProgress(date) {
        return (date.getHours() + date.getMinutes() / 60) / 24;
    }

    function getNearestQuarterFromProgress(date, progress) {
        var dateCopy = new Date(date);
        var time = 24 * progress;
        var hours = Math.floor(24 * progress);
        var minutes = Math.floor(60 * (time - hours) / 15) * 15;
        dateCopy.setHours(hours, minutes, 0);
        return dateCopy;
    }

    function partOfDay(minutes) {
        return minutes / (60 * 24);
    }

    function dateDaysAfterDate(date, daysAfter) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + daysAfter);
    }

    function dateMinutesAfterDate(date, minutes) {
        var retDate = new Date(date);
        retDate.setMinutes(retDate.getMinutes() + minutes);
        return retDate;
    }

    function minutesBetween(laterDate, earlierDate) {
        return (laterDate - earlierDate) / (60 * 1000);
    }

    function daysBetween(startDate, date) {
        var days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
        if (days === 0) {
            return (date.getDate() - startDate.getDate()) ? 1 : 0;
        } else {
            return days;
        }
    }

    function daysOfMonthForDate(date) {
        return daysOfMonth(date.getFullYear(), date.getMonth() + 1);
    }

    function daysOfMonth(year, month) {
        return (new Date(year, month, 0)).getDate();
    }

    function getWeekNumber(date) {
        date = new Date(date);
        date.setHours(0, 0, 0);
        date.setDate(date.getDate() - (date.getDay() || 7) + 4);
        var yearStart = new Date(date.getFullYear(), 0, 1);
        return Math.ceil(((date - yearStart) / (1000 * 3600 * 24) + 1) / 7);
    }

    function sundayCorrect(day, isSunday) {
        if (!isSunday) {
            day = (day || 7) - 1; //makes monday 0, tuesday 1 etc
        }
        return day;
    }

    function weekDayOfFirstDayInMonth(year, month, isSunday) {
        var day = (new Date(year, month)).getDay();
        return sundayCorrect(day, isSunday);
    }

    function firstDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth());
    }

    function weekDayOfLastDayInMonth(year, month, isSunday) {
        var lastDay = new Date(year, month);
        lastDay.setDate(daysOfMonthForDate(lastDay));
        return sundayCorrect(lastDay.getDay(), isSunday);
    }

    function twoDigits(number) {
        if (("" + number).length === 1) {
            return "0" + number;
        } else {
            return "" + number;
        }
    }

    function timeString(date) {
        return twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes());
    }

    function dateToString(date) {
        return date.toDateString() + " " + timeString(date);
    }

    function dateToISOString(date) {
        return date.getFullYear() + "-" + twoDigits(date.getMonth() + 1) + "-" + twoDigits(date.getDate());
    }

    function nameOfDay(dayNumber, maxlen, lang) {
        lang = lang || "en";
        maxlen = maxlen || 100; // clearly full length if not set
        dayNumber = sundayCorrect(dayNumber);
        return DAYNAMES[lang][dayNumber].substring(0, maxlen);
    }

    function nameOfDayForDate(date, maxlen, lang) {
        return nameOfDay(date.getDay(), maxlen, lang);
    }

    function nameOfMonth(month, maxlen, lang) {
        lang = lang || "en";
        maxlen = maxlen || 100; // clearly full length if not set
        return MONTHNAMES[lang][month].substring(0, maxlen);
    }

    function nameOfMonthForDate(date, maxlen, lang) {
        return nameOfMonth(date.getMonth(), maxlen, lang);
    }

    function dayNames(length, lang) {
        lang = lang || "en";
        var names = DAYNAMES[lang];
        return length ? names.map(function (name) {
            return name.substring(0, length);
        }) : names;
    }

    //a bit unclear why this one is here, but needed for method below unless Array() is used
    function getNullArray(length) {
        var array = [], i;
        for (i = 0; i < length; i++) {
            array[i] = null;
        }
        return array;
    }

    function weekArraysForMonth(year, month) {
        var dayArray = [], weekArrays = [],
            days, weekdaysBeforeMonth, weekdaysAfterMonth, nullPaddedMonth, i, j;

        days = daysOfMonth(year, month);
        for (i = 0; i < days; i++) {
            dayArray[i] = i + 1;
        }
        weekdaysBeforeMonth = getNullArray(weekDayOfFirstDayInMonth(year, month));
        weekdaysAfterMonth = getNullArray(6 - weekDayOfLastDayInMonth(year, month));
        nullPaddedMonth = weekdaysBeforeMonth.concat(dayArray, weekdaysAfterMonth);
        for (i = 0, j = nullPaddedMonth.length; i < j; i += 7) {
            weekArrays.push(nullPaddedMonth.slice(i, i + 7));
        }
        return weekArrays;
    }

    function weekArrayForDate(date) {
        var startDate = weekStart(date);
        var weekDays = [0, 1, 2, 3, 4, 5, 6];
        return weekDays.map(function (value) {
            var weekDay = new Date(startDate);
            weekDay.setDate(startDate.getDate() + value);
            return weekDay;
        });
    }

    /**
     * Emulates PHP date formatter, see http://www.php.net/manual/en/function.date.php
     */
    function formatDate(format, date) {
        date = date || new Date();
        var formatted = "",
            i = 0;
        for (; i < format.length; i++) {
            switch (format[i]) {
                case "Y":
                    formatted += date.getFullYear();
                    break;
                case "m":
                    formatted += twoDigits(date.getMonth() + 1);
                    break;
                case "M":
                    formatted += nameOfMonthForDate(date, 3);
                    break;
                case "F":
                    formatted += nameOfMonthForDate(date);
                    break;
                case "d":
                    formatted += twoDigits(date.getDate());
                    break;
                case "D":
                    formatted += nameOfDayForDate(date, 3);
                    break;
                case "l":
                    formatted += nameOfDayForDate(date);
                    break;
                default:
                    formatted += format[i];
            }
        }
        return formatted;
    }

    return {
        weekStart: weekStart,
        nextWeekStart: nextWeekStart,
        previousWeekStart: previousWeekStart,
        adjacentWeekStart: adjacentWeekStart,
        dateWeeksAfterDate: dateWeeksAfterDate,
        weeklyDatesBetweenDates: weeklyDatesBetweenDates,
        dateDaysAfterDate: dateDaysAfterDate,
        dateMinutesAfterDate: dateMinutesAfterDate,
        getWeekNumber: getWeekNumber,
        weekArraysForMonth: weekArraysForMonth,
        weekArrayForDate: weekArrayForDate,
        weekDayOfFirstDayInMonth: weekDayOfFirstDayInMonth,
        weekDayOfLastDayInMonth: weekDayOfLastDayInMonth,
        sameDay: sameDay,
        daysBetween: daysBetween,
        minutesBetween: minutesBetween,
        dayProgress: dayProgress,
        getNearestQuarterFromProgress: getNearestQuarterFromProgress,
        partOfDay: partOfDay,
        isToday: isToday,
        daysOfMonth: daysOfMonth,
        daysOfMonthForDate: daysOfMonthForDate,
        dateToString: dateToString,
        timeString: timeString,
        dateToISOString: dateToISOString,
        nameOfDay: nameOfDay,
        nameOfMonth: nameOfMonth,
        nameOfDayForDate: nameOfDayForDate,
        nameOfMonthForDate: nameOfMonthForDate,
        formatDate: formatDate,
        dayNames: dayNames
    };

})();
