const socket = io.connect();

socket.on("productos", listaProductos => {
    loadProds(listaProductos)
});

async function loadProds(listProd) {
    let htmlProd = ''
    const tableList = await fetch('../views/partials/table.ejs').then(res => res.text())
    if (listProd.length === 0){
        htmlProd = `<h4>No se encontraron productos.</h4>`
    }else{
        htmlProd = ejs.render(tableList, {listProd})
    }

    document.getElementById('tabla').innerHTML = htmlProd; 
}

document.getElementById('btn').addEventListener('click', (e) => {

    const nuevoProducto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value
    }
socket.emit("guardarNuevoProducto",nuevoProducto)
})

socket.on('messages', function(data) { render(data); });

function render(data) {
    const html = data.chatDenormalized.mensajes.map((elem) => {
        return(`<div>
            <strong style="color:blue">${elem.author.id}</strong>:
            <p>${elem.date}<p>
            <i style="color:green">${elem.text}</i> </div>
            `)
    }).join(" ");
    const porcentajeCompresion = `<h4 style="color:blue" >Centro de Mensajes(compresion %${data.compr}) </h4>`
    document.getElementById('messages').innerHTML = html;
    document.getElementById('compresion').innerHTML = porcentajeCompresion
}

document.getElementById('formChat').addEventListener('submit', (e) => {
    e.preventDefault()
    agregarMensaje()
})

function agregarMensaje() {
    const nuevoMensaje = {
        author:{
            email: document.getElementById('email').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
        },
        text: document.getElementById('textoMensaje').value,
    }
    socket.emit("messegesNew",nuevoMensaje)
}




