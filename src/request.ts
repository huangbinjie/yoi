import { IncomingMessage } from "http"
import * as accepts from "accepts"
import * as rangeParser from "range-parser"
const typeis = require("typeis")
import { Request as ExpressRequest, MediaType } from "express"

export interface IRequest extends IncomingMessage, ExpressRequest {
	url: string
	method: string
	headers: { [key: string]: string }
	session: any
}
export function createRequest(request: IRequest): IRequest {
	const accept = accepts(request)
	request.cookies = {}
	request.signedCookies = {}
	request.body = {}
	request.query = {}
	request.params = {}

	request.accepts = function (...args: any[]) {
		return accept.types.apply(accept, args)
	}

	request.acceptsCharsets = function (...args: any[]) {
		return accept.charsets.apply(accept, args)
	}

	request.acceptsEncodings = function (...args: any[]) {
		return accept.encodings.apply(accept, args)
	}

	request.acceptsLanguages = function (...args: any[]) {
		return accept.languages.apply(accept, args)
	}

	// TODO
	defineGetter(request, "fresh", () => {
		return true
	})

	request.get = function (name: string): any {
		if (!name) {
			throw new TypeError('name argument is required to req.get');
		}

		if (typeof name !== 'string') {
			throw new TypeError('name must be a string to req.get');
		}

		var lc = name.toLowerCase();

		switch (lc) {
			case 'referer':
			case 'referrer':
				return this.headers.referrer
					|| this.headers.referer;
			default:
				return this.headers[lc];
		}
	}

	request.header = function (name: string): any {
		return this.get(name)
	}

	defineGetter(request, "host", function () {
		return this.get("Host")
	})

	defineGetter(request, "hostname", function () {
		var trust = this.app.get('trust proxy fn');
		var host = this.get('X-Forwarded-Host');

		if (!host || !trust(this.connection.remoteAddress, 0)) {
			host = this.get('Host');
		}

		if (!host) return;

		// IPv6 literal support
		var offset = host[0] === '['
			? host.indexOf(']') + 1
			: 0;
		var index = host.indexOf(':', offset);

		return index !== -1
			? host.substring(0, index)
			: host;
	})

	defineGetter(request, "ip", function () {
		return this.socket.remoteAddress
	})

	// TODO
	defineGetter(request, "ips", function () {
		return []
	})

	// TODO
	defineGetter(request, "subdomains", function () {
		return []
	})

	request.is = function (types: string) {
		return typeis(this, types);
	}

	defineGetter(request, "originalUrl", function () {
		return this.url
	})

	defineGetter(request, "protocol", function () {
		return (this.connection as any).encrypted ? "https" : "http"
	})

	/** actually express range:  range(size: number, options: rangeParser.Options) */
	request.range = function (size: number) {
		const range = this.get("Range")
		if (range) return rangeParser(size, range, {}) as any
	}

	defineGetter(request, "route", function () {
		return this.path
	})

	defineGetter(request, "secure", function () {
		return this.protocol === "https"
	})

	// TODO
	defineGetter(request, "stale", function () {
		return true
	})

	defineGetter(request, "xhr", function () {
		const xhr = this.get("X-Requested-With") || ""
		return xhr.toLowerCase() === "xmlhttprequest"
	})

	return request
}

function defineGetter(obj: object, name: string, getter: (this: IRequest) => any) {
	Object.defineProperty(obj, name, {
		configurable: true,
		enumerable: true,
		get: getter
	})
}
