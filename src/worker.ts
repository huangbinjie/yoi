import { ActorRef } from "js-actor"
import { AbstractActor } from "js-actor"

import { Middleware } from "./server"
import { Context } from "./context"

export class Worker {
	private endpoint: ActorRef
	private startpoint: ActorRef
	constructor(private nextActor: ActorRef, middlewares: Middleware[]) {
		this.startpoint = nextActor
		this.endpoint = nextActor
		for (let mid of middlewares) {
			const midActor = createActor(mid)
			this.endpoint = this.endpoint.getContext().actorOf(new midActor)
		}
	}

	/**
	 * if processing actor is the endpoint, kill this work line.
	 * otherwise process child actor.
	 */
	public next(message: object) {
		if (this.nextActor.name === this.endpoint.name) {
			this.startpoint.getContext().stop()
			return
		}
		this.nextActor = this.nextActor.getContext().children.values().next().value
		this.nextActor.tell(message)
	}
}

function createActor(mid: Middleware) {
	return class MiddlewareActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(Context, context => mid(context.req, context.res, () => context.worker.next(context)))
				.build()
		}
	}
}