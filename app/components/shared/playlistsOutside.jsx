import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';
import debug from 'debug';

class PlaylistsOutside extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    addTrack: PropTypes.object.isRequired,
    isIn: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired
  }

  _getIntlMessage = IntlMixin.getIntlMessage

  state = {
    i18n: this.props.flux
      .getStore('locale')
      .getState()
  }

  componentWillMount() {
    debug('dev')(this.props.flux
      .getStore('locale')
      .getState());
  }

  render() {
    let _tracks = ( this.state.playlistTracks.id === pls.id ) ? this.state.playlistTracks.tracks : [];
    let tracksContainerClass = ( _tracks.length > 0 ) ? 'tracklist active' : 'tracklist';
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
          <div className='plss--action view'
               onClick={this._browsePlaylistTracksNow.bind(this, pls)}>
            {this._getIntlMessage('playlists.action.view')}
          </div>
          <div className='plss--action dl'
               onClick={this._donwloadPlaylistTracksNow.bind(this, pls)}>
            {this._getIntlMessage('playlists.action.dl')}
          </div>
        </div>
        <div className='cfx'></div>
        <aside className={tracksContainerClass}>
          <div className='tracklist--heading'>
            {this._getIntlMessage('playlists.pltracks')}
          </div>
          <CSSTransitionGroup component="div" transitionName="fade" transitionAppear={true} transitionLeave={false}>
            {
              _tracks.map(this._renderTrack)
            }
          </CSSTransitionGroup>
        </aside>
      </div>
    );
  }

}

export default PlaylistsOutside;
