import debug from 'debug'
import fs from 'fs'
import url from 'url'
import route from 'koa-route'
import https from 'https'
import sanitize from 'sanitize-filename'
import prepareDir from '../helpers/prepareDir'
import archiver from 'archiver'
import path from 'path'
import zip from 'zipfolder'

const settings = {
  apiUrl: 'http://api.soundcloud.com/resolve.json',
  requiredKeys: ['title', 'stream_url', 'playlist_title', 'clientid']  
};

// expected params
// title - will use for file name
// stream_url - will use for construction download link
// clientid - will use for construction download link
// playlist_title - will use for download directory

export default route.get(
  '/downloadPlaylistTracks',
  function *() {
    const prv = this;
    const _toClientResponse = {
      err: [],
    };
    let _query = url.parse(prv.request.url, true).query;
    
    // construct url, and first see if all required params passed in
    const _missingParams = [];
    
    let isMissingParam = () => {
      settings.requiredKeys.forEach((key)=> {
        debug('dev')('iterating: ',key, ' and result would be ', hasOwnProperty.call(_query, key));
        if (!hasOwnProperty.call(_query, key)) {
          _missingParams.push(key);          
        }
      });
      return ( _missingParams.length ) ? true : false;
    };
    
    // dirname by playlist title
    var _dirName = sanitize(_query.playlist_title).replace(/\s/g, '_').toLowerCase();
    var _dir = ( isMissingParam() ) ? false : prepareDir(_dirName);
    
    if ( _missingParams.length == 0 && _dir ) {
      debug('koa')('will download this song: ', _query.title); 
      let _filename = _dir+'/'+sanitize(_query.title).replace(/\s/g, '_').toLowerCase()+'.mp3';
      let file = fs.createWriteStream(_filename);      
      let str = '';
      yield (callback) => {      
        https.get(_query.stream_url+'?client_id='+_query.clientid, function(res) {
          res.on('data', function (chunk) {
            str += chunk;
          });
          res.on('end', function () {
            let _finalResponse = JSON.parse(str);
            debug('dev')('file location at:', _finalResponse.location);
            if ( _finalResponse.status == '302 - Found' ) {            
              https.get(_finalResponse.location, function(__response) {
                __response.pipe(file);
                _toClientResponse.success = 'finished downloading '+_filename;
                callback(null, console.log('finished downloading '+_filename));
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
    } else {
      _toClientResponse.err.push('Didnt have _dir created or missing params occured', _missingParams);
    }
    
    // if we need to make a zip of the folder
    if ( _missingParams.length == 0 && _dir && _query.makeZip ) {
//      let target_dir = 'downloaded/';
//      let _fileNamePath = target_dir+_dirName+'.zip';
//      // remove old zip if exists
//      if ( fs.existsSync(_fileNamePath) )
//        fs.unlinkSync(_fileNamePath);      

      
//      let output = fs.createWriteStream(_fileNamePath);
//      let archive = archiver('zip');
//
//      output.on('close', function () {
//        debug('dev')(archive.pointer() + ' total bytes');          
//        debug('dev')('finalized zip all good');
//        _toClientResponse.zip = target_dir+_dirName+'.zip';
//      });
//
//      archive.on('error', function(err){
//        throw err;
//      });      

      
//      let _filesInPlaylist = fs.readdirSync(_dir);      
//      _filesInPlaylist.map( (item) => {
//        let _filepath = './'+target_dir+_dirName+'/'+item;
//        debug('dev')('i got filepath: ');
////        // This line opens the file as a readable stream
//        let readStream = fs.readFileSync(_filepath);
//        archive.append(new Buffer(readStream), { name:'file.mp3' });
//      });

////      archive.pipe(output);
////      
//      archive.bulk([
//        { expand: true, cwd: _dir, src: ['*.mp3'] }
//      ]);
//      archive.finalize();    
    }
    
    // here we send response to client
    this.body = JSON.stringify(_toClientResponse);
  }
)