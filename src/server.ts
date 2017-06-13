import * as http from "http"
import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { ActorRef } from "js-actor"

import { Context } from "./context"
import { Request } from "./request"
import { Response } from "./response"

export class Server {
	private system = new ActorSystem("app")
	private middlewares: Array<new () => AbstractActor> = []
	public listen(port: number) {
		const server = http.createServer((req, res) => {
			const request = new Request(req)
			const response = new Response(res)
			const nextActor = this.system.actorOf(new NextActor)
			const context = new Context(request, response, nextActor, this.middlewares)
			nextActor.tell(context)
		})

		server.listen(port)
	}

	public use(actor: new () => AbstractActor) {
		this.middlewares.push(actor)
	}
}

class NextActor extends AbstractActor {
	public createReceive() {
		return this.receiveBuilder()
			.match(Context, context => context.next())
			.build()
	}
}
