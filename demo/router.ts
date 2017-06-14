import { Router } from "../lib/router/router"

const router = new Router

router.get("/", (req, res, next) => {
	console.log("this is a interceptor")
	next()
}, (req, res) => {
	res.send("hello")
})

router.post("/", (req, res) => {
	console.log(req.body)
	res.json(req.body)
})

export default router.routes()
