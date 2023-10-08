

function openMenu() {
    menu.style.width = "250px";
    // Agrega un evento click al documento para cerrar el menú si se hace clic fuera de él
    document.addEventListener("click", closeMenuOnClickOutside);
}

// Cierra el menú
function closeMenu() {
    menu.style.width = "0";
    // Remueve el evento click del documento después de cerrar el menú
    document.removeEventListener("click", closeMenuOnClickOutside);
}

function closeMenuOnClickOutside(event) {
    if (!menu.contains(event.target)) {
        closeMenu();
    }
}

function toggleMenu() {
    var menu = document.getElementById("menu");
    if (menu.style.width === "250px") {
        menu.style.width = "0";
    } else {
        menu.style.width = "250px";
    }
}