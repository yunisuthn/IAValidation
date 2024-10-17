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

app.use((req, res, next)=>{
  req.io = io
  next()
})

//test item
// const itemSchema = new mongoose.Schema({
//   name: String,
//   isLocked: { type: Boolean, default: false },
// });

// const Item = mongoose.model('Item', itemSchema);
// var dataItem = {
//   "name": "testName"
// }

// Création de l'objet à sauvegarder
// const dataItem = new Item({
//   name: "testtest",
// }).save();

// API pour obtenir tous les éléments
// app.get('/items', async (req, res) => {
//   const items = await Item.find();
  
//   res.json(items);
// });

// app.get('/items/:id', async (req, res) => {
//   var id = req.params.id
  
//   const items = await Item.findById(id);
  
//   res.json(items);
// })



// io.on('connection', (socket) => {

  // socket.on('open-file', (fileId) => {
  //   socket.broadcast.emit('file-locked', fileId);
  // });

  // socket.on('close-file', (fileId) => {
  //   socket.broadcast.emit('file-unlocked', fileId);
  // });


  //test socket
  // socket.on('lock-item', async (id) => {
  //   const item = await Item.findById(id)
  //   if (!item.isLocked) {
  //     item.isLocked = true
  //     await item.save()
  //     io.emit('item-locked', {id, isLocked: true})
  //   }
    
  // })
  // socket.on('unlock-item', async (id) => {
  //   const item = await Item.findById(id)
  //   item.isLocked = false
  //   await item.save()
  //   io.emit('item-unlocked', {id, isLocked: false})
  // })


  
  // socket.on('disconnect', () => {
  //   // console.log('Un utilisateur s\'est déconnecté:', socket.id);
  // });
// });

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
