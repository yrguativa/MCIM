import { format } from "date-fns";
import { es } from 'date-fns/locale';

/**
 * For dates that are the current day or within one day, return 'today', 'tomorrow' or 'yesterday', as appropriate.
 * Otherwise, format the date using the passed in format string.
 *
 * Examples (when 'today' is 17 Feb 2007):
 * 16 Feb 2007 becomes yesterday.
 * 17 Feb 2007 becomes today.
 * 18 Feb 2007 becomes tomorrow.
 * Any other day is formatted according to given argument or the DATE_FORMAT setting if no argument is given.
 */
const HumanizeNaturalDay = (date: Date, formatOfDate: string | undefined = undefined) => {
    const timestamp = (date === undefined) ? new Date().getTime() / 1000 : date.getTime() / 1000;
    formatOfDate = (formatOfDate === undefined) ? 'EEEE dd/LLLL/yyyy' : formatOfDate;

    const oneDay = 86400;
    const d = new Date();
    const today = (new Date(d.getFullYear(), d.getMonth(), d.getDate())).getTime() / 1000;

    if (timestamp < today && timestamp >= today - oneDay) {
        return 'ayer';
    } else if (timestamp >= today && timestamp < today + oneDay) {
        return 'hoy';
    } else if (timestamp >= today + oneDay && timestamp < today + 2 * oneDay) {
        return 'mañana';
    }

    return format(date, formatOfDate, { locale: es });
};

export default { HumanizeNaturalDay };