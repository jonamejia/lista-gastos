//Variables 
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
let presupuesto;


eventListener();
function eventListener() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGastos);
}



class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number( presupuesto );
        this.restante = Number( presupuesto );
        this.gastos = [];

    }

    nuevoGasto( gasto ) {
        const { nombre, cantidad, id } = gasto;
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos);
        this.calcularRestante();

    }

    calcularRestante() {
        const gastado = this.gastos.reduce( ( total, gasto ) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto( id ) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante();
    }

    
}

class UI {
    insertarPresupuesto( cantidad ) {
        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }

    imprimirAlerta(mensaje, tipo) {

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alert', 'text-center');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore( divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }
    mostrarGastos( gastos ) {

        this.limpiarHTML();
        
        gastos.forEach( gasto => {

            const { nombre, cantidad, id } = gasto;

            //Crear LI
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            // li.setAttribute('data-id', id);
            li.dataset.id = id;

            //agregar html al gasto
            li.innerHTML = `
                ${nombre} <span class="badge badge-primary badge-pill" >$ ${cantidad} </span>
            `;

            //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            li.appendChild(btnBorrar)


            //agregar html
            gastoListado.appendChild(li);
            
        });
    }


    limpiarHTML() {

        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarPresupuesto( restante ) {
        document.querySelector('#restante').textContent = restante;
        console.log(restante)

    }

    comprobarPresupuesto( presupuestoObj ) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //Si queda el 25%
        if( ( presupuesto / 4 ) > restante ) {

            console.log('has sobrepasado el 75% de presupuesto');
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');

        } else if( ( presupuesto / 2) > restante ) {
            restanteDiv.classList.remove('alert-danger', 'alert-succes');
            restanteDiv.classList.add('alert-warning');
            console.log('has pasado el 50% del presupuesto');

        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        if(restante <= 0) {
            ui.imprimirAlerta('EL presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        } else {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }
}

const ui = new UI();



function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Ingrese su presupuesto');


    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGastos( e ) {
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;

    } else if( cantidad <= 0 || isNaN( cantidad )) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
        
    }

    const gasto = { nombre, cantidad, id: Date.now() };

    presupuesto.nuevoGasto( gasto );

    ui.imprimirAlerta('Correcto', 'exito');

    const { gastos, restante } = presupuesto;

    ui.mostrarGastos( gastos );

    ui.actualizarPresupuesto( restante );

    ui.comprobarPresupuesto( presupuesto );

    formulario.reset();

}


function eliminarGasto( id ) {
    presupuesto.eliminarGasto(id);
    const { gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarPresupuesto( restante );

    ui.comprobarPresupuesto( presupuesto );
}
