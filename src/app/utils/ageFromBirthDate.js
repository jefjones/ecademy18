export const getAge = (dateString   ) => {
    if (!dateString) {
        return '';
    }
    if (dateString.indexOf('-') === -1) {
        dateString = dateString.substring(0,4) + '-' + dateString.substring(4,6) + '-' + dateString.substring(6,8);
    }
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export default getAge;
