import {Component} from 'react';
import LangContext from '../../context/LangContext';

class PageLanguage extends Component {
  constructor(props) {
      super(props);

      this.state = {
      }
  }
  static contextType = LangContext;

  render() {
      const {p, t} = this.props;
      const pageLangs = this.context;
      let pageLang = pageLangs && pageLangs.length > 0 && pageLangs.filter(m => m.page === p && m.text === t)[0];
      return (pageLang && pageLang.translation) || t;
  }
};

export default PageLanguage;
