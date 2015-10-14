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
    this.state.filter = '';
    setInterval(() => {
      debug('dev')(this.state.filter);
    }, 1000);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('search')
      .unlisten(this._handleResultsChange);
  }

  _handleSearchRowClick = (event) => {
    debug('dev')(event.target);
    let clicked = false;
    let target = event.target;
    let id;

    if ( target.tagName === 'LABEL' ) {
      target.nextSibling.click();
    }
    else if ( target.tagName === 'INPUT' && target.type === 'radio') {
      clicked = target;
    }
    // if its about type switching, lets change our state.
    if ( clicked ) {
      id = clicked.getAttribute('id');
      debug('dev')('we clicked the right spot man!', id);
      if ( id ) {
        if ( this.state.filter === id ) {
          debug('dev')('it was already our filter, do nothing');
          return false;
        }
        else {
          debug('dev')('Setting new filter');
          this.setState({filter: id}, this._doSearch);
        }
      }
    }
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
    // since this is now called from checkboxes and input, ill add additional check for query length
    if ( this.state.searchQry.length > 2 ) {
      // destruct state
      let {searchQry, clientid, filter} = this.state;
      // trigger search action
      this.props.flux.getActions('search').searchTrack({
        searchQry,
        clientid,
        filter
      });
    }
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
        <div className='searchRow cfx'
          onClick={this._handleSearchRowClick.bind(this)}
          >
          {this._getIntlMessage('search.heading')}
          <input
            value={this.state.searchQry}
            onChange={this._startSearch} />
          <div className="searchRow--inline">
            <label for='tracks'>{this._getIntlMessage('search.byTrack')}</label>
            <input type='radio' name='filter' id='tracks' />
          </div>
          <div className="searchRow--inline">
            <label for='users'>{this._getIntlMessage('search.byUser')}</label>
            <input type='radio' name='filter' id='users' />
          </div>
          <div className="searchRow--inline">
            <label for='playlists'>{this._getIntlMessage('search.byPlaylist')}</label>
            <input type='radio' name='filter' id='playlists' />
          </div>
        </div>
        <div className='appTracks--bulk cfx'>
        {
          this.state.results.map((item) => {
            debug('dev')('Will render this item: ', item);
            if ( item.kind === 'track' ) {
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
