export const formatNumber = (varText, boolUnlimitedDecimal=false, boolNoDecimal=true, decimalCount=2) => {
    //Split off the Decimal part of the number, if any.
	//Find the remainder of the length after three is subtracted and the result is less than 3 but greater than 0
	//Take that number as the index of the first place to put a comma.
	//Put commas in after each three characters until the length is done.

	// const formatter = new Intl.NumberFormat('en-US', {
	// 		style: 'currency',
	// 		currency: 'USD',
	// 		minimumFractionDigits: 2
	// })


	if (!varText || varText === 'null' || varText === 'undefined') return 0
	varText = String(varText)
	if (varText === "" || String(varText) === "undefined") {
		return ""
	} else if (varText === "0") {
		return "0"
	} else if (varText === "0.00") {
		return "0"
	}
	varText = varText.replace(/,/g,"")
	let varDecimalPart = String()
	varText = String(varText)
	if (varText.indexOf(".") !== -1) {
		varDecimalPart = varText.substr(varText.indexOf("."))
		//if the decimal part only consists of a period, then null it out
		//	because it will be displayed as a period without any zeroes to follow.
		if (varDecimalPart === ".") {
			varDecimalPart = ""
		}
		//varDecimalPart = varDecimalPart.replace(/,/g,"");
		varText = varText.substr(0,varText.indexOf("."))
	}
	//take off leading zeroes
	while (varText.indexOf("0") === 0) {
		varText = varText.substr(1)
	}
	const varLength = String(varText).length
	if (varLength > 3) {
		let varStartComma = varLength
		let varNextCommaIndex
		while(varStartComma > 3) {
			varStartComma -= 3
		}
		if (varStartComma !== 0 && varLength >= 3) {
			varText = varText.substr(0,varStartComma) + "," + varText.substr(varStartComma)
		}
		varNextCommaIndex = varStartComma + 4
		while (varLength >= varNextCommaIndex) {
			varText = varText.substr(0,varNextCommaIndex) + "," + varText.substr(varNextCommaIndex)
			varNextCommaIndex += 4
		}
	}
	if (boolNoDecimal) {
		//do nothing
	} else if (varDecimalPart === "") {
		varText += decimalCount === 1 ? ".0" : ".00"
	} else if (String(varDecimalPart).length === 2 && decimalCount >= 2) {
		varText += varDecimalPart + "0"
	} else if (boolUnlimitedDecimal !== true) {
		varText += varDecimalPart.substr(0,Number(decimalCount) + Number(1))
	} else {
		varText += varDecimalPart
	}

	if (varText === ".00" || varText === ".0") {
		return ""
	} else {
		if (varText.substr(0,2) === "-,") {
			varText = "-" + varText.slice(2,varText.length)
		}
		return varText
	}
}

export const twoDigit = (number) => {
		if (number < 10) return '0' + number
		return number
}

export const formatPhoneNumber = (str) => {
  //Filter only numbers from the input
  let cleaned = ('' + str).replace(/\D/g, '')

  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3]
  }

  return str
}
export default formatNumber
