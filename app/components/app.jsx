import React, {Component, PropTypes} from 'react/addons';
import debug from 'debug';

import Header from 'components/header';
import Footer from 'components/footer';
import Tracks from 'components/tracks';

if (process.env.BROWSER) {
  require('styles/main.scss');
}

class App extends Component {

  static propTypes = {
    flux: PropTypes.object.isRequired,
    children: PropTypes.element
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      i18n: props.flux
        .getStore('locale')
        .getState(),
      clientid: props.flux
        .getStore('client')
        .getState(),
      tracks: props.flux
        .getStore('tracks')
        .getState().tracks
    };
  }

  componentDidMount() {
    this.props.flux
      .getStore('locale')
      .listen(this._handleLocaleChange);

    this.props.flux
      .getStore('page-title')
      .listen(this._handlePageTitleChange);

    this.props.flux
      .getStore('tracks')
      .listen(this._handleTrackChange);
  }

  componentWillUnmount() {
    this.props.flux
      .getStore('locale')
      .unlisten(this._handleLocaleChange);

    this.props.flux
      .getStore('page-title')
      .unlisten(this._handlePageTitleChange);

    this.props.flux
      .getStore('tracks')
      .unlisten(this._handleTrackChange);
  }

  _handleLocaleChange = (i18n) => {
    return this.setState({i18n});
  }

  _handleClientidChange = (clientid) => {
    return this.setState({clientid});
  }

  _handlePageTitleChange({title}) {
    document.title = title;
  }

  _handleTrackChange = (store) => {
    debug('dev')('YEAH handle the add track here man', store);

    return this.setState(store);
//    return this.setState({tracks: store.tracks});
  }

  _handleAddTrack = (track) => {
    this.props.flux.getActions('tracks').addTrack(track);
  }

  // If we have children components sent by `react-router`
  // we need to clone them and add them the correct
  // locale and messages sent from the Locale Store
  renderChild = (child) => {
    return React.addons
      .cloneWithProps(child, {...this.state.i18n, addTrack: this._handleAddTrack, allTracks: this.state.tracks});
  }

  render() {
    return (
      <div>
        <Header
          {...this.state.i18n}
          flux={this.props.flux} />
        {
          React.Children
            .map(this.props.children, this.renderChild)
        }
        <Tracks
          {...this.state.i18n}
          tracks={this.state.tracks}
          flux={this.props.flux} />
        <Footer
          {...this.state.i18n}
          clientid={this.state.clientid}
          flux={this.props.flux} />
      </div>
    );
  }

}

export default App;
