const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const fileRoutes = require('./Routes/routeFile');
require('dotenv').config();
mongoose.connect(process.env.DB_URI, {});


const db = mongoose.connection
db.on("error", console.error.bind(console, 'MongoDB connection error'))
db.once("open", ()=>{
    console.log("Connected to MongoDB ");
})


const app = express();
// Parse application/json
app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(express.static('uploads'));  // Servir les fichiers statiques dans le dossier 'uploads'

const server = http.createServer(app);
// const io = socketIo(server);  // Initialiser Socket.IO une fois
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Remplace par l'URL de ton client
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté:', socket.id);

  socket.on('open-file', (fileId) => {
    socket.broadcast.emit('file-locked', fileId);
  });

  socket.on('close-file', (fileId) => {
    socket.broadcast.emit('file-unlocked', fileId);
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté:', socket.id);
  });
});

// app.set('io', io);  // Stocker l'instance de io dans l'application express
// async function connectDB() {
//     try{
//         await mongoose.connect(process.env.DB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         })
//         console.log("Connected to MongoDB");
        
//     }catch (error){
//         console.error("MongoDB connection error: ", error);
//         process.exit(1)
//     }
// }

// connectDB()

// Utiliser les routes
app.use('/', fileRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
