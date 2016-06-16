# mpc.js

mpc.js is a full-featured javascript client library for the [Music Player Daemon](https://www.musicpd.org/).

It features a Promise-based API, type definitions for [Typescript](https://www.typescriptlang.org/)
and works in both [node.js](https://nodejs.org/) and current browsers (connecting to mpd through a
WebSocket bridge like [websockify](https://github.com/kanaka/websockify)).

## API documentation

Typedoc-generated API documentation is available [here](https://hbenl.github.io/mpc-js/typedoc/classes/_mpc_.mpc.html).

## Examples

Install mpc.js

```
npm install mpc-js
```

Then create a client

```
var MPC = require('mpc-js').MPC;
var mpc = new MPC();
```

and connect to mpd

```
// via TCP
mpc.connectTCP('localhost', 6600);

// ... or a Unix socket
mpc.connectUnixSocket('/run/mpd/socket');

// ... or a WebSocket
mpc.connectWebSocket('ws://localhost:8000/');
```

### Controlling playback

```
mpc.playback.play();

mpc.playback.next();

mpc.playback.stop();
```

### Changing the current playlist

Clear the playlist and add a directory

```
mpc.currentPlaylist.clear();

mpc.currentPlaylist.add('ambient/Loscil/2010 - Endless Falls');
```

Search the playlist for songs whose title contains 'dub' and delete them

```
mpc.currentPlaylist.playlistSearch('Title', 'dub').then(
	items => items.forEach(item => mpc.currentPlaylist.deleteId(item.id)));
```

### Observing state changes

```
mpc.on('changed-player', () => { 
	mpc.status.status().then(status => { 
		if (status.state == 'play') { 
			mpc.status.currentSong().then(song => console.log(`Playing '${song.title}'`));
		} else {
			console.log('Stopped playback');
		}
	});
});

mpc.play();
Playing 'Lake Orchard'

mpc.stop();
Stopped playback
```

### Exploring the mpd database

List the contents of a directory

```
mpc.database.listFiles('ambient/Loscil/2010 - Endless Falls').then(console.log);

[ File {
    entryType: 'file',
    path: '01. Endless Falls.mp3',
    lastModified: 2014-07-03T18:28:07.000Z,
    size: 19280819 },
  File {
    entryType: 'file',
    path: '02. Estuarine.mp3',
    lastModified: 2014-07-03T18:29:15.000Z,
    size: 20292272 },
(...)
]
```

List metadata for the contents of a directory

```
mpc.database.listInfo('ambient/Loscil/2010 - Endless Falls').then(console.log);

[ Song {
    entryType: 'song',
    path: 'ambient/Loscil/2010 - Endless Falls/01. Endless Falls.mp3',
    lastModified: 2014-07-03T18:28:07.000Z,
    title: 'Endless Falls',
    name: undefined,
    artist: 'Loscil',
    artistSort: undefined,
    composer: undefined,
    performer: undefined,
    album: 'Endless Falls',
    albumSort: undefined,
    albumArtist: 'Loscil',
    albumArtistSort: undefined,
    track: '01/08',
    disc: undefined,
    date: '2010',
    genre: 'Experimental, Ambient',
    comment: undefined,
    musicBrainzArtistId: undefined,
    musicBrainzAlbumId: undefined,
    musicBrainzAlbumArtistId: undefined,
    musicBrainzTrackId: undefined,
    musicBrainzReleaseTrackId: undefined,
    duration: 475 },
(...)
]
```

List song titles from Loscil in 2006, grouped by album

```
mpc.database.list('Title', [['Artist', 'Loscil'], ['Date', '2006']], ['Album']).then(console.log);

Map {
  [ 'Stases' ] => [ 'B15-A', 'Biced', 'Cotom', 'Faint Liquid', 'Micro Hydro', 'Nautical2',
  'Resurgence', 'Sous-marin', 'Still Upon The Ocean Floor', 'Stratus', 'Subaquatic', 'Windless' ],
  [ 'Plume' ] => [ 'Bellows', 'Charlie', 'Chinook', 'Halcyon',
  'Mistral', 'Motoc', 'Rorschach', 'Steam', 'Zephyr' ],
  [ 'Idol Tryouts Two: Ghostly International Vol. Two' ] => [ 'Umbra' ] }

```
