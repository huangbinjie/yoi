import * as http from "http"
import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { ActorRef } from "js-actor"

import { Context } from "./context"
import { Request } from "./request"
import { Response } from "./response"

export class Server {
	private system = new ActorSystem("app")
	private middlewares: ActorRef[] = []
	public listen(port: number) {
		const server = http.createServer((req, res) => {
			const request = new Request(req)
			const response = new Response(res)
			const context = new Context(request, response)
			this.middlewares.forEach(mid => mid.tell(context))
		})

		server.listen(port)
	}

	public use(actor: new () => AbstractActor) {
		this.middlewares.push(this.system.actorOf(new actor))
	}
}
