# mpc.js

mpc.js is a javascript client library for the [Music Player Daemon](https://www.musicpd.org/).

It features a Promise-based API for all [mpd commands](https://www.musicpd.org/doc/protocol/command_reference.html),
type definitions for [Typescript](https://www.typescriptlang.org/) and works in both 
[node.js](https://nodejs.org/) and current browsers (connecting to mpd through a WebSocket bridge 
like [websockify](https://github.com/kanaka/websockify)).

## Documentation

### npm package

Install with
```
npm install mpc-js
```
and import with
```
import { MPC } from 'mpc-js';
```
or
```
var MPC = require('mpc-js').MPC;
```

### bower package

Install with
```
bower install mpc-js
```
and import with
```
<script src="bower_components/mpc-js/index.js"></script>
```

### Typescript projects

The npm package contains type definitions that will be picked up by the TypeScript compiler automatically.
Since the API of mpc.js uses ES6 promises, collections and node.js's EventEmitter, you will have to
install typings for those as well, e.g.
```
typings install --global --save env~es2015-promise env~es2015-collections env~node
```

### Web projects

If you want to use mpc.js in the browser you can either process it with [browserify](http://browserify.org/)
yourself or use the bower package, which has already been browserified.

Since you can't use TCP or Unix socket connections in the browser, you'll need to set up a WebSocket
bridge, e.g.
```
websockify --web <path/to/your/webapp> 8000 localhost:6600
```
Now if you open your web application at `http://localhost:8000/index.html` you can connect to mpd using
```
mpc.connectWebSocket('ws://localhost:8000/');
```

### API

[Typedoc](http://typedoc.io/)-generated API documentation is available [here](https://hbenl.github.io/mpc-js/typedoc/classes/_mpc_.mpc.html).

### Events

The following events are emitted by the client:

* `ready` - The connection to mpd has been initialized
* `changed` - There was a change in one or more of mpd's subsystems, the list of changed subsystems
  is passed to the event listeners. This list may contain:
  * `database` - the song database has been modified after `update`
  * `update` - a database update has started or finished; if the database was modified during the update, the `database` event is also emitted
  * `stored_playlist` - a stored playlist has been modified, renamed, created or deleted
  * `playlist` - the current playlist has been modified
  * `player` - the player has been started, stopped or seeked
  * `mixer` - the volume has been changed
  * `output` - an audio output has been enabled or disabled
  * `options` - options like `repeat`, `random`, `crossfade`, replay gain
  * `sticker` - the sticker database has been modified
  * `subscription`: a client has subscribed or unsubscribed to a channel
  * `message`: a message was received on a channel this client is subscribed to; this event is only emitted when the queue is empty
* `changed-<subsystem>` - There was a change in `<subsystem>`

## Examples

Create a client and connect to mpd
```
var mpc = new MPC();

// connect via TCP (when running in node.js)
mpc.connectTCP('localhost', 6600);

// ... or a Unix socket (when running in node.js)
mpc.connectUnixSocket('/run/mpd/socket');

// ... or a WebSocket (when running in a browser)
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

mpc.playback.play();
Playing 'Lake Orchard'

mpc.playback.stop();
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
