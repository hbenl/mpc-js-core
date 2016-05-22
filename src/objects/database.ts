/**
 * The types of objects in the music database
 */
declare type DirectoryEntryType = 'song' | 'playlist' | 'directory';

/**
 * Base class for objects in the music database.
 */
export class DirectoryEntry {

	path: string;
	lastModified: Date;
	entryType: DirectoryEntryType;

	static fromValueMap(valueMap: Map<string, string>): DirectoryEntry {
		if (valueMap.get('file')) {
			return new Song(valueMap);
		} else if (valueMap.get('directory')) {
			return new Directory(valueMap);
		} else if (valueMap.get('playlist')) {
			return new Playlist(valueMap);
		}
	}
}

export class Song extends DirectoryEntry {

	title: string;
	artist: string;
	album: string;
	albumArtist: string;
	date: string;
	genre: string;
	duration: number;

	constructor(valueMap: Map<string, string>) {
		super();
		this.entryType = 'song';
		this.path = valueMap.get('file');
		this.lastModified = new Date(valueMap.get('Last-Modified'));
		this.title = valueMap.get('Title');
		this.artist = valueMap.get('Artist');
		this.album = valueMap.get('Album');
		this.albumArtist = valueMap.get('AlbumArtist');
		this.date = valueMap.get('Date');
		this.genre = valueMap.get('Genre');
		this.duration = Number(valueMap.get('Time'));
	}
}

export class Playlist extends DirectoryEntry {

	constructor(valueMap: Map<string, string>) {
		super();
		this.entryType = 'playlist';
		this.path = valueMap.get('playlist');
		this.lastModified = new Date(valueMap.get('Last-Modified'));
	}
}

export class Directory extends DirectoryEntry {

	constructor(valueMap: Map<string, string>) {
		super();
		this.entryType = 'directory';
		this.path = valueMap.get('directory');
		this.lastModified = new Date(valueMap.get('Last-Modified'));
	}
}
