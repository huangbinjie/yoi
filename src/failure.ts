import { Success } from "./success"

export class Failure {
	constructor(public error: Error, public success: Success) { }
}
