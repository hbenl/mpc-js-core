import { MPDProtocol } from '../protocol';

export class PlaybackCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Begins playing the playlist at song number songPos.
	 */
	play(songPos: number) {
		let cmd = `play ${songPos}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Begins playing the playlist at song with the given songid.
	 */
	playId(songId: number) {
		let cmd = `playId ${songId}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Plays the previous song in the playlist.
	 */
	previous(): Promise<void> {
		return this.protocol.sendCommand('previous').then(() => {});
	}

	/**
	 * Plays the next song in the playlist.
	 */
	next(): Promise<void> {
		return this.protocol.sendCommand('next').then(() => {});
	}

	/**
	 * Seeks to the position time (in seconds; fractions allowed) of entry songPos in the playlist.
	 */
	seek(songPos: number, time: number) {
		let cmd = `seek ${songPos} ${time}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Seeks to the position time (in seconds; fractions allowed) of song with the given songId. 
	 */
	seekId(time: number) {
		let cmd = `seekcur ${time}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Seeks to the position time (in seconds; fractions allowed) within the current song.
	 * If relative is true, then the time is relative to the current playing position. 
	 */
	seekCur(time: number, relative = false) {
		let cmd: string; 
		if (relative && (time >= 0)) {
			cmd = `seekcur +${time}`;
		} else {
			cmd = `seekcur ${time}`;
		}
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Pauses or resumes playback.
	 */
	pause(pause: boolean): Promise<void> {
		let cmd = `pause ${pause ? 1 : 0}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Stops playing.
	 */
	stop(): Promise<void> {
		return this.protocol.sendCommand('stop').then(() => {});
	}

}
