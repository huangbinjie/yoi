import { ActorRef } from "js-actor"
import { AbstractActor } from "js-actor"
import { IRequest } from "./request"
import { IResponse } from "./response"
import { Worker } from "./worker"

/**
 * Context is actor line's logic context, every line will keep one context.
 */
export class Context {
	constructor(public req: IRequest, public res: IResponse, public worker: Worker) { }
}
