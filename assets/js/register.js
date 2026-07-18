const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    try {

        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        await db.collection("users").doc(userCredential.user.uid).set({

            name: name,
            email: email,
            phone: phone,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        alert("Registration Successful ✅");

        window.location.href = "login.html";

    }

    catch (error) {

        alert(error.message);

    }

});