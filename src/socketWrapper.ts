import * as net from 'net';

/**
 * Interface for wrapping different ways of connecting to the daemon
 * (usually node.js Sockets or browser WebSockets)
 */
export interface SocketWrapper {
	/**
	 * This method will be called to initiate the connection
	 * @param receive	This callback should be called when data from the daemon is received
	 */
	connect(receive: (msg: string) => void): void;

	/**
	 * This method will be called to send data to the daemon
	 */
	send(msg: string): void;

	/**
	 * This method will be called to disconnect
	 */
	disconnect(): void;
}

export class TcpSocketWrapper implements SocketWrapper {

	private hostname: string;
	private port: number;
	private socket: net.Socket;

	constructor(hostname: string, port: number) {
		this.hostname = hostname;
		this.port = port;
	}

	connect(receive: (msg: string) => void) {
		this.socket = net.connect(this.port, this.hostname);
		this.socket.setEncoding('utf8');
		this.socket.on('data', (msg) => {
			receive(msg);
		});
	}

	send(msg: string): void {
		this.socket.write(msg);
	}

	disconnect() {
		this.socket.end();
	}
}

export class UnixSocketWrapper implements SocketWrapper {

	private path: string;
	private socket: net.Socket;

	constructor(path: string) {
		this.path = path;
	}

	connect(receive: (msg: string) => void) {
		this.socket = net.connect(this.path);
		this.socket.setEncoding('utf8');
		this.socket.on('data', (msg) => {
			receive(msg);
		});
	}

	send(msg: string): void {
		this.socket.write(msg);
	}

	disconnect() {
		this.socket.end();
	}
}

export class WebSocketWrapper implements SocketWrapper {

	private uri: string;
	private wsClient: WebSocket;
	
	constructor(uri: string) {
		this.uri = uri;
	}

	connect(receive: (msg: string) => void) {
		this.wsClient = new WebSocket(this.uri, ['base64']);
		this.wsClient.onmessage = (e) => receive(new Buffer(e.data, 'base64').toString('utf8'));
	}

	send(msg: string) {
		this.wsClient.send(new Buffer(msg).toString('base64'));
	}

	disconnect() {
		this.wsClient.close();
	}
}
