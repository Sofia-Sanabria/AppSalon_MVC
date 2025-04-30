document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

// Buena practica para cuando tenemos muchas funciones
function iniciarApp() {
    buscarPorFecha();
}

function buscarPorFecha() {
    const fechaInput = document.querySelector('#fecha');
    // Escucha la fecha seleccionada, utilizando 'target' para saber el valor
    fechaInput.addEventListener('input', function(e) {
        const fechaSeleccionada = e.target.value;

        // Redirecciona en el buscador a la fecha seleccionada
        window.location = `?fecha=${fechaSeleccionada}`;
    });
}