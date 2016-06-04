import { MPDProtocol } from '../protocol';
import { PlaylistItem, Status, Statistics } from '../objects/index';

export class StatusCommands {

	constructor(private protocol: MPDProtocol) {}

	currentSong(): Promise<PlaylistItem> {
		return this.protocol.sendCommand('currentsong').then(
			(lines) => this.protocol.parse(lines, ['file'], (valueMap) => new PlaylistItem(valueMap))[0]);
	}

	status(): Promise<Status> {
		return this.protocol.sendCommand('status').then(
			(msg) => this.protocol.parse<Status>(msg, [], (valueMap) => new Status(valueMap))[0]);
	}

	statistics(): Promise<Statistics> {
		return this.protocol.sendCommand('stats').then(
			(msg) => this.protocol.parse<Statistics>(msg, [], (valueMap) => new Statistics(valueMap))[0]);
	}

	/**
	 * Clears the current error message in status
	 */
	clearError(): Promise<void> {
		return this.protocol.sendCommand('clearerror').then(() => {});
	}
}
