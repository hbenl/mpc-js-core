import { MPDProtocol } from '../protocol';
import { Decoder } from '../objects/decoder';
import { stringStartsWith } from '../util';

export class ReflectionCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Dumps configuration values that may be interesting for the client.
	 * This command is only permitted to "local" clients (connected via UNIX domain socket).
	 * The following response attributes are available:
	 * * `music_directory`: The absolute path of the music directory.
	 */
	config(): Promise<Map<string, string>> {
		return this.protocol.sendCommand('config').then(
			(lines) => this.protocol.parse(lines, [], (valueMap) => valueMap)[0]);
	}

	/**
	 * Shows which commands the current user has access to.
	 */
	commands(): Promise<string[]> {
		return this.protocol.sendCommand('commands').then(
			(lines) => lines.map((line) => line.substring(9)));
	}

	/**
	 * Shows which commands the current user has access to.
	 */
	notCommands(): Promise<string[]> {
		return this.protocol.sendCommand('notcommands').then(
			(lines) => lines.map((line) => line.substring(9)));
	}

	/**
	 * Shows a list of available song metadata.
	 */
	tagTypes(): Promise<string[]> {
		return this.protocol.sendCommand('tagtypes').then(
			(lines) => lines.map((line) => line.substring(9)));
	}

	/**
	 * Gets a list of available URL handlers.
	 */
	urlHandlers(): Promise<string[]> {
		return this.protocol.sendCommand('urlhandlers').then(
			(lines) => lines.map((line) => line.substring(9)));
	}

	/**
	 * Returns a list of decoder plugins with their supported suffixes and MIME types.
	 */
	decoders(): Promise<Decoder[]> {
		return this.protocol.sendCommand('decoders').then((lines) => {
			let decoders: Decoder[] = [];
			let currentDecoder: Decoder;
			lines.forEach((line) => {
				if (stringStartsWith(line, 'plugin')) {
					if (currentDecoder) {
						decoders.push(currentDecoder);
					}
					currentDecoder = new Decoder(line.substring(8));
				} else if (stringStartsWith(line, 'suffix')) {
					currentDecoder.suffixes.push(line.substr(8));
				} else if (stringStartsWith(line, 'mime_type')) {
					currentDecoder.mimeTypes.push(line.substr(11));
				}
			});
			return decoders;
		});
	}
}
