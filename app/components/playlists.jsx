import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';
import debug from 'debug';
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

if (process.env.BROWSER) {
  require('styles/playlists.scss');
}

class Playlists extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired
  }

  _getIntlMessage = IntlMixin.getIntlMessage

  state = this.props.flux
    .getStore('playlists')
    .getState()

  componentWillMount() {
    this.props.flux
      .getActions('page-title')
      .set(this._getIntlMessage('playlists.page-title'));

    debug('dev')('State is: ', this.state);
  }

  componentWillMount() {
    this.state.userid = this.props.flux
        .getStore('playlists')
        .getUserid();
  }

  componentDidMount() {
    this.props.flux
      .getStore('playlists')
      .listen(this._handleStoreChange);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('playlists')
      .unlisten(this._handleStoreChange);
  }

  _fetchPlaylistsHandler = () => {
    debug('dev')('clciked btn and userid to search playlists from is: ', this.state.userid);
    return this.props.flux.getActions('playlists').fetchPlaylists({
      userid: this.state.userid,
      clientid: this.props.flux.getStore('client').getClientid()
    });
  }

  _handleStoreChange = (event) => {
    debug('dev')('_handling store change, received props: ', event);
    if ( event.target ) {
      return this.props.flux.getActions('playlists').switchUserid({userid: event.target.value});
    }
    else {
      return this.setState(event);
    }
  }

  _donwloadPlaylistTracksNow = (el) => {
    debug('dev')('clicked DL', el);
    return this.props.flux.getActions('playlists').downloadPlaylistTracks({
      clientid: this.props.flux
        .getStore('client')
        .getClientid(),
      tracks: el.tracks,
      playlist_title: el.title
    });
  }

  _renderPlaylists = (pls) => {
    return (
      <div className='plss cfx' key={pls.id} uri={pls.uri}>
        <div className='plss--id'>
          {pls.id}
        </div>
        <div className='plss--title'>
          {pls.title}
        </div>
        <div className='plss--count'>
          {pls.tcount}
        </div>
        <div className='plss--actions'>
          <div className='plss--action view'>
            {this._getIntlMessage('playlists.action.view')}
          </div>
          <div className='plss--action dl'
              onClick={this._donwloadPlaylistTracksNow.bind(this, pls)}>
            {this._getIntlMessage('playlists.action.dl')}
          </div>
        </div>
      </div>
    );
  }

  render() {
    let _playlistsBulkClassname = (this.state.playlists.length > 0)
      ? 'playlists--bulk cfx active'
      : 'playlists--bulk cfx';
    return (
      <div>
        <h1 className='text-center'>
          {this._getIntlMessage('playlists.title')}
        </h1>

        <div className='input-row cfx'>
          <label>User id for playlists:</label>
          <input
            value={this.state.userid}
            onChange={this._handleStoreChange}
              />
          <button
            onClick={this._fetchPlaylistsHandler} >
              {this._getIntlMessage('playlists.fetchbtn')}
          </button>
        </div>

        <div className={_playlistsBulkClassname}>
          <div className='plss--headingrow cfx'>
            <div className='plss--id'>
              {this._getIntlMessage('playlists.id')}
            </div>
            <div className='plss--title'>
              {this._getIntlMessage('playlists.pltitle')}
            </div>
            <div className='plss--count'>
              {this._getIntlMessage('playlists.tcount')}
            </div>
            <div className='plss--actions'>
              {this._getIntlMessage('playlists.actions')}
            </div>
          </div>
          <CSSTransitionGroup component="div" transitionName="fade" transitionAppear={true} transitionLeave={true}>
          {
            this.state.playlists.map(this._renderPlaylists)
          }
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }

}

export default Playlists;
