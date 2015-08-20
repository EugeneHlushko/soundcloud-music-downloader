import React, {Component, PropTypes} from 'react';
import {IntlMixin} from 'react-intl';
const CSSTransitionGroup = React.addons.CSSTransitionGroup;
import debug from 'debug';

if (process.env.BROWSER) {
  require('styles/tracks.scss');
}

class Tracks extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    locales: PropTypes.array.isRequired,
    tracks: PropTypes.array.isRequired
  }

  _getIntlMessage = IntlMixin.getIntlMessage

  componentWillMount() {
    debug('dev')('Tracks component WILL MOUNT, state is', this.props.tracks);
  }

  componentDidMount() {
    debug('dev')('Tracks component mounted, state is', this.props.tracks);
  }

  _renderTracks = (pls) => {
    return (
      <div className='track cfx' key={pls.id} uri={pls.uri}>
        <div className='track--id'>
          {pls.id}
        </div>
        <div className='track--title'>
          {pls.title}
        </div>
        <div className='track--actions'>
          <div className='track--action dl'>
            {this._getIntlMessage('playlists.action.dl')}
          </div>
        </div>
      </div>
    );
  }

  render() {
    let tracks = (this.props.tracks.length > 0) ? this.props.tracks : [];
    let _tracksActive = (tracks.length > 0)
      ? 'appTracks cfx active'
      : 'appTracks cfx';

    return (
      <section className={_tracksActive}>
        <h1>{this._getIntlMessage('tracks.header')}</h1>

        <div className='appTracks--bulk cfx'>
          <div className='track headingrow cfx'>
            <div className='track--id'>
              {this._getIntlMessage('tracks.id')}
            </div>
            <div className='track--title'>
              {this._getIntlMessage('tracks.title')}
            </div>
            <div className='track--actions'>
              {this._getIntlMessage('playlists.actions')}
            </div>
          </div>
          <CSSTransitionGroup component="div" transitionName="fade" transitionAppear={true} transitionLeave={true}>
          {
            tracks.map(this._renderTracks)
          }
          </CSSTransitionGroup>
        </div>
      </section>
    );
  }

}

export default Tracks;
