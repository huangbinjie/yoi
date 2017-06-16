import { Router } from "../lib/router/router"

const router = new Router

router.get("/", (req, res, next) => {
	req.session.name = "corol"
	next()
}, (req, res) => {
	res.send("hello")
})

router.get("/session", (req, res) => {
	res.send(req.session.name)
})

export default router.routes()
