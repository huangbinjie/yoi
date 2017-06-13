import { ServerResponse } from "http"

export class Response {
	constructor(private _response: ServerResponse) {

	}
	public send(body: Object) {
		this._response.write(body)
		this._response.end()
	}
}