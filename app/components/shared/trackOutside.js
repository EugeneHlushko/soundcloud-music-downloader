import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';
import debug from 'debug';

class TrackOutside extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    addTrack: PropTypes.object.isRequired,
    isIn: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired
  }

  _getIntlMessage = IntlMixin.getIntlMessage

  state = {
    i18n: this.props.flux
      .getStore('locale')
      .getState()
  }

  componentWillMount() {
    debug('dev')(this.props.flux
      .getStore('locale')
      .getState());
  }

  render() {
    let trackActionText = (this.props.isIn)
      ? this.state.i18n.messages.tracks.remove
      : this.state.i18n.messages.tracks.add;
    let actionClass = (this.props.isIn) ? 'track--action remove' : 'track--action';
    return (
      <div className='track cfx' key={this.props.item.id} uri={this.props.item.uri} >
        <div className='track--title'>
          {this.props.item.title}
        </div>
        <div className='track--actions'>
          <div className='track--action dl'>
            {this.state.i18n.messages.playlists.action.dl}
          </div>
          <div className={actionClass}
               onClick={this.props.addTrack.bind(this, this.props.item)} >
            {trackActionText}
          </div>
        </div>
      </div>
    );
  }

}

export default TrackOutside;
