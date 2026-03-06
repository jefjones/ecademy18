let hasBlobConstructor = typeof(Blob) !== 'undefined' && (function () {
    try {
        return Boolean(new Blob())
    } catch (e) {
        return false
    }
}())

let hasArrayBufferViewSupport = hasBlobConstructor && typeof(Uint8Array) !== 'undefined' && (function () {
    try {
        return new Blob([new Uint8Array(100)]).size === 100
    } catch (e) {
        return false
    }
}())

let hasToBlobSupport = (typeof HTMLCanvasElement !== "undefined" ? HTMLCanvasElement.prototype.toBlob : false)

let hasBlobSupport = (hasToBlobSupport || (typeof Uint8Array !== 'undefined' && typeof ArrayBuffer !== 'undefined' && typeof atob !== 'undefined'))

let hasReaderSupport = (typeof FileReader !== 'undefined' || typeof URL !== 'undefined')

export default class ImageTools {
    static resize(file, maxDimensions, callback) {
        if (typeof maxDimensions === 'function') {
            callback = maxDimensions
            maxDimensions = {
                width: 640,
                height: 480
            }
        }

        let maxWidth  = maxDimensions.width
        let maxHeight = maxDimensions.height

        if (!ImageTools.isSupported() || !file.type.match(/image.*/)) {
            callback(file, false)
            return false
        }

        if (file.type.match(/image\/gif/)) {
            // Not attempting, could be an animated gif
            callback(file, false)
            // TODO: use https://github.com/antimatter15/whammy to convert gif to webm
            return false
        }

        let image = document.createElement('img')

        ImageTools._loadImage(image, file)

        return true
    }

    static _toBlob(canvas, type) {
        let dataURI = canvas.toDataURL(type)
        let dataURIParts = dataURI.split(',')
        let byteString
        if (dataURIParts[0].indexOf('base64') >= 0) {
            // Convert base64 to raw binary data held in a string:
            byteString = atob(dataURIParts[1])
        } else {
            // Convert base64/URLEncoded data component to raw binary data:
            byteString = decodeURIComponent(dataURIParts[1])
        }
        let arrayBuffer = new ArrayBuffer(byteString.length)
        let intArray = new Uint8Array(arrayBuffer)

        for (let i = 0; i < byteString.length; i += 1) {
            intArray[i] = byteString.charCodeAt(i)
        }

        let mimeString = dataURIParts[0].split(':')[1].split(';')[0]
        let blob = null

        if (hasBlobConstructor) {
            blob = new Blob(
                [hasArrayBufferViewSupport ? intArray : arrayBuffer],
                {type: mimeString}
            )
        } else {
            let bb = new Blob()
            bb.append(arrayBuffer)
            blob = bb.getBlob(mimeString)
        }

        return blob
    }

    static _loadImage(image, file, callback) {
        if (typeof(URL) === 'undefined') {
            let reader = new FileReader()
            reader.onload = function(evt) {
                image.src = evt.target.result
                if (callback) { callback(); }
            }
            reader.readAsDataURL(file)
        } else {
            image.src = URL.createObjectURL(file)
            if (callback) { callback(); }
        }
    }

    static isSupported() {
        return (
               (typeof(HTMLCanvasElement) !== 'undefined')
            && hasBlobSupport
            && hasReaderSupport
        )
    }
}
