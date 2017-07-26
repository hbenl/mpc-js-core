import { MPDProtocol } from '../protocol';

export class PlaybackOptionsCommands {

	constructor(private protocol: MPDProtocol) {}

	/**
	 * Sets volume, the range of volume is 0-100.
	 */
	setVolume(volume: number): Promise<void> {
		let cmd = `setvol ${volume}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	setRandom(random: boolean): Promise<void> {
		let cmd = `random ${random ? 1 : 0}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	setRepeat(repeat: boolean): Promise<void> {
		let cmd = `repeat ${repeat ? 1 : 0}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Sets single state. When single is activated, playback is stopped after current song,
	 * or song is repeated if the 'repeat' mode is enabled.
	 */
	setSingle(single: boolean): Promise<void> {
		let cmd = `single ${single ? 1 : 0}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Sets consume state. When consume is activated, each song played is removed from playlist.
	 */
	setConsume(consume: boolean): Promise<void> {
		let cmd = `consume ${consume ? 1 : 0}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Sets crossfading between songs
	 */
	setCrossfade(seconds: number): Promise<void> {
		let cmd = `crossfade ${seconds}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Sets the threshold at which songs will be overlapped. Like crossfading but doesn't fade the
	 * track volume, just overlaps. The songs need to have MixRamp tags added by an external tool.
	 * 0dB is the normalized maximum volume so use negative values, I prefer -17dB.
	 * In the absence of mixramp tags * crossfading will be used.
	 * See [http://sourceforge.net/projects/mixramp]
	 */
	setMixrampdb(decibels: number): Promise<void> {
		let cmd = `mixrampdb ${decibels}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Additional time subtracted from the overlap calculated by mixrampdb.
	 * A value of null disables MixRamp overlapping and falls back to crossfading.
	 */
	setMixrampDelay(seconds: number): Promise<void> {
		let cmd = `mixrampdelay ${seconds ? seconds : 'nan'}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	/**
	 * Sets the replay gain mode. One of off, track, album, auto.
	 * Changing the mode during playback may take several seconds, because the new settings does
	 * not affect the buffered data. This command triggers the options idle event. 
	 */
	setReplayGainMode(mode: 'off' | 'track' | 'album' | 'auto'): Promise<void> {
		let cmd = `replay_gain_mode ${mode}`;
		return this.protocol.sendCommand(cmd).then(() => {});
	}

	getReplayGainMode(): Promise<'off' | 'track' | 'album' | 'auto'> {
		return this.protocol.sendCommand('replay_gain_status').then(
			(lines) => <'off' | 'track' | 'album' | 'auto'>lines[0].substring(18));
	}
}
