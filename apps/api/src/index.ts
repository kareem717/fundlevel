import { Server } from './internal/server'

const server = new Server()

export type AppType = typeof server.routes
export default server.routes
