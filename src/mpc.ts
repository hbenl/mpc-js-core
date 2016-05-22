import { MPDProtocol } from './protocol';
import { StatusCommands, PlaybackCommands, PlaybackOptionsCommands, CurrentPlaylistCommands,
	StoredPlaylistsCommands, DatabaseCommands, OutputDeviceCommands } from './commands/index';

export class MPC extends MPDProtocol {

	status: StatusCommands;
	playback: PlaybackCommands;
	playbackOptions: PlaybackOptionsCommands;
	currentPlaylist: CurrentPlaylistCommands;
	storedPlaylists: StoredPlaylistsCommands;
	database: DatabaseCommands;
	outputDevices: OutputDeviceCommands;

	constructor() {
		super();
		this.status = new StatusCommands(this);
		this.playback = new PlaybackCommands(this);
		this.playbackOptions = new PlaybackOptionsCommands(this);
		this.currentPlaylist = new CurrentPlaylistCommands(this);
		this.storedPlaylists = new StoredPlaylistsCommands(this);
		this.database = new DatabaseCommands(this);
		this.outputDevices = new OutputDeviceCommands(this);
	}
}
