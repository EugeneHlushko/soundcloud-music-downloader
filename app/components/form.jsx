import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';

if (process.env.BROWSER) {
  require('styles/form.scss');
}

class Form extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired
  }

  _getIntlMessage = IntlMixin.getIntlMessage

  state = this.props.flux
    .getStore('form')
    .getState()

  componentWillMount() {
    this.props.flux
      .getActions('page-title')
      .set(this._getIntlMessage('form.page-title'));

    this.props.flux
      .getActions('form')
      .fetchTracks();
  }

  componentDidMount() {
    this.props.flux
      .getStore('form')
      .listen(this._handleStoreChange);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('form')
      .unlisten(this._handleStoreChange);
  }

  _handleStoreChange = (state) => {
    return this.setState(state);
  }

  render() {
    return (
      <div>
        <h1 className='text-center'>
          {this._getIntlMessage('form.title')}
        </h1>
      </div>
    );
  }

}

export default Form;
