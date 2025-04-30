<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIControllers {
    public static function index() {
        $servicios = Servicio::all();
        // Convertir arreglos en JSON (serie de objetos)
        // Un arreglo asociativo es lo mismo que un objeto en JavaScript
        // Entonces asi se pueden comunicar
        echo json_encode($servicios);
        
    }

    public static function guardar() {
        
        // Almacena la Cita y devuelve el Id
        $cita = new Cita($_POST);
        $resultado = $cita->guardar(); // Guarda el resultado en la base de datos

        // Extrae el id
        $id = $resultado['id'];
        
        // 'explode()' separa el string por comas y lo convierte en un arreglo
        $idServicios = explode(",", $_POST['servicios'] );

        // Almacena las Citas y los Servicios
        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];
            
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar(); // Guadar los servicios de la cita en la base de datos
        }

        // Un arreglo asociativo es equivalente a un objeto en JavaScript
        // $respuesta = [
        //     'cita' => $cita
        // ];

        echo json_encode(['resultado' => $resultado]);

    }

    public static function eliminar() {
        // Asegurar que solo se ejecute cuando es un metodo POST
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            
            $cita = Cita::find($id);
            $cita->eliminar();

            // Redirecciona a la pagina anterior
            header('Location: ' . $_SERVER['HTTP_REFERER']);
        }
    }
}