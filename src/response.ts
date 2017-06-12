import { ServerResponse } from "http"

export class Response {
	public send(body: Object) {
		this._response.write(body)
		this._response.end()
	}
	constructor(private _response: ServerResponse) {

	}
}