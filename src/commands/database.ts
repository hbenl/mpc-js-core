import { MPDProtocol } from '../protocol';
import { DirectoryEntry, File, Song, Playlist, Directory, SongCount, GroupedSongCount } from '../objects/database';

export class DatabaseCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Counts the number of songs and their total playtime in the database that match exactly.
	 * Note that tags are case sensitive and that the MPD documentation incorrectly lists all
	 * tags as lower-case. Use `mpc.reflection.tagTypes()` to get the correct list of tags
	 * supported by MPD.
	 */
	count(tagsAndNeedles: [string, string][]): Promise<SongCount> {
		let cmd = 'count';
		tagsAndNeedles.forEach((tagAndNeedle) => {
			cmd += ` ${tagAndNeedle[0]} "${tagAndNeedle[1]}"`;
		});
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, [], (valueMap) => new SongCount(valueMap))[0]);
	}

	/**
	 * Counts the number of songs and their total playtime in the database that match exactly.
	 * The results are grouped by tag `groupingTag` (e.g. 'Artist', 'Album', 'Date', 'Genre')
	 * Note that tags are case sensitive and that the MPD documentation incorrectly lists all
	 * tags as lower-case. Use `mpc.reflection.tagTypes()` to get the correct list of tags
	 * supported by MPD.
	 */
	countGrouped(tagsAndNeedles: [string, string][], groupingTag: string): Promise<GroupedSongCount[]> {
		let cmd = 'count';
		tagsAndNeedles.forEach((tagAndNeedle) => {
			cmd += ` ${tagAndNeedle[0]} "${tagAndNeedle[1]}"`;
		});
		cmd += ` group ${groupingTag}`;
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, [groupingTag], 
			(valueMap) => new GroupedSongCount(valueMap, groupingTag)));
	}

	/**
	 * Finds songs in the database that match exactly. `type` can be any tag supported by MPD,
	 * or one of the special parameters:
	 * * 'any' checks all tag values
	 * * 'file' checks the full path (relative to the music directory)
	 * * 'base' restricts the search to songs in the given directory (also relative to the music directory)
	 * * 'modified-since' compares the file's time stamp with the given value (ISO 8601 or UNIX time stamp) 
	 * `start` and `end` can be used to query only a portion of the real response.
	 * Note that tags are case sensitive and that the MPD documentation incorrectly lists all
	 * tags as lower-case. Use `mpc.reflection.tagTypes()` to get the correct list of tags
	 * supported by MPD.
	 */
	find(typesAndNeedles: [string, string][], start?: number, end?: number): Promise<Song[]> {
		let cmd = 'find';
		typesAndNeedles.forEach((typeAndNeedle) => {
			cmd += ` ${typeAndNeedle[0]} "${typeAndNeedle[1]}"`;
		});
		if ((typeof start === 'number') && (typeof end === 'number')) {
			cmd += ` window ${start}:${end}`;
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], 
			(valueMap) => <Song>DirectoryEntry.fromValueMap(valueMap, true)));
	}

	/**
	 * Finds songs in the database that match exactly and adds them to the current playlist.
	 * Parameters have the same meaning as for `find()`.
	 */
	findAdd(typesAndNeedles: [string, string][]): Promise<void> {
		let cmd = 'findadd';
		typesAndNeedles.forEach((typeAndNeedle) => {
			cmd += ` ${typeAndNeedle[0]} "${typeAndNeedle[1]}"`;
		});
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Searches for any song that matches. Parameters have the same meaning as for `find()`,
	 * except that the search is a case insensitive substring search.
	 */
	search(typesAndNeedles: [string, string][], start?: number, end?: number): Promise<Song[]> {
		let cmd = 'search';
		typesAndNeedles.forEach((typeAndNeedle) => {
			cmd += ` ${typeAndNeedle[0]} "${typeAndNeedle[1]}"`;
		});
		if ((typeof start === 'number') && (typeof end === 'number')) {
			cmd += ` window ${start}:${end}`;
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], 
			(valueMap) => <Song>DirectoryEntry.fromValueMap(valueMap, true)));
	}

	/**
	 * Searches for any song that matches and adds them to the current playlist.
	 * Parameters have the same meaning as for `find()`, except that the search is a
	 * case insensitive substring search.
	 */
	searchAdd(typesAndNeedles: [string, string][]): Promise<void> {
		let cmd = 'searchadd';
		typesAndNeedles.forEach((typeAndNeedle) => {
			cmd += ` ${typeAndNeedle[0]} "${typeAndNeedle[1]}"`;
		});
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Searches for any song that matches and adds them to the playlist named `name`.
	 * If a playlist by that name doesn't exist it is created.
	 * Parameters have the same meaning as for `find()`, except that the search is a
	 * case insensitive substring search.
	 */
	searchAddPlaylist(name: string, typesAndNeedles: [string, string][]): Promise<void> {
		let cmd = `searchaddpl ${name}`;
		typesAndNeedles.forEach((typeAndNeedle) => {
			cmd += ` ${typeAndNeedle[0]} "${typeAndNeedle[1]}"`;
		});
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Lists the contents of the directory `uri`, including files are not recognized by MPD.
	 * `uri` can be a path relative to the music directory or an URI understood by one of the
	 * storage plugins. For example, "smb://SERVER" returns a list of all shares on the given
	 * SMB/CIFS server; "nfs://servername/path" obtains a directory listing from the NFS server. 
	 */
	listFiles(uri?: string): Promise<(File | Directory)[]> {
		let cmd = 'listfiles';
		if (uri) {
			cmd += ` "${uri}"`;
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file', 'directory'], 
			(valueMap) => <File | Directory>DirectoryEntry.fromValueMap(valueMap, false)));
	}

	/**
	 * Lists the contents of the directory `uri`. When listing the root directory, this currently
	 * returns the list of stored playlists. This behavior is deprecated; use `listPlaylists()`
	 * instead. This command may be used to list metadata of remote files (e.g. `uri` beginning
	 * with "http://" or "smb://"). Clients that are connected via UNIX domain socket may use this
	 * command to read the tags of an arbitrary local file (`uri` is an absolute path).
	 */
	listInfo(uri?: string): Promise<(Song | Playlist | Directory)[]> {
		let cmd = 'lsinfo';
		if (uri) {
			cmd += ` "${uri}"`;
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file', 'playlist', 'directory'], 
			(valueMap) => <Song | Playlist | Directory>DirectoryEntry.fromValueMap(valueMap, true)));
	}

	/**
	 * Lists all songs and directories in `uri` recursively. Do not use this command to manage a
	 * client-side copy of MPD's database. That is fragile and adds huge overhead.
	 * It will break with large databases. Instead, query MPD whenever you need something.
	 */
	listAll(uri?: string): Promise<string[]> {
		let cmd = 'listall';
		if (uri) {
			cmd += ` "${uri}"`;
		}
		return this.protocol.sendCommand(cmd).then((lines) => lines.map((line) => 
			line.substring(line.indexOf(':') + 2)
		));
	}

	/**
	 * Same as `listAll()`, except it also returns metadata info. Do not use this command to
	 * manage a client-side copy of MPD's database. That is fragile and adds huge overhead.
	 * It will break with large databases. Instead, query MPD whenever you need something.
	 */
	listAllInfo(uri?: string): Promise<(Song | Playlist | Directory)[]> {
		let cmd = 'listallinfo';
		if (uri) {
			cmd += ` "${uri}"`;
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file', 'playlist', 'directory'], 
			(valueMap) => <Song | Playlist | Directory>DirectoryEntry.fromValueMap(valueMap, true)));
	}

	/**
	 * Lists unique tags values of the specified type. `type` can be any tag supported by MPD
	 * or 'file'. `typesAndNeedles` specifies a filter like the one in `find()`.
	 * `groupingTags` may be used to group the results by one or more tags.
	 * Note that tags are case sensitive and that the MPD documentation incorrectly lists all
	 * tags as lower-case. Use `mpc.reflection.tagTypes()` to get the correct list of tags
	 * supported by MPD.
	 */
	list(type: string, typesAndNeedles: [string, string][] = [], groupingTags: string[] = []): Promise<Map<string[], string[]>> {
		let cmd = `list ${type}`;
		typesAndNeedles.forEach((typeAndNeedle) => {
			cmd += ` ${typeAndNeedle[0]} "${typeAndNeedle[1]}"`;
		});
		groupingTags.forEach((tag) => {
			cmd += ` group ${tag}`;
		});
		return this.protocol.sendCommand(cmd).then((lines) => {
			let tagsGroupedByString = new Map<string, string[]>();
			this.protocol.parse(lines, [type], (map) => {
				let group: string[] = [];
				groupingTags.forEach((groupingTag) => group.push(map.get(groupingTag) || ''));
				let groupString = JSON.stringify(group);
				if (!tagsGroupedByString.has(groupString)) {
					tagsGroupedByString.set(groupString, []);
				}
				if (map.has(type)) {
					tagsGroupedByString.get(groupString)!.push(map.get(type)!);
				}
			});
			let groupedTags = new Map<string[], string[]>();
			tagsGroupedByString.forEach((tags, groupString) => {
				let group = JSON.parse(groupString);
				groupedTags.set(group, tags);
			});
			return groupedTags;
		});
	}

	/**
	 * Read "comments" (i.e. key-value pairs) from the file specified by `uri`. This `uri` can be
	 * a path relative to the music directory or an absolute path. This command may be used to list
	 * metadata of remote files (e.g. `uri` beginning with "http://" or "smb://").
	 * Comments with suspicious characters (e.g. newlines) are ignored silently.
	 * The meaning of these depends on the codec, and not all decoder plugins support it.
	 * For example, on Ogg files, this lists the Vorbis comments.
	 */
	readComments(uri: string): Promise<Map<string, string>> {
		let cmd = `readcomments "${uri}"`;
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, [], (map) => map)[0]);
	}

	/**
	 * Updates the music database: find new files, remove deleted files, update modified files.
	 * `uri` is a particular directory or song/file to update. If you do not specify it, everything
	 * is updated. Returns a positive number identifying the update job. You can read the current
	 * job id in the status response. 
	 */
	update(uri?: string): Promise<number> {
		let cmd = 'update';
		if (uri) {
			cmd += ` "${uri}"`;
		}
		return this.protocol.sendCommand(cmd).then((lines) => Number(lines[0].substring(13)));
	}

	/**
	 * Same as `update()`, but also rescans unmodified files.
	 */
	rescan(uri?: string): Promise<number> {
		let cmd = 'rescan';
		if (uri) {
			cmd += ` "${uri}"`;
		}
		return this.protocol.sendCommand(cmd).then((lines) => Number(lines[0].substring(13)));
	}
}
