import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';
import debug from 'debug';

if (process.env.BROWSER) {
  require('styles/searchscloud.scss');
}

class Searchscloud extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired
  }

  state = this.props.flux.getStore('search').getState();

  _getIntlMessage = IntlMixin.getIntlMessage

  componentDidMount() {
    this.props.flux
      .getStore('search')
      .listen(this._handleResultsChange);
    this.state.searchQry = '';

    setInterval(() => {
      debug('dev')(this.state);
    }, 2000);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('search')
      .unlisten(this._handleResultsChange);
  }

  _handleResultsChange = (store) => {
    debug('dev')('YEAH handle the add track here man', store);
    return this.setState(store);
  }

  _startSearch = (event) => {
    debug('dev')('Will start searching by keyword', event.target.value);
    this.state.searchQry = event.target.value;
    this.props.flux.getActions('search').searchTrack({query: this.state.searchQry});
  }

  _renderTracks = (pls) => {
    return (
      <div className='track cfx' key={pls.id} uri={pls.uri}>
        <div className='track--id'>
          {pls.id}
        </div>
        <div className='track--title'>
          {pls.title}
        </div>
      </div>
    );
  }

  render() {
    let results = (this.state.results.length > 0) ? this.state.results : [];
    let _resultsActive = (results.length > 0)
      ? 'srchSclResults cfx active'
      : 'srchSclResults cfx';

    return (
      <section className={_resultsActive}>
        {this._getIntlMessage('search.heading')}
        <input
          value={this.state.searchQry}
          onChange={this._startSearch} />
        <div className='searchTracks cfx'>
        {
          this.state.results.map(this._renderTracks)
        }
        </div>
      </section>
    );
  }

}

export default Searchscloud;
