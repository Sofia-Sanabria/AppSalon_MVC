let paso = 1; // Valor variable (Puede cambiar de valor)
const pasoInicial = 1; // El valor no cambia nunca
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // Muestra y oculta las secciones
    tabs(); // Cambia la seccion cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botoner de paginador
    paginaAnterior();
    paginaSiguiente();

    consultarAPI(); // Consulta la API en el backend de JavaScript

    idCliente(); // Devuelve el id del cliente para insertarlo en la base de datos
    nombreCliente(); // Añade el nombre del cliente en la cita
    seleccionarFecha(); // Añade la hora de la cita 
    seleccionarHora(); // Añade la fecha de la cita

    mostrarResumen(); // Muestra un resumen de la cita
}

function mostrarSeccion() {

    // Ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar'); // Se coloca un punto en la clase cuando es un selector
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }

    // Seleccionar la seccion con el paso
    const seccion = document.querySelector(`#paso-${paso}`);
    seccion.classList.add('mostrar');

    // Quita la clase de actual al tab actual
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual')
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');

    // No addEventListener cuando hay querySelectorAll directamente
    // Se debe iterar sobre los botones para escuchar el evento
    botones.forEach( boton => {
        boton.addEventListener('click', function(evento) {
            evento.preventDefault();
            // Acceder a atributos creados por mi misma en HTML
            paso = parseInt(evento.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        })
    });
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        // En el paso 3 se manda a llamar el resumen de la cita
        mostrarResumen();
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();   
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector(`#anterior`);
    paginaAnterior.addEventListener('click', function() {
         
        if(paso <= pasoInicial) return;
        paso--; //Para que vaya de uno en uno hacia atras
        
        botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector(`#siguiente`);
    paginaSiguiente.addEventListener('click', function() {

        if (paso >= pasoFinal) return; 
        paso++; //Para que vaya de uno en uno hacia adelante

        botonesPaginador();
    });
}

// 'async' Otras funciones se pueden ejecutar mientras esta se esta ejecutando
async function consultarAPI() {

    // 'try catch' Intenta ejecutar lo que esta en try, si hay errore muestra un mensaje 
    // Pero el resto de las funciones siguen funcionando
    try {
        // `${location.origin}` => Si el proyecto esta en otro dominio 
        // Detecta donde se esta ejecutando el codigo y lo agrega
        const url = '/api/servicios';
        // 'await' Detiene la ejecucion de las siguientes lineas, hasta que no se completen
        // 'await' Espera a que carguen todos los servicios, para ejecutar las siguientes funciones
        // async y await se utilizan juntos, ideales para APIs
        const resultado = await fetch(url); // 'fech' Funcion que permite consumier este servicio

        // 'json' Metodo para traer todo lo que este en resultado
        const servicios = await resultado.json();
        mostrarServicios(servicios);

    } catch (error) {
        console.log(error);
    }
}

function mostrarServicios(servicios) {
    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio;

        // Desarrollo por scrpting
        const nombreServicio = document.createElement('P'); // Utilizar esta sintaxis en mayuscula 
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P'); // 'P' para parrafo
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDIV = document.createElement('DIV'); // En html aparecera en minuscula
        servicioDIV.classList.add('servicio');
        servicioDIV.dataset.idServicio = id; // Atributo personalizado, muestra el resultado de isServicio
        // Funcion que se va a ejecutar cuando de click en ese DIV
        servicioDIV.onclick = function () { // Se agrega en una funcion para cuando hagas click en un servicio, aparezca solo ese servicio 
            seleccionarServicio(servicio)
        };

        // Adjuntar los parrafos al DIV
        servicioDIV.appendChild(nombreServicio);
        servicioDIV.appendChild(precioServicio);

        // Inyectar la iteracion de los servicios que estan cada DIV a la vista de servicios
        document.querySelector('#servicios').appendChild(servicioDIV);
    });
}

function seleccionarServicio(servicio) {
    const { id } = servicio; // Extraer los id y agregar a los servicios
    const { servicios } = cita; // Extraer los servicios y agregar al objeto de cita
    
    // Identificar el elemento al que se le da el click
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    // 'some' Array Method para Comprobar si un servicio ya fue agregado al objeto
    if( servicios.some( agregado => agregado.id === id ) ) {
        // Eliminarlo: 'filter' Array Method para eliminar un elemento basado en una condicion
        cita.servicios = servicios.filter( agregado => agregado.id !== id );
        divServicio.classList.remove('seleccionado'); 
 
    } else {
        // Agregarlo
        cita.servicios = [...servicios, servicio]; // Tomar una copia de lo que hay en el objeto de servicios y agregarle el nuevo servicio
        divServicio.classList.add('seleccionado'); 
    }
}

function idCliente() {
    cita.id = document.querySelector('#id').value; 
}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(evento) {
        
        // Devuelve el dia de la fecha seleccionada 
        const dia = new Date(evento.target.value).getUTCDay();

        // Condicionar los dias disponibles para citas
        if( [6, 0].includes(dia) ) {
            evento.target.value = ''; // Para que no guarde la fecha
            mostrarAlerta('Fines de semana no permitidos', 'error', '.formulario');
        } else {
            cita.fecha = evento.target.value;
        }

    });
}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(evento) {

        const horaCita = evento.target.value;
        const hora = horaCita.split(":")[0] // 'split' permite separar una cadena de texto
        
        // Condicionar las horas validas
        if(hora < 10 || hora > 18) {
            evento.target.value = ''; // Para que no guarde la fecha
            mostrarAlerta('Hora No Valida', 'error', '.formulario');
        } else {
            cita.hora = evento.target.value;

        }
    });
}

function mostrarAlerta (mensaje, tipo, elemento, desaparece = true) {

    // Elimina alertas previas para que no se solapen
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    // Mostrar una alerta para dias no permitidos
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    // Seleccionar el formulario
    const referencia = document.querySelector(elemento);
    // Agregar la alerta en el formulario
    referencia.appendChild(alerta);

    // Eliminar la alerta despues de 3 segundos
    if(desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');
    
    // Limipiar el contenido del resumen
    while( resumen.firstChild ) {
        resumen.removeChild(resumen.firstChild);
    }

    // Validar si el objeto de cita tiene campos vacios o si no se hayan seleccionado servicios
    if( Object.values(cita).includes('') || cita.servicios.length === 0 ) {
        mostrarAlerta('Faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen', false);
        return;
    }

    // Extraer todos los datos del objeto cita
    const { nombre, fecha, hora, servicios } = cita;

    // Heading para servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    // Iterar sobre los servicios seleccionados para mostrar en la vista de resumen
    servicios.forEach(servicio => {
        const { id, nombre, precio } = servicio;

         /** Scripting */

        // Colocar los servicios en un contenedor
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        // Colocar el nombre del servicio en un parrafo
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        // Colocar el precio del servicio en un parrafo
        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

        // Agregar el nombre y precio del servicio en el DIV
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        // Agregar el contenedor de servicios en la vista de resumen
        resumen.appendChild(contenedorServicio);
    }); 

    // Heading para cita en Resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    resumen.appendChild(headingCita);
    
    /** Formatear el DIV de resumen */ 

    // Crear un parrafo con el nombre del cliente
    const nombreCliente = document.createElement('P');
    // 'innerHTML' Inyecta codigo html
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    // Formatear la fecha en el idima español
    const fechaOBJ = new Date(fecha);
    const mes = fechaOBJ.getMonth();
    const dia = fechaOBJ.getDate() + 2; // Cada vez que se instancia la fecha, hay un desface de un dia
    const year = fechaOBJ.getFullYear();

    /** Instanciar la fecha */
    // 'UTC' Retorna la fecha en formato de UNIX
    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    
    // Porporciona la fecha formateada en un idioma especifico
    // No modifica el dato original, devuelve un dato nuevo al instanciar
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaUTC.toLocaleDateString('es-MX', opciones);

    // Crear un parrafo con el fecha del cliente
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;
    
    // Crear un parrafo con el hora del cliente
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}hs`;

    // Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    // Mostrar a la vista el resumen
    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(botonReservar);
}

async function reservarCita() {

    const { id, fecha, hora, servicios } = cita;

    // Solo se requiere el id de los Servicios en la base de datos
    // 'map' las coincidencias las coloca en la variable
    const idServicios = servicios.map( servicio => servicio.id );
    
    // Enviar datos de formularios al servidor, crear un submit con JavaScript
    const datos = new FormData();

    // Agregar datos al FormData,
    // El primer campo se accede con POST, la segunda parte es la variable
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);

    /** Operaciones criticas, el try catch mostrara un mensaje indicando el error */
    try {

        // Peticion del servidor hacia la API
        const url = '/api/citas';

        // No sabemos cuanto tiempo va a tardar en realizar la peticion
        // Entonces async await bloquea la ejecucion del codigo
        const respuesta = await fetch(url, { // 'fech' permite la conexion con la API
            method: 'POST', // Metodo seleccionado
            body: datos // Cuerpo de la peticion que se envia

        });

        // Devuelve la respuesta de la API en formato JSON
        const resultado = await respuesta.json();

        // En el ActiveRecord el resultado marca true o false, al guardar a la base de datos
        if (resultado.resultado) {
            Swal.fire({ // Mensaje de confirmacion de sweetalert
                icon: "success",
                title: "Cita Creada",
                text: "Tu cita fue creada correctamente",
                button: 'OK'
            }).then( () => {
                setTimeout(() => {
                    window.location.reload(); // Recarga la pagina
                }, 1000);
            })
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita",
        });
    }

    // Ver los datos del FormData
    // console.log([...datos]);
}