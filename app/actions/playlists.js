import debug from 'debug';
import XMLHttpRequest from 'xhr2';

class PlaylistsActions {
  constructor() {
    this.generateActions(
      'switchUseridSuccess',
      'fetchPlaylistsSuccess',
      'downloadPlaylistTracksSuccess'
    );
  }

  switchUserid(data) {
    debug('dev')('received client id: ', data);
    if (data.userid) {
      return this.actions.switchUseridSuccess(data.userid);
    }
  }

  fetchPlaylists(data) {
    const prv = this;
    debug('dev')('I will fetch playlists, cid received: ', data.clientid, ' and userid received: ', data.userid);
    if (data.userid && data.clientid) {
      // set up xhr in a promise and then resolve it
      const promise = (resolve) => {
        this.alt.getActions('requests').start();
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          debug('dev')('Fetching playlists in action', xhr.readyState);
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              debug('dev')('raw reply from server', JSON.parse(xhr.responseText));
              const responsified = JSON.parse(xhr.responseText);
              this.actions.fetchPlaylistsSuccess({playlists: responsified, userid: data.userid});
              prv.alt.getActions('requests').success();
              return resolve();
            }
            else {
              debug('dev')('XHR failed, msg: ', xhr.responseText);
            }
          }
        };
        xhr.open('GET', `http://localhost:3000/getPlaylists?client_id=${data.clientid}&url=${data.userid}`);
        xhr.send();
      };
      this.alt.resolve(promise);
    }
    else {
      debug('dev')('OH CRAP YOU DIDNT PROVIDE ID AND CID');
    }
  }

  downloadPlaylistTracks(data) {
    const prv = this;
    debug('dev')('I will download all of selected playlist tracks', data);
    if (data.clientid && data.tracks) {
      // show spinner
      this.alt.getActions('requests').start();
      let _trackscount = data.tracks.length;

      // iterate through tracks array and download one by one, reporting about how many are downloaded already
      data.tracks.map((value, index)=> {
        // set up xhr in a promise and then resolve it
        const promise = (resolve) => {
          this.alt.getActions('requests').start();
          let xhr = new XMLHttpRequest();
          let _url = `http://localhost:3000/downloadPlaylistTracks?title=${value.title}&stream_url=${value.stream_url}&clientid=${data.clientid}&playlist_title=${data.playlist_title}`;

          xhr.onreadystatechange = () => {
            debug('dev')('Downloading tracks in action', xhr.readyState);
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                debug('dev')('raw reply from server after download', JSON.parse(xhr.responseText));
                if ( _trackscount === index + 1 ) {
                  prv.alt.getActions('requests').success();
                }
                return resolve();
              }
              else {
                debug('dev')('XHR failed, msg: ', xhr.responseText);
                if ( _trackscount === index + 1 ) {
                  prv.alt.getActions('requests').success();
                }
                return resolve();
              }
            }
          };
          // if its last track send makezip param
//          if ( _trackscount === index + 1 ) {
//            _url += '&makeZip=true';
//          }
          // else if its first track, prepare the directory
          if ( index === 0 ) {
            _url += '&prepareDir=true';
          }
          xhr.open('GET', _url);
          xhr.send();
        };
        this.alt.resolve(promise);
      });
    }
    else {
      debug('dev')('OH CRAP YOU DIDNT PROVIDE ID AND CID AND TRACKS');
    }
  }
}

export default PlaylistsActions;
