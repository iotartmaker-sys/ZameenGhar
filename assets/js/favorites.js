firebase.auth().onAuthStateChanged(async function(user){

    if(!user){

        window.location.href = "login.html";

        return;

    }

    const container = document.getElementById("favoriteProperties");

    // ==========================
    // Load Favorite IDs
    // ==========================

    const favoriteSnapshot = await db
    .collection("favorites")
    .where("userId", "==", user.uid)
    .get();

    if (favoriteSnapshot.empty) {

        container.innerHTML = `

        <div class="col-12">

            <div class="alert alert-warning text-center">

                ❤️ You have no favorite properties.

            </div>

        </div>

        `;

        return;

    }
    
    container.innerHTML = "";

    for (const favorite of favoriteSnapshot.docs) {

        const propertyId = favorite.data().propertyId;

        const propertyDoc = await db
        .collection("properties")
        .doc(propertyId)
        .get();

        if (!propertyDoc.exists) continue;

        const property = propertyDoc.data();

        const image =

            (property.images && property.images.length > 0)

            ? property.images[0]

            : CONFIG.DEFAULT_PROPERTY_IMAGE;

    
            container.innerHTML += `

            <div class="col-lg-4 col-md-6">
        
                <div class="card shadow-sm border-0 rounded-4 h-100">
        
                    <img
                        src="${image}"
                        class="card-img-top"
                        style="height:220px;object-fit:cover;">
        
                    <div class="card-body">
        
                        <h5 class="fw-bold">
        
                            ${property.title}
        
                        </h5>
        
                        <p class="text-muted">
        
                            📍 ${property.city}, ${property.state}
        
                        </p>
        
                        <h4 class="text-success">
        
                            ₹${Number(property.price).toLocaleString("en-IN")}
        
                        </h4>
        
                        <a
                        href="property-details.html?id=${propertyDoc.id}"
                        class="btn btn-success w-100">
        
                        View Details
        
                        </a>
        
                    </div>
        
                </div>
        
            </div>
        
            `;
        
        }


    container.innerHTML = `

    <div class="text-center py-5">

        <div class="spinner-border text-success"></div>

        <p class="mt-3">

            Loading Favorites...

        </p>

    </div>

    ;

});