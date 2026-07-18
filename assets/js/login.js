const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    try {

        await auth.signInWithEmailAndPassword(email, password);

        alert("Login Successful ✅");

        window.location.href = "dashboard.html";

    }

    catch (error) {

        alert(error.message);

    }

});