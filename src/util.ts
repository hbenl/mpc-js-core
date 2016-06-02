export function stringStartsWith(str: string, prefix: string): boolean {
	return ((str.length >= prefix.length) && (str.substring(0, prefix.length) == prefix));
}
