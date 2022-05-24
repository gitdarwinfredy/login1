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
// app.use('/resources', express.static('public'));
// app.use('/resources', express.static(__dirname + '/public'));
app.use(express.static('public'));

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

    app.get('/login',( req, res)=>{
        res.render('login.ejs');
    });

     app.get('/editar',( req, res)=>{
        connection.query('SELECT * FROM users' , async(error,results) =>{
            if(error){
                throw error;
            }else{
                data = JSON.stringify(results);
                 res.render('editar.ejs',{
                    results: results,
                    data
                });
            } 
        })
     });

     app.get('/editarB',( req, res)=>{
        connection.query('SELECT * FROM users' , async(error,results) =>{
            if(error){
                throw error;
            }else{
                data = JSON.stringify(results);
                 res.render('editarB.ejs',{
                    results: results,
                    data
                });
            } 
        })
     });

     app.get('/entries',( req, res)=>{
        connection.query('SELECT * FROM users' , async(error,results) =>{
            if(error){
                throw error;
            }else{
                data = JSON.stringify(results);
                 res.render('entriesDataTables.ejs',{
                    results: results,
                    data
                });
            } 
        })
     });

     app.get('/editarB1',( req, res)=>{
        connection.query('SELECT * FROM users limit 10 ' , async(error,results) =>{
            if(error){
                throw error;
            }else{
                data = JSON.stringify(results);
                 res.render('editarB.ejs',{
                    results: results,
                    data
                });
            } 
        })
     });

     app.get('/editarB2',( req, res)=>{
        connection.query('SELECT * FROM users limit 10, 10 ' , async(error,results) =>{
            if(error){
                throw error;
            }else{
                data = JSON.stringify(results);
                 res.render('editarB.ejs',{
                    results: results,
                    data
                });
            } 
        })
     });


    app.get('/register',(req, res)=>{
        res.render('register.ejs');
    });

   

    /* app.get('/consulta',(req, res)=>{
        res.render('consulta.ejs');
    }); */

   

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

});

//11- autenticacion
app.post('/auth', async (req, res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
    connection.query('SELECT * FROM users WHERE user=?', [user], async(error,results)=>{
     if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
        res.render('login.ejs', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Datos Ingresados Incorrectos",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
        }else{
            req.session.logeding = true;
            req.session.name= results[0].name;
            req.session.rol= results[0].rol;
            res.render('login.ejs', {
                alert: true,
                alertTitle:"Felicitaciones",
                alertMessage:"Usuario y password correcto",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 2000,
                ruta:''
            });
        }    
    
    })
  }else{
    res.render('login.ejs',{
        alert: true,
        alertTitle: "Error",
        alertMessage:"No ha ingresado Usuario y Password",
        alertIcon: 'error',
        showConfirmButton: true,
        timer:false,
        ruta:'login'
    
    });
 }
});

//12 - logueo
app.get('/', (req, res)=>{
        if(req.session.logeding){        
        res.render('index.ejs',{                       
            login: true,
            name: req.session.name,
            rol: req.session.rol
            });
            }else{                
                res.render('index.ejs',{
                login: false,
                name: 'Debe iniciar session',
                rol: ''
                });
             }            
         
   });

//13 - Destruir la sesssion
app.get('/logout', (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
});


 
//14 - consulta -Si el usuario existe se direccona a editar.ejs
app.post('/consultar', (req , res)=>{

    const id = req.body.id;
    const user = req.body.user;
    if(user){
        connection.query('SELECT * FROM users WHERE user=?', [user], async(error, results)=>{
            if(results.length == 0 ){
            res.send("usuario incorrecto");
        
            }else{
                                
               res.render('edit.ejs',{
                   results : results[0]
                   
               });
                

            }
        })
        }
    });

//-15 Editar si el usuario existe en params se direccion a save.ejs y envia results
app.get('/edit/:user/',(req, res)=>{
    
    const user = req.params.user;
    connection.query('SELECT * FROM users WHERE user=?',[user], async(error,results) =>{
        if(error){
            throw error;
        }else{ 
            
            res.render('edit.ejs',{
                results: results[0]
            });
            
        } 
    })
   });

//-16 Actualizar
app.post('/update', async (req, res) => {
        
        const user = req.body.user;
        const name = req.body.name;
        const rol  = req.body.rol;
        const pass = req.body.pass;
        let passwordHaash = await bcryptjs.hash(pass, 8);

 

        connection.query('UPDATE users SET ? WHERE user=?', [{ name: name, rol: rol, pass: passwordHaash }, user], async (error, results) => {
            if (error) {
                throw error;
            } else {
                res.redirect('/');
            }
        });

    });

//-17 Eliminar
app.get('/eliminar/:user', (req, res)=>{
    const user = req.params.user;
    connection.query('DELETE FROM users WHERE user = ?', [user], (error,results)=>{
        if(error){
            throw error;
        }else{
            res.redirect('/');
        }
    })

});


app.listen('3000', (req, res)=>{
    console.log('SERVER RUNNIG EN http://localhost:3000');
});

