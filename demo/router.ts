import { Router } from "../lib/router/router"
const router = new Router

router.get("/", (req, res) => {
	res.send("hello")
	// res.redirect("http://www.baidu.com")
})

router.get("/session", (req, res) => {
	res.send(req.session.name)
})

export default router.routes()
