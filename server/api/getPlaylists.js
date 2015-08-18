import debug from 'debug'
import url from 'url'
import route from 'koa-route'
import https from 'https'
import http from 'http'

// http://api.soundcloud.com/playlists/405726?client_id=YOUR_CLIENT_ID
//  https://soundcloud.com/eugenehlushko
const settings = {  
  resolveUrl: 'http://api.soundcloud.com/resolve.json',
  requiredKeys: [
    'client_id',
    'url'
  ]
};

export default route.get(
  '/getPlaylists',
  function *() {
    
    var prv = this;
    let _query = url.parse(prv.request.url, true).query;
    var _missingParams = [];
    
    let isMissingParam = () => {
      settings.requiredKeys.forEach((key)=> {
        debug('dev')('iterating: ',key, ' and result would be ', hasOwnProperty.call(_query, key));
        if (!hasOwnProperty.call(_query, key)) {
          _missingParams.push(key);          
        }
      });
      return ( _missingParams.length ) ? true : false;
    };
    
//    if ( isMissingParam() ) {
//      this.body = 'its BAD: '+JSON.stringify(_missingParams);
//    } else {
//      this.body = 'its GOOD: '+JSON.stringify(_missingParams);
//    }
    
    // here we get track list from a given album url
    var _playlistsByUserIdResponse = yield (callback) => {      
      let url = settings.resolveUrl;
      let first = true;
      settings.requiredKeys.forEach((key)=> {
        url += (first) ? '?' : '&';
        if ( first ) first = false;        
        if ( key == 'url' ) {
          url += key+'=';
          url += ( _query[key].substr(-1) == '/' ) ? _query[key]+'sets/' : _query[key]+'/sets';
        } else {          
          url += key+'='+_query[key];
        }
      });
      let _resStr = '';
      debug('dev')('constructer url was: ', url);
      http.get(url, function(res) {
        let _data = '';
        res.on('data', (chunk) => {
          _data += chunk;
        });
        res.on('end', () => {
          _data = JSON.parse(_data);  
          if ( _data.status == '302 - Found' ) {            
            callback(null, _data);
          } else {
            callback(null, 'Error resolving tracklist');
          }
        });      
      });
    };
    
  
    if ( _playlistsByUserIdResponse.location ) {
      // fetch userid from url so we dont have to wait for another response from server to get full user info,
      // we just need an id here to fetch playlists      
      var _playlistsResponse = yield (callback) => {
//        let _userID = _userIdResponse.location.substring(_userIdResponse.location.lastIndexOf('/')+1).split('.')[0];
//        let _urlForPlaylists = settings.apiUrl+'/'+_userID+'?client_id='+_query.client_id;
        
        https.get(_playlistsByUserIdResponse.location, function(res) {
          let _data = '';
          res.on('data', (chunk) => {
            _data += chunk;
          });
          res.on('end', () => {
            _data = JSON.parse(_data);
            callback(null, _data);
          });      
        });
      }      
    } else {
      this.body = _playlistsByUserIdResponse;
    }
    
    // after we got playlist response, see if its applicable.
    if ( _playlistsResponse && _playlistsResponse.length ) {
      this.body = _playlistsResponse;
    } else {
      this.body = 'no playlist response';
    }

  }
)