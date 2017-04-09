import { MPDProtocol } from '../protocol';
import { PlaylistItem, SongIdAndPosition } from '../objects/playlists';

export class CurrentPlaylistCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Adds the file or directory `uri` to the playlist (directories add recursively).
	 */
	add(uri: string): Promise<void> {
		let cmd = `add "${uri}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Adds a song to the playlist (non-recursive) and returns the song id.
	 * `uri` is always a single file or URL.
	 */
	addId(uri: string, position?: number): Promise<number> {
		let cmd = `addid "${uri}"`;
		if (typeof position === 'number') {
			cmd += ` ${position}`;
		}
		return this.protocol.sendCommand(cmd).then((lines) => Number(lines[0].substring(4)));
	}

	/**
	 * Clears the current playlist.
	 */
	clear(): Promise<void> {
		return this.protocol.sendCommand('clear').then(() => {});
	}

	/**
	 * Deletes a song from the playlist.
	 */
	delete(position: number): Promise<void> {
		let cmd = `delete ${position}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Deletes a song range from the playlist.
	 */
	deleteRange(start: number, end?: number): Promise<void> {
		let cmd = `delete ${start}:`;
		if (typeof end === 'number') {
			cmd += end;
		}
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Deletes the song with the given songid from the playlist.
	 */
	deleteId(songId: number): Promise<void> {
		let cmd = `deleteid ${songId}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Moves the song at `from` to `to` in the playlist.
	 */
	move(from: number, to: number): Promise<void> {
		let cmd = `move ${from} ${to}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Moves the range of songs from `start` to `end` to `to` in the playlist.
	 */
	moveRange(start: number, end: number, to: number): Promise<void> {
		let cmd = `move ${start}:${end} ${to}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Moves the song with the given songid to `to` the playlist.
	 * If `to` is negative, it is relative to the current song in the playlist (if there is one).
	 */
	moveId(songId: number, to: number): Promise<void> {
		let cmd = `moveid ${songId} ${to}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Finds songs in the current playlist with strict matching.
	 */
	playlistFind(tag: string, needle: string): Promise<PlaylistItem[]> {
		let cmd = `playlistfind "${tag}" "${needle}"`;
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], (valueMap) => new PlaylistItem(valueMap)));
	}

	/**
	 * Searches case-insensitively for partial matches in the current playlist.
	 */
	playlistSearch(tag: string, needle: string): Promise<PlaylistItem[]> {
		let cmd = `playlistsearch "${tag}" "${needle}"`;
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], (valueMap) => new PlaylistItem(valueMap)));
	}

	/**
	 * Gets info for the song with the specified songid in the playlist.
	 */
	playlistId(songId: number): Promise<PlaylistItem> {
		let cmd = `playlistid ${songId}`;
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, [], (valueMap) => new PlaylistItem(valueMap))[0]);
	}

	/**
	 * Gets info for all songs or a single song in the playlist.
	 */
	playlistInfo(position?: number): Promise<PlaylistItem[]> {
		let cmd = 'playlistinfo';
		if (typeof position === 'number') {
			cmd += ` ${position}`;
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], (valueMap) => new PlaylistItem(valueMap)));
	}

	/**
	 * Gets info for a range of songs in the playlist.
	 */
	playlistRangeInfo(start: number, end?: number): Promise<PlaylistItem[]> {
		let cmd = `playlistinfo ${start}:`;
		if (typeof end === 'number') {
			cmd += `${end}`;
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], (valueMap) => new PlaylistItem(valueMap)));
	}

	/**
	 * Displays changed songs currently in the playlist since `version`. Start and end positions 
	 * may be given to limit the output to changes in the given range. To detect songs that were 
	 * deleted at the end of the playlist, use playlistlength returned by status command. 
	 */
	playlistChanges(version: number, start?: number, end?: number): Promise<PlaylistItem[]> {
		let cmd = `plchanges ${version}`;
		if (typeof start === 'number') {
			cmd += ` ${start}:`;
			if (typeof end === 'number') {
				cmd += end;
			}
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], (valueMap) => new PlaylistItem(valueMap)));
	}

	/**
	 * Displays changed songs currently in the playlist since `version`. This function only returns
	 * the position and the id of the changed song, not the complete metadata. This is more
	 * bandwidth efficient. To detect songs that were deleted at the end of the playlist, use 
	 * playlistlength returned by status command. 
	 */
	playlistChangesPosId(version: number, start?: number, end?: number): Promise<SongIdAndPosition[]> {
		let cmd = `plchangesposid ${version}`;
		if (typeof start === 'number') {
			cmd += ` ${start}:`;
			if (typeof end === 'number') {
				cmd += end;
			}
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['cpos'], (valueMap) => new SongIdAndPosition(valueMap)));
	}

	/**
	 * Set the priority of the specified songs. A higher priority means that it will be played 
	 * first when "random" mode is enabled.
	 * A priority is an integer between 0 and 255. The default priority of new songs is 0.
	 */
	prio(priority: number, start: number, end:number): Promise<void> {
		let cmd = `prio ${priority} ${start}:${end}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Same as prio, but address the songs with their songid.
	 */
	prioId(priority: number, songId: number): Promise<void> {
		let cmd = `prioid ${priority} ${songId}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Specifies the portion of the song that shall be played. `start` and `end` are offsets 
	 * in seconds (fractional seconds allowed); both are optional. Omitting both means "remove the
	 * range, play everything". A song that is currently playing cannot be manipulated this way.
	 */
	rangeId(songId: number, start?: number, end?: number): Promise<void> {
		let cmd = `rangeid ${songId} `;
		if (typeof start === 'number') {
			cmd += start;
		}
		cmd += ':';
		if (typeof end === 'number') {
			cmd += end;
		}
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Shuffles the current playlist. `start` and `end` is optional and specifies a range of songs.
	 */
	shuffle(start?: number, end?: number): Promise<void> {
		let cmd = 'shuffle';
		if (typeof start === 'number') {
			cmd += ` ${start}:`;
			if (typeof end === 'number') {
				cmd += end;
			}
		}
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Swaps the positions of `song1` and `song2`.
	 */
	swap(song1: number, song2: number): Promise<void> {
		let cmd = `swap ${song1} ${song2}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Swaps the positions of `song1` and `song2` (both songids).
	 */
	swapId(song1: number, song2: number): Promise<void> {
		let cmd = `swapid ${song1} ${song2}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Adds a tag to the specified song. Editing song tags is only possible for remote songs.
	 * This change is volatile: it may be overwritten by tags received from the server, and the
	 * data is gone when the song gets removed from the queue.
	 */
	addTagId(songId: number, tag: string, value: string): Promise<void> {
		let cmd = `addtagid ${songId} "${tag}" "${value}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Removes tags from the specified song. If `tag` is not specified, then all tag values will be
	 * removed. Editing song tags is only possible for remote songs.
	 */
	clearTagId(songId: number, tag?: string): Promise<void> {
		let cmd = `cleartagid ${songId}`;
		if (tag) {
			cmd += ` "${tag}"`;
		}
		return this.protocol.sendCommand(cmd).then(() => {});
	}
}
