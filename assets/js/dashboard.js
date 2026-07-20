firebase.auth().onAuthStateChanged(async function (user) {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Welcome
    const welcomeUser = document.getElementById("welcomeUser");
    if (welcomeUser) {
        welcomeUser.innerHTML = "👋 Welcome, " + (user.displayName || user.email);
    }

    // Profile
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    if (profileName) {
        profileName.innerHTML = user.displayName || "User";
    }

    if (profileEmail) {
        profileEmail.innerHTML = user.email;
    }

    const propertyContainer = document.getElementById("myProperties");

    const totalProperties = document.getElementById("totalProperties");
    const totalViews = document.getElementById("totalViews");
    const totalFavorites = document.getElementById("totalFavorites");

    let views = 0;
    let html = "";

    try {

        const snapshot = await db
        .collection("properties")
        .where("ownerId", "==", user.uid)
        .get();

        totalProperties.innerHTML = snapshot.size;

        if (snapshot.empty) {

            propertyContainer.innerHTML = `
                <div class="alert alert-warning text-center">
                    You have not posted any property yet.
                </div>
            `;

            return;
        }

        snapshot.forEach(function(doc){

            const property = doc.data();

            views += property.views || 0;

            html += `

<div class="card shadow-sm mb-3">

<div class="card-body">

<div class="row align-items-center">

<div class="col-md-8">

<h5 class="fw-bold">

${property.title}

</h5>

<p class="mb-1">

<i class="bi bi-geo-alt"></i>

${property.city}, ${property.state}

</p>

<p class="mb-1">

<strong class="text-success">

₹ ${Number(property.price).toLocaleString("en-IN")}

</strong>

</p>

<span class="badge bg-warning text-dark">

${property.status}

</span>

</div>

<div class="col-md-4 text-end">

<button
class="btn btn-primary btn-sm editBtn"
data-id="${doc.id}">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-danger btn-sm deleteBtn"
data-id="${doc.id}">

<i class="bi bi-trash"></i>

</button>

</div>

</div>

</div>

</div>

`;

        });

        propertyContainer.innerHTML = html;

        totalViews.innerHTML = views;

        totalFavorites.innerHTML = "0";

        // Delete Property

        document.querySelectorAll(".deleteBtn").forEach(function(btn){

            btn.addEventListener("click", async function(){

                const id = this.dataset.id;

                if(confirm("Delete this property?")){

                    await db.collection("properties").doc(id).delete();

                    location.reload();

                }

            });

        });

        // Edit Button

        document.querySelectorAll(".editBtn").forEach(function(btn){

            btn.addEventListener("click", function(){
        
                const id = this.dataset.id;
        
                window.location.href =
                "edit-property.html?id=" + id;
        
            });
        
        });

    }

    catch(error){

        console.error(error);

        propertyContainer.innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;

    }

});