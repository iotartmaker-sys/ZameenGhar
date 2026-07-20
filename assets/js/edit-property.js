// ======================================
// Edit Property - ZameenGhar
// Part 1
// ======================================

// ------------------------------
// Get Property ID
// ------------------------------

const params = new URLSearchParams(window.location.search);
const propertyId = params.get("id");

if (!propertyId) {

    alert("Property not found.");

    window.location.href = "dashboard.html";

}

// ------------------------------
// Form Elements
// ------------------------------

const propertyForm = document.getElementById("propertyForm");
const updateBtn = document.getElementById("updateBtn");

const imageInput = document.getElementById("images");
const imagePreview = document.getElementById("imagePreview");

// ------------------------------
// Variables
// ------------------------------

let property = {};
let imageUrls = [];

// ------------------------------
// Image Preview
// ------------------------------

if (imageInput) {

    imageInput.addEventListener("change", function () {

        imagePreview.innerHTML = "";

        Array.from(this.files).forEach(function(file){

            const reader = new FileReader();

            reader.onload = function(e){

                imagePreview.innerHTML += `

                <div class="col-md-3 col-6 mb-3">

                    <img
                        src="${e.target.result}"
                        class="img-fluid rounded shadow"
                        style="
                            height:120px;
                            width:100%;
                            object-fit:cover;
                        ">

                </div>

                `;

            };

            reader.readAsDataURL(file);

        });

    });

}

// ------------------------------
// Upload Images To Cloudinary
// ------------------------------

async function uploadImages(files){

    const uploadedImages = [];

    for(const file of files){

        const formData = new FormData();

        formData.append("file", file);

        formData.append(
            "upload_preset",
            CLOUDINARY_UPLOAD_PRESET
        );

        const response = await fetch(

            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,

            {

                method: "POST",

                body: formData

            }

        );

        const data = await response.json();

        uploadedImages.push(data.secure_url);

    }

    return uploadedImages;

}
// ======================================
// Render Old Images
// ======================================

function renderOldImages() {

    const oldImages = document.getElementById("oldImages");

    if (!oldImages) return;

    oldImages.innerHTML = "";

    if (imageUrls.length === 0) {

        oldImages.innerHTML = `

        <div class="col-12">

            <div class="alert alert-light text-center">

                No Images Available

            </div>

        </div>

        `;

        return;

    }

    imageUrls.forEach(function(image, index){

        oldImages.innerHTML += `

        <div class="col-6 col-md-3">

            <div class="position-relative">

                <img
                    src="${image}"
                    class="img-fluid rounded shadow"
                    style="
                        height:120px;
                        width:100%;
                        object-fit:cover;
                    ">

                <button
                    type="button"
                    class="btn btn-danger btn-sm position-absolute top-0 end-0 deleteImageBtn"
                    data-index="${index}">

                    <i class="bi bi-x-lg"></i>

                </button>

            </div>

        </div>

        `;

    });

    document.querySelectorAll(".deleteImageBtn").forEach(function(btn){

        btn.addEventListener("click", function(){

            if(!confirm("Delete this image?")) return;

            const index = Number(this.dataset.index);

            imageUrls.splice(index, 1);

            renderOldImages();

        });

    });

}

// ======================================
// Login Check
// ======================================

firebase.auth().onAuthStateChanged(async function(user){

    if(!user){

        window.location.href = "login.html";

        return;

    }

    try{

        const doc = await db
        .collection("properties")
        .doc(propertyId)
        .get();

        if(!doc.exists){

            alert("Property not found.");

            window.location.href = "dashboard.html";

            return;

        }

        property = doc.data();

        if(property.ownerId !== user.uid){

            alert("You are not allowed to edit this property.");

            window.location.href = "dashboard.html";

            return;

        }

        imageUrls = property.images || [];

        renderOldImages();

        // ==========================
        // Fill Form
        // ==========================

        document.getElementById("title").value =
            property.title || "";

        document.getElementById("type").value =
            property.type || "";

        document.getElementById("purpose").value =
            property.purpose || "";

        document.getElementById("price").value =
            property.price || "";

        document.getElementById("state").value =
            property.state || "";

        document.getElementById("city").value =
            property.city || "";

        document.getElementById("address").value =
            property.address || "";

        document.getElementById("area").value =
            property.area || "";

        document.getElementById("bedrooms").value =
            property.bedrooms || "";

        document.getElementById("bathrooms").value =
            property.bathrooms || "";

        document.getElementById("parking").value =
            property.parking || "Yes";

        document.getElementById("description").value =
            property.description || "";

        document.getElementById("contactName").value =
            property.contactName || "";

        document.getElementById("mobile").value =
            property.mobile || "";

        document.getElementById("whatsapp").value =
            property.whatsapp || "";
                    // ==========================
        // Update Property
        // ==========================

        propertyForm.addEventListener("submit", async function(e){

            e.preventDefault();

            updateBtn.disabled = true;
            updateBtn.innerHTML = "Updating...";

            try{

                // --------------------------
                // Upload New Images
                // --------------------------

                if(imageInput.files.length > 0){

                    const newImages = await uploadImages(imageInput.files);

                    imageUrls = imageUrls.concat(newImages);

                }

                // --------------------------
                // Update Firestore
                // --------------------------

                await db.collection("properties")
                .doc(propertyId)
                .update({

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

                    images: imageUrls,

                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()

                });

                alert("✅ Property Updated Successfully");

                window.location.href = "dashboard.html";

            }

            catch(error){

                console.error(error);

                alert(error.message);

            }

            updateBtn.disabled = false;

            updateBtn.innerHTML = `
                <i class="bi bi-check-circle"></i>
                Update Property
            `;

        });

    }

    catch(error){

        console.error(error);

        alert(error.message);

        window.location.href = "dashboard.html";

    }

});
