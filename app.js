//1-invocamos a express
const express = require('express');
const app = express(); 


//2-variables que no estan definidas no afecte la programacion,capturar datos del form
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3- invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//4- Creamos el directorio public
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

console.log(__dirname);

//5- Motor de plantillas
app.set('view engine', 'ejs');

//6- Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7- variable de session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: 'true',
    saveUninitialized: 'true'

}));

//8- Invocamos a la conexion de la base de datos
const connection = require('./database/db');


app.use('/', require('./router'));


app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNIG EN http://localhost:3000');
})

