import { MPDProtocol } from '../protocol';
import { Status, Statistics } from '../objects/index';

export class StatusCommands {

	constructor(private protocol: MPDProtocol) {}

	getStatus(): Promise<Status> {
		return this.protocol.sendCommand('status').then(
			(msg) => this.protocol.parse<Status>(msg, [], (valueMap) => new Status(valueMap))[0]);
	}

	getStatistics(): Promise<Statistics> {
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
