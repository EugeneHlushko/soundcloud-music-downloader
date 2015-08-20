import debug from 'debug';
const Cookies = (process.env.BROWSER) ? require('cookies-js') : false;

class TracksStore {

  constructor() {
    this.bindActions(this.alt.getActions('tracks'));
    this.tracks = (Cookies && Cookies.get('_tracks')) ? Cookies.get('_tracks') : [];
    debug('dev')('i have set Tracks to', this.tracks);
  }

  static getTracks() {
    return ( Cookies && Cookies.get('_tracks') && !this.getState().tracks ) ? Cookies.get('_tracks') : this.getState().tracks;
  }

  onSetTracksSuccess(track) {
    debug('dev')('received tracks in SetTracksSuccess: ', track);
    let _alreadyInArray = this.tracks.indexOf(track);
    // if not already in tracklist, then add
    if ( _alreadyInArray === -1) {
      this.tracks.push(track);
    }
    else {
      this.tracks.splice(_alreadyInArray, 1);
    }
    return this.setState({
      tracks: this.tracks
    });
  }
}

export default TracksStore;
