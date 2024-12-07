const socketIO = require('socket.io');
const jwt = require('jsonwebtoken'); // Make sure you have this installed

let io;

const initializeSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Authentication middleware
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const userId = socket.handshake.auth.userId;
            if (!token || !userId) {
                return next(new Error("Authentication error"));
            }

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
            socket.userId = decoded._id || userId;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // Join user to their personal room
        socket.join(`user_${socket.userId}`);

        // Handle follow action events
        socket.on('notification', async (data) => {
            const { action, requestId } = data;
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
}; 