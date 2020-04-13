import { MPDProtocol } from '../protocol';

export class ClientToClientCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Subscribe to a channel. The channel is created if it does not exist already.
	 * The name may consist of alphanumeric ASCII characters plus underscore, dash, dot and colon.
	 */
	subscribe(channel: string): Promise<void> {
		let cmd = `subscribe ${channel}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Unsubscribe from a channel.
	 */
	unsubscribe(channel: string): Promise<void> {
		let cmd = `unsubscribe ${channel}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Obtain a list of all channels.
	 */
	channels(): Promise<string[]> {
		return this.protocol.sendCommand('channels').then(
			(lines) => lines.map((line) => line.substring(9)));
	}

	/**
	 * Reads messages for this client. Returns a Map containing the messages grouped by channel name.
	 */
	readMessages(): Promise<Map<string, string[]>> {
		return this.protocol.sendCommand('readmessages').then((lines) => {
			let messagesPerChannel = new Map<string, string[]>();
			for (let i = 0; i < lines.length; i += 2) {
				let channel = lines[i].substring(9);
				let message = lines[i + 1].substring(9);
				if (!messagesPerChannel.has(channel)) {
					messagesPerChannel.set(channel, []);
				}
				messagesPerChannel.get(channel)!.push(message);
			}
			return messagesPerChannel;
		});
	}

	/**
	 * Send a message to the specified channel.
	 */
	sendMessage(channel: string, text: string): Promise<void> {
		let cmd = `sendmessage ${channel} "${text}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}
}
