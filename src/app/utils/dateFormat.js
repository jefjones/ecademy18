export const formatDayShortMonthYear = (dateText, hasDashes=false) => {
    if (!dateText) {
        return '';
    }
    let newDate;

    if (hasDashes && dateText.indexOf("-") === -1) return dateText;

    if (hasDashes) {
        newDate = new Date(dateText.substring(0,10));
    } else {
        newDate = new Date(dateText.substring(0,4) + '-' + dateText.substring(4,6) + '-' + dateText.substring(6,8));
    }
    newDate.setDate(newDate.getDate() + 1);
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    var day = newDate.getDate();
    var monthIndex = newDate.getMonth(); //Notice that the monthNames array, in this case, starts in index 0 which matches with getMonth which is also zero based..
    var year = newDate.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

export default formatDayShortMonthYear;
