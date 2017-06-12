import { IncomingMessage } from "http"

export class Request {
	public headers: any
	public method?: string
	public url?: string
	public body: { [key: string]: any }
	public query: { [key: string]: any }
	public params: { [key: string]: any }
	constructor(private _request: IncomingMessage) {
		this.headers = this._request.rawHeaders
		this.method = this._request.method
		this.url = this._request.url
		this.body = {}
		this.query = {}
		this.params = {}
	}
}
