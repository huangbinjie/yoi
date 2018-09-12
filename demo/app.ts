import { AbstractActor } from "js-actor"
import { Server } from "../src/server"
import * as morgan from "morgan"
import * as bodyParser from "body-parser"
import * as session from "express-session"
import * as cookieParser from "cookie-parser"
import routes from "./router"

const app = new Server()

// compatible with express middleware
app
	// .use(morgan("dev"))
	// .use(bodyParser.json())
	// .use(bodyParser.urlencoded({ extended: false }))
	// .use(cookieParser())
	// .use(session({
	// 	resave: false,
	// 	saveUninitialized: true,
	// 	secret: "demo",
	// 	cookie: {}
	// }))
	// // middleware use case
	// .use((req, res, next) => {
	// 	console.log("request_url: " + req.url)
	// 	next()
	// })

	// // use router, only support individual express middleware.so express.router() will not work
	// .use(routes)

	.use((req, res, next) => {
		// res.status(404).send("page not found")
		res.send("hello")
	})

	// .catch((error, req,res) => {
	// 	console.log(error)
	// 	res.status(404).send("404")
	// })

	.listen(3000)

console.log("server has listened on 3000")

