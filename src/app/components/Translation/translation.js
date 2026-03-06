import React from 'react';
import PropTypes from "prop-types";

// // to do, implement this later when data ready...
// export class Provider extends Component {
//   static defaultProps = {
//     strings: {}
//   };
//
//   static childContextTypes = {
//     strings: PropTypes.object
//   };
//
//   getChildContext() {
//     return {
//       strings: this.props.strings
//     };
//   }
//
//   // TODO: remove Array check when React 16
//   render() {
//     const { children } = this.props;
//     return Array.isArray(children) ? <div>{children}</div> : children;
//   }
// }
//

// Create this in components folder
const Translate = ({Component="span", children, ...props}, {strings={}}) => {

    // strings = {};
    // translate = ({key, data}) => "string" // derived from key


    if( typeof children ==="function" ) {
        // pass back some translate function
        return children({strings, translate})
    }

    return <Component {...props}>{strings[children]}</Component>

}

Translate.contextTypes = {
    strings: PropTypes.object
};

// // how to use translate
// // option a
// <Translate>page.body.title</Translate>
//
// // option b (advanced)
// <Translate>
//     { ({strings, translate}) => (
//         <span title={ strings["page.span.title"] }>
//             contents
//             // there is 1 dog
//             // there are 3 dogs
//             {
//                 translate(({key: "string.dogs.count", data: n }))}
//
//         </span>
//     )}
// </Translate>
