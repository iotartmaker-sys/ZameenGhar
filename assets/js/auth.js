firebase.auth().onAuthStateChanged(function (user) {

    // अगर Dashboard Page है
    if (window.location.pathname.includes("dashboard.html")) {

        if (!user) {

            window.location.href = "login.html";
            return;

        }

        // User Login है
        const welcome = document.getElementById("welcomeUser");

        if (welcome) {
            welcome.innerHTML = "👋 Welcome, " + (user.email || "User");
        }

    }

});
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        firebase.auth().signOut().then(() => {

            window.location.href = "login.html";

        });

    });

}