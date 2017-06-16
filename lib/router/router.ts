import { AbstractActor } from "js-actor"
import { ReceiveBuilder } from "js-actor"
import { Receive } from "js-actor"

import { Middleware } from "../../src/server"
import { Context } from "../../src/context"
import { IRequest } from "../../src/request"
import { IResponse } from "../../src/response"

export class Router {
	private _routes: Route[] = []

	public use() {

	}

	public get(url: string, ...fns: Callback[]) {
		this._routes.push({ method: "GET", url, callbacks: fns })
	}

	public post(url: string, ...fns: Callback[]) {
		this._routes.push({ method: "POST", url, callbacks: fns })
	}

	public routes() {
		return (req: IRequest, res: IResponse, next: () => void) => {
			for (let route of this._routes) {
				if (route.method === req.method && route.url === req.url) {
					const genCallback = compose(route.callbacks)
					runcb(req, res, next, genCallback, genCallback.next().value)
					return
				}
			}
			next()
		}
	}
}

function runcb(req: IRequest, res: IResponse, next: () => void, genCallback: Iterator<Callback>, cb: Callback) {
	cb(req, res, () => {
		const nextcb = genCallback.next().value
		if (nextcb) runcb(req, res, next, genCallback, nextcb)
		else next()
	})
}

function* compose(fns: Callback[]) {
	for (let fn of fns) {
		yield fn
	}
}

export type Route = {
	method: string
	url: string,
	callbacks: Callback[]
}

export type Callback = (req: Context["req"], res: Context["res"], next: () => void) => void
