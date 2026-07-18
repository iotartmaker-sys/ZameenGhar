const propertyForm = document.getElementById("propertyForm");

propertyForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = firebase.auth().currentUser;

    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const publishBtn = document.getElementById("publishBtn");

    publishBtn.disabled = true;
    publishBtn.innerHTML = "Publishing...";

    try {

        await db.collection("properties").add({

            title: document.getElementById("title").value.trim(),

            type: document.getElementById("type").value,

            purpose: document.getElementById("purpose").value,

            price: Number(document.getElementById("price").value),

            state: document.getElementById("state").value,

            city: document.getElementById("city").value.trim(),

            address: document.getElementById("address").value.trim(),

            area: Number(document.getElementById("area").value || 0),

            bedrooms: Number(document.getElementById("bedrooms").value || 0),

            bathrooms: Number(document.getElementById("bathrooms").value || 0),

            parking: document.getElementById("parking").value,

            description: document.getElementById("description").value.trim(),

            contactName: document.getElementById("contactName").value.trim(),

            mobile: document.getElementById("mobile").value.trim(),

            whatsapp: document.getElementById("whatsapp").value.trim(),

            ownerId: user.uid,

            ownerEmail: user.email,

            status: "Pending",

            featured: false,

            views: 0,

            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        alert("✅ Property Published Successfully");

        propertyForm.reset();

        window.location.href = "dashboard.html";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

    publishBtn.disabled = false;

    publishBtn.innerHTML = '<i class="bi bi-cloud-upload-fill"></i> Publish Property';

});