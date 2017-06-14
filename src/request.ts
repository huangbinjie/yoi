import { IncomingMessage } from "http"
import * as accepts from "accepts"
import * as rangeParser from "range-parser"
import * as url from "url"
import { Request as ExpressRequest, MediaType } from "express"

export class Request implements IncomingMessage, ExpressRequest {
	// stream.Readable
	public readable: boolean
	public _read = this._request._read
	public read = this._request.read
	public isPaused = this._request.isPaused
	public pipe = this._request.pipe
	public unshift = this._request.unshift
	public wrap = this._request.wrap
	public push = this._request.push

	// IncomingMessage
	public httpVersion = this._request.httpVersion
	public httpVersionMajor = this._request.httpVersionMajor
	public httpVersionMinor = this._request.httpVersionMinor
	public connection = this._request.connection
	public headers = this._request.headers as { [key: string]: string }
	public rawHeaders = this._request.rawHeaders
	public trailers = this._request.trailers
	public rawTrailers = this._request.rawTrailers
	public setTimeout = this._request.setTimeout
	public destroy = this._request.destroy
	public statusCode = this._request.statusCode
	public statusMessage = this._request.statusMessage
	public socket = this._request.socket
	public method = this._request.method!
	public url = this._request.url!
	public app: any

	// enchanced
	public accepted: MediaType[]
	public cookies: { [key: string]: any } = {}
	public signedCookies: { [key: string]: any } = {}
	public body: { [key: string]: any } = {}
	public query: { [key: string]: any } = {}
	public params: { [key: string]: any } = {}
	public baseUrl: string
	public path: string

	private accept = accepts(this)

	constructor(private _request: IncomingMessage) { }


	public accepts(...args: any[]) {
		return this.accept.types.apply(this.accept, args)
	}

	public acceptsCharsets(...args: any[]) {
		return this.accept.charsets.apply(this.accept, args)
	}

	public acceptsEncodings(...args: any[]) {
		return this.accept.encodings.apply(this.accept, args)
	}

	public acceptsLanguages(...args: any[]) {
		return this.accept.languages.apply(this.accept, args)
	}

	public clearCookie(name: string, options?: any) {
		return null as any
	}

	// TODO
	public get fresh() {
		return false
	}

	public get(name: string) {
		return this.headers[name.toLowerCase()]
	}

	public header(name: string) {
		return this.get(name)
	}

	public get host() {
		return this.hostname
	}
	// TODO
	public get hostname() {
		return ""
	}

	// TODO
	public get ip() {
		return ""
	}

	// TODO
	public get ips() {
		return []
	}

	// TODO
	public get subdomains() {
		return []
	}

	// TODO
	public is(type: string) {
		return true
	}

	public get originalUrl() {
		return url.parse(this.url || "").path!
	}

	// not stable
	public param(name: string, defaultValue?: any) {
		return ""
	}

	public get protocol() {
		return (this.connection as any).encrypted ? "https" : "http"
	}

	/** actually express range:  range(size: number, options: rangeParser.Options) */
	public range(size: number) {
		const range = this.get("Range")
		if (range) return rangeParser(size, range, {}) as any
	}

	public get route() {
		return this.path
	}

	public get secure() {
		return this.protocol === "https"
	}
	// TODO
	public get stale() {
		return true
	}

	public get xhr() {
		const xhr = this.get("X-Requested-With") || ""
		return xhr.toLowerCase() === "xmlhttprequest"
	}

	// IncomingMessage
	public pause() {
		this._request.pause()
		return this
	}

	public resume() {
		this._request.resume()
		return this
	}

	public setEncoding(encoding: string) {
		this._request.setEncoding(encoding)
		return this
	}

	public unpipe<T extends NodeJS.WritableStream>(destination?: T) {
		this._request.unpipe(destination)
		return this
	}

	// eventemitter
	public setMaxListeners(n: number) {
		this._request.setMaxListeners(n)
		return this
	}

	public getMaxListeners() {
		return this._request.getMaxListeners()
	}

	public listeners(event: string | symbol) {
		return this._request.listeners(event)
	}

	public eventNames() {
		return this._request.eventNames()
	}

	public listenerCount(type: string | symbol) {
		return this._request.listenerCount(type)
	}

	public addListener(event: string, listener: Function) {
		this._request.addListener(event, listener)
		return this
	}

	public emit(event: string, ...args: any[]) {
		return this._request.emit(event, ...args)
	}

	public on(event: string, listener: Function) {
		this._request.on(event, listener)
		return this
	}

	public once(event: string, listener: Function) {
		this._request.once(event, listener)
		return this
	}

	public prependListener(event: string, listener: Function) {
		this._request.prependListener(event, listener)
		return this
	}

	public prependOnceListener(event: string, listener: Function) {
		this._request.prependOnceListener(event, listener)
		return this
	}

	public removeListener(event: string, listener: Function) {
		this._request.removeListener(event, listener)
		return this
	}

	public removeAllListeners(event?: string | symbol) {
		this._request.removeAllListeners(event)
		return this
	}

}
