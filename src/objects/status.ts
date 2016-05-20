/**
 * The current status of the player
 */
export class Status {

	state: 'play' | 'stop' | 'pause';

	/**
	 * index of the currently playing or stopped on song within the playlist
	 */
	song: number;

	/**
	 * playlist songid of the currently playing or stopped on song
	 */
	songId: number;

	/**
	 * index of the next song within the playlist
	 */
	nextSong: number;

	/**
	 * playlist songid of the next song
	 */
	nextSongId: number;

	/**
	 * total time elapsed within the current song in seconds
	 */
	elapsed: number;

	/**
	 * duration of the current song in seconds
	 */
	duration: number;

	/**
	 * current bitrate in kbps
	 */
	bitRate: number;

	sampleRate: number;

	bitDepth: number;

	channels: number;

	/**
	 * 0-100
	 */
	volume: number;

	/**
	 * crossfade in seconds
	 */
	xfade: number;

	/**
	 * mixramp threshold in dB
	 */
	mixrampdb: number;

	/**
	 * mixramp delay in seconds
	 */
	mixrampDelay: number;

	/**
	 * 31-bit unsigned integer, the playlist version number
	 */
	playlistVersion: number;

	playlistLength: number;

	repeat: boolean;

	random: boolean;

	single: boolean;

	consume: boolean;

	/**
	 * update job id
	 */
	updating: number;

	error: string;

	private static audioRegEx = /([0-9]+):([0-9]+):([0-9]+)/;

	constructor(valueMap: Map<string, string>) {
		this.state = <'play' | 'stop' | 'pause'>valueMap.get('state');
		this.song = Number(valueMap.get('song'));
		this.songId = Number(valueMap.get('songid'));
		this.nextSong = Number(valueMap.get('nextsong'));
		this.nextSongId = Number(valueMap.get('nextsongid'));
		this.elapsed = Number(valueMap.get('elapsed'));
		this.duration = Number(valueMap.get('duration'));
		this.bitRate = Number(valueMap.get('bitrate'));
		let audio = valueMap.get('audio');
		if (audio) {
			let match = audio.match(Status.audioRegEx);
			this.sampleRate = Number(match[1]);
			this.bitDepth = Number(match[2]);
			this.channels = Number(match[3]);
		}
		this.volume = Number(valueMap.get('volume'));
		this.xfade = Number(valueMap.get('xfade'));
		this.mixrampdb = Number(valueMap.get('mixrampdb'));
		this.mixrampDelay = Number(valueMap.get('mixrampdelay'));
		this.playlistVersion = Number(valueMap.get('playlist'));
		this.playlistLength = Number(valueMap.get('playlistlength'));
		this.repeat = Boolean(Number(valueMap.get('repeat')));
		this.random = Boolean(Number(valueMap.get('random')));
		this.single = Boolean(Number(valueMap.get('single')));
		this.consume = Boolean(Number(valueMap.get('consume')));
		this.updating = Number(valueMap.get('updating_db'));
		this.error = valueMap.get('error');
	}
}
