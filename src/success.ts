import { ActorRef } from "js-actor"
import { AbstractActor } from "js-actor"
import { IRequest } from "./request"
import { IResponse } from "./response"

/**
 * Context is actor line's logic context, every line will keep one context.
 */
export class Success {
	constructor(public req: IRequest, public res: IResponse) { }
}
