import { Router } from "../lib/router/router"

const router = new Router

router.get("/", (req, res, next) => {
	console.log("this is a interceptor")
	next()
}, (req, res) => {
	res.send("hello")
})

export default router.routes()
