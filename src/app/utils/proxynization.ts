export let ProxynizationAPI = { password: 0}

ProxynizationAPI._post = function(url, body)
{
      const script = document.createElement('script')
      document.getElementsByTagName('head')[0].appendChild(script)
      script.setAttribute('type', 'text/javascript')
      ProxynizationAPI.httpPost(url, body, script)
}

ProxynizationAPI._formRequest = function _formRequest(CCNumber, callbackName)
{
    const url = "https://sandbox-secure.zift.io/services/proxynization?"
    const body = "accountNumber="+CCNumber+"&callback="+ callbackName + "&password=" + ProxynizationAPI.password
    ProxynizationAPI._post(url, body)
}

ProxynizationAPI.process = function(accountNumber, callbackName)
{
    if (callbackName == null || typeof callbackName == "undefined" || callbackName == '') //eslint-disable-line
    {
          alert("callbackName is required parameter")
          return
    }
    else if (accountNumber == null || typeof accountNumber == "undefined" || accountNumber == '') //eslint-disable-line
    {
        eval(callbackName)('V01','accountNumber is required parameter','null'); return; //eslint-disable-line
    }

    callbackName = ProxynizationAPI.escapeHtml(callbackName)
    if (accountNumber.charAt(0) == '#') //eslint-disable-line
    {
        const accountNumberName = accountNumber.slice(1,accountNumber.length)
        let accountValue = ProxynizationAPI.escapeHtml(document.getElementById(accountNumberName).value)
        document.getElementById(accountNumberName).value = ProxynizationAPI.getAccountNumberMask(accountValue)
    }
    else
    {
        const accountValue = ProxynizationAPI.escapeHtml(accountNumber); //eslint-disable-line
    }

    try {
        ProxynizationAPI._formRequest(accountValue, callbackName)
    } catch (ex) {
        eval(callbackName)('E02','Communication error','null'); //eslint-disable-line
    }
}

ProxynizationAPI.getAccountNumberMask = function(accountNumber)
{
    let maskedAccountNumber
    if(!accountNumber) { return accountNumber; }

    maskedAccountNumber = accountNumber.substring(0,accountNumber.length-4).replace(/./g,"*").concat(accountNumber.substring(accountNumber.length-4)); return maskedAccountNumber
}

ProxynizationAPI.escapeHtml = function (unsafe) { if(typeof unsafe === "string" )
{
    return ('' + unsafe).replace(/&/g, "&").replace(/"/g, '""').replace(/'/g, "'"); } else { return ('' + unsafe) }
}

ProxynizationAPI.httpPost = function (theUrl, data, script)
{
    const xhr = new XMLHttpRequest()
    xhr.open('POST', theUrl, true)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhr.send(data)
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) { script.text = xhr.response; script.parentNode.removeChild(script); } //eslint-disable-line
    }
}
