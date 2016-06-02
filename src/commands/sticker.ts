import { MPDProtocol } from '../protocol';

export class StickerCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Reads a sticker value for the specified object.
	 */
	getSticker(type: string, uri: string, name: string): Promise<string> {
		let cmd = `sticker get ${type} "${uri}" "${name}"`;
		return this.protocol.sendCommand(cmd).then(
			(lines) => lines[0].substring(name.length + 10));
	}

	/**
	 * Adds a sticker value to the specified object.
	 * If a sticker item with that name already exists, it is replaced.
	 */
	setSticker(type: string, uri: string, name: string, value: string): Promise<void> {
		let cmd = `sticker set ${type} "${uri}" "${name}" "${value}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Deletes a sticker value from the specified object.
	 * If you do not specify a sticker name, all sticker values are deleted.
	 */
	deleteSticker(type: string, uri: string, name?: string): Promise<void> {
		let cmd = `sticker delete ${type} "${uri}"`;
		if (name) {
			cmd += ` "${name}"`;
		}
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Lists the stickers for the specified object.
	 * Returns a Map with sticker names as keys.
	 */
	listStickers(type: string, uri: string): Promise<Map<string, string>> {
		let cmd = `sticker list ${type} "${uri}"`;
		return this.protocol.sendCommand(cmd).then((lines) => {
			let stickerMap = new Map<string, string>();
			lines.forEach((line) => {
				let separatorIndex = line.indexOf('=');
				stickerMap.set(line.substring(9, separatorIndex), line.substring(separatorIndex + 1));
			});
			return stickerMap;
		});
	}

	/**
	 * Searches the sticker database for stickers with the specified name,
	 * below the specified directory (`uri`).
	 * Returns a Map with the URIs of the matching songs as keys.
	 */
	findStickers(type: string, uri: string, name: string, value?: string, 
		operator: '=' | '<' | '>' = '='): Promise<Map<string, string>> {

		let cmd = `sticker find ${type} "${uri}" "${name}"`;
		if (value) {
			cmd += ` ${operator} "${value}"`;
		}
		return this.protocol.sendCommand(cmd).then(
			(lines) => this.protocol.parse(lines, ['file'], (valueMap) => valueMap)).then(
			(fileAndStickers) => {
				let stickerMap = new Map<string, string>();
				fileAndStickers.forEach((fileAndSticker) => {
					let stickerValue = fileAndSticker.get('sticker').substring(name.length + 1);
					stickerMap.set(fileAndSticker.get('file'), stickerValue);
				});
				return stickerMap;
			});
	}
}
