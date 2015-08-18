export default class FormStore {

  constructor() {
    this.bindActions(this.alt.getActions('form'));
    this.userData = [];
  }

  onFetchBySeedSuccess(results) {
    return this.setState({form: results});
  }

}
