const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileRoutes = require('./Routes/routeFile');

mongoose.connect( "mongodb+srv://dev-solumada:05lyBVqDgjleonPF@solumada.yqeyglv.mongodb.net/SmartVerifica?retryWrites=true&w=majority&appName=Solumada", {})

const db = mongoose.connection
db.on("error", console.error.bind(console, 'MongoDB connection error'))
db.once("open", ()=>{
    console.log("Connected to MongoDB ");
})

const app = express();
app.use(cors());
app.use(express.static('uploads'));  // Servir les fichiers statiques dans le dossier 'uploads'

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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
