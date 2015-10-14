import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';
import debug from 'debug';

// import render components
import TrackOutside from 'components/shared/trackOutside';

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
            title={this._getIntlMessage('tracks.downloadPlaylist')}
            onClick={this._donwloadPlaylistTracksNow} >
            {this._getIntlMessage('tracks.downloadPlaylist')}
          </div>
        </div>
        <div className='appTracks--bulk sidebar cfx'>
          <div className='track headingrow cfx'>
            <div className='track--title'>
              {this._getIntlMessage('tracks.title')}
            </div>
            <div className='track--actions'>
              {this._getIntlMessage('playlists.actions')}
            </div>
          </div>

          {
            tracks.map((item) => {
              let isIn = tracks.some((oneItem)=> {
                return oneItem.id === item.id;
              });
              return (<TrackOutside
                {...this.state.i18n}
                flux={this.props.flux}
                addTrack={this.props.addTrack}
                isIn={isIn}
                item={item}
                key={item.id} />);
            })
          }
        </div>
      </section>
    );
  }

}

export default Tracks;
