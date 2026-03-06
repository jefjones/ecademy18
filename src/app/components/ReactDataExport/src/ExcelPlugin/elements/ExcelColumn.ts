import { Component } from "react"
import PropTypes from "prop-types"

export default class ExcelColumn extends Component {
    static propsTypes = {
        label: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.bool,
            PropTypes.string,
            PropTypes.func
        ]).isRequired
    }

    render() {
        return null
    }
}
