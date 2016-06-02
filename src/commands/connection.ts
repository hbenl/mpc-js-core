import { MPDProtocol } from '../protocol';

export class ConnectionCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Closes the connection to MPD. MPD will try to send the remaining output buffer before it
	 * actually closes the connection, but that cannot be guaranteed. This command will not
	 * generate a response.
	 */
	close(): void {
		this.protocol.sendCommand('close');
	}

	/**
	 * Kills MPD.
	 */
	kill(): void {
		this.protocol.sendCommand('kill');
	}

	/**
	 * This is used for authentication with the server. `password` is simply the plaintext password.
	 */
	password(password: string): Promise<void> {
		let cmd = `password "${password}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Does nothing but return "OK".
	 */
	ping(): Promise<void> {
		return this.protocol.sendCommand('ping').then(() => {});
	}
}
