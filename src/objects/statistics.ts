export class Statistics {

	/**
	 * the number of artists in the database
	 */
	artists: number;

	/**
	 * the number of albums in the database
	 */
	albums: number;

	/**
	 * the number of sonds in the database
	 */
	songs: number;

	/**
	 * daemon uptime in seconds
	 */
	uptime: number;

	/**
	 * sum of all song lengths in the database in seconds
	 */
	dbPlaytime: number;

	/**
	 * time of last database update
	 */
	dbUpdate: Date;

	/**
	 * time length in seconds of music played
	 */
	playtime: number;

	constructor(valueMap: Map<string, string>) {
		this.artists = Number(valueMap.get('artists'));
		this.albums = Number(valueMap.get('albums'));
		this.songs = Number(valueMap.get('songs'));
		this.uptime = Number(valueMap.get('uptime'));
		this.dbPlaytime = Number(valueMap.get('db_playtime'));
		this.dbUpdate = new Date(Number(valueMap.get('db_update')) * 1000);
		this.playtime = Number(valueMap.get('playtime'));
	}
}