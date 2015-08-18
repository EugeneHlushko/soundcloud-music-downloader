import debug from 'debug';
import fs from 'fs';
// will create a dir, if failed will return false, if success will return dirpath for filewriting
export default (dir, firstRound) => {
  let _dldir = './downloaded/';
  let _dir = _dldir+dir;
  let _err = false;
  
  // first check if downloaded dir exists
  if ( firstRound && !fs.existsSync(_dldir) ) {
    fs.mkdirSync(_dldir, '0777', function(err) {
      _err = (err) ? true : false;
    });   
  }  
  // if dir already exists cleanup, else create a dir like always, if download dir not available
  // just return false
  if ( _err ) {
    return _err;
  }  
  else if ( firstRound && fs.existsSync(_dir) ) {
    // cleanup
    rmDir(_dir, true);
  }
  else if ( !fs.existsSync(_dir) ) {
    fs.mkdirSync(_dir, '0777', function(err) {
      _err = (err) ? true : false;
    });
  }
  return (_err) ? false : _dir;
};
// function to remove everything inside of the dir, pass false as 2nd argument if you
// dont want to remove the dir but only to clean it up
const rmDir = (dirPath, removeSelf) => {
  let files = [];
  if (removeSelf === undefined)
    removeSelf = true;
  try {
    files = fs.readdirSync(dirPath);
  }
  catch(e) {
    return;
  }
  
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      let filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
    if (removeSelf)
      fs.rmdirSync(dirPath);
}