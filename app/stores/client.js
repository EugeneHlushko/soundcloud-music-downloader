import debug from 'debug';

const Cookies = (process.env.BROWSER) ? require('cookies-js') : false;

class ClientStore {

  constructor() {
    this.bindActions(this.alt.getActions('client'));
    this.clientid = (Cookies) ? Cookies.get('_clientid') : '';
    debug('dev')('i have set clientid and it is now', this.clientid);
  }

  static getClientid() {
    return ( Cookies && !this.getState().clientid ) ? Cookies.get('_clientid') : this.getState().clientid;
  }

  onSwitchClientidSuccess(clientid) {
    debug('dev')('received clientid in success: ', clientid);
    if (process.env.BROWSER) {
      Cookies.set('_clientid', clientid, {expires: Infinity});
      debug('dev')(`updated _clientid cookie to ${clientid}`);
    }

    return this.setState({clientid});
  }

}

export default ClientStore;
