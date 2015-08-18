import React from 'react';
import {Route} from 'react-router';
import {generateRoute} from 'utils/localized-routes';

export default (
  <Route component={require('./components/app')}>
    {generateRoute({
      paths: ['/'],
      component: require('./components/form')
    })}
    {generateRoute({
      paths: ['/playlists'],
      component: require('./components/playlists')
    })}
    <Route path='*' component={require('./pages/not-found')} />
  </Route>
);
