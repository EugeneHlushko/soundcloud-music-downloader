import debug from 'debug';

const Cookies = (process.env.BROWSER) ? require('cookies-js') : false;

class PlaylistsStore {

  constructor() {
    this.bindActions(this.alt.getActions('playlists'));
    this.userid = (Cookies) ? Cookies.get('_playlists_userid') : '';
    this.playlists = [];
    debug('dev')('i have set userID and it is now', this.userid, ' playlists too: ', this.playlists);
  }

  static getUserid() {
    return ( Cookies && !this.getState().userid ) ? Cookies.get('_playlists_userid') : this.getState().userid;
  }

  onSwitchUseridSuccess(userid) {
    debug('dev')('received clientid in success: ', userid);
    // Save userID to cookie if available
    if (process.env.BROWSER) {
      Cookies.set('_playlists_userid', userid, {expires: Infinity});
      debug('dev')(`updated _playlists_userid cookie to ${userid}`);
    }
    return this.setState({userid: userid});
  }

  onFetchPlaylistsSuccess(data) {
    debug('dev')('We have received playlists: ', data.playlists);
    let prepared = [];
    data.playlists.map((item, index)=> {
      prepared[index] = {title: item.title, id: item.id, uri: item.permalink_url, tcount: item.track_count, tracks: item.tracks};
    });
    debug('dev')('AFTER map prepared was: ', prepared);
    return this.setState({
      userid: data.userid,
      playlists: prepared
    });
  }

}

export default PlaylistsStore;
