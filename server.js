import express from 'express'
const app = express()
import { faker } from '@faker-js/faker'
faker.locale = 'es'
import mensajeController from './controllers/ContenedorMensajes.js'
import { createServer } from "http";
import { Server } from "socket.io";
import { normalize, schema, denormalize} from 'normalizr';

const httpServer = new createServer(app)
const io = new Server(httpServer)

app.set('view engine', 'ejs')
app.set('views', './public/views');

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

//faker

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
function normalizeAll (getAllMessages){
    const newGetAllMessages = getAllMessages.map((e) => {
        const allMessagesObject ={
            author: e.author,
            date: e.date,
            text: e.text
        }
    return allMessagesObject
    })
    const chatOriginal = {
        id: 'mensajes',
        mensajes: newGetAllMessages
    }
    const schemaAuthor = new schema.Entity('author', {}, {idAttribute: 'email'});
    const schemaMensaje = new schema.Entity('text', { author: schemaAuthor })
    const schemaMensajes = new schema.Entity('posts', {mensajes: [schemaMensaje] })
    const normalizarMensajes = normalize(chatOriginal, schemaMensajes)
    const sinNorm = JSON.stringify(newGetAllMessages).length
    const norm = JSON.stringify(normalizarMensajes).length
    const porcentajeCompr = 100 - ((norm*100)/sinNorm)
    const chatDenormalized = denormalize(chatOriginal, normalizarMensajes)
    const compr = Math.round(porcentajeCompr*100)/100
    return {chatDenormalized , compr}
}
// mensajes
    const messages = await mensajeController.getAll()
    socket.emit('messages', normalizeAll(messages));

    socket.on('messegesNew', async (data) => {
        const newNormMessage = {
            author: {
                id: data.author.email,
                nombre: data.author.nombre,
                apellido: data.author.apellido,
                edad: data.author.edad,
                alias: data.author.alias,
                avatar: data.author.avatar
            },
            date: new Date,
            text: data.text
        }
        const historialSave = await mensajeController.save(newNormMessage)
        io.sockets.emit('messages', historialSave);
    });
});

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
