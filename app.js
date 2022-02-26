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
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

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

//9- Estableciendo Rutas

    app.get('/', (req, res)=>{
        res.render('index.ejs',{msg:'ESTOS ES UN MENSAJE DESDE NODE'});
    });

    app.get('/login',( req, res)=>{
        res.render('login.ejs');
    });

    app.get('/register',(req, res)=>{
        res.render('register.ejs');
    });

//10- registracion
app.post('/register', async (req ,res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?',{user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>{
                        if(error){
                            console.log('El error es'+error);
                        }else{
                            let alert = false;
                            res.render('register.ejs', await{
                                alert: true,
                                alertTitle: "Registration",
                                alertMessage: "Successful Registration",
                                alertIcon: 'success',
                                showConfirmButton: false,
                                timer: 1500,
                                ruta: ''


                            })
                            
                        }
                    })

})

//11- autenticacion
app.get('/auth', async (req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcrypts.hash(pass, 8);
    if(user && pass){
    connection.query('SELECT * FROM users WHERE user=?', [user], async(error,results)=>{
     if(results.length == 0 || !(await bcrypts.compare(pass, results[0].pass))){
        res.send('usuario yo password invalido');
        }else{
            res.send('usuario logueado');
        }
    
    
    })
  }
})






app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNIG EN http://localhost:3000');
})

