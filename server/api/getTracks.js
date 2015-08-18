import debug from 'debug'
import fs from 'fs'
import url from 'url'
import route from 'koa-route'
import https from 'https';
import http from 'http';
import sanitize from 'sanitize-filename';
import prepareDir from '../helpers/prepareDir';

const settings = {
  apiUrl: 'http://api.soundcloud.com/resolve.json',
  params: {
    url: 'https://soundcloud.com/eugene-hlushko/sets/music-for-road',
    client_id: '6257f39353886e32bbb8e57044999242'
  }  
};
// using a generator function
function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}

export default route.get(
  '/tracks',
  function *() {
    var prv = this;
    var _steps = {
      stepGetPlaylist: false
    };
    var _toClientResponse = {
      err: [],
    };
    
    // here we get track list from a given album url
    var _apiResponse = yield (callback) => {      
      let url = settings.apiUrl;
      let first = true;
      for (let [key, value] of entries(settings.params)) {
        url += (first) ? '?' : '&';
        if ( first ) first = false;   
        url += key+'='+value;
      }
      let _resStr = '';
      http.get(url, function(res) {
        let _data = '';
        res.on('data', (chunk) => {
          _data += chunk;
        });
        res.on('end', () => {
          _data = JSON.parse(_data);
          if ( _data.status == '302 - Found' ) {            
            https.get(_data.location, function(__response) {
              let _response_data = '';
              __response.on('data', (_chunk) => {
                _response_data += _chunk;
              });
              __response.on('end', () => {
                callback(null, JSON.parse(_response_data));
              });
            });
          } else {
            callback(null, console.log('Error resolving tracklist'));
          }
        });      
      });
    };
    
    if ( _apiResponse.title )
      _steps.stepGetPlaylist = true;
    else
      _toClientResponse.err.push('Could not fetch playlist information');
    
    // dirname by playlist title
    var _dirName = sanitize(_apiResponse.title);
    var _dir = prepareDir(_dirName);
    
    
    // here we download tracks if dir was created, if not, send error msg
    if ( _dir && _steps.stepGetPlaylist ) {
      for (let [key, value] of entries(_apiResponse.tracks)) {
        debug('koa')('will download this song: ', value.title); 
        let _filename = _dir+'/'+sanitize(value.title)+'.mp3';
        let file = fs.createWriteStream(_filename);
        let url = 'https://api.soundcloud.com/tracks/'+value.id+'/stream?client_id='+settings.params.client_id;
        let str = '';
        yield (callback) => {      
          https.get(url, function(res) {
            res.on('data', function (chunk) {
              str += chunk;
            });
            res.on('end', function () {
              let _finalResponse = JSON.parse(str);
              debug('dev')('file location at:', _finalResponse.location);
              if ( _finalResponse.status == '302 - Found' ) {            
                https.get(_finalResponse.location, function(__response) {
                  __response.pipe(file);
                  callback(null, console.log('finished downloading'+key+'.mp3'));
                  __response.on('error', function(err) {
                    debug('dev')('httpserrot occured', err);
                  });
                });
              } else {
                callback(null, console.log('Error downloading'+_filename));
              }
            });
            res.on('error', function(err) {
              debug('dev')('httpserrot occured', err);
            });
          });
        };
      }
      _toClientResponse.downloaded = 'success';
    } else {
      _toClientResponse.err.push('could not create dir: '+_dirName);
    }
    
    // here we send response to client
    this.body = JSON.stringify(_toClientResponse);
  }
)