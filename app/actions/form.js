export default class FormActions {

  constructor() {
    this.generateActions(
      'fetchTracksSuccess'
    );
  }

  fetchTracks() {
    const promise = (resolve) => {
      // fake xhr
      this.alt.getActions('requests').start();
      setTimeout(() => {
        this.alt.getActions('requests').success();
        return resolve();
      }, 300);
    };
    this.alt.resolve(promise);
  }
}
