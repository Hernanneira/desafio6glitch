import express from 'express'
const app = express()
import { faker } from '@faker-js/faker'
faker.locale = 'es'
import mensajeController from './controllers/ContenedorMensajes.js'

import { createServer } from "http";
import { Server } from "socket.io";

import { config } from './config/mariaDB.js'
import { options } from './config/sqlite3.js'
import Contenedor from './controllers/Contenedor.js'

const ProductoController = new Contenedor(config)

// import Chats from './controllers/Chats.js'
// const historial = new Chats(options)

const httpServer = new createServer(app)
const io = new Server(httpServer)

app.set('view engine', 'ejs')
app.set('views', './public/views');

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

// mySQL Productos

// ProductoController.createTable()
//     .then(()=>{
//         console.log('tabla Articulos creada');

//         const articulos = [
//             {
//                 "title": "Escuadra",
//                 "price": 123.45,
//                 "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
//                 "id_articulo": 1
//             },
//             {
//                 "title": "Calculadora",
//                 "price": 234.56,
//                 "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
//                 "id_articulo": 2
//             },
//             {
//                 "title": "Globo Terráqueo",
//                 "price": 345.67,
//                 "thumbnail": "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
//                 "id_articulo": 3
//             },
//         ]
//         return ProductoController.save(articulos)
//     })
//     .then(()=>{
//         console.log('articulos insertados');
//     })
//     .catch((error)=> {
//         console.log(error);
//         throw error ;
//     })
    // .finally(() => {
    //     ProductoController.close();
    // });

// SQLITE3 Chats

// historial.createTable()
//     .then(()=>{
//         console.log('tabla chats creada');

//         const chats = [
//             {
//                 "email": "Loquito",
//                 "date": "11/11/22",
//                 "textoMensaje": "Holis",
//                 "id_chat": 1
//             },
//             {
//                 "email": "Loquita",
//                 "date": "11/11/22",
//                 "textoMensaje": "Hola",
//                 "id_chat": 2
//             },
//             {
//                 "email": "MadMan",
//                 "date": "11/11/22",
//                 "textoMensaje": "como va?",
//                 "id_chat": 3
//             },
//         ]
//         return historial.save(chats)
//     })
//     .then(()=>{
//         console.log('Chats insertados');
//     })
//     .catch((error)=> {
//         console.log(error);
//         throw error ;
//     })
    // .finally(() => {
    //     ProductoController.close();
    // });

function getRandomProduct(id_articulo) {
    return {
        id_articulo,
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.abstract()
    }
  }

  const productos = []
    for (let i = 1; i < 6; i++) {
        productos.push(getRandomProduct(i))
    }

// webSocket
io.on('connection', async (socket) => {
    console.log('Un cliente se ha conectado');
    //productos
    socket.emit("productos", productos)
    // socket.on("guardarNuevoProducto", (nuevoProducto) => {

    //     ProductoController.save(nuevoProducto)
    //     io.sockets.emit("productos", productos)
    // })

//Normalizr
    

// mensajes
    const messages = await mensajeController.getAll()
    console.log(messages)
    socket.emit('messages', messages);

    socket.on('messegesNew', async (data) => {
        // const newMessage = {
        //     email: data.email,
        //     textoMensaje: data.textoMensaje,
        //     date: new Date
        // }
        console.log(data)
        const newNormMessage = {
            author: {
                id: data.email,
                nombre: data.nombre,
                apellido: data.apellido,
                edad: data.edad,
                alias: data.alias,
                avatar: data.avatar
            },
            date: new Date,
            text: data.textoMensaje
        }
        const historialSave = await mensajeController.save(newNormMessage)
        io.sockets.emit('messages', historialSave);
    });
});

//faker

//CRUD FAKER PROD
app.get('/api/productos-test', async (req, res, next) =>{
    res.render('pages/index',{productos})
})
//CRUD
// app.get('/', async (req, res, next) =>{
//     const productos = await ProductoController.getAll()
//     res.render('pages/index',{productos})
// })

// app.get('/:id', async (req,res,next) => {
//     const { id } = req.params
//     const productos = await ProductoController.getById(id)
//     res.render('pages/index',{productos})
// })

// app.post('/', async (req, res, next) => {
//     const { title, price, thumbnail } = req.body
//     const newArticulo = {
//         title: title,
//         price: price,
//         thumbnail: thumbnail
//     }
//     const newProducto = await ProductoController.save(newArticulo)
//     const productos = await ProductoController.getAll()
//     res.render('pages/index', {productos})
// })

// app.put('/:id',async (req, res, next) => {
//     const { title, price, thumbnail } = req.body
//     const { id } = req.params;
//     const upDateProducto = await ProductoController.update(title, price, thumbnail,id)
//     const productos = await ProductoController.getAll()
//     res.render('pages/index', {productos})
// })

// app.delete('/:id', async (req, res, next) => {
//     const { id } = req.params;
//     const deleteProducto = await ProductoController.deleteById(id)
//     console.log(deleteProducto)
//     const productos = await ProductoController.getAll()
//     res.render('pages/index', {productos})
// })

//Server
const PORT = 8080
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))
