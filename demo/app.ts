import { Server } from "../src/server"
import routes from "./router"

const app = new Server()

app.use(routes)

app.listen(3000)

console.log("server has listened on 3000")