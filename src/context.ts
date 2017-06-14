import { ActorRef } from "js-actor"
import { AbstractActor } from "js-actor"
import { Request } from "./request"
import { Response } from "./response"
import { Worker } from "./worker"

/**
 * Context is actor line's logic context, every line will keep one context.
 */
export class Context {
	constructor(public req: Request, public res: Response, public worker: Worker) { }
}
