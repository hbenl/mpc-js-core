import { MPDProtocol } from './protocol';
import { StatusCommands, PlaybackCommands, PlaybackOptionsCommands, CurrentPlaylistCommands,
	StoredPlaylistsCommands, DatabaseCommands, MountCommands, StickerCommands, ConnectionCommands,
	OutputDeviceCommands, ReflectionCommands, ClientToClientCommands } from './commands/index';

export class MPCCore extends MPDProtocol {

	status: StatusCommands;
	playback: PlaybackCommands;
	playbackOptions: PlaybackOptionsCommands;
	currentPlaylist: CurrentPlaylistCommands;
	storedPlaylists: StoredPlaylistsCommands;
	database: DatabaseCommands;
	mounts: MountCommands;
	stickers: StickerCommands;
	connection: ConnectionCommands;
	outputDevices: OutputDeviceCommands;
	reflection: ReflectionCommands;
	clientToClient: ClientToClientCommands;

	constructor() {
		super();
		this.status = new StatusCommands(this);
		this.playback = new PlaybackCommands(this);
		this.playbackOptions = new PlaybackOptionsCommands(this);
		this.currentPlaylist = new CurrentPlaylistCommands(this);
		this.storedPlaylists = new StoredPlaylistsCommands(this);
		this.database = new DatabaseCommands(this);
		this.mounts = new MountCommands(this);
		this.stickers = new StickerCommands(this);
		this.connection = new ConnectionCommands(this);
		this.outputDevices = new OutputDeviceCommands(this);
		this.reflection = new ReflectionCommands(this);
		this.clientToClient = new ClientToClientCommands(this);
	}
}