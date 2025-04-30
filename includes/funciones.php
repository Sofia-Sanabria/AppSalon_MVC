<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function sanitizar($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

// Retorna el ultimo valor
function esUltimo(string $actual, string $proximo) : bool {

    if($actual !== $proximo) {
        return true;
    } else {
        return false;
    }
}

// Funcion que revisa que el usuario este autenticado
function estaAutenticado() : void {
    // Si no esta definido la variable de session
    // Manda al usuario al login
    if(!isset($_SESSION['login'])){
        header('Location: /');
    }
}

// Funcion que verifica que el usuario sea un administrador
function EsAdmin(): void {
    if(!isset($_SESSION['admin'])) {
        header('Location: /');
    }
}

