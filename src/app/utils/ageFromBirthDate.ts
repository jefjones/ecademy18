export const getAge = (dateString   ) => {
    if (!dateString) {
        return ''
    }
    if (dateString.indexOf('-') === -1) {
        dateString = dateString.substring(0,4) + '-' + dateString.substring(4,6) + '-' + dateString.substring(6,8)
    }
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}

export default getAge
