# ES6 Isomorphic flux app to download streamable mp3 from soundcloud.com

## Installation
  clone the project
  run npm install
  
## Running the project
  open console inside of project directory and do: npm run dev ( prod version probably not needed for this project )
  Visit http://localhost:3000
  Provide your client_id ( will be used to authenticate you in soundcloud API )
  Go to "Get playlists"
  Paste URL to your or someone's profile in format https://soundcloud.com/username ofcourse we replace username for real user.
  Make sure that node has rights to create dirs, it will create directory ./downloaded and download playlists into seperate folders
  
## TODOs:
  ~~Browse playlist, download track from list ( one, stream to browser as download, pretend this is a web service, just for experience )~~
  Search page: search tracks from soundcloud, download button per track ( also streamable to browser as DL )
  Add authentication of "user" through soundcloud if its applicable ( probably not, will require web app registration )
  
# DO NOT DOWNLOAD ANY .mp3 FILES WHICH ARE RESTRICTED OR PROTECTED BY LICENSE, YOU ARE RESPONSIBLE FOR THIS YOURSELF, REMEMBER THIS!