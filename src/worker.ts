import { ActorSystem } from "js-actor"
import { ActorRef } from "js-actor"
import { AbstractActor } from "js-actor"

import { Middleware, Operator, ErrorHandler } from "./server"
import { Success } from "./success"
import { Failure } from "./failure"

export class Worker {
	private startpoint: ActorRef
	private handler: ActorRef
	constructor(system: ActorSystem, operators: Operator[]) {
		const handler = createUseActor((req, res, next) => next())
		let endpoint = this.startpoint = system.actorOf(new (operators.shift()))
		for (let ope of operators) {
			endpoint = endpoint.getContext().actorOf(new ope)
		}
		this.handler = endpoint.getContext().actorOf(new handler)
	}
	public start(context: Success) {
		this.handler.tell(context)
	}

	public stop() {
		this.startpoint.getContext().stop()
	}
}

export function createUseActor(mid: Middleware) {
	return class UseActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(Success, success =>
					mid(success.req, success.res, (err?: Error) => {
						const message = err ? new Failure(err, success) : success
						this.next(message)
					}))
				.match(Failure, failure => this.next(failure))
				.build()
		}

		public next(message: object) {
			this.context.parent.tell(message)
		}
	}
}

export function createCatchActor(errorHandler: ErrorHandler) {
	return class CatchActor extends AbstractActor {
		public createReceive() {
			return this.receiveBuilder()
				.match(Success, success => this.next(success))
				.match(Failure, ({ error, success }) =>
					errorHandler(error, success.req, success.res, (err?: Error) => {
						const message = err ? new Failure(err, success) : success
						this.next(message)
					}))
				.build()
		}

		public next(message: object) {
			this.context.parent.tell(message)
		}
	}
}
