import { MPDProtocol } from '../protocol';
import { Mount, Neighbor } from '../objects/mount';

export class MountCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Mount the specified remote storage `uri` at the given `path`.
	 */
	mount(path: string, uri: string): Promise<void> {
		let cmd = `mount "${path}" "${uri}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Unmounts the specified `path`.
	 */
	unmount(path: string): Promise<void> {
		let cmd = `unmount "${path}"`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Queries a list of all mounts. By default, this contains just the configured `music_directory`.
	 */
	listMounts(): Promise<Mount[]> {
		return this.protocol.sendCommand('listmounts').then(
			(lines) => this.protocol.parse(lines, ['mount'], (valueMap) => new Mount(valueMap)));
	}

	/**
	 * Queries a list of "neighbors" (e.g. accessible file servers on the local net).
	 * Items on that list may be used with `mount()`.
	 */
	listNeighbors(): Promise<Neighbor[]> {
		return this.protocol.sendCommand('listneighbors').then(
			(lines) => this.protocol.parse(lines, ['neighbor'], (valueMap) => new Neighbor(valueMap)));
	}
}
