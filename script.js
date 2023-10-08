document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");

    menuToggle.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
});

function filterResources(option) {
    // Ocultar todos los recursos
    document.getElementById('papers').style.display = 'none';
    document.getElementById('revistas').style.display = 'none';
    document.getElementById('libros').style.display = 'none';

    // Mostrar recursos según la opción seleccionada
    document.getElementById(option).style.display = 'block';
}