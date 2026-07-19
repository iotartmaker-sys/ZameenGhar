// ==========================================
// ZameenGhar - Post Property
// assets/js/post-property.js
// ==========================================

const propertyForm = document.getElementById("propertyForm");
const publishBtn = document.getElementById("publishBtn");
const btnText = document.getElementById("btnText");
const statusMessage = document.getElementById("statusMessage");

// ------------------------------
// Login Check
// ------------------------------

firebase.auth().onAuthStateChanged(function (user) {

    if (!user) {

        alert("Please login first.");

        window.location.href = "login.html";

    }

});

// ------------------------------
// Submit Property
// ------------------------------

propertyForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const user = firebase.auth().currentUser;

    if (!user) {

        alert("Please login first.");

        return;

    }

    publishBtn.disabled = true;

    if (btnText) {
        btnText.innerHTML = "Publishing...";
    } else {
        publishBtn.innerHTML = "Publishing...";
    }

    if (statusMessage) {
        statusMessage.innerHTML = "";
    }

    try {

        const propertyData = {

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

            ownerName: user.displayName || "",

            imageUrls: [],

            featured: false,

            status: "Pending",

            views: 0,

            favorites: 0,

            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        };

        await db.collection("properties").add(propertyData);

        if (statusMessage) {

            statusMessage.innerHTML = `

                <div class="alert alert-success">

                    ✅ Property Published Successfully.

                </div>

            `;

        }

        propertyForm.reset();

        setTimeout(function () {

            window.location.href = "dashboard.html";

        }, 1200);

    }

    catch (error) {

        console.error(error);

        if (statusMessage) {

            statusMessage.innerHTML = `

                <div class="alert alert-danger">

                    ${error.message}

                </div>

            `;

        } else {

            alert(error.message);

        }

    }

    publishBtn.disabled = false;

    if (btnText) {

        btnText.innerHTML = "Publish Property";

    } else {

        publishBtn.innerHTML =
            '<i class="bi bi-cloud-upload-fill"></i> Publish Property';

    }

});