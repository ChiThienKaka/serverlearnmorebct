import app from './app'
import http from 'http' //Module HTTP từ Node.js dùng để tạo server HTTP.
import { Server } from 'socket.io' // tạo và quản lý WebSocket cho phép truyền dữ liệu thời gian thực giữa server và client.
const server = http.createServer(app) //để tạo server HTTP từ ứng dụng Express.

const io = new  Server(server); //Tạo một instance của WebSocket từ socket.io và kết nối với server HTTP.

export default io;