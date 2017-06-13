import { ActorRef } from "js-actor"
import { AbstractActor } from "js-actor"
import { Request } from "./request"
import { Response } from "./response"

/**
 * Context is actor line's logic context, every line will keep one context.
 */
export class Context {
	private endpoint: ActorRef
	private startpoint: ActorRef
	constructor(public req: Request, public res: Response, private nextActor: ActorRef, middlewares: Array<new () => AbstractActor>) {
		this.startpoint = nextActor
		this.endpoint = nextActor
		for (let mid of middlewares) {
			this.endpoint = this.endpoint.getContext().actorOf(new mid)
		}
	}

	/**
	 * if processing actor is the endpoint, kill this line.
	 * otherwise process child actor.
	 */
	public next() {
		if (this.nextActor.getContext().path === this.endpoint.getContext().path) {
			this.startpoint.getContext().stop()
			return
		}
		this.nextActor = this.nextActor.getContext().children.values().next().value
		this.nextActor.tell(this)
	}
}
