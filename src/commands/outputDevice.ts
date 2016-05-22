import { MPDProtocol } from '../protocol';
import { OutputDevice } from '../objects/outputDevice';

export class OutputDeviceCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Returns information about all outputs.
	 */
	outputs(): Promise<OutputDevice[]> {
		return this.protocol.sendCommand('outputs').then(
			(lines) => this.protocol.parse(lines, ['outputid'], (valueMap) => new OutputDevice(valueMap)));
	}

	/**
	 * Turns an output on.
	 */
	enableOutput(id: number): Promise<void> {
		let cmd = `enableoutput ${id}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Turns an output off.
	 */
	disableOutput(id: number): Promise<void> {
		let cmd = `disableoutput ${id}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Turns an output on or off, depending on the current state.
	 */
	toggleOutput(id: number): Promise<void> {
		let cmd = `toggleoutput ${id}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}
}
