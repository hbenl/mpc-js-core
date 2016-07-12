import * as net from 'net';
import * as base64 from 'base64-js';
import { TextEncoderLite, TextDecoderLite } from 'text-encoder-lite-module';

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

	private url: string;
	private textEncoder: TextEncoderLite;
	private textDecoder: TextDecoderLite;
	private wsClient: WebSocket;
	
	constructor(url: string) {
		this.url = url;
		this.textEncoder = new TextEncoderLite();
		this.textDecoder = new TextDecoderLite();
	}

	connect(receive: (msg: string) => void) {
		this.wsClient = new WebSocket(this.url, ['base64']);
		this.wsClient.onmessage = (e) => receive(this.textDecoder.decode(base64.toByteArray(e.data)));
	}

	send(msg: string) {
		this.wsClient.send(base64.fromByteArray(this.textEncoder.encode(msg)));
	}

	disconnect() {
		this.wsClient.close();
	}
}
