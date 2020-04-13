import { getOptionalDate } from '../util';

/**
 * The types of objects in the music database
 */
export declare type DirectoryEntryType = 'file' | 'song' | 'playlist' | 'directory';

/**
 * Base class for objects in the music database.
 */
export class DirectoryEntry {

	path: string;
	lastModified?: Date;
	entryType: DirectoryEntryType;

	constructor(valueMap: Map<string, string>, pathKey: string, entryType: DirectoryEntryType) {

		if (!valueMap.has(pathKey)) throw new Error('Path not found for DirectoryEntry object');

		this.entryType = entryType;
		this.path = valueMap.get(pathKey)!;
		this.lastModified = getOptionalDate(valueMap,'Last-Modified');
	}

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
		} else {
			const keys = [ ...valueMap.keys() ].map(key => `'${key}'`).join(', ');
			throw new Error(`Couldn't determine type of directory entry with keys ${keys}`)
		}
	}

	isFile(): this is File { return this.entryType === 'file'; }
	isSong(): this is Song { return this.entryType === 'song'; }
	isPlaylist(): this is Playlist { return this.entryType === 'playlist'; }
	isDirectory(): this is Directory { return this.entryType === 'directory'; }
}

export class File extends DirectoryEntry {

	entryType!: 'file';
	size?: number;

	constructor(valueMap: Map<string, string>) {
		super(valueMap, 'file', 'file');
		this.size = valueMap.has('size') ? Number(valueMap.get('size')) : undefined;
	}
}

export class Song extends DirectoryEntry {

	entryType!: 'song';
	title?: string;
	name?: string;
	artist?: string;
	artistSort?: string;
	composer?: string;
	performer?: string;
	album?: string;
	albumSort?: string;
	albumArtist?: string;
	albumArtistSort?: string;
	track?: string;
	disc?: string;
	date?: string;
	genre?: string;
	comment?: string;
	musicBrainzArtistId?: string;
	musicBrainzAlbumId?: string;
	musicBrainzAlbumArtistId?: string;
	musicBrainzTrackId?: string;
	musicBrainzReleaseTrackId?: string;
	duration?: number;

	constructor(valueMap: Map<string, string>) {
		super(valueMap, 'file', 'song');
		this.title = valueMap.get('Title');
		this.name =  valueMap.get('Name');
		this.artist = valueMap.get('Artist');
		this.artistSort = valueMap.get('ArtistSort');
		this.composer = valueMap.get('Composer');
		this.performer = valueMap.get('Performer');
		this.album = valueMap.get('Album');
		this.albumSort = valueMap.get('AlbumSort');
		this.albumArtist = valueMap.get('AlbumArtist');
		this.albumArtistSort = valueMap.get('AlbumArtistSort');
		this.track = valueMap.get('Track');
		this.disc = valueMap.get('Disc');
		this.date = valueMap.get('Date');
		this.genre = valueMap.get('Genre');
		this.comment = valueMap.get('Comment');
		this.musicBrainzArtistId = valueMap.get('MUSICBRAINZ_ARTISTID');
		this.musicBrainzAlbumId = valueMap.get('MUSICBRAINZ_ALBUMID');
		this.musicBrainzAlbumArtistId = valueMap.get('MUSICBRAINZ_ALBUMARTISTID');
		this.musicBrainzTrackId = valueMap.get('MUSICBRAINZ_TRACKID');
		this.musicBrainzReleaseTrackId = valueMap.get('MUSICBRAINZ_RELEASETRACKID');
		this.duration = valueMap.has('Time') ? Number(valueMap.get('Time')) : undefined;
	}
}

export class Playlist extends DirectoryEntry {

	entryType!: 'playlist';

	constructor(valueMap: Map<string, string>) {
		super(valueMap, 'playlist', 'playlist');
	}
}

export class Directory extends DirectoryEntry {

	entryType!: 'directory';

	constructor(valueMap: Map<string, string>) {
		super(valueMap, 'directory', 'directory');
	}
}

export class SongCount {

	songs: number;
	playtime: number;

	constructor(valueMap: Map<string, string>) {

		if (!valueMap.has('songs')) throw new Error('Number of songs not found for SongCount object');
		if (!valueMap.has('playtime')) throw new Error('Playtime of songs not found for SongCount object');

		this.songs = Number(valueMap.get('songs'));
		this.playtime = Number(valueMap.get('playtime'));
	}
}

export class GroupedSongCount extends SongCount {

	group: string;

	constructor(valueMap: Map<string, string>, groupingTag: string) {
		super(valueMap);

		if (!valueMap.has(groupingTag)) throw new Error(`'${groupingTag}' not found for GroupedSongCount object`);

		this.group = valueMap.get(groupingTag)!;
	}
}
