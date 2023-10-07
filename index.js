// scripts.js

let prevScrollPos = window.pageYOffset;
let headerTimeout; // Variable para el retraso

window.onscroll = function() {
    const currentScrollPos = window.pageYOffset;
    const header = document.querySelector('header');

    if (prevScrollPos > currentScrollPos) {
        // Si el usuario hace scroll hacia arriba, muestra el encabezado
        header.style.opacity = "1";
        
        // Establece un tiempo de enfriamiento de 500 milisegundos (ajustable)
        clearTimeout(headerTimeout);
        headerTimeout = setTimeout(function() {
            header.style.opacity = "0"; // Vuelve a desvanecer el encabezado
        }, 500); // 500 milisegundos de tiempo de enfriamiento (ajustable)
    } else {
        // Si el usuario hace scroll hacia abajo, desvanece gradualmente el encabezado
        header.style.opacity = "0"; // Puedes ajustar la opacidad deseada
    }

    prevScrollPos = currentScrollPos;
}
