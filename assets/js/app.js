document.addEventListener("DOMContentLoaded", () => {

    loadNavbar();
    loadFooter();

});

function loadNavbar() {

    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    fetch("components/navbar.html")
        .then(response => response.text())
        .then(data => {

            navbar.innerHTML = data;

        });

}
function loadFooter() {

    const footer = document.getElementById("footer");

    if (!footer) return;

    fetch("components/footer.html")
        .then(response => response.text())
        .then(data => {

            footer.innerHTML = data;

        });

}