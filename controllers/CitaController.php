<?php 

namespace Controllers;

use MVC\Router;

class CitaController {

    public static function index (Router $router) {

        // Arrancar la session de nuevo
        session_start();

        // Ejecuta la funcion para comprobar si el usuario esta autenticado
        estaAutenticado();

        $router->render('cita/index', [
            'nombre' => $_SESSION['nombre'],
            'id' => $_SESSION['id']
        ]);
    }
}