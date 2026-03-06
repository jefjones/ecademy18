// @flow
/**
 * A simple loading indicator, modeled after react-select.  Since react styles
 * don't support animations, hack it so we inject the keyframe animation
 * into the document.
 */
import { Component } from 'react'

const STYLESHEET_NAME = "__react-multi-select_style_inject__"


function findStylesheet() {
    const styleSheet = Array.from(document.styleSheets)
        .find(stylesheet => stylesheet.title === STYLESHEET_NAME)

    // upcast as CSSStyleSheet
    const cssStylesheet = styleSheet as any

    return cssStylesheet
}

function registerStylesheet(css) {
    try {
        if (findStylesheet()) {
            return
        }

        const style = document.createElement("style")
        style.setAttribute("title", STYLESHEET_NAME)
        document.head && document.head.appendChild(style)

        const stylesheet = findStylesheet()
        if (!stylesheet) {
            // Someting bad happened.  Abort!
            return
        }

        stylesheet.insertRule(css, 0)
    } catch (e) {
    }
}

function LoadingIndicator(props) {
  return <span style={styles.loading} />
}

const keyFrames = `
@keyframes react-multi-select_loading-spin {
    to {
        transform: rotate(1turn)
    }
}
`;

const styles = {
    loading: {
        "animation": "react-multi-select_loading-spin 400ms infinite linear",
        "width": "16px",
        "height": "16px",
        boxSizing: "border-box",
        borderRadius: "50%",
        border: "2px solid #ccc",
        borderRightColor: "#333",
        display: "inline-block",
        position: "relative",
        verticalAlign: "middle",
    },
}

export default LoadingIndicator
