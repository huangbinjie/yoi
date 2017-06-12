import { Router } from "../lib/router/router"

const router = new Router

router.get("/", (req, res) => {
	res.send("hello")
})

export default router.routes()