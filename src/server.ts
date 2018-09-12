import * as http from "http"
import { ActorSystem } from "js-actor"
import { AbstractActor } from "js-actor"
import * as onFinished from "on-finished"

import { Success } from "./success"
import { createRequest, IRequest } from "./request"
import { createResponse, IResponse } from "./response"
import { Worker, createUseActor, createCatchActor } from "./worker"

export class Server {
	private system = new ActorSystem("app")
	private operators: Operator[] = []

	public listen(port: number) {
		const server = http.createServer((req, res) => {
			const request = createRequest(req as IRequest)
			const response = createResponse(res as IResponse)
			const context = new Success(request, response)
			const worker = new Worker(this.system, this.operators.slice())
			worker.start(context)
			onFinished(context.res, () => worker.stop())
		})

		server.listen(port)
	}

	public use(middleware: Middleware) {
		this.operators.unshift(createUseActor(middleware))
		return this
	}

	public catch(handler: ErrorHandler) {
		this.operators.unshift(createCatchActor(handler))
		return this
	}
}

export type Operator = new () => AbstractActor
export type Middleware = (req: IRequest, res: IResponse, next: (error?: Error) => void) => void
export type ErrorHandler = (error: Error, req: IRequest, res: IResponse, next: (error?: Error) => void) => void
