import debug from 'debug';

class ClientActions {
  constructor() {
    this.generateActions('switchClientidSuccess');
  }

  switchClientid(data) {
    debug('dev')('received client id: ', data);
    if (data.clientid) {
      return this.actions.switchClientidSuccess(data.clientid);
    }
  }
}

export default ClientActions;
