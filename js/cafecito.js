// Variables

let cafes = [];
const URL = `./js/arraycoffee.json`;
let arrayCarrito = JSON.parse(localStorage.getItem("Productos")) || [];

// Genero los <div> desde html con getElementById

const container = document.getElementById("container");
const carro = document.getElementById("carro");

// Loader

const loader = document.createElement("span");
container.appendChild(loader);
loader.className = "loader";

setTimeout(()=> {
  cafes = traerCafes();
  container.removeChild(loader);
  mostrarCarrito();
  }, 3500);

// Genero la clase Carrito con constructor

class Carrito {
    constructor(id, cafe, cantidad){
        this.id = id;
        this.cafe = cafe;
        this.cantidad = cantidad;
    }
}

// Agrego elemento de compra nuevo al Carrito

function agregoelemento(id, elemento){
    const nuevoelemento = new Carrito(id, elemento, 1);
    arrayCarrito.push(nuevoelemento)
}

// Calculo el importe total de la compra

function calculototal(array){
    let total = 0;
    array.forEach((el) => {
        total += el.cantidad * cafes[el.id-1].precio;
    })
    return total;
}

// Ante una compra chequeo si el producto ya está en carrito, en ese caso incremento cantidad, sino lo agrego

function comprar(id){
    if(arrayCarrito.some(el => el.id === id)){
        arrayCarrito.find(el => el.id === id).cantidad += 1;
    } else {
        agregoelemento(cafes[id-1].id, cafes[id-1].title);
    }
    
    // Muestro con Toastify el producto agregado

    const Toast = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      });
    Toast.fire({
      icon: "success",
      title: "Producto agregado!"
    });

    // Actualizo carrito en pantalla y en Storage
    localStorage.setItem("Productos", JSON.stringify(arrayCarrito));
    mostrarCarrito();
}


// Muestro el carrito en pantalla acutalizado con cada evento de compra y renuevo LocalStorage

function mostrarCarrito(){
  
  let items = document.createElement("div");
  carro.innerHTML = "";
  carro.innerText = "Carrito";
  arrayCarrito.forEach((el,idx) => {
      items = document.createElement("div");
      const precio = cafes[el.id-1].precio;
      const subtotal = precio * el.cantidad;
      items.innerText = `${el.cafe}. Cantidad. ${el.cantidad} Precio U. $${precio} Subtotal $${subtotal} `;   
      const botoneliminar = document.createElement("button");
      botoneliminar.className = "btne";
      botoneliminar.innerText = "X"
      items.className = "carrito";
      items.appendChild(botoneliminar);
      botoneliminar.onclick = () => eliminarproducto(idx);
      carro.appendChild(items);
  })
}        


// Agrego funcion para eliminar producto

function eliminarproducto(id){
  arrayCarrito.splice(id,1);
  mostrarCarrito(); 
  localStorage.setItem("Productos", JSON.stringify(arrayCarrito));
}

// Agrego función para vaciar Carrito

function vaciarcarrito(){
  
  const productos = JSON.parse(localStorage.getItem("Productos"));
  if ((productos != null) && calculototal(productos)!= 0){

    // Confirmo eliminación de carrito con SweetAlert
    Swal.fire({
        title: "Está seguro que desea vaciar el carrito?",
        text: "Se borrarán todos sus productos",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Carrito Eliminado!",
            icon: "success",
          });
          arrayCarrito = []; 
          localStorage.clear();
          mostrarCarrito();  
        }
        
      }); 
  } else {
    Swal.fire({
        title: "Carrito Vacío!",
        icon: "error",
    });
}
}

//Agrego el boton de vaciar carrito

const btnVaciar = document.createElement("button");
btnVaciar.innerText = "Vaciar carrito";
btnVaciar.onclick = () => vaciarcarrito(arrayCarrito);
btnVaciar.className = "btn3";
container.appendChild(btnVaciar);

//Agrego el boton de Finalizar Compra, que recorre storage y muestra total de compra

const btnFin = document.createElement("button");
btnFin.innerText = "Finalizar compra";
btnFin.onclick = () => recorrostorage(); 
btnFin.className = "btn2";
container.appendChild(btnFin);

const btnMostrar = document.createElement("button");
btnMostrar.innerText = "Mostrar Carrito";
btnMostrar.onclick = () => mostrarCarrito(); 
btnMostrar.className = "btn4";
container.appendChild(btnMostrar);


//Muestro Total una vez finalizada la compra

function recorrostorage(){
    const productos = JSON.parse(localStorage.getItem("Productos"));
    
    if ((productos != null) && calculototal(productos)!= 0){
        Swal.fire({
            title: "El Total del pedido es $"+calculototal(productos),
            text: "Desea confirmar el pedido?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí"
          }).then((result) => {
            if (result.isConfirmed){
              Swal.fire({
                title: "Pedido Realizado!",
                text: "Muchas gracias! lo esperamos nuevamente",
                icon: "success",
              });
              arrayCarrito = []; 
              localStorage.clear();
              mostrarCarrito();
            };
          });
    } else {
        Swal.fire({
            title: "Carrito Vacío!",
            icon: "error",
        });
    }
}
   
// Funcion con Taostify para mostrar los Ingredientes y la Descripción de cada Producto

function mostrar(elemento){
    Toastify({
        text: elemento,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #b5651e, #855224)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}


//Muestro productos disponibles, con descripción, ingredientes, imagen y botón de compra con asincronía await

async function traerCafes(){
    try{
        response = await fetch(URL)
        cafes = await response.json()
                
        cafes.forEach((el, idx) => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerText = `${idx + 1}. ${el.title}`;
            
            const imgCafe = document.createElement("img");
            imgCafe.src = el.image;
            imgCafe.className = "imagen";
            imgCafe.alt = "NOIMG";
        
            const btnInfo = document.createElement("button");
            btnInfo.innerText = "Descripción";
            btnInfo.onclick = () => mostrar(`${el.description}`); 
            btnInfo.className = "btn";

            const btnIngredientes = document.createElement("button");
            btnIngredientes.innerText = "Ingredientes";
            let ingredientes = el.ingredients.join(", ");
            btnIngredientes.onclick = () => mostrar(`${(ingredientes)}`);
            btnIngredientes.className = "btn";
            
            const btnComprar = document.createElement("button");
            btnComprar.innerText = "Comprar";
            btnComprar.onclick = () => comprar(el.id);
            btnComprar.className = "btn";

            card.onmousemove = () => btnComprar.innerText = `Comprar $${el.precio}`;
            card.onmouseout = () => btnComprar.innerText = "Comprar";
            
            container.appendChild(card);
            card.appendChild(imgCafe);
            card.appendChild(btnInfo);
            card.appendChild(btnIngredientes);
            card.appendChild(btnComprar);
        }
        )
        return cafes;  
    } catch(err){
        console.log(err);
    } finally {
        console.log("finalizado");
    }
}   

// Fin