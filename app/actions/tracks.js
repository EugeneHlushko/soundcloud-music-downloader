import debug from 'debug';

export default class TracksActions {
  constructor() {
    this.generateActions(
      'setTracksSuccess'
    );
  }

  addTrack(track) {
    debug('dev')('received these tracks array in actions Tracks ', track);
    this.actions.setTracksSuccess(track);
  }
}
