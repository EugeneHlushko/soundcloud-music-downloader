import React, {Component, PropTypes} from 'react';

class Clientid extends Component {

  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    flux: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.state = {
      clientid: this.props.flux
        .getStore('client')
        .getClientid()
    };
  }

  componentDidMount() {
    this.props.flux
      .getStore('client')
      .listen(this._handleStoreChange);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('client')
      .unlisten(this._handleStoreChange);
  }

  _handleStoreChange = (event) => {
//    this.setState({clientid: event.target.value});
    return this.props.flux.getActions('client').switchClientid({clientid: event.target.value});
  }

  render() {
    return (
      <div className="clientid--holder">
        <label>client_id</label>
        <input
          value={this.state.clientid}
          onChange={this._handleStoreChange}
            />
      </div>
    );
  }

}

export default Clientid;
