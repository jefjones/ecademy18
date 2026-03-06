import React, {Component} from 'react';
//import PropTypes from 'prop-types';
//import jsdiff from 'diff';
let jsdiff = require('diff');

//const fnMap = jsdiff.diffWords;
// const fnMap = {
//   'chars': jsdiff.diffChars,
//   'words': jsdiff.diffWords,
//   'sentences': jsdiff.diffSentences,
//   'json': jsdiff.diffJson
// };

/**
 * Display diff in a stylable form.
 *
 * Default is character diff. Change with props.type. Valid values
 * are 'chars', 'words', 'sentences', 'json'.
 *
 *  - Wrapping div has class 'Difference', override with props.className
 *  - added parts are in <ins>
 *  - removed parts are in <del>
 *  - unchanged parts are in <span>
 */

export default class extends Component {
  render() {
      let {inputA, inputB} = this.props;
      var regex = "/<(.|\n)*?>/";
      inputA = inputA && inputA.replace(regex, "")
              .replace(/<br>/g, "")
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .trim();

      inputB = inputB && inputB.replace(regex, "")
              .replace(/<br>/g, "")
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .trim();

      const diff = jsdiff.diffWords(inputA, inputB); //fnMap[this.props.type]
      const result = diff && diff.length > 0 && diff.map((part, index) => {
          if (part.added) {
            return <ins key={index}>{part.value}</ins>
          }
          if (part.removed) {
            return <del key={index}>{part.value}</del>
          }
          return <span key={index}>{part.value}</span>
      });
      return (
          <div className={this.props.className}>
              {result}
           </div>
      );
  }
}

// Diff.defaultProps = {
//   inputA: '',
//   inputB: '',
//   type: 'words',
//   className: 'Difference'
// };
