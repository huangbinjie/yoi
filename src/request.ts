import { IncomingMessage } from "http"
import * as accepts from "accepts"
import * as rangeParser from "range-parser"
import * as url from "url"
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

	request.get = function (name: string) {
		return this.headers[name.toLowerCase()]
	}

	request.header = function (name: string) {
		return this.get(name)
	}

	defineGetter(request, "host", function () {
		return this.hostname
	})
	// TODO
	defineGetter(request, "hostname", function () {
		return ""
	})

	// TODO
	defineGetter(request, "ip", function () {
		return ""
	})

	// TODO
	defineGetter(request, "ips", function () {
		return []
	})

	// TODO
	defineGetter(request, "subdomains", function () {
		return []
	})

	// TODO
	request.is = function (type: string) {
		return true
	}

	defineGetter(request, "originalUrl", function () {
		return this.url
	})

	// not stable
	request.param = function (name: string, defaultValue?: any) {
		return ""
	}

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
