import debug from 'debug';

export default class TracksActions {
  constructor() {
    this.generateActions(
      'setTracksSuccess'
    );
  }

  addTrack(track) {
    debug('dev')('received these tracks array in actions Tracks ', track);
    let _track = {
      id: track.id,
      title: track.title,
      stream_url: track.stream_url
    };
    this.actions.setTracksSuccess(_track);
  }
}
