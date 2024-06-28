const app = require('./app');
const connectDatabase = require('./db/database');

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({
        path: './config/.env'
    })
}

//connection to mongoose

connectDatabase();

// handling uncaught exception 
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`),
      console.log("Shutting down the server for handling uncaught exception");
})

// server

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`
    );
});

// unhandling uncaught exception

process.on('unhandledRejection', (err)=> {
    console.log(`Error ${err.message}`);
    console.log("Shutting down the server for unhandled promise rejection");
    
    server.close(() => {
        process.exit(1);
    })
})
