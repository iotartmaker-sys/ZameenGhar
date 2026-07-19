// ======================================
// ZameenGhar - Home Page
// assets/js/home.js
// ======================================

const db = firebase.firestore();

const propertyList = document.getElementById("propertyList");

loadProperties();

async function loadProperties() {

    propertyList.innerHTML = `

    <div class="col-12 text-center py-5">

        <div class="spinner-border text-success"></div>

        <p class="mt-3">Loading Properties...</p>

    </div>

    `;

    try {

        const snapshot = await db
            .collection("properties")
            .get();

        if (snapshot.empty) {

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

        snapshot.forEach(doc => {

            const p = doc.data();

            let image =
                "https://placehold.co/600x400?text=ZameenGhar";

            if (p.imageUrls &&
                p.imageUrls.length > 0) {

                image = p.imageUrls[0];

            }

            propertyList.innerHTML += `

            <div class="col-lg-4 col-md-6">

                <div class="card shadow-sm border-0 rounded-4 h-100">

                    <img
                        src="${image}"
                        class="card-img-top"
                        style="height:220px;object-fit:cover;">

                    <div class="card-body">

                        <h5 class="fw-bold">

                            ${p.title}

                        </h5>

                        <p class="text-muted mb-2">

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

    }

    catch (error) {

        console.error(error);

        propertyList.innerHTML = `

        <div class="col-12">

            <div class="alert alert-danger">

                ${error.message}

            </div>

        </div>

        `;

    }

}