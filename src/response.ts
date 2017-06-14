import { ServerResponse } from "http"
import { Response as ExpressResponse } from "express"

export class Response implements ServerResponse, ExpressResponse {
	// writeable
	public writable = this._response.writable
	public _write = this._response._write
	public pipe = this._response.pipe
	// ServerResponse
	public write = this._response.write
	public writeContinue = this._response.writeContinue
	public writeHead = this._response.writeHead
	public statusCode = this._response.statusCode
	public statusMessage = this._response.statusMessage
	public headersSent = this._response.headersSent
	public setHeader = this._response.setHeader
	public setTimeout = this._response.setTimeout
	public sendDate = this._response.sendDate
	public getHeader = this._response.getHeader
	public removeHeader = this._response.removeHeader
	public addTrailers = this._response.addTrailers
	public finished = this._response.finished
	public end = this._response.end
	// enchanced
	public locals: any
	public charset: string
	public app: any

	constructor(private _response: ServerResponse) {

	}

	// enchanced
	public attachment() {
		return this
	}
	public clearCookie(name: string, options?: any) {
		return this
	}
	public contentType(type: string) {
		return this.type(type)
	}
	public cookie() {
		return this
	}
	// TODO
	public download() {
		return this
	}
	// TODO
	public format(obj: any) {
		return this
	}

	public get(header: string) {
		return this.getHeader(header)
	}
	public header(key: string, val?: any) {
		return this.set(key, val)
	}
	// TODO
	public links() {
		return this
	}
	public location() {
		return this
	}

	public json(body: Object) {
		this.set("Content-Type", "application/json")
		this.send(JSON.stringify(body))
		return this
	}
	// TODO
	public jsonp() {
		return this
	}
	public redirect() {
		return this
	}
	public render() {
		return this
	}

	public send(body: Object) {
		this._response.end(body, "utf8")
		return this
	}
	// TODO
	public sendFile() {
		return this
	}
	// TODO
	public sendfile() {
		return this
	}

	public sendStatus(code: number) {
		switch (code) {
			case 200: this.status(200).send("OK")
			case 403: this.status(403).send("Forbidden")
			case 404: this.status(400).send("Not Found")
			case 500: this.status(500).send("Internal Server Error")
			default: this.status(500).send("Internal Server Error")
		}
		return this
	}

	public set(key: string, val?: any) {
		this.setHeader(key, val)
		return this
	}

	public status(code: number) {
		this.statusCode = code
		return this
	}

	// server response
	public setDefaultEncoding(encoding: string) {
		this._response.setDefaultEncoding(encoding)
		return this
	}

	public type(type: string) {
		return this.set("Content-Type", type)
	}

	public vary() {
		return this
	}

	// eventemitter
	public setMaxListeners(n: number) {
		this._response.setMaxListeners(n)
		return this
	}

	public getMaxListeners() {
		return this._response.getMaxListeners()
	}

	public listeners(event: string | symbol) {
		return this._response.listeners(event)
	}

	public eventNames() {
		return this._response.eventNames()
	}

	public listenerCount(type: string | symbol) {
		return this._response.listenerCount(type)
	}

	public addListener(event: string, listener: Function) {
		this._response.addListener(event, listener)
		return this
	}

	public emit(event: string, ...args: any[]) {
		return this._response.emit(event, ...args)
	}

	public on(event: string, listener: Function) {
		this._response.on(event, listener)
		return this
	}

	public once(event: string, listener: Function) {
		this._response.once(event, listener)
		return this
	}

	public prependListener(event: string, listener: Function) {
		this._response.prependListener(event, listener)
		return this
	}

	public prependOnceListener(event: string, listener: Function) {
		this._response.prependOnceListener(event, listener)
		return this
	}

	public removeListener(event: string, listener: Function) {
		this._response.removeListener(event, listener)
		return this
	}

	public removeAllListeners(event?: string | symbol) {
		this._response.removeAllListeners(event)
		return this
	}

}