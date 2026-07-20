// ======================================
// ZameenGhar - Home Page
// Part 1
// ======================================

// ------------------------------
// Elements
// ------------------------------

const propertyList = document.getElementById("propertyList");

let currentUser = null;

// ------------------------------
// Login Check
// ------------------------------

firebase.auth().onAuthStateChanged(function(user){

    currentUser = user;

    loadProperties();

});

// ------------------------------
// Load Properties
// ------------------------------

async function loadProperties(){

    propertyList.innerHTML = `

    <div class="col-12 text-center py-5">

        <div class="spinner-border text-success"></div>

        <p class="mt-3">
            Loading Properties...
        </p>

    </div>

    `;

    try{

        // --------------------------
        // Load All Properties
        // --------------------------

        const snapshot = await db
            .collection("properties")
            .get();

        if(snapshot.empty){

            propertyList.innerHTML = `

            <div class="col-12">

                <div class="alert alert-warning text-center">

                    No Properties Found.

                </div>

            </div>

            `;

            return;

        }

        propertyList.innerHTML = "";

        // --------------------------
        // Load Favorites
        // --------------------------

        let favoriteIds = [];

        if(currentUser){

            const favoriteSnapshot = await db
                .collection("favorites")
                .where("userId","==",currentUser.uid)
                .get();

            favoriteSnapshot.forEach(function(doc){

                favoriteIds.push(
                    doc.data().propertyId
                );

            });

        }

        // --------------------------
        // Property Cards
        // --------------------------

        snapshot.forEach(function(doc){

            const p = doc.data();

            let image =
            "https://placehold.co/600x400?text=ZameenGhar";

            if(p.images && p.images.length>0){

                image = p.images[0];

            }            propertyList.innerHTML += `

            <div class="col-lg-4 col-md-6 mb-4">

                <div class="card shadow-sm border-0 rounded-4 h-100 position-relative">

                    <img
                        src="${image}"
                        class="card-img-top"
                        style="height:220px;object-fit:cover;">

                    <button
                        class="btn ${
                            favoriteIds.includes(doc.id)
                                ? "btn-danger"
                                : "btn-light"
                        } rounded-circle position-absolute top-0 end-0 m-2 favoriteBtn"
                        data-id="${doc.id}">

                        <i class="bi ${
                            favoriteIds.includes(doc.id)
                                ? "bi-heart-fill"
                                : "bi-heart"
                        }"></i>

                    </button>

                    <div class="card-body">

                        <h5 class="fw-bold">

                            ${p.title}

                        </h5>

                        <p class="text-muted">

                            <i class="bi bi-geo-alt-fill text-danger"></i>

                            ${p.city}, ${p.state}

                        </p>

                        <h4 class="text-success">

                            ₹ ${Number(p.price).toLocaleString("en-IN")}

                        </h4>

                        <div class="d-flex justify-content-between mt-3">

                            <span class="badge bg-success">

                                ${p.type}

                            </span>

                            <span class="badge bg-primary">

                                ${p.purpose}

                            </span>

                        </div>

                    </div>

                    <div class="card-footer bg-white border-0">

                        <a
                            href="property-details.html?id=${doc.id}"
                            class="btn btn-success w-100">

                            View Details

                        </a>

                    </div>

                </div>

            </div>

            `;

        });

        // ==========================
        // Favorite Button Events
        // ==========================

        document.querySelectorAll(".favoriteBtn").forEach(function(btn){            btn.addEventListener("click", async function(e){

            e.preventDefault();
            e.stopPropagation();

            if(!currentUser){

                alert("Please login first.");

                window.location.href = "login.html";

                return;

            }

            const propertyId = this.dataset.id;

            try{

                const snapshot = await db
                    .collection("favorites")
                    .where("userId","==",currentUser.uid)
                    .where("propertyId","==",propertyId)
                    .get();

                if(snapshot.empty){

                    await db.collection("favorites").add({

                        userId: currentUser.uid,

                        propertyId: propertyId,

                        createdAt: firebase.firestore.FieldValue.serverTimestamp()

                    });

                    this.classList.remove("btn-light");
                    this.classList.add("btn-danger");

                    this.innerHTML = `
                        <i class="bi bi-heart-fill"></i>
                    `;

                }

                else{

                    for(const doc of snapshot.docs){

                        await doc.ref.delete();

                    }

                    this.classList.remove("btn-danger");
                    this.classList.add("btn-light");

                    this.innerHTML = `
                        <i class="bi bi-heart"></i>
                    `;

                }

            }

            catch(error){

                console.error(error);

                alert(error.message);

            }

        });

    });

}

catch(error){

    console.error(error);

    propertyList.innerHTML = `

    <div class="col-12">

        <div class="alert alert-danger text-center">

            ${error.message}

        </div>

    </div>

    `;

}

}