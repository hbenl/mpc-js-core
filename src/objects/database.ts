/**
 * The types of objects in the music database
 */
declare type DirectoryEntryType = 'file' | 'song' | 'playlist' | 'directory';

/**
 * Base class for objects in the music database.
 */
export class DirectoryEntry {

	path: string;
	lastModified: Date;
	entryType: DirectoryEntryType;

	static fromValueMap(valueMap: Map<string, string>, withMetadata = true): DirectoryEntry {
		if (valueMap.get('file')) {
			if (withMetadata) {
				return new Song(valueMap);
			} else {
				return new File(valueMap);
			}
		} else if (valueMap.get('directory')) {
			return new Directory(valueMap);
		} else if (valueMap.get('playlist')) {
			return new Playlist(valueMap);
		}
	}
}

export class File extends DirectoryEntry {

	size: number;

	constructor(valueMap: Map<string, string>) {
		super();
		this.entryType = 'file';
		this.path = valueMap.get('file');
		this.lastModified = new Date(valueMap.get('Last-Modified'));
		this.size = Number(valueMap.get('size'));
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

export class SongCount {

	songs: number;
	playtime: number;

	constructor(valueMap: Map<string, string>) {
		this.songs = Number(valueMap.get('songs'));
		this.playtime = Number(valueMap.get('playtime'));
	}
}

export class GroupedSongCount extends SongCount {

	group: string;

	constructor(valueMap: Map<string, string>, groupingTag: string) {
		super(valueMap);
		this.group = valueMap.get(groupingTag);
	}
}
