import debug from 'debug';

class SearchStore {

  constructor() {
    this.bindActions(this.alt.getActions('search'));
    this.results = [];
  }

  static getResultsDefaultLimit() {
    return 50;
  }

  static getResultsMaxLimit() {
    // this might be limited by soundcloud to a lower value
    return 200;
  }

  onSearchSuccess(results) {
    debug('dev')('received results in onSearchSuccess: ', results);
    // debug('dev')('results.length is', results.collection.length);
    if ( results.collection && results.collection.length > 0 ) {
      return this.setState({results: results.collection});
    }
    else if ( !results.collection && results.length > 0 ) {
      return this.setState({results: results});
    }
    else {
      return this.setState({results: []});
    }
  }
}

export default SearchStore;
