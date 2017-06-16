import { AbstractActor } from "js-actor"
import { Context } from "../src/context"
import { Server } from "../src/server"
import * as morgan from "morgan"
import * as bodyParser from "body-parser"
import * as session from "express-session"
import * as cookieParser from "cookie-parser"
import routes from "./router"

const app = new Server()

// compatible with express middleware
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
	resave: false,
	saveUninitialized: true,
	secret: "demo",
	cookie: {}
}))
// middleware use case
app.use((req, res, next) => {
	console.log("request_url: " + req.url)
	next()
})

// use router, only support individual express middleware.so express.router() will not work
app.use(routes)

app.use((req, res) => {
	res.status(404).send("page not found")
})

app.listen(3000)

console.log("server has listened on 3000")

