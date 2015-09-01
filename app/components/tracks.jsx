import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';
import debug from 'debug';

if (process.env.BROWSER) {
  require('styles/tracks.scss');
}

class Tracks extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    locales: PropTypes.array.isRequired,
    tracks: PropTypes.array.isRequired,
    addTrack: PropTypes.object.isRequired
  }

  state = {
    playlistName: ''
  }

  _getIntlMessage = IntlMixin.getIntlMessage

  componentWillMount() {
    debug('dev')('Tracks component WILL MOUNT, state is', this.props.tracks);
  }

  componentDidMount() {
    debug('dev')('Tracks component mounted, state is', this.props.tracks);
  }

  _donwloadPlaylistTracksNow = () => {
    return this.props.flux.getActions('playlists').downloadPlaylistTracks({
      clientid: this.props.flux
        .getStore('client')
        .getClientid(),
      tracks: this.props.tracks,
      playlist_title: this.state.playlistName
    });
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
        <div className='track--actions'>
          <div className='track--action dl'>
            {this._getIntlMessage('playlists.action.dl')}
          </div>
          <div className='track--action remove'
            onClick={this.props.addTrack.bind(this, pls)} >
            {this._getIntlMessage('tracks.remove')}
          </div>
        </div>
      </div>
    );
  }

  _changePlaylistName = (event) => {
    return this.setState({playlistName: event.target.value});
  }

  render() {
    let tracks = (this.props.tracks.length > 0) ? this.props.tracks : [];
    let _tracksActive = (tracks.length > 0)
      ? 'appTracks cfx active'
      : 'appTracks cfx';
    let _dlActive = (tracks.length > 0 && this.state.playlistName.length > 1 )
      ? 'btn downloadAll active'
      : 'btn downloadAll';

    return (
      <section className={_tracksActive}>
        <h1>{this._getIntlMessage('tracks.header')}</h1>
        <div className='inputrow cfx'>
          Playlist name
          <input
            onChange={this._changePlaylistName} />

          <div className={_dlActive}
            onClick={this._donwloadPlaylistTracksNow} >
            {this._getIntlMessage('tracks.downloadPlaylist')}
          </div>
        </div>
        <div className='appTracks--bulk cfx'>
          <div className='track headingrow cfx'>
            <div className='track--id'>
              {this._getIntlMessage('tracks.id')}
            </div>
            <div className='track--title'>
              {this._getIntlMessage('tracks.title')}
            </div>
            <div className='track--actions'>
              {this._getIntlMessage('playlists.actions')}
            </div>
          </div>
          {
            tracks.map(this._renderTracks)
          }
        </div>
      </section>
    );
  }

}

export default Tracks;
