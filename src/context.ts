import { Request } from "./request"
import { Response } from "./response"

export class Context {
	constructor(public req: Request, public res: Response) {

	}
}