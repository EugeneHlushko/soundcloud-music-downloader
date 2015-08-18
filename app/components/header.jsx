import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import {IntlMixin} from 'react-intl';

// import imageResolver from 'utils/image-resolver';
import Spinner from 'components/shared/spinner';

// Load styles for the header
if (process.env.BROWSER) {
  require('styles/header.scss');
}

class Header extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired
  }

  _getIntlMessage = IntlMixin.getIntlMessage

  state = {
    spinner: false
  }

  componentDidMount() {
    this.props.flux
      .getStore('requests')
      .listen(this._handleRequestStoreChange);
  }

  _handleRequestStoreChange = ({inProgress}) => {
    return this.setState({spinner: inProgress});
  }

  render() {
    return (
      <header className='app--header'>
        <h1>{this._getIntlMessage('header.heading')}</h1>
        {/* Spinner in the top right corner */}
        <Spinner active={this.state.spinner} />

        {/* Links in the navbar */}
        <ul className='app--navbar text-center reset-list un-select'>
          <li>
            <Link to={this._getIntlMessage('routes.getLists')}>
              {this._getIntlMessage('header.getLists')}
            </Link>
          </li>
          <li>
            <Link to={this._getIntlMessage('routes.getTracksByUser')}>
              {this._getIntlMessage('header.getTracksByUser')}
            </Link>
          </li>
          <li>
            <Link to={this._getIntlMessage('routes.search')}>
              {this._getIntlMessage('header.search')}
            </Link>
          </li>
        </ul>
      </header>
    );
  }
}

export default Header;
