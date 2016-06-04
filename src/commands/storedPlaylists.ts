import { MPDProtocol } from '../protocol';
import { StoredPlaylist, PlaylistItem } from '../objects/playlists';

export class StoredPlaylistsCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Prints a list of the playlist directory. Each playlist name comes with its last 
	 * modification time. To avoid problems due to clock differences between clients and the
	 * server, clients should not compare this value with their local clock. 
	 */
	listPlaylists(): Promise<StoredPlaylist[]> {
		return this.protocol.sendCommand('listplaylists').then(
			(lines) => this.protocol.parse(lines, ['playlist'], (valueMap) => new StoredPlaylist(valueMap)));
	}

	/**
	 * Lists the songs in the playlist. Playlist plugins are supported.
	 */
	listPlaylist(name: string): Promise<string[]> {
		let cmd = `listplaylist "${name}"`;
		return this.protocol.sendCommand(cmd).then(
			(lines) => lines.map((line) => line.substring(6)));
	}

	/**
	 * Lists the songs with metadata in the playlist. Playlist plugins are supported.
	 */
	listPlaylistInfo(name: string): Promise<PlaylistItem[]> {
		let cmd = `listplaylistinfo "${name}"`;
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], (valueMap) => new PlaylistItem(valueMap)));
	}

	/**
	 * Loads the playlist into the current queue. Playlist plugins are supported.
	 * A range may be specified to load only a part of the playlist.
	 */
	load(name: string, start?: number, end?: number): Promise<void> {
		let cmd = `load "${name}"`;
		if (typeof start === 'number') {
			cmd += ` ${start}:`;
			if (typeof end === 'number') {
				cmd += end;
			}
		}
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Saves the current playlist to `name`.m3u from the playlist directory.
	 */
	save(name: string): Promise<void> {
		let cmd = `save "${name}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Adds `uri` to the playlist `name`.m3u. `name`.m3u will be created if it does not exist.
	 */
	playlistAdd(name: string, uri: string): Promise<void> {
		let cmd = `playlistadd "${name}" "${uri}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Clears the playlist `name`.m3u.
	 */
	playlistClear(name: string): Promise<void> {
		let cmd = `playlistclear "${name}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Deletes `position` from the playlist `name`.m3u.
	 */
	playlistDelete(name: string, position: number): Promise<void> {
		let cmd = `playlistdelete "${name}" ${position}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Moves the song at position `from` in the playlist `name`.m3u to the position `to`.
	 */
	playlistMove(name: string, from: number, to: number): Promise<void> {
		let cmd = `playlistmove "${name}" ${from} ${to}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Renames the playlist `name`.m3u to `newName`.m3u.
	 */
	rename(name: string, newName: string): Promise<void> {
		let cmd = `rename "${name}" "${newName}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Removes the playlist `name`.m3u from the playlist directory.
	 */
	remove(name: string): Promise<void> {
		let cmd = `rm "${name}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}
}
