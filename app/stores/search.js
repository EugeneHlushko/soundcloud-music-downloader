import debug from 'debug';

class SearchStore {

  constructor() {
    this.bindActions(this.alt.getActions('search'));
    this.results = [];
  }

  onSearchSuccess(results) {
    debug('dev')('received results in onSearchSuccess: ', results);
    debug('dev')('results.length is', results.collection.length);
    if ( results.collection.length > 0 ) {
      return this.setState({results: results.collection});
    }
    else {
      return this.setState({results: []});
    }
  }
}

export default SearchStore;
