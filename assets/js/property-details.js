// Get Property ID From URL

const params = new URLSearchParams(window.location.search);

const propertyId = params.get("id");

if (!propertyId) {

    alert("Property not found.");

    window.location.href = "index.html";

}

// Firestore Reference

const propertyRef = db.collection("properties").doc(propertyId);

// Load Property

propertyRef.get().then(async (doc) => {

    if (!doc.exists) {

        alert("Property not found.");

        window.location.href = "index.html";

        return;

    }

    const property = doc.data();
    
    // ==========================
    // Favorite Button
    // ==========================

    const favoriteBtn = document.getElementById("favoriteBtn");




    // Increase Views

    await propertyRef.update({

        views: firebase.firestore.FieldValue.increment(1)

    });
    // Property Header

    document.getElementById("propertyTitle").innerText =
        property.title || "No Title";

    document.getElementById("propertyLocation").innerText =
        `${property.city}, ${property.state}`;

    document.getElementById("propertyPrice").innerText =
        "₹" + Number(property.price).toLocaleString("en-IN");

    // Main Image

    const mainImage = document.getElementById("propertyImage");

    const gallery = document.getElementById("imageGallery");

    gallery.innerHTML = "";

    if (property.images && property.images.length > 0) {

        mainImage.src = property.images[0];

        property.images.forEach((image) => {

            gallery.innerHTML += `

            <div class="col-3 col-md-2">

                <img

                    src="${image}"

                    class="img-fluid rounded shadow-sm"

                    style="
                        height:90px;
                        width:100%;
                        object-fit:cover;
                        cursor:pointer;
                    "

                    onclick="changeImage('${image}')">

            </div>

            `;

        });

    }
    else{

        mainImage.src =
        "https://placehold.co/1200x700?text=No+Image";

    }

    // Property Details

    document.getElementById("propertyBedrooms").innerText =
        property.bedrooms + " Bedrooms";

    document.getElementById("propertyBathrooms").innerText =
        property.bathrooms + " Bathrooms";

    document.getElementById("propertyParking").innerText =
        property.parking;

    document.getElementById("propertyArea").innerText =
        property.area + " Sq.ft";

    document.getElementById("propertyDescription").innerText =
        property.description || "No description available.";
    // ==========================
    // Check Favorite Status
    // ==========================

    const currentUser = firebase.auth().currentUser;

    if (currentUser && favoriteBtn) {

        const favoriteSnapshot = await db
            .collection("favorites")
            .where("userId", "==", currentUser.uid)
            .where("propertyId", "==", propertyId)
            .get();

        if (!favoriteSnapshot.empty) {

            favoriteBtn.classList.remove("btn-outline-danger");
            favoriteBtn.classList.add("btn-danger");

            favoriteBtn.innerHTML = `
                <i class="bi bi-heart-fill"></i>
                Saved
            `;

        }

    }



    favoriteBtn.addEventListener("click", async function () {

        const user = firebase.auth().currentUser;
    
        if (!user) {
    
            alert("Please login first.");
    
            window.location.href = "login.html";
    
            return;
    
        }
    
        const snapshot = await db
            .collection("favorites")
            .where("userId", "==", user.uid)
            .where("propertyId", "==", propertyId)
            .get();
    
        if (snapshot.empty) {
    
            await db.collection("favorites").add({
    
                userId: user.uid,
    
                propertyId: propertyId,
    
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
    
            });
    
            favoriteBtn.classList.remove("btn-outline-danger");
            favoriteBtn.classList.add("btn-danger");
    
            favoriteBtn.innerHTML = `
                <i class="bi bi-heart-fill"></i>
                Saved
            `;
    
        } else {
    
            snapshot.forEach(async function(doc){
    
                await doc.ref.delete();
    
            });
    
            favoriteBtn.classList.remove("btn-danger");
            favoriteBtn.classList.add("btn-outline-danger");
    
            favoriteBtn.innerHTML = `
                <i class="bi bi-heart"></i>
                Save Property
            `;
    
        }
    
    });


        


    
    // Owner Information

    document.getElementById("ownerName").innerText =
        property.contactName || "Property Owner";

    document.getElementById("callBtn").href =
        `tel:${property.mobile}`;

    document.getElementById("whatsappBtn").href =
        `https://wa.me/${property.whatsapp}`;

    document.getElementById("emailBtn").href =
        `mailto:${property.ownerEmail}`;
            // ==========================
    // Similar Properties
    // ==========================

    const similarContainer =
    document.getElementById("similarProperties");

db.collection("properties")

    .where("status", "==", "Approved")

    .where("type", "==", property.type)

    .limit(3)

    .get()

    .then((snapshot) => {

        similarContainer.innerHTML = "";

        snapshot.forEach((item) => {

            if (item.id === propertyId) return;

            const p = item.data();

            const image =

                (p.images && p.images.length > 0)

                    ? p.images[0]

                    : "https://placehold.co/600x400?text=ZameenGhar";

            similarContainer.innerHTML += `

            <div class="col-lg-4">

                <div class="card shadow-sm border-0 rounded-4 h-100">

                    <img src="${image}"

                         class="card-img-top"

                         style="height:220px;object-fit:cover;">

                    <div class="card-body">

                        <h5>${p.title}</h5>

                        <p class="text-muted">

                            📍 ${p.city}, ${p.state}

                        </p>

                        <h4 class="text-success">

                            ₹${Number(p.price).toLocaleString("en-IN")}

                        </h4>

                        <a

                        href="property-details.html?id=${item.id}"

                        class="btn btn-success w-100">

                        View Details

                        </a>

                    </div>

                </div>

            </div>

            `;

        });

    });

})

.catch((error)=>{

console.error(error);

alert(error.message);

});
function changeImage(image){

    document.getElementById("propertyImage").src = image;

}