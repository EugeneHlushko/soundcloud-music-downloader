export default {
  messages: {
    header: {
      form: 'Users List',
      getLists: 'Get playlists',
      getTracksByUser: 'Get tracks by user',
      search: 'Search audio by keyword',
      heading: 'FOR TESTING PURPOSES ONLY! You must remove downloaded content if it violates any of the rights, copyrights of content respective owners!'
    },
    playlists: {
      'page-title': 'Playlists',
      title: 'Playlists.....:',
      fetchbtn: 'Fetch Playlists',
      id: 'ID',
      pltitle: 'Playlist name',
      tcount: 'Tracks count:',
      actions: 'Actions',
      action: {
        view: 'Browse',
        dl: 'Download'
      },
      pltracks: 'Playlist tracks'
    },
    tracks: {
      header: 'Construct your own playlists',
      id: 'ID',
      title: 'Track title',
      add: 'Add to current selection'
    },
    protected: {
      'page-title': 'Protected Page'
    },
    profile: {
      'page-title': 'Profile - {fullName}',
      'not-found-page-title': 'User profile not found'
    },
    form: {
      'page-title': 'Welcome! Provide details..',
      title: 'Choose an action',
      err: 'You must provide a client_id'
    },
    routes: {
      getLists: '/playlists',
      getTracksByUser: '/tracksbyuser',
      search: '/search'
    }
  }
};