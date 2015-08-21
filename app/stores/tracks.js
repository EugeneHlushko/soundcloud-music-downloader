import debug from 'debug';
const Cookies = (process.env.BROWSER) ? require('cookies-js') : false;

class TracksStore {

  constructor() {
    this.bindActions(this.alt.getActions('tracks'));
    this.tracks = [];

    if ( Cookies ) {
      this.on('init', this.bootstrap);
      this.on('bootstrap', this.bootstrap);
    }
  }

  bootstrap() {
    if ( Cookies ) {
      debug('dev')('have cookies, will try to get it');
      debug('dev')(Cookies.get('_tracks'));
      let _tracks = (Cookies.get('_tracks')) ? JSON.parse(Cookies.get('_tracks')) : [];
      this.tracks = (_tracks.length > 0) ? _tracks : [];
    }
    else {
      this.tracks = [];
    }
  }

  static getTracks() {
    return ( Cookies && Cookies.get('_tracks') && !this.getState().tracks ) ? Cookies.get('_tracks') : this.getState().tracks;
  }

  onSetTracksSuccess(track) {
    debug('dev')('received tracks in SetTracksSuccess: ', track);
    let _index = false;
    let _alreadyInArray = this.tracks.some((oneItem, index)=> {
      if ( oneItem.id === track.id ) {
        _index = index;
        return true;
      }
    });
    // if not already in tracklist, then add
    if (!_alreadyInArray) {
      this.tracks.push(track);
    }
    else {
      this.tracks.splice(_index, 1);
    }
    // store to cookie
    if (process.env.BROWSER) {
      let _tracksJsonString = JSON.stringify(this.tracks);
      debug('dev')('cookies should be');
      Cookies('_tracks', _tracksJsonString, {expires: 600 * 5});
      debug('dev')(`updated _tracks cookie to ${this.tracks}`);
      debug('dev')(Cookies.get('_tracks'));
    }
    return this.setState({tracks: this.tracks});
  }
}

export default TracksStore;
