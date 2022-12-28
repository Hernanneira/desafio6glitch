import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// const MensajesScheme = new Schema(
//     {
//     author: {
//         id: { type: String, required: true },
//         nombre: { type: String, required: true },
//         apellido: { type: String, required: true },
//         edad: { type: Number, required: true },
//         alias: { type: String, required: true },
//         avatar: { type: String, required: true }
//     },
//     date: { type: String, required: true },
//     text: { type: String, required: true }
//     })

const MensajesScheme = new Schema({
    author: {
        type: Object,
        required: true
    },
    date: { 
        type: String, 
        required: true },
    text: {
        type: String,
        required: true
    }
})

// const MensajesScheme = {
//     id: { type: String, required: true },
//     mensajes: {
//                 type: Object,
//                 required: true
//             }
// }

// const productosDAO = mongoose.model('mensajes', MensajesScheme)
console.log("db mongoose conectada")
// inserto algo para probar que levanta

// await mongoose.connect('mongodb://localhost:27017/mensajes', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 5000,
//         });
//         const chatHernan = [{
//                 id: 'mensajes',
//                 mensajes:[{
//                     author: {
//                         id: "data.author.email,",
//                         nombre: "data.author.nombre,",
//                         apellido: "data.author.apellido,",
//                         edad: "data.author.edad,",
//                         alias: "data.author.alias,",
//                         avatar: "data.author.avatar"
//                     },
//                     date: "2022",
//                     text: "PROBANDOOOO"
//                 }]      
//             }
//         ]
//             const inserciones = [];
//             for (const prod of chatHernan) {
//                 inserciones.push(productosDAO.create(prod))
//             }
//             const results = await Promise.allSettled(inserciones)
//             console.log(chatHernan)
//             console.log(inserciones)
//             console.log(results)
//             await mongoose.disconnect();

// await mongoose.connect('mongodb://localhost:27017/mensajes', {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 5000,
//         });
//         const chatHernan = [{
//             author: {
//                 id: 1,
//                 nombre: "hernan",
//                 apellido: "Neira",
//                 edad: 30,
//                 alias: "Herni",
//                 avatar: "messiii messiii"
//             },
//             date: "21/12/2022 20:12",
//             text: "Probando que funciona"
//             }]
            
//             const inserciones = [];
//             for (const prod of chatHernan) {
//                 inserciones.push(productosDAO.create(prod))
//             }
//             const results = await Promise.allSettled(inserciones)
//             console.log(chatHernan)
//             console.log(inserciones)
//             console.log(results)
//             await mongoose.disconnect();

class Mensaje {
        productosDAO = mongoose.model('mensajes', MensajesScheme);

    async connect(){
        await mongoose.connect('mongodb://localhost:27017/mensajes', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });
        }

    async disconnect(){
        await mongoose.disconnect();
    }

    async getAll() {
        try {
            await this.connect()
            const content = await this.productosDAO.find({})
            await this.disconnect()
            return content
        } catch (error) {
            return(error)
        }
    }
    
    async save(newMessage) {
        try {
            await this.connect()
            await this.productosDAO.create(newMessage)
            const content = await this.getAll()
            await this.disconnect()
            return content
            }
        catch (error) {
            return(error)
        }
    }
    // async getById(id){
    //     console.log(id)
    //     try {
    //         this.connect()
    //         const content =  await this.productosDAO.find({id: id}) // usando mongo
    //         const elementosFiltrados = content.filter(e => e.id === id) //trabajandolo en paralelo
    //         this.disconnect()
    //         if(elementosFiltrados.length === 0){
    //             return({ error : 'producto no encontrado' })
    //         } else {
    //             return content
    //         }
    //     } catch (error) {
    //         console.log('estamos en error')
    //         return({error})
    //     }
    // }

    // async update(timestamp, nombre, descripcion, código, foto, precio, stock, id) {
    //     try{
    //         this.connect()
    //         const newProduct = {timestamp, nombre, descripcion, código, foto, precio, stock, id};
    //         const updateProduct = await this.productosDAO.updateMany({id: id}, {$set: newProduct})
    //         this.disconnect()
    //         return updateProduct ; //me devuelve un objeto raro pero lo actualiza.
    //     } catch (error) {
    //         return(error)
    //     }
    // }
    // async deleteAll(){
    //     try {
    //         this.connect()
    //         await this.productosDAO.deleteAll({})
    //         this.disconnect()
    //         return "eliminado con exito"
    //     } catch (error) {
    //         console.log(error)
    //         return "no pudo eliminarse"
    //     }
    // }

    // async deleteById (id) {
    //     try {
    //         this.connect()
    //         const elementosFiltrados = await this.productosDAO.deleteMany({id: id}) //me devuelve un objeto raro pero lo elimina.
    //         this.disconnect()
    //         return elementosFiltrados 
    //     } catch (error) {
    //         return(error)
    //     }
    // }
}

const mensajeController = new Mensaje()

export default mensajeController