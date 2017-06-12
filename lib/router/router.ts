import { AbstractActor } from "js-actor"
import { ReceiveBuilder } from "js-actor"
import { Receive } from "js-actor"

import { Context } from "../../src/context"

export class Router {
	private receiveBuilder: ReceiveBuilder

	public use() {

	}

	public get(url: string, ...fns: Callback[]) {
		this.receiveBuilder.match(Context, context => {
			if (context.req.method === "GET" && context.req.url === url) {
				for (let fn of fns) {
					fn(context.req, context.res)
				}
			}
		})
	}

	public routes() {
		const _this = this
		return class RouterActor extends AbstractActor {
			public createReceive() {
				return _this.receiveBuilder.build()
			}
		}
	}

	constructor() {
		this.receiveBuilder = new ReceiveBuilder()
	}
}

export type Callback = (req: Context["req"], res: Context["res"]) => void