import { ActorSystem } from "js-actor"
import { ActorRef } from "js-actor"
import { AbstractActor } from "js-actor"

import { Middleware } from "./server"
import { Context } from "./context"

export class Worker {
	private nextActor: ActorRef
	private startpoint: ActorRef
	private endpoint: ActorRef
	constructor(system: ActorSystem, middlewares: Middleware[]) {
		this.startpoint = this.nextActor = system.actorOf(new Startpoint)
		this.endpoint = this.nextActor
		for (let mid of middlewares) {
			const midActor = createActor(mid)
			this.endpoint = this.endpoint.getContext().actorOf(new midActor)
		}
	}

	/**
	 * if processing actor is the endpoint, kill this work line.
	 * otherwise process child actor.
	 */
	public async next(message: object) {
		if (this.nextActor.name === this.endpoint.name) {
			this.stop()
			return
		}
		this.nextActor = this.nextActor.getContext().children.values().next().value
		this.nextActor.tell(message)
	}

	public stop() {
		this.startpoint.getContext().stop()
	}
}

class Startpoint extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Context, context => context.worker.next(context))
			.build()
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