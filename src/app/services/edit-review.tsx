let jsdiff = require('diff')

export const setMovedTextIntoPlace = (chapterText, moveSentence) => {
    //We are going to jump out of the htmlDoc to take the plain text and literally move the text from one location to another.
    //This will help by taking the p-tags and div-tags and just anything in between the sentence-grab so that we don't have to
    //  deal with the caveats of all the DOM details and all that implies.  Then we will return the text back to htmlDoc to
    //  continue with other edits as needed.
    //1. Get the begin hrefId
    //2. Get the end hrefId
    //3. Remove the text from beginning to end wholesale (everything in between) and hold that in a variable.
    //4. Get the position of before or after the target sentence.
    //5. Get the target sentence and find the position
    //6. Insert the new html in position.
    //7. Return the text to the htmlDoc object.
    let m = moveSentence
    let currentText = chapterText
    //1. Get the begin hrefId
    let beginHrefId = m.moveArrayHrefId[0]

    //2. Get the end hrefId
    let endHrefId = m.moveArrayHrefId[m.moveArrayHrefId.length-1]

    //3. Remove the text from beginning to end wholesale (everything in between) and hold that in a variable.
    let resultText = currentText.substring(0, currentText.indexOf(beginHrefId))
    resultText = resultText.substring(0, resultText.lastIndexOf("<")); //Go to the end and go backwards to find the beginning of that span tag.
    let beginSentenceMove = currentText.substring(resultText.length); //We will use this down below to get the fragment text of the sentence themselves.
    let remainingText = currentText.substring(currentText.indexOf(endHrefId));  //Get from the hrefId on.  That will cut off the <span text in front of the hrefId
    remainingText = remainingText.substring(remainingText.indexOf('>')+1); //Cut off the beginning until the end of the beginning span tag.
    //We will just jump to the next id="~ text and then jump to the front.
    //We will do that with a frag so that we don't lose the remainingText because we have to step back to the < start of the tag.
    //We will take the length of the fragSpan and then take that length and cut that off from the beginning of the remainingText
    let fragSpan = remainingText
    if (fragSpan.indexOf("~") > -1)
    {
        fragSpan = fragSpan.substring(0, fragSpan.indexOf("~"))
    }
    fragSpan = fragSpan.substring(0, fragSpan.toLowerCase().lastIndexOf("</span>") + 7); //Cut off to the end of the current HrefId span because we don't want to pick up any ending paragraph or div tags.
    remainingText = remainingText.substring(fragSpan.length); //Cut off up to the end of the the next HrefId tag.
    currentText = resultText + remainingText

    //We are good to this point, but there has been trouble getting the exact sentencesToMove, so we
    //  are going to pick up the sentences to move independently of the above code to get the resultText and the remainingtext.
    //Get the beginSentenceMove from above.  Use a temp variable to find the hrefId AFTER the endHrefId. Then cut that back to the last </span>.  Done.
    let findNextHrefIdAfterEnd = beginSentenceMove
    let findPrecedingText = beginSentenceMove
    findNextHrefIdAfterEnd = findNextHrefIdAfterEnd.substring(findNextHrefIdAfterEnd.indexOf(endHrefId) + 5); //Got to get past the ~! so the next search will not re-pick up this hrefId.
    findPrecedingText = findPrecedingText.substring(findPrecedingText.indexOf(endHrefId) + 5)
    if (findNextHrefIdAfterEnd.indexOf("~") > -1)
    {
        findNextHrefIdAfterEnd = findNextHrefIdAfterEnd.substring(findNextHrefIdAfterEnd.indexOf("~") + 2)
        findPrecedingText = findPrecedingText.substring(0, findPrecedingText.indexOf("~") + 2)
    } else {
        //Help todo:  What if there isn't another hrefId after the target?
    }
    //So... we have two potential problems here.  The HrefId that we just picked up could belong to a div.  For some reason
    //  not yet detected is that all div-s have the same id.  The textProcessor does seem to assign the next Id to them but
    //  that id must get overwritten with the global value.  To fix this problem, we will look for the div that preceeds that
    //  id.  If it is not a span tag, then we will take the 35 characters in front of it and match on that.
    //The second problem is that this sentence may be the last one and there is not an id to find.  If that is the case,
    //  then we will just reach back to pick up the span and then check for a </div> end tag that we might need to cut out as well...multiple times.
    let sentencesToMove = ""
    if (findPrecedingText.substring(findPrecedingText.length - 15).toLowerCase().indexOf("<div") > -1)
    {
        findPrecedingText = findPrecedingText.substring(findPrecedingText.length - 35)
        sentencesToMove = beginSentenceMove.substring(0, beginSentenceMove.indexOf(findPrecedingText) + findPrecedingText.length)
        sentencesToMove = sentencesToMove.substring(0, sentencesToMove.toLowerCase().lastIndexOf("</span>") + 7); //Cut off to the end of the current HrefId span because we don't want to pick up any ending paragraph or div tags.
    }
    else if (findNextHrefIdAfterEnd === "")
    {
        sentencesToMove = sentencesToMove.substring(0, sentencesToMove.toLowerCase().lastIndexOf("</span>") + 7); //Cut off to the end of the current HrefId span because we don't want to pick up any ending paragraph or div tags.
    }
    else
    {
        findNextHrefIdAfterEnd = parseInt(findNextHrefIdAfterEnd, 10)
        let searchHrefType = beginSentenceMove.indexOf('~^') > -1 ? '~^' : '~!'
        sentencesToMove = beginSentenceMove.substring(0, beginSentenceMove.indexOf(searchHrefType + findNextHrefIdAfterEnd));  //NOTICE THE ~^ which is the writer-side hrefId type.
        sentencesToMove = sentencesToMove.substring(0, sentencesToMove.toLowerCase().lastIndexOf("</span>") + 7); //Cut off to the end of the current HrefId span because we don't want to pick up any ending paragraph or div tags.
    }
    //We're seeing </div> at the end of the sentence.  At least check the last 35 characters of the sentencesToMove and remove any div's at the end.
    let divLoop = 0
    let divText = sentencesToMove.substring(sentencesToMove.length - 20)
    while (divText.toLowerCase().indexOf("</div>") > -1 && divLoop < 5)
    {
        sentencesToMove = sentencesToMove.substring(0, sentencesToMove.toLowerCase().lastIndexOf("</div>"))
        divText = sentencesToMove.substring(sentencesToMove.length - 20)
        divLoop++
    }

    //4. Get the position of before or after the target sentence.
    let position = m.position

    //5. Get the target sentence and find the position
    let targetHrefId = m.hrefId
    let leftText = ''
    let rightText = ''

    if (position === 'Begin') {
        leftText = currentText.substring(0, currentText.indexOf(targetHrefId))
        leftText = leftText.substring(0, leftText.lastIndexOf("<"))
        rightText = currentText.substring(leftText.length)
    } else if (position === 'End') {
        //At this point the sentencesToMove has been taken out of currentText already.
         //Get the target spot and split off the leftText and the rightText
         //1. Find the targetHrefId and take the right side.
         //2. Look for the next hrefId and take the number only
         //3. Get the left side now of the currentText all the way to the hrefId found above with the number plus the prefix of ~!
         //4. Cut the right end of the left side by getting the lastIndexOf </span> and take all the way to the end of that ending span tag.
         //5. Get the right side, now, by taking the length of that left string and subtract it from the total left of the currentText.

         //1. Find the targetHrefId and take the right side.
         //2. Look for the next hrefId and take the number only
         let nextHrefIdAfterTargetHrefId = currentText.substring(currentText.indexOf(targetHrefId) + 5); //Add 5 just to get past the ~! to look for the next one.
         let findPreceding = currentText.substring(currentText.indexOf(targetHrefId) + 5);

        if (nextHrefIdAfterTargetHrefId.indexOf("~") > -1)
        {
            nextHrefIdAfterTargetHrefId = nextHrefIdAfterTargetHrefId.substring(nextHrefIdAfterTargetHrefId.indexOf("~") + 2)
            findPreceding = findPreceding.substring(0, findPreceding.indexOf("~") + 2)
        } else {
            //Help todo:  If this is the last hrefId, then we need to consider taking the last part and working with it.
        }
        //So... we have two potential problems here.  The HrefId that we just picked up could belong to a div.  For some reason
        //  not yet detected is that all div-s have the same id.  The textProcessor does seem to assign the next Id to them but
        //  that id must get overwritten with the global value.  To fix this problem, we will look for the div that preceeds that
        //  id.  If it is not a span tag, then we will take the 35 characters in front of it and match on that.
        //The second problem is that this sentence may be the last one and there is not an id to find.  If that is the case,
        //  then we will just reach back to pick up the span and then check for a </div> end tag that we might need to cut out as well...multiple times.
        if (findPreceding.substring(findPreceding.length - 15).toLowerCase().indexOf("<div") > -1)
        {
            findPreceding = findPreceding.substring(findPreceding.length - 35)
            leftText = currentText.substring(0, currentText.indexOf(findPreceding) + findPreceding.length)
            leftText = leftText.substring(0, leftText.toLowerCase().lastIndexOf("</span>") + 7); //Cut off to the end of the current HrefId span because we don't want to pick up any ending paragraph or div tags.
        }
        else if (nextHrefIdAfterTargetHrefId === "")
        {
            leftText = currentText.substring(0, currentText.toLowerCase().lastIndexOf("</span>") + 7); //Cut off to the end of the current HrefId span because we don't want to pick up any ending paragraph or div tags.
        }
        else
        {
            nextHrefIdAfterTargetHrefId = parseInt(nextHrefIdAfterTargetHrefId, 10)
            let searchHrefType = currentText.indexOf('~^') > -1 ? '~^' : '~!'
            leftText = currentText.substring(0, currentText.indexOf(searchHrefType + nextHrefIdAfterTargetHrefId)); //NOTICE THE ~^ which is the writer-side editing pane hrefId type.
            leftText = leftText.substring(0, leftText.toLowerCase().lastIndexOf("</span>") + 7); //Cut off to the end of the current HrefId span because we don't want to pick up any ending paragraph or div tags.
        }
        //We're seeing </div> at the end of the sentence.  At least check the last 35 characters of the sentencesToMove and remove any div's at the end.
        let divLoop = 0
        let divText = leftText.substring(leftText.length - 20)
        while (divText.toLowerCase().indexOf("</div>") > -1 && divLoop < 5)
        {
            leftText = leftText.substring(0, leftText.toLowerCase().lastIndexOf("</div>"))
            divText = leftText.substring(leftText.length - 20)
            divLoop++
        }
        rightText = currentText.substring(leftText.length)
    }
    //6. Insert the new html in position.
    return leftText + sentencesToMove + rightText
}


export const setSaveSelectionFunction = (window, document) => {
    if (window.getSelection && document.createRange) {
        return function(containerEl, currentHrefId) {
            let isHrefIdChange = false
            let range = window.getSelection().getRangeAt(0)
            let preSelectionRange = range.cloneRange()
						let newElementId = ''
						let start = ''
						if (containerEl) {
		            preSelectionRange.selectNodeContents(containerEl)
		            preSelectionRange.setEnd(range.startContainer, range.startOffset)
		            newElementId = preSelectionRange.endContainer.parentElement.id
		            start = preSelectionRange.toString().length
		            if (newElementId !== currentHrefId) {
		                isHrefIdChange = true
		            }
						}

            return {
                start: start,
                end: start + range.toString().length,
                isHrefIdChange,
                newElement: preSelectionRange.endContainer.parentElement
            }
        }
    } else if (document.selection) {
        return function(containerEl) {
            let selectedTextRange = document.selection.createRange()
            let preSelectionTextRange = document.body.createTextRange()
            preSelectionTextRange.moveToElementText(containerEl)
            preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange)
            let start = preSelectionTextRange && preSelectionTextRange.text.length

            return {
                start: start,
                end: start + selectedTextRange && selectedTextRange.text.length
            }
        }
    }
}


export const setRestoreSelectionFunction = (window, document) => {
    if (window.getSelection && document.createRange) {
        return function(containerEl, savedSel) {
            let charIndex = 0, range = document.createRange()
            range.setStart(containerEl, 0)
            range.collapse(true)
            let nodeStack = [containerEl], node, foundStart = false, stop = false

            while (!stop && (node = nodeStack.pop())) { //eslint-disable-line
                if (node.nodeType == 3) {  //eslint-disable-line
                    let nextCharIndex = charIndex + node.length
                    if (!foundStart && savedSel && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                        range.setStart(node, savedSel && savedSel.start - charIndex)
                        foundStart = true
                    }
                    if (foundStart && savedSel && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                        range.setEnd(node, savedSel && savedSel.end - charIndex)
                        stop = true
                    }
                    charIndex = nextCharIndex
                } else {
                    let i = node.childNodes.length
                    while (i--) {
                        nodeStack.push(node.childNodes[i])
                    }
                }
            }

            let sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
        }
    } else if (document.selection) {
         return function(containerEl, savedSel) {
            let textRange = document.body.createTextRange()
            textRange.moveToElementText(containerEl)
            textRange.collapse(true)
            textRange.moveEnd("character", savedSel && savedSel.end)
            textRange.moveStart("character", savedSel && savedSel.start)
            textRange.select()
        }
    }
}

export const setBreakNewTextIntoPlace = (htmlDoc, breakNew, showEditIcons, editorColors) => {
    let m = breakNew
    let originalNode = htmlDoc.getElementById(m.hrefId)
    //In order to split up a paragraph, we will make a copy of the entire parentNode of the target hrefId from the htmlDoc.
    //  We will leave the htmlDoc mode to work with the  text-only to make the changes and then return that to the htmlDoc.
    //0. Take a text copy of the entire htmlDoc innerHTML.
    const allText = htmlDoc.body.innerHTML
    //1. Take a string copy of the parentNode of the hrefId (if the parent is not the editorDiv).
    const paragraphText = htmlDoc.getElementById(m.hrefId).parentNode.outerHTML; //Notice the outerHTML
    //2. Get the left side text of the entire document before the originalParentNode.
    const allLeftText = allText.substring(0, allText.indexOf(paragraphText))
    //3. Get the right side text of the entire document by using the length of the left side text.
    //4. Cut off the originalParentNode from the right side by using the length of the originalParentNode.
    const allRightText = allText.substring(allText.indexOf(paragraphText) + paragraphText.length)
    //5. Get the firstChild node of the paragraph.
    let spans = originalNode.parentNode.childNodes
    let firstChild
    let length = spans && spans.length ? spans.length : 0
    for(let i = 0; i < length; i++) {
        if (!firstChild && spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~ to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~ further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
            firstChild = spans[i]
            break
        }
    }
    //6. Get the beginning text of the paragraph before the beginning of the firstChild.
    //      Note:  We do want to be smarter by taking the document's common paragraph start and use it here, but until then, let' use a paragraph start tag.
    const paragraphBegin = '<p>'; //paragraphText.substring(0, paragraphText.indexOf(firstChild.outerHTML));
    //7. Get the lastChild node of the paragraph.
    //Going backwards from the end to the beginning in order to find the first span that has an hrefId.
    let lastChild;  //eslint-disable-line
    spans = originalNode.parentNode.childNodes
    length = spans && spans.length ? spans.length : 0
    for(let i = length; i >= 0 ; i--) {
        if (spans[i] && spans[i].id && spans[i].id.indexOf('~') > -1) {  //Notice that we use > -1 since the last child could be an icon as well as a span hrefId We want to skip over it.
            lastChild = spans[i]
            break
        }
    }
    //8. Get the ending text of the paragraph after the lastChild.
    //      Note:  We do want to be smarter by taking the document's common paragraph end and use it here, but until then, let' use a paragraph end tag.
    let paragraphEnd = '</p>' //paragraphText.substring(paragraphText.indexOf(lastChild.outerHTML) + lastChild.outerHTML.length);
    let firstParagraph = ""
    let secondParagraph = ""

    if (m.position === 'Begin') {
        //10. If the position is 'Begin':
        //   a. Finish the first paragraph split
        //      i. Take a copy of the full paragraphText and take the left side of the text right up to the beginning of the target hrefId span tag
        firstParagraph = paragraphText.substring(0, paragraphText.indexOf(originalNode.outerHTML))
        //      ii. Add on the paragraph ending text.
        if (showEditIcons) firstParagraph += createBreakNewIcon(m.editDetailId, m.position, showEditIcons, editorColors && editorColors[m.personId])
        firstParagraph += paragraphEnd
        //   b. Finish the second paragraph split
        //      i. Take a copy of the originalParentNode and take the right side of the text from the beginning of the target hrefId span tag to the end of the paragraph.
        secondParagraph = paragraphText.substring(paragraphText.indexOf(originalNode.outerHTML))
        //      ii. Add on the paragraph beginning text at the front.
        secondParagraph = paragraphBegin + secondParagraph
        //    c. Return the text back to the HtmlDoc.
        htmlDoc = new DOMParser().parseFromString(allLeftText + firstParagraph + secondParagraph + allRightText, "text/html")

    } else if (m.position === 'End') {
        //10. If the position is 'End':
        //   a. Finish the first paragraph split
        //      i. Take a copy of the full paragraphText and take the left side of the text right up to the END of the target hrefId span tag
        firstParagraph = paragraphText.substring(0, paragraphText.indexOf(originalNode.outerHTML) + originalNode.outerHTML.length)
        //      ii. Add on the paragraph ending text.
        if (showEditIcons) firstParagraph += createBreakNewIcon(m.editDetailId, m.position, showEditIcons, editorColors && editorColors[m.personId])
        firstParagraph += paragraphEnd
        //   b. Finish the second paragraph split
        //      i. Take a copy of the originalParentNode and take the right side of the text from the END of the target hrefId span tag to the end of the paragraph.
        secondParagraph = paragraphText.substring(paragraphText.indexOf(originalNode.outerHTML) + originalNode.outerHTML.length)
        //      ii. Add on the paragraph beginning text at the front.
        secondParagraph = paragraphBegin + secondParagraph
        //    c. Return the text back to the HtmlDoc.
        htmlDoc = new DOMParser().parseFromString(allLeftText + firstParagraph + secondParagraph + allRightText, "text/html")
    }
    return htmlDoc
}

export const setImageNewTextIntoPlace = (htmlDoc, imageNew, showEditIcons) => {
    let m = imageNew
    let originalNode = htmlDoc.getElementById(m.hrefId)

    if (m.position === 'Begin') {
        let imageBegin = document.createRange().createContextualFragment(m.htmlImage64)
        originalNode.parentNode.insertBefore(imageBegin.childNodes[0], originalNode)

    } else if (m.position === 'End') {
        let imageEnd = document.createRange().createContextualFragment(m.htmlImage64)
        let nextSibling = originalNode.nextSibling
        if (nextSibling) {
            originalNode.parentNode.insertBefore(imageEnd.childNodes[0], nextSibling)
        } else {
            originalNode.parentNode.appendChild(imageEnd.childNodes[0])
        }
    }
    return htmlDoc
}

function cleanHTMLWhiteSpace(htmlText) {
    let regex = "/<(.|\n)*?>/"
    if (htmlText && htmlText.indexOf("<svg") > -1) return htmlText;  //Let our icons get through without getting cut off.

    return htmlText.replace(regex, "")
        .replace(/<br>/g, "")
        .replace(/<br\/>/g, "")
        .replace(/<br \/>/g, "")
        .replace(/<BR>/g, "")
        .replace(/<BR\/>/g, "")
        .replace(/<BR \/>/g, "")
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00A0/g, '') //non breaking space
        .trim()
}

function writerHrefId(elementId) {
    if (elementId && elementId.length > 0 && elementId.indexOf('~!') > -1) {
        let newElementId = elementId.replace(/\~\!/g, '~^');  //eslint-disable-line
        return newElementId
    }
    return elementId
}

function standardHrefId(elementId) {
    if (elementId && elementId.length > 0 && elementId.indexOf('~^') > -1) {
        let newElementId = elementId.replace(/\~\^/g, '~!');  //eslint-disable-line
        return newElementId
    }
    return elementId
}

export const setBreakDeleteTextIntoPlace = (htmlDoc, breakDelete, showEditIcons, editorColors) => {
    //We are going to jump out of the htmlDoc to take the plain text and literally delete the text from the last sentence of one paragraph to the first sentence of the next paragraph.
    //This will help by taking the p-tags, section-tags and div-tags and just anything in between the sentence-grab so that we don't have to
    //  deal with the caveats of all the DOM details and all that implies.  Then we will return the text back to htmlDoc to
    //  continue with other edits as needed.
    //If the breakDelete position is Begin
    //1. Get the firstChild element in the target paragraph
    //2. Get all of the spans with Id like '~!' and find the firstChild then go backwards until a non-empty, non-white-space-only span is found which should then be considered the last sentence of the previous paragraph.
    //3. Remove the text from the end of the last sentence of the preceding paragraph To the beginning of the first sentence of the target paragraph.
    //4. Insert the Icon with the 'Begin' parameter.
    //5. Return the text to the htmlDoc object.
    //If the breakDelete position is End
    //6. Get the lastChild element in the target paragraph
    //7. Get all of the spans with Id like '~!' and get the next span hrefId (following the lastChild of the target paragraph) that represents the first sentence of the next paragraph.
    //8. Remove the text from the end of the last sentence of the target paragraph To the beginning of the first sentence of the next paragraph.
    //9. Insert the Icon with the 'End' parameter.
    //10. Return the text to the htmlDoc object.
    let m = breakDelete
    const currentText = htmlDoc.body.innerHTML
    let updatedText = currentText
    let originalNode = htmlDoc.getElementById(m.hrefId)
    //If the breakDelete position is Begin
    if (m.position === 'Begin') {
        //1. Get the firstChild element in the target paragraph that has an hrefId
        let firstChild
        let spans = originalNode.parentNode.getElementsByTagName('SPAN')
        let length = spans && spans.length ? spans.length : 0
        for(let i = 0; i < length; i++) {
                //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.
                //An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
            if (!firstChild && spans[i] && spans[i].id && spans[i].id.indexOf('~') > -1 && cleanHTMLWhiteSpace(spans[i].innerHTML)) {
                firstChild = spans[i]
                break
            }
        }

        //2. Get all of the spans with Id like '~!' and find the firstChild then go backwards until a non-empty, non-white-space-only span is found which should then be considered the last sentence of the previous paragraph.
        spans = htmlDoc.getElementsByTagName('SPAN')
        let firstChildIndex
        let preceedingSpan
        length = spans && spans.length ? spans.length : 0
        for(let i = 0; i < length; i++) {
            if (spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                if (spans[i].id === firstChild.id) {
                    firstChildIndex = i
                    break
                }
            }
        }
        for(let i = --firstChildIndex; i >= 0; i--) {
            if (spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0) {
                if (cleanHTMLWhiteSpace(spans[i].innerHTML)) {
                    preceedingSpan = spans[i]
                    break
                }
            }
        }

        //3. Remove the text from the end of the last sentence of the preceding paragraph To the beginning of the first sentence of the target paragraph.
        //4. Delete the html text.
        if (preceedingSpan) {
            let resultText = currentText.substring(0, currentText.indexOf(preceedingSpan.id))
            resultText = resultText.substring(0, resultText.lastIndexOf("<")); //Go to the end and go backwards to find the beginning of that span tag.
            resultText += preceedingSpan.outerHTML + " "; //Give an extra space behind just to make sure there is at least one space between the joined sentences.
            if (showEditIcons) {
                resultText += createBreakDeleteIcon(m.editDetailId, m.position, editorColors && editorColors[m.personId])
            }
            let remainingText = firstChild && currentText.substring(currentText.indexOf(firstChild.outerHTML)); //Find the outerHTML of the firstChild;
            updatedText = resultText + remainingText
        }

    //If the breakDelete position is End
    } else if (m.position === 'End') {
        //6. Get the lastChild element in the target paragraph
        let lastChild;  //Going backwards from the end to the beginning in order to find the first span that has an hrefId.
        let spans = originalNode.parentNode.getElementsByTagName('SPAN')
        let length = spans && spans.length ? spans.length : 0
        for(let i = length; i >= 0 ; i--) {
            if (spans[i] && spans[i].id && spans[i].id.indexOf('~') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                lastChild = spans[i]
                break
            }
        }

        //7. Get all of the spans with Id like '~!' and get the next span hrefId (following the lastChild of the target paragraph) that represents the first sentence of the next paragraph.
        // //2. Get all of the spans with Id like '~!' and find the firstChild then go backwards until a non-empty, non-white-space-only span is found which should then be considered the last sentence of the previous paragraph.
        // spans = document.getElementById('editorDiv').getElementsByTagName('SPAN');
        // let firstChildIndex;
        // let preceedingSpan;
        // for(let i = 0; i < spans.length; i++) {
        //     if (spans[i] && spans[i].id && spans[i].id.indexOf('~!') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
        //         if (spans[i].id === firstChild.id) {
        //             firstChildIndex = i;
        //             break;
        //         }
        //     }
        // }
        // for(let i = firstChildIndex; i > 0; i--) {
        //     if (spans[i] && spans[i].id && spans[i].id.indexOf('~!') === 0 && cleanHTMLWhiteSpace(spans[i].innerHTML)) {
        //         preceedingSpan = spans[i];
        //     }
        // }
        //
        spans = htmlDoc.getElementsByTagName('SPAN')
        let nextSpan
        let foundCurrent = false
        length = spans && spans.length ? spans.length : 0
        for(let i2 = 0; i2 < length || 0; i2++) {
            if (spans[i2] && spans[i2].id && spans[i2].id.indexOf('~') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                if (foundCurrent && !nextSpanIsEmpty(spans[i2])) {
                    nextSpan = spans[i2]
                    break
                }
                if (spans[i2].id === standardHrefId(lastChild.id) || spans[i2].id === writerHrefId(lastChild.id)) {
                    foundCurrent = true
                }
            }
        }

        //8. Remove the text from the end of the last sentence of the target paragraph To the beginning of the first sentence of the next paragraph.
        //9. Delete the html text.
        if (lastChild && nextSpan) {
            let resultText = currentText.substring(0, currentText.indexOf(lastChild.id))
            resultText = resultText.substring(0, resultText.lastIndexOf("<")); //Go to the end and go backwards to find the beginning of that span tag.
            resultText += lastChild.outerHTML + " "; //Give an extra space behind just to make sure there is at least one space between the joined sentences.
            if (showEditIcons) {
                resultText += createBreakDeleteIcon(m.editDetailId, m.position, editorColors && editorColors[m.personId])
            }
            let remainingText = ""
            if (currentText.indexOf(standardHrefId(nextSpan.outerHTML)) > -1) {
                remainingText = nextSpan && currentText.substring(currentText.indexOf(standardHrefId(nextSpan.outerHTML))); //Find the outerHTML of the firstChild;
            } else {
                remainingText = nextSpan && currentText.substring(currentText.indexOf(writerHrefId(nextSpan.outerHTML))); //Find the outerHTML of the firstChild;
            }
            updatedText = resultText + remainingText
        }
    }
    //5. Return the text to the htmlDoc object.
    return new DOMParser().parseFromString(updatedText, "text/html")
}

function nextSpanIsEmpty(span) {
    let spanHTML = span.innerHTML
    let regex = "/<(.|\n)*?>/"
    spanHTML = spanHTML && spanHTML.replace(regex, "")
            .replace(/<br>/g, "")
            .replace(/<br\/>/g, "")
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim()

    while (spanHTML && spanHTML.indexOf('&nbsp;') > -1) {
        spanHTML = spanHTML.replace('&nbsp;', '')
    }

    return spanHTML ? false : true
}

export const eraseSentenceAuthorWorkspace = (chapterText, writer_HrefId) => {
    let htmlDoc = new DOMParser().parseFromString(chapterText, "text/html")
    htmlDoc.getElementById(writer_HrefId).innerHTML = ''
    return htmlDoc.body.innerHTML
}

export const breakNewAuthorWorkspace = (htmlDoc, hrefId, position, editorColors) => {
    let showEditIcons = false
    return setBreakNewTextIntoPlace(htmlDoc, {hrefId, position}, showEditIcons, editorColors)
}

export const breakDeleteAuthorWorkspace = (htmlDoc, hrefId, position, editorColors) => {
    let showEditIcons = false
    return setBreakDeleteTextIntoPlace(htmlDoc, {hrefId, position}, showEditIcons, editorColors)
}

export const sentenceMoveAuthorWorkspace = (chapterText, moveSentence) => {
    return setMovedTextIntoPlace(chapterText, moveSentence)
}

export const imageNewAuthorWorkspace = (htmlDoc, hrefId, position, htmlImage64) => {
    let showEditIcons = false
    return setImageNewTextIntoPlace(htmlDoc, {hrefId, position, htmlImage64}, showEditIcons)
}

export const showChapterTextEdits = (htmlDoc, fullText, editsFiltered, authorPersonId, showColorCode, showEditIcons, replaceEditsBreaksAndSentences, showDiffWords, editorColors) => {
    //Note: The only uncontrolled option in the function call to showChapterTextEdits is that the author's comments are always color-coded but not included in the edit count
    let colorBlue = "#147EA7"; //This is the corporate blue color as set also in variables.css.  The author's changes in their own tab is marked in color
    let colorRed = "red"

    if (!editsFiltered || editsFiltered.length === 0) {
        return htmlDoc
    } else {
        editsFiltered.forEach(m => {
            let theHrefId = m.hrefId.replace(/\~\^/g, '~!'); //eslint-disable-line
            let sentence = htmlDoc.getElementById(theHrefId)
            if (sentence) {
                if (m.editTypeName === 'edit') {
                    if (!m.isComment) {
                        if (replaceEditsBreaksAndSentences) {
                            htmlDoc.getElementById(theHrefId).innerHTML = m.editText === "[<i>erased</i>]"
                                ? showEditIcons
                                    ? createErasedIcon(m.editDetailId, editorColors && editorColors[m.personId])
                                    : showDiffWords && htmlDoc.getElementById(theHrefId)
                                        ? diffWord(htmlDoc.getElementById(theHrefId).innerHTML, m.editText)
                                        : ''
                                : showDiffWords && htmlDoc.getElementById(theHrefId)
                                    ? diffWord(htmlDoc.getElementById(theHrefId).innerHTML, m.editText)
                                    : m.editText
                        }
                        if (showColorCode) {
                            htmlDoc.getElementById(theHrefId).style.color = authorPersonId === m.personId ? colorBlue : colorRed
                        }
                    }
                    if (showEditIcons && m.isComment) {
                        let originalNode = htmlDoc.getElementById(theHrefId)
                        if (originalNode) {
                            let commentIcon = htmlDoc.createRange().createContextualFragment(createCommentIcon(m.editDetailId, editorColors && editorColors[m.personId]))
                            let nextSibling = originalNode.nextSibling
                            if (nextSibling) {
                                originalNode.parentNode.insertBefore(commentIcon, nextSibling); //.childNodes[0]
                            } else {
                                originalNode.parentNode.appendChild(commentIcon); //.childNodes[0]
                            }
                        }
                    }
                    if (showEditIcons && m.editTypeName === 'edit' && m.editText !== "[<i>erased</i>]" && !m.isComment) {
                        let originalNode = htmlDoc.getElementById(theHrefId)
                        if (originalNode) {
                            let pencilIcon = htmlDoc.createRange().createContextualFragment(createPencilIcon(m.editDetailId, editorColors && editorColors[m.personId]))
                            let nextSibling = originalNode.nextSibling
                            if (nextSibling) {
                                originalNode.parentNode.insertBefore(pencilIcon, nextSibling); //.childNodes[0]
                            } else {
                                originalNode.parentNode.appendChild(pencilIcon); //.childNodes[0]
                            }
                        }
                    }

                } else if (m.editTypeName === 'sentenceMove' && m.moveArrayHrefId && m.moveArrayHrefId.length > 0) {
                    if (replaceEditsBreaksAndSentences) {
                        let currentText = htmlDoc.body.innerHTML
                        let updatedText = setMovedTextIntoPlace(currentText, m); //This function is found here in the services/edit-review.js file.
                        if (updatedText) {
                            htmlDoc = new DOMParser().parseFromString(updatedText, "text/html")
                        }
                    }
                    //Apply the icons which will be disabled to start with.
                    //A click will select the editMode to sentenceMove, cause the icons be black instead of grayed out, and the list will be set
                    //  and ready to receive author-accept or edit-up-vote or down-vote or troll-vote.  The owner of the suggestion can delete it.
                    if (showEditIcons && !htmlDoc.getElementById("target" + m.position + "^^!" + m.editDetailId)) {
                        let originalNode = htmlDoc.getElementById(theHrefId)
                        if (originalNode) {
                            if (m.position === 'Begin') {
                                let targetIcon = htmlDoc.createRange().createContextualFragment(createTargetIcon(m.editDetailId, 'Begin', editorColors && editorColors[m.personId]))
                                originalNode.parentNode.insertBefore(targetIcon, originalNode); //.childNodes[0]
                            } else if (m.position === 'End') {
                                let targetIcon = htmlDoc.createRange().createContextualFragment(createTargetIcon(m.editDetailId, 'End', editorColors && editorColors[m.personId]))
                                let nextSibling = originalNode.nextSibling
                                if (nextSibling) {
                                    originalNode.parentNode.insertBefore(targetIcon, nextSibling); //.childNodes[0]
                                } else {
                                    originalNode.parentNode.appendChild(targetIcon); //.childNodes[0]
                                }
                            }
                        }
                    }
                    if (showEditIcons && m.moveArrayHrefId && m.moveArrayHrefId.length > 0) {
                        if (!htmlDoc.getElementById("moveBegin^^!" + m.editDetailId)) {
                            //The beginning move icon
                            let moveBeginIcon = htmlDoc.createRange().createContextualFragment(createMoveIcon(m.editDetailId, 'Begin', editorColors && editorColors[m.personId]))
                            let originalNode = htmlDoc.getElementById(m.moveArrayHrefId[0])
                            if (originalNode) {
                                originalNode.parentNode.insertBefore(moveBeginIcon, originalNode); //.childNodes[0]
                                //The ending move icon
                                let moveEndIcon = htmlDoc.createRange().createContextualFragment(createMoveIcon(m.editDetailId, 'End', editorColors && editorColors[m.personId]))
                                 originalNode = htmlDoc.getElementById(m.moveArrayHrefId[m.moveArrayHrefId.length-1])
                                let nextSibling = originalNode && originalNode.nextSibling
                                if (nextSibling) {
                                    originalNode.parentNode.insertBefore(moveEndIcon, nextSibling); //.childNodes[0]
                                } else {
                                    originalNode.parentNode.appendChild(moveEndIcon); //.childNodes[0]
                                }
                            }
                        }
                    }
                } else if (m.editTypeName === 'breakNew' && theHrefId) {
                    //Apply the icons which will be disabled to start with.
                    //A click will select the editMode to breakNew, cause the icons be black instead of grayed out, and the list will be set
                    //  and ready to receive author-accept or edit-up-vote or down-vote or troll-vote.  The owner of the edit-suggestion can delete it.
                    if (!htmlDoc.getElementById('breakNew' + m.position +  + '^^!' + m.editDetailId)) {
                        if (replaceEditsBreaksAndSentences) {
                            htmlDoc = setBreakNewTextIntoPlace(htmlDoc, m, showEditIcons, editorColors); //This function is found here in the services/edit-review.js file.
                        } else {
                            let breakNewIcon = htmlDoc.createRange().createContextualFragment(createBreakNewIcon(m.editDetailId, m.position, showEditIcons, editorColors && editorColors[m.personId]))
                            let originalNode = htmlDoc.getElementById(theHrefId)
                            if (m.position === 'Begin') {
                                originalNode.parentNode.insertBefore(breakNewIcon, originalNode); //.childNodes[0]
                            } else if (m.position === 'End') {
                                let nextSibling = originalNode.nextSibling
                                if (nextSibling) {
                                    originalNode.parentNode.insertBefore(breakNewIcon, nextSibling); //.childNodes[0]
                                } else {
                                    originalNode.parentNode.appendChild(breakNewIcon); //.childNodes[0]
                                }
                            }
                        }
                    }
                } else if (m.editTypeName === 'breakDelete' && theHrefId) {
                    //Apply the icons which will be disabled to start with.
                    //A click will select the editMode to breakDelete, cause the icons be black instead of grayed out, and the list will be set
                    //  and ready to receive author-accept or edit-up-vote or down-vote or troll-vote.  The owner of the suggestion can delete it.
                    //if (document.getElementById('tabView') && document.getElementById('tabView').innerHTML.indexOf('breakDelete' + m.position + '^^!' + m.editDetailId) === -1) {
                    if (!htmlDoc.getElementById('breakDelete' + m.position + '^^!' + m.editDetailId)) {
                        if (replaceEditsBreaksAndSentences) {
                            htmlDoc = setBreakDeleteTextIntoPlace(htmlDoc, m, showEditIcons, editorColors); //This function is found here in the services/edit-review.js file.
                        } else {
                            let originalNode = htmlDoc.getElementById(theHrefId)
                            let breakDeleteIcon = htmlDoc.getElementById('breakDelete' + m.position + theHrefId)
                            if (originalNode && !breakDeleteIcon) {
                                let breakDeleteIcon = htmlDoc.createRange().createContextualFragment(createBreakDeleteIcon(m.editDetailId, m.position, editorColors && editorColors[m.personId]))
                                if (m.position === 'Begin') {
                                    let firstChild
                                    let spans = originalNode.parentNode.getElementsByTagName('SPAN')
                                    let length = spans && spans.length ? spans.length : 0
                                    for(let i = 0; i < length; i++) {
                                        if (!firstChild && spans[i] && spans[i].id && spans[i].id.indexOf('~!') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                                            firstChild = spans[i]
                                            break
                                        }
                                    }

                                    //Wait until you have the firstChild element identified before pulling out the html between the previous paragraph last sentence and the first sentence of the target PARAGRAPH
                                    firstChild.parentNode.insertBefore(breakDeleteIcon, firstChild); //.childNodes[0]
                                } else if (m.position === 'End') {
                                    let lastChild;  //Going backwards from the end to the beginning in order to find the first span that has an hrefId.
                                    let spans = originalNode.parentNode.getElementsByTagName('SPAN')
                                    let length = spans && spans.length ? spans.length : 0
                                    for(let i = length; i >= 0 ; i--) {
                                        if (spans[i] && spans[i].id && spans[i].id.indexOf('~!') === 0) {  //Notice that we use = 0 instead of greater than -1 because 0 is the location of ~! to start rather than being an icon, which could be the case here after the first run is made to clear the paragraph break.  An icon is placed in there.  So to go through again will find the icon that has ~! further in the name:  breakDeleteBegin~!<number>  We don't want that one.  We want to skip over it.
                                            lastChild = spans[i]
                                            break
                                        }
                                    }
                                    let nextSibling = lastChild.nextSibling
                                    //Wait until you have the lastChild element identified before pulling out the html between the target paragraph last sentence and the next paragraph's first sentence
                                    if (nextSibling) {
                                        lastChild.parentNode.insertBefore(breakDeleteIcon, nextSibling); //.childNodes[0]
                                    } else {
                                        lastChild.parentNode.appendChild(breakDeleteIcon); //.childNodes[0]
                                    }
                                }
                            }
                        }
                    }
                } else if (m.editTypeName === 'imageNew' && theHrefId) {

                    //Apply the icons which will be disabled to start with.
                    //A click will select the editMode to breakNew, cause the icons be black instead of grayed out, and the list will be set
                    //  and ready to receive author-accept or edit-up-vote or down-vote or troll-vote.  The owner of the suggestion can delete it.
                    if (!htmlDoc.getElementById('imageNew' + m.position + "^^!" + m.editDetailId)) {
                        let originalNode = htmlDoc.getElementById(theHrefId)
                        if (originalNode) {
                            let imageElement
                            if (replaceEditsBreaksAndSentences) {
                                imageElement = htmlDoc.createRange().createContextualFragment(m.htmlImage64)
                                if (m.position === 'Begin') {
                                    originalNode.parentNode.insertBefore(imageElement, originalNode); //.childNodes[0]
                                } else if (m.position === 'End') {
                                    let nextSibling = originalNode.nextSibling
                                    if (nextSibling) {
                                        originalNode.parentNode.insertBefore(imageElement, nextSibling); //.childNodes[0]
                                    } else {
                                        originalNode.parentNode.appendChild(imageElement); //.childNodes[0]
                                    }
                                }
                            }
                            if (showEditIcons) {
                                imageElement = htmlDoc.createRange().createContextualFragment(createImageIcon(m.editDetailId, m.position, editorColors && editorColors[m.personId]))
                                if (m.position === 'Begin') {
                                    originalNode.parentNode.insertBefore(imageElement, originalNode); //.childNodes[0]
                                } else if (m.position === 'End') {
                                    let nextSibling = originalNode.nextSibling
                                    if (nextSibling) {
                                        originalNode.parentNode.insertBefore(imageElement, nextSibling); //.childNodes[0]
                                    } else {
                                        originalNode.parentNode.appendChild(imageElement); //.childNodes[0]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
    return htmlDoc
}

function createTargetIcon(editDetailId, beginOrEnd, editorColor) {
    return `<svg id='target` + beginOrEnd + `^^!` + editDetailId + `' style='border-radius: 4px; cursor:pointer; position: relative; top: 2px; width: 16px; height: 16px;' viewBox='0 0 20 20'><svg class="icon-vucPy imageLeftSide-2cXNm lessLeft-3mjJt" viewBox="0 0 20 20"><g><path fill='` + editorColor + `' d="M9.5 1c-0.276 0-0.5 0.224-0.5 0.5v4c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-4c0-0.276-0.224-0.5-0.5-0.5z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M9.5 15c-0.276 0-0.5 0.224-0.5 0.5v4c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-4c0-0.276-0.224-0.5-0.5-0.5z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M5 10.5c0-0.276-0.224-0.5-0.5-0.5h-4c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h4c0.276 0 0.5-0.224 0.5-0.5z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M18.5 10h-4c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h4c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M16.21 9c-0.216 0-0.414-0.14-0.479-0.357-0.628-2.111-2.263-3.746-4.374-4.374-0.265-0.079-0.415-0.357-0.337-0.622s0.357-0.415 0.622-0.337c1.187 0.353 2.28 1.006 3.161 1.886s1.533 1.974 1.886 3.161c0.079 0.265-0.072 0.543-0.337 0.622-0.048 0.014-0.096 0.021-0.143 0.021z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M11.5 17.71c-0.216 0-0.414-0.14-0.479-0.357-0.079-0.265 0.072-0.543 0.337-0.622 2.11-0.628 3.745-2.263 4.374-4.374 0.079-0.265 0.357-0.415 0.622-0.337s0.415 0.357 0.337 0.622c-0.353 1.187-1.006 2.28-1.886 3.161s-1.973 1.533-3.161 1.886c-0.048 0.014-0.096 0.021-0.143 0.021z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M7.5 17.71c-0.047 0-0.095-0.007-0.143-0.021-1.187-0.353-2.28-1.005-3.161-1.886s-1.533-1.973-1.886-3.161c-0.079-0.265 0.072-0.543 0.337-0.622s0.543 0.072 0.622 0.337c0.628 2.11 2.263 3.745 4.374 4.373 0.265 0.079 0.415 0.357 0.337 0.622-0.065 0.217-0.264 0.358-0.479 0.358z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M2.79 9c-0.047 0-0.095-0.007-0.143-0.021-0.265-0.079-0.415-0.357-0.337-0.622 0.353-1.187 1.006-2.28 1.886-3.161s1.973-1.533 3.161-1.886c0.265-0.079 0.543 0.072 0.622 0.337s-0.072 0.543-0.337 0.622c-2.11 0.628-3.745 2.263-4.373 4.374-0.065 0.217-0.264 0.358-0.479 0.358z" fill='` + editorColor + `'></path></g></svg>`
}

function createImageIcon(editDetailId, beginOrEnd, editorColor) {
    return "<svg id='imageNew" + beginOrEnd + `^^!` + editDetailId + "' style='cursor:pointer; position: relative; top: 2px; width: 16px; height: 16px;' viewBox='0 0 20 20'><g><path fill='" + editorColor + "' d='M13.5 9c-1.378 0-2.5-1.122-2.5-2.5s1.122-2.5 2.5-2.5 2.5 1.122 2.5 2.5-1.122 2.5-2.5 2.5zM13.5 5c-0.827 0-1.5 0.673-1.5 1.5s0.673 1.5 1.5 1.5 1.5-0.673 1.5-1.5-0.673-1.5-1.5-1.5z'></path><path fill='" + editorColor + "' d='M18.5 0h-17c-0.827 0-1.5 0.673-1.5 1.5v17c0 0.827 0.673 1.5 1.5 1.5h17c0.827 0 1.5-0.673 1.5-1.5v-17c0-0.827-0.673-1.5-1.5-1.5zM1 18.5v-4.807l4.197-4.617c0.085-0.093 0.196-0.145 0.314-0.147s0.231 0.048 0.318 0.139l9.5 9.932h-13.83c-0.276 0-0.5-0.224-0.5-0.5zM19 18.5c0 0.276-0.224 0.5-0.5 0.5h-1.786l-10.161-10.623c-0.281-0.294-0.655-0.452-1.053-0.447s-0.768 0.173-1.042 0.474l-3.457 3.803v-10.707c0-0.276 0.224-0.5 0.5-0.5h17c0.276 0 0.5 0.224 0.5 0.5v17z'></path></g></svg>"
}

function createErasedIcon(editDetailId, editorColor) {
    return ` <svg id='erased^^!` + editDetailId + `' style="cursor: pointer; position: relative; top: 2px; width: 12px; height: 12px;" viewBox="0 0 20 20"><g><path fill='` + editorColor + `' d="M8.5 12c-0.132 0-0.26-0.053-0.353-0.147s-0.147-0.222-0.147-0.353 0.053-0.261 0.147-0.353c0.093-0.093 0.222-0.147 0.353-0.147s0.261 0.053 0.353 0.147c0.093 0.093 0.147 0.222 0.147 0.353s-0.053 0.261-0.147 0.353c-0.093 0.093-0.222 0.147-0.353 0.147z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M19.313 14.915c-0.748-1.183-1.946-1.919-3.126-1.919-0.488 0-0.955 0.132-1.351 0.382-0.632 0.399-1.043 1.058-1.174 1.869l-1.308-2.016c-0.003-0.004-0.006-0.009-0.008-0.013l-8.427-12.99c-0.092-0.142-0.25-0.228-0.419-0.228-0 0-0.001 0-0.001 0-0.17 0.001-0.328 0.087-0.42 0.23l-0.742 1.158c-0.393 0.614-0.452 1.572-0.136 2.23l4.416 9.197c0.319 0.665 1.146 1.185 1.884 1.185l3.159-0.003 2.578 3.975c0.022 0.037 0.044 0.074 0.067 0.11 0.748 1.183 1.946 1.919 3.126 1.919 0 0 0 0 0 0 0.488 0 0.955-0.132 1.35-0.382 0.69-0.436 1.117-1.181 1.203-2.097 0.081-0.867-0.157-1.793-0.671-2.607zM8.5 13c-0.359 0-0.827-0.295-0.982-0.618l-4.416-9.197c-0.163-0.34-0.127-0.94 0.077-1.257l0.323-0.505 7.508 11.574-2.511 0.003zM18.989 17.428c-0.056 0.6-0.32 1.078-0.742 1.345-0.238 0.151-0.513 0.227-0.816 0.227-0 0-0 0-0 0-0.773-0-1.605-0.498-2.166-1.283l-0.175-0.27c-0.355-0.602-0.518-1.264-0.46-1.879 0.056-0.6 0.32-1.078 0.742-1.345 0.238-0.151 0.513-0.227 0.816-0.227 0.828 0 1.723 0.57 2.281 1.453 0.397 0.628 0.582 1.33 0.521 1.979z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M13.5 11.917c-0.073 0-0.146-0.016-0.216-0.049-0.249-0.12-0.354-0.418-0.234-0.667l3.848-8.016c0.163-0.34 0.127-0.94-0.077-1.257l-0.323-0.505-4.578 7.057c-0.15 0.232-0.46 0.298-0.692 0.147s-0.298-0.46-0.147-0.692l5-7.708c0.092-0.142 0.25-0.228 0.419-0.228 0 0 0.001 0 0.001 0 0.17 0.001 0.328 0.087 0.42 0.23l0.742 1.158c0.393 0.614 0.452 1.572 0.136 2.23l-3.848 8.016c-0.086 0.179-0.265 0.284-0.451 0.284z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M7.042 15.081c-0.232-0.15-0.541-0.084-0.692 0.147l-0.013 0.020c-0.131-0.812-0.542-1.47-1.174-1.869-0.395-0.25-0.862-0.382-1.351-0.382-1.18 0-2.378 0.735-3.126 1.919-0.514 0.813-0.753 1.739-0.671 2.607 0.086 0.916 0.513 1.66 1.203 2.097 0.395 0.25 0.862 0.382 1.35 0.382 1.18 0 2.378-0.735 3.126-1.919 0.023-0.036 0.045-0.073 0.067-0.11l1.427-2.2c0.15-0.232 0.084-0.541-0.147-0.692zM2.569 19c-0.303 0-0.578-0.076-0.816-0.227-0.422-0.267-0.686-0.744-0.742-1.345-0.061-0.649 0.124-1.351 0.521-1.979 0.558-0.883 1.453-1.453 2.281-1.453 0.303 0 0.578 0.076 0.816 0.227 0.422 0.267 0.686 0.744 0.742 1.345 0.058 0.614-0.106 1.277-0.46 1.878l-0.175 0.27c-0.561 0.785-1.393 1.283-2.166 1.283z" fill='` + editorColor + `'></path></g></svg> `
}

function createCommentIcon(editDetailId, editorColor) {
    return ` <svg id='comment^^!` + editDetailId + `' style="cursor:pointer; margin-right: 2px; position: relative; top: 2px; width: 12px; height: 12px;" viewBox="0 0 20 20"><g><path fill='` + editorColor + `' d="M0.5 19c-0.225 0-0.422-0.15-0.482-0.367s0.032-0.447 0.225-0.562c1.691-1.014 2.392-2.489 2.641-3.179-1.838-1.407-2.884-3.354-2.884-5.392 0-1.029 0.258-2.026 0.768-2.964 0.486-0.894 1.18-1.695 2.061-2.381 1.787-1.39 4.156-2.156 6.671-2.156s4.884 0.766 6.671 2.156c0.881 0.685 1.575 1.486 2.061 2.381 0.51 0.937 0.768 1.934 0.768 2.964s-0.258 2.026-0.768 2.964c-0.486 0.894-1.18 1.695-2.061 2.381-1.787 1.39-4.156 2.156-6.671 2.156-1.033 0-2.047-0.129-3.016-0.385-0.429 0.286-1.231 0.793-2.189 1.27-1.488 0.74-2.764 1.115-3.794 1.115zM9.5 3c-4.687 0-8.5 2.916-8.5 6.5 0 1.815 1.005 3.562 2.756 4.792 0.172 0.121 0.25 0.336 0.196 0.539-0.117 0.436-0.515 1.633-1.58 2.788 1.302-0.456 2.704-1.247 3.739-1.959 0.123-0.085 0.277-0.11 0.421-0.069 0.948 0.271 1.947 0.409 2.968 0.409 4.687 0 8.5-2.916 8.5-6.5s-3.813-6.5-8.5-6.5z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M13.5 7h-8c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h8c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M13.5 9h-8c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h8c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M13.5 11h-8c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h8c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z" fill='` + editorColor + `'></path><path fill='` + editorColor + `' d="M11.5 13h-6c-0.276 0-0.5-0.224-0.5-0.5s0.224-0.5 0.5-0.5h6c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5z" fill='` + editorColor + `'></path></g></svg> `
}

function createPencilIcon(editDetailId, editorColor) {
    return ` <svg id='editText^^!` + editDetailId + `' style="cursor:pointer; margin-right: 2px; position: relative; top: 2px; width: 12px; height: 12px;" viewBox="0 0 20 20"><g><path fill='` + editorColor + `' d="M19.104 0.896c-0.562-0.562-1.309-0.871-2.104-0.871s-1.542 0.309-2.104 0.871l-12.75 12.75c-0.052 0.052-0.091 0.114-0.116 0.183l-2 5.5c-0.066 0.183-0.021 0.387 0.116 0.524 0.095 0.095 0.223 0.146 0.354 0.146 0.057 0 0.115-0.010 0.171-0.030l5.5-2c0.069-0.025 0.131-0.065 0.183-0.116l12.75-12.75c0.562-0.562 0.871-1.309 0.871-2.104s-0.309-1.542-0.871-2.104zM5.725 17.068l-4.389 1.596 1.596-4.389 11.068-11.068 2.793 2.793-11.068 11.068zM18.396 4.396l-0.896 0.896-2.793-2.793 0.896-0.896c0.373-0.373 0.869-0.578 1.396-0.578s1.023 0.205 1.396 0.578c0.373 0.373 0.578 0.869 0.578 1.396s-0.205 1.023-0.578 1.396z" fill='` + editorColor + `'></path></g></svg> `
}

function createBreakNewIcon(editDetailId, beginOrEnd, showEditIcons, editorColor) {
    //Create the paragraph tag outside of the span with the breaknew hrefId.  When this is saved off as accepted by the author, then the svg will be
    //  stripped out and then the p tag will be left over.  It should then also get an hrefId assigned to it (although I don't think that it is every really used later for reference.)
    if (showEditIcons) {
        return "<svg id='breakNew" + beginOrEnd + `^^!` + editDetailId + "' style='cursor:pointer; 4px; position: relative; top: 4px; width: 14px; height: 14px;' viewBox='0 0 23 22'><g><path d='M12.27,0.856c-0.379,0-7.692,0-7.692,0  c-2.455,0-4.448,1.995-4.448,4.448c0,2.451,1.993,4.447,4.445,4.447h1.111v8.336c0,0.306,0.25,0.558,0.557,0.558  c0.308,0,0.556-0.252,0.556-0.558V1.968h3.335v16.119c0,0.306,0.251,0.558,0.557,0.558c0.309,0,0.556-0.252,0.556-0.558V1.968h1.024  c0.406,0.001,0.643-0.271,0.643-0.577C12.91,1.084,12.648,0.856,12.27,0.856z M5.688,8.638H4.574c-1.838,0-3.334-1.496-3.334-3.334  c0-1.838,1.498-3.335,3.334-3.335h1.111v6.669H5.688z' fill='" + editorColor + "'></path><path d='M18.641,13.78l0.044-4.639l4.636,0.043c0.369,0.004,0.664-0.29,0.668-0.654  c0.002-0.365-0.293-0.665-0.654-0.668L18.696,7.82l0.044-4.641c0.004-0.361-0.29-0.66-0.654-0.665  c-0.364-0.002-0.664,0.295-0.668,0.652l-0.044,4.64l-4.636-0.043c-0.366-0.005-0.664,0.293-0.667,0.655  c-0.003,0.367,0.292,0.664,0.654,0.667l4.634,0.043l-0.044,4.638c-0.004,0.367,0.291,0.662,0.655,0.665  C18.338,14.439,18.637,14.146,18.641,13.78z' fill='" + editorColor + "'></path></g></svg>"
    }
    return ""
}

function createBreakDeleteIcon(editDetailId, beginOrEnd, editorColor) {
    //Create the paragraph tag outside of the span with the breaknew hrefId.  When this is saved off as accepted by the author, then the svg will be
    //  stripped out and then the p tag will be left over.  It should then also get an hrefId assigned to it (although I don't think that it is every really used later for reference.)
    return  "<svg id='breakDelete" + beginOrEnd + `^^!` + editDetailId + "' style='cursor:pointer;  position: relative; top: 3px; width: 14px; height: 14px;' viewBox='0 0 23 22'><g><path d='M12.27,0.856c-0.379,0-7.692,0-7.692,0  c-2.455,0-4.448,1.995-4.448,4.448c0,2.451,1.993,4.447,4.445,4.447h1.111v8.336c0,0.306,0.25,0.558,0.557,0.558  c0.308,0,0.556-0.252,0.556-0.558V1.968h3.335v16.119c0,0.306,0.251,0.558,0.557,0.558c0.309,0,0.556-0.252,0.556-0.558V1.968h1.024  c0.406,0.001,0.643-0.271,0.643-0.577C12.91,1.084,12.648,0.856,12.27,0.856z M5.688,8.638H4.574c-1.838,0-3.334-1.496-3.334-3.334  c0-1.838,1.498-3.335,3.334-3.335h1.111v6.669H5.688z' fill='" + editorColor + "'></path><path d='M23.775,13.052l-4.132-4.134l4.132-4.131c0.329-0.328,0.324-0.853,0-1.178  c-0.325-0.325-0.855-0.324-1.178-0.001l-4.132,4.131l-4.135-4.135c-0.321-0.322-0.85-0.321-1.176,0.002  c-0.323,0.325-0.32,0.857-0.003,1.175l4.134,4.136l-4.131,4.13c-0.327,0.325-0.322,0.856,0,1.179c0.327,0.325,0.854,0.323,1.178,0  l4.129-4.129l4.133,4.134c0.325,0.327,0.852,0.322,1.176-0.002C24.102,13.906,24.102,13.378,23.775,13.052z' fill='" + editorColor + "'></path></g></svg>"
}

function createMoveIcon(editDetailId, beginOrEnd, editorColor) {
    //The id coming in is the target hrefId
    //There is more to just the name that si different from begin or end.  The end icon is actually flipped horizontally.
    let icon = "<svg id='move" + beginOrEnd + `^^!` + editDetailId + "' style='cursor:pointer; "
    if (beginOrEnd === 'End') {
        icon += " -moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); transform: scaleX(-1); filter: FlipH; -ms-filter: \"FlipH\"; "
    }
    icon += " margin-right: 2px; position: relative; top: 2px; width: 14px; height: 14px;' viewBox='0 0 20 20'><g><path fill='" + editorColor + "' d='M18.5 18h-17c-0.827 0-1.5-0.673-1.5-1.5v-13c0-0.827 0.673-1.5 1.5-1.5h11c0.276 0 0.5 0.224 0.5 0.5s-0.224 0.5-0.5 0.5h-11c-0.276 0-0.5 0.224-0.5 0.5v13c0 0.276 0.224 0.5 0.5 0.5h17c0.276 0 0.5-0.224 0.5-0.5v-7c0-0.276 0.224-0.5 0.5-0.5s0.5 0.224 0.5 0.5v7c0 0.827-0.673 1.5-1.5 1.5z' fill='" + editorColor + "'></path><path fill='" + editorColor + "' d='M19.354 6.146l-4-4c-0.195-0.195-0.512-0.195-0.707 0s-0.195 0.512 0 0.707l3.146 3.146h-6.293c-1.721 0-3.346 0.62-4.575 1.747-1.241 1.138-1.925 2.648-1.925 4.253v0.5c0 0.276 0.224 0.5 0.5 0.5s0.5-0.224 0.5-0.5v-0.5c0-2.757 2.467-5 5.5-5h6.293l-3.146 3.146c-0.195 0.195-0.195 0.512 0 0.707 0.098 0.098 0.226 0.146 0.354 0.146s0.256-0.049 0.354-0.146l4-4c0.195-0.195 0.195-0.512 0-0.707z' fill='" + editorColor + "'></path></g></svg>"
    return icon
}

function diffWord(inputA, inputB) {
    const regex = "/<(.|\n)*?>/"
    inputA = inputA && inputA.replace(regex, "")
            .replace(/<br>/g, "")
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim()

    inputB = inputB && inputB.replace(regex, "")
            .replace(/<br>/g, "")
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim()

    const diff = jsdiff.diffWords(inputA, inputB); //fnMap[this.props.type]
    const result = diff && diff.length > 0 && diff.map((part, index) => {
        if (part.added) {
          return '<ins key={index}>' + part.value + '</ins>'
        }
        if (part.removed) {
          return '<del key={index}>' + part.value + '</del>'
        }
        return '<span key={index}>' + part.value + '</span>'
    })
    return result.join("")
}
