import debug from 'debug';
import XMLHttpRequest from 'xhr2';

class SearchActions {
  constructor() {
    this.generateActions(
      'searchSuccess'
    );
  }

  searchTrack(data) {
    const prv = this;
    debug('dev')('Will search for tracks, keyword is: ', data.query);
    if (data.query) {
      // set up xhr in a promise and then resolve it
      const promise = (resolve) => {
        this.alt.getActions('requests').start();
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          debug('dev')('Searching in action, we received xhr response, readystate is: ', xhr.readyState);
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              debug('dev')('raw reply from server on search', JSON.parse(xhr.responseText));
              const responsified = JSON.parse(xhr.responseText);
              this.actions.searchSuccess({tracks: responsified});
              prv.alt.getActions('requests').success();
              return resolve();
            }
            else {
              debug('dev')('XHR failed, msg: ', xhr.responseText);
            }
          }
        };
        xhr.open('GET', `http://api.soundcloud.com/tracks?q==${data.query}`);
        xhr.send();
      };
      this.alt.resolve(promise);
    }
    else {
      debug('dev')('OH CRAP YOU DIDNT PROVIDE a good query');
    }
  }
}
export default SearchActions;
