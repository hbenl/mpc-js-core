import { getOptionalDate } from '../util';

export class StoredPlaylist {

	name: string;
	lastModified?: Date;

	constructor(valueMap: Map<string, string>) {

		if (!valueMap.has('playlist')) throw new Error('Name not found for StoredPlaylist object');

		this.name = valueMap.get('playlist')!;
		this.lastModified = getOptionalDate(valueMap, 'Last-Modified');
	}
}

export class PlaylistItem {

	id: number;
	position: number;
	title?: string;
	name?: string;
	artist?: string;
	album?: string;
	albumArtist?: string;
	date?: string;
	genre?: string;
	duration?: number;
	path?: string;
	lastModified?: Date;

	constructor(valueMap: Map<string, string>) {

		if (!valueMap.has('Id')) throw new Error('ID not found for PlaylistItem object');
		if (!valueMap.has('Pos')) throw new Error('Position not found for PlaylistItem object');

		this.id = Number(valueMap.get('Id'));
		this.position = Number(valueMap.get('Pos'));
		this.title = valueMap.get('Title');
		this.name = valueMap.get('Name');
		this.artist = valueMap.get('Artist');
		this.album = valueMap.get('Album');
		this.albumArtist = valueMap.get('AlbumArtist');
		this.date = valueMap.get('Date');
		this.genre = valueMap.get('Genre');
		this.duration = valueMap.has('Time') ? Number(valueMap.get('Time')) : undefined;
		this.path = valueMap.get('file');
		this.lastModified = getOptionalDate(valueMap, 'Last-Modified');
	}
}

export class SongIdAndPosition {

	songId: number;
	position: number;

	constructor(valueMap: Map<string, string>) {
		this.songId = Number(valueMap.get('Id'));
		this.position = Number(valueMap.get('cpos'));
	}
}
