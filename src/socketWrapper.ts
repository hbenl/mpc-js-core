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
