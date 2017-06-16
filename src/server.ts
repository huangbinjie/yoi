import * as http from "http"
import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import { ActorRef } from "js-actor"
import * as onFinished from "on-finished"

import { Context } from "./context"
import { createRequest, IRequest } from "./request"
import { createResponse, IResponse } from "./response"
import { Worker } from "./worker"

export class Server {
	private system = new ActorSystem("app")
	private middlewares: Middleware[] = []
	public listen(port: number) {
		const server = http.createServer((req, res) => {
			const request = createRequest(req as IRequest)
			const response = createResponse(res as IResponse)
			const worker = new Worker(this.system, this.middlewares)
			const context = new Context(request, response, worker)
			worker.start(context)
			onFinished(context.res, () => worker.stop())
		})

		server.listen(port)
	}

	public use(middleware: Middleware) {
		this.middlewares.push(middleware)
	}
}

export type Middleware = (req: IRequest, res: IResponse, next: () => void) => void
