import React, {Component, PropTypes} from 'react';

import Clientid from 'components/formcomponents/clientid';
import LangPicker from 'components/shared/lang-picker';

if (process.env.BROWSER) {
  require('styles/footer.scss');
}

class Footer extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    locales: PropTypes.array.isRequired
  }

  render() {
    const {locales, flux} = this.props;
    const [activeLocale] = locales;

    return (
      <footer className='app--footer'>
        {/* LangPicker on the right side */}
        <Clientid
          flux={flux} />

        <LangPicker
          activeLocale={activeLocale}
          onChange={flux.getActions('locale').switchLocale} />
      </footer>
    );
  }

}

export default Footer;
