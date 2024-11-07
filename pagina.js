// Variables globales
let carrito = [];
let mesaSeleccionada = 0;

// Selección de mesa
const mesaSelect = document.getElementById("mesa");

// Cuando se cambia la mesa, actualizamos la mesa seleccionada
mesaSelect.addEventListener("change", (e) => {
    mesaSeleccionada = e.target.value;
    console.log(`Mesa seleccionada: ${mesaSeleccionada}`);
});

// Agregar productos al carrito
const botonesAgregar = document.querySelectorAll(".agregarCarrito");
botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", (e) => {
        const nombreProducto = e.target.getAttribute("data-nombre");
        const precioProducto = parseInt(e.target.getAttribute("data-precio"));
        const tamañoPapas = e.target.closest('.producto').querySelector('.selectTamaño') ? e.target.closest('.producto').querySelector('.selectTamaño').value : null;
        const bebida = e.target.closest('.producto').querySelector('.selectBebida') ? e.target.closest('.producto').querySelector('.selectBebida').value : null;

        // Si es el combo familiar, tomar las dos bebidas elegidas
        let bebidasCombo = [];
        if (nombreProducto === "Combo Familiar") {
            bebidasCombo = Array.from(e.target.closest('.producto').querySelectorAll('.selectBebida'))
                .map(select => select.value)
                .filter(value => value); // Filtramos los valores vacíos
        }

        // Comprobar si el producto ya existe en el carrito
        const productoExistente = carrito.find(producto => producto.nombre === nombreProducto && producto.tamaño === tamañoPapas && JSON.stringify(producto.bebidas) === JSON.stringify(bebidasCombo) && producto.bebida === bebida);

        if (productoExistente) {
            // Si el producto ya existe, incrementar la cantidad
            productoExistente.cantidad += 1;
        } else {
            // Si el producto no existe, agregarlo al carrito
            carrito.push({
                nombre: nombreProducto,
                precio: bebida ? parseInt(bebida) : precioProducto,
                cantidad: 1,
                tamaño: tamañoPapas,
                bebida: bebida,
                bebidas: bebidasCombo
            });
        }

        // Mostrar el carrito
        mostrarCarrito();
    });
});

// Función para mostrar el carrito
function mostrarCarrito() {
    const carritoDiv = document.getElementById("productosCarrito");
    const totalDiv = document.getElementById("totalCarrito");

    carritoDiv.innerHTML = '';
    let total = 0;
    carrito.forEach((producto) => {
        let detalleProducto = `${producto.nombre} - $${producto.precio} x ${producto.cantidad}`;
       
        if (producto.tamaño) {
            detalleProducto += ` (Tamaño: ${producto.tamaño === '150' ? 'Clásicas' : 'Grandes'})`;
        }

        // Mostrar bebida con nombre y precio
        if (producto.bebida && producto.nombre !== 'Combo Familiar') {
            const nombreBebida = obtenerNombreBebida(producto.bebida);
            detalleProducto += ` (Bebida: ${nombreBebida})`;
        }

        // Mostrar bebidas en combo con nombre
        if (producto.bebidas.length > 0 && producto.nombre === 'Combo Familiar') {
            detalleProducto += ` (Bebidas: ${producto.bebidas.map(bebida => obtenerNombreBebida(bebida)).join(', ')})`;
        }

        // Solo mostrar precio del combo sin bebidas para el Combo Familiar
        if (producto.nombre === "Combo Familiar") {
            detalleProducto = `${producto.nombre} - $${producto.precio} x ${producto.cantidad}`;
        }

        carritoDiv.innerHTML += `        
            <p>${detalleProducto}
                <button class="eliminarProducto" data-nombre="${producto.nombre}" data-tamaño="${producto.tamaño}" data-bebida="${producto.bebida}" data-bebidas="${producto.bebidas.join(', ')}">Eliminar</button>
            </p>
        `;
        total += producto.precio * producto.cantidad;
    });

    totalDiv.innerHTML = `Total: $${total}`;
    document.getElementById("carrito").style.display = 'block'; // Mostrar carrito
    agregarEventosEliminar();
}

// Función para obtener el nombre de la bebida según el valor
function obtenerNombreBebida(bebida) {
    switch (bebida) {
        case '100':
            return 'Coca Cola';
        case '100':
            return 'Fanta';
        case '100':
            return 'Sprite';
        case '100':
            return 'Coca Cola Zero';        
        case '50':
            return 'Agua';
        case '75':
            return 'Agua Saborizada';
        default:
            return 'Bebida desconocida';
    }
}

// Eliminar productos del carrito
function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll(".eliminarProducto");
    botonesEliminar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const nombreProducto = e.target.getAttribute("data-nombre");
            const tamaño = e.target.getAttribute("data-tamaño");
            const bebida = e.target.getAttribute("data-bebida");
            const bebidas = e.target.getAttribute("data-bebidas").split(', ');

            // Filtrar el carrito para eliminar el producto
            carrito = carrito.filter((producto) => !(producto.nombre === nombreProducto && producto.tamaño === tamaño && producto.bebida === bebida && JSON.stringify(producto.bebidas) === JSON.stringify(bebidas)));
            mostrarCarrito();
        });
    });
}

// Vaciar carrito
document.getElementById("vaciarCarrito").addEventListener("click", () => {
    carrito = [];
    mostrarCarrito();
    document.getElementById("carrito").style.display = 'none'; // Ocultar carrito
});

// Confirmar pedido
document.getElementById("confirmarPedido").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
    } else {
        alert(`Pedido confirmado. Mesa: ${mesaSeleccionada}`);
        carrito = [];
        mostrarCarrito();
        document.getElementById("carrito").style.display = 'none'; // Ocultar carrito
    }
});

// Agregar funcionalidad de abrir/cerrar el carrito
const carritoDiv = document.getElementById("carrito");
const carritoBtn = document.getElementById("carritoBtn");

// Cuando se hace clic en el icono del carrito
carritoBtn.addEventListener("click", () => {
    if (carritoDiv.style.display === 'none' || carritoDiv.style.display === '') {
        // Mostrar el carrito
        carritoDiv.style.display = 'block';
        // Colocar el icono del carrito en la parte superior
        carritoBtn.style.position = 'absolute';
        carritoBtn.style.bottom = 'auto';
        carritoBtn.style.top = '20px';
    } else {
        // Ocultar el carrito
        carritoDiv.style.display = 'none';
        // Colocar el icono del carrito en la parte inferior
        carritoBtn.style.position = 'fixed';
        carritoBtn.style.bottom = '20px';
        carritoBtn.style.top = 'auto';
    }
});
