import Alt from 'alt';
import AltResolver from './alt-resolver';

class Flux extends Alt {

  constructor(config = {}) {
    super(config);

    this._resolver = new AltResolver();

    ['requests', 'locale', 'form', 'page-title', 'client', 'playlists']
      .map(this.registerCouple);
  }

  registerCouple = (name) => {
    this.addActions(name, require(`actions/${name}`));
    this.addStore(name, require(`stores/${name}`));
  }

  resolve(result) {
    this._resolver.resolve(result);
  }

  render(handler) {
    return this._resolver.render(handler, this);
  }
}

export default Flux;
