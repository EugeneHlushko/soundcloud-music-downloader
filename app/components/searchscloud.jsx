import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';
import debug from 'debug';
// import render components
import TrackOutside from 'components/shared/trackOutside';

if (process.env.BROWSER) {
  require('styles/searchscloud.scss');
}

class Searchscloud extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    addTrack: PropTypes.object.isRequired,
    allTracks: PropTypes.array.isRequired,
    clientid: PropTypes.string.isRequired
  }

  state = this.props.flux.getStore('search').getState();

  _timeout = {
    running: false,
    itself: null,
    interval: 1000
  };

  _getIntlMessage = IntlMixin.getIntlMessage

  componentDidMount() {
    this.props.flux
      .getStore('search')
      .listen(this._handleResultsChange);
    this.state.searchQry = '';
    this.state.clientid = this.props.flux
      .getStore('client')
      .getClientid();
    this.state.i18 = this.props.flux
      .getStore('locale')
      .getState();

//    setInterval(() => {
//      debug('dev')(this.state.searchQry);
//    }, 100);
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
    let _val = event.target.value;
    debug('dev')('Will start searching by keyword if timeout goes on and if more then 3 keys entered', _val);
    if ( _val.length > 2 ) {
      if ( this._timeout.running ) {
        clearTimeout(this._timeout.itself);
        this._timeout.itself = null;
        this._timeout.running = false;
      }
      // now that TO is cleared, start new one
      this._timeout.running = true;
      this._timeout.itself = setTimeout(this._doSearch, this._timeout.interval);
    }
    return this.setState({searchQry: _val});
  }

  _doSearch = () => {
    this.props.flux.getActions('search').searchTrack({
      query: this.state.searchQry,
      clientid: this.state.clientid
    });
  }

  _renderTracks = (pls) => {
    let isIn = this.props.allTracks.some((oneItem)=> {
      return oneItem.id === pls.id;
    });
    let trackActionText = (isIn) ? this._getIntlMessage('tracks.remove') : this._getIntlMessage('tracks.add');
    let actionClass = (isIn) ? 'track--action remove' : 'track--action';
    return (
      <div className='track cfx' key={pls.id} uri={pls.uri}>
        <div className='track--title'>
          {pls.title}
        </div>
        <div className='track--actions'>
          <div className='track--action dl'>
            {this._getIntlMessage('playlists.action.dl')}
          </div>
          <div className={actionClass}
            onClick={this.props.addTrack.bind(this, pls)} >
            {trackActionText}
          </div>
        </div>
      </div>
    );
  }

  _renderUser = (pls) => {
    return (
      <div className='track cfx' key={pls.id} uri={pls.uri}>
        <div className='track--title'>
          {pls.username}
        </div>
        <div className='track--actions'>
          <div className='track--action'
               onClick={this.props.addTrack.bind(this, pls)} >
            {this._getIntlMessage('user.view')}
          </div>
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
        <h1></h1>
        <div className='searchRow cfx'>
          {this._getIntlMessage('search.heading')}
          <input
            value={this.state.searchQry}
            onChange={this._startSearch} />
        </div>
        <div className='appTracks--bulk cfx'>
        {
          this.state.results.map((item) => {
            debug('dev')('Will render this item: ', item);
            if ( item.kind === 'track' ) {
              // return this._renderTracks(item);
              let isIn = this.props.allTracks.some((oneItem)=> {
                return oneItem.id === item.id;
              });
              return (<TrackOutside
                {...this.state.i18n}
                flux={this.props.flux}
                addTrack={this.props.addTrack}
                isIn={isIn}
                item={item}
                key={item.id} />);
            }
            else if ( item.kind === 'user' ) {
              return this._renderUser(item);
            }
            else if ( item.kind === 'playlist' ) {
              return this._renderUser(item);
            }
          })
        }
        </div>
      </section>
    );
  }

}

export default Searchscloud;
