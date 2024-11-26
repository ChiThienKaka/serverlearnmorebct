import app from "./app";
import http from "http";
import { Server } from "socket.io";
const server = http.createServer(app);//12:36 28/10/2024
const io = new Server(server, { // Create a Socket.IO server instance
    cors: {
        origin: 'http://localhost:3000', // Allow requests from your React app
        methods: ['GET', 'POST'],
        credentials: true
    }
});
app.set('socketio', io);//12:36 28/10/2024
// Đặt Socket.IO vào app để dùng trong REST API
const PORT = process.env.PORT || 3001
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('joinRoom', ({room})=>{
        console.log(room, 'room');
        socket.join(room); //Tham gia vào phòng với idenrollment cụ thể
        socket.emit('joinRoom', room);//xác nhận
    })
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
});
server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})