import { ServerResponse } from "http"
import { CookieOptions, Response as ExpressResponse } from "express"
import * as cookie from "cookie"

/** IResponse use to overlap wrong member of definition */
export interface IResponse extends ServerResponse, ExpressResponse {
	append(field: string, val: string | string[]): this
	set(field: string | { [key: string]: string }, val?: string | string[]): this
	redirect(url: string | number, status?: number | string): void
}

export function createResponse(response: IResponse): IResponse {

	response.append = function (field: string, val: string | string[]) {
		const prev = this.get(field)

		if (prev) {
			val = Array.isArray(prev) ? prev.concat(val) : [prev].concat(val)
		}

		return this.set(field, val)
	}

	response.attachment = function () {
		return this
	}

	response.clearCookie = function (name: string, options?: any) {
		return this
	}

	response.contentType = function (type: string) {
		return this.type(type)
	}

	response.cookie = function (name: string, value: string | object, options = { path: "/" } as CookieOptions) {
		value = typeof value === "object" ? "j:" + JSON.stringify(value) : value

		if (options.maxAge) {
			options.expires = new Date(Date.now() + options.maxAge)
			options.maxAge /= 1000
		}

		this.append("Set-Cookie", cookie.serialize(name, String(value), options as cookie.CookieSerializeOptions))
		return this
	}

	// TODO
	response.download = function () {
		return this
	}

	// TODO
	response.format = function (obj: any) {
		return this
	}

	response.get = function (header: string) {
		return this.getHeader(header)
	}

	response.header = function (key: string, val?: any) {
		return this.set(key, val)
	}

	// TODO
	response.links = function () {
		return this
	}

	response.location = function (url: string) {
		return this.set("Location", url)
	}

	response.json = function (body: Object) {
		this.set("Content-Type", "application/json")
		this.send(JSON.stringify(body))
		return this
	}

	// TODO
	response.jsonp = function () {
		return this
	}

	response.redirect = function (url: string) {
		// this.statusCode = 302
		// this.location(url)
		console.log(url)
		this.end("")
	}

	response.render = function () {
		return this
	}

	response.send = function (body: Object) {
		if (typeof body === "object") body = JSON.stringify(body)
		this.end(body, "utf8")
		return this
	}

	// TODO
	response.sendFile = function () {
		return this
	}

	// TODO
	response.sendfile = function () {
		return this
	}

	response.sendStatus = function (code: number) {
		switch (code) {
			case 200: this.status(200).send("OK")
			case 403: this.status(403).send("Forbidden")
			case 404: this.status(400).send("Not Found")
			case 500: this.status(500).send("Internal Server Error")
			default: this.status(500).send("Internal Server Error")
		}
		return this
	}

	response.set = function (field: string | { [key: string]: string }, val?: string | string[]) {
		if (2 === arguments.length && "string" === typeof field) {
			if (Array.isArray(val)) val = val.map(String)
			else val = String(val)
			this.setHeader(field, val)
		}
		if ("object" === typeof field) {
			for (let key of Object.keys(field)) {
				this.set(key, field[key])
			}
		}
		return this
	}

	response.status = function (code: number) {
		this.statusCode = code
		return this
	}

	response.type = function (type: string) {
		return this.set("Content-Type", type)
	}

	response.vary = function () {
		return this
	}

	return response
}
