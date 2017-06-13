import { AbstractActor } from "js-actor"
import { ReceiveBuilder } from "js-actor"
import { Receive } from "js-actor"

import { Context } from "../../src/context"

export class Router {
	private _routes: Route[] = []

	public use() {

	}

	public get(url: string, ...fns: Callback[]) {
		this._routes.push({ method: "GET", url, callbacks: fns })
	}

	public routes() {
		const _this = this
		return class RouterActor extends AbstractActor {
			public createReceive() {
				return this.receiveBuilder()
					.match(Context, context => {
						for (let route of _this._routes) {
							if (route.method === context.req.method && route.url === context.req.url) {
								const genCallback = compose(route.callbacks)
								runcb(context, genCallback, genCallback.next().value)
							}
						}
					})
					.build()
			}
		}
	}
}

class RouterActor extends AbstractActor {
	constructor(private routes: Route[]) { super() }

	public createReceive() {
		return this.receiveBuilder()
			.match(Context, context => {
				for (let route of this.routes) {
					if (route.method === context.req.method && route.url === context.req.url) {
						const genCallback = compose(route.callbacks)
						runcb(context, genCallback, genCallback.next().value)
					}
				}
			})
			.build()
	}

}

function runcb(context: Context, genCallback: Iterator<Callback>, cb: Callback) {
	cb(context.req, context.res, () => {
		const nextcb = genCallback.next().value
		if (nextcb) runcb(context, genCallback, nextcb)
		else context.next()
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
