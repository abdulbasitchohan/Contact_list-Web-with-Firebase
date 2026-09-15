// ===============================
// Firebase Realtime Database
// ===============================

const db = firebase.database();

// HTML Elements
const form = document.querySelector(".form");
const nameInp = document.getElementById("nameInp");
const emailInp = document.getElementById("emailInp");
const addBtn = document.getElementById("addBtn");


// ===============================
// Add Contact
// ===============================

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInp.value.trim();
  const email = emailInp.value.trim();

  // Validation
  if (name === "" || email === "") {
    alert("Please enter name and email.");
    return;
  }

  // Firebase v8 Realtime Database
  const contactRef = db.ref("contacts").push();

  contactRef
    .set({
      name: name,
      email: email
    })
    .then(() => {
      alert("Contact added successfully!");

      // Clear inputs
      nameInp.value = "";
      emailInp.value = "";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Something went wrong!");
    });
});


// ===============================
// Get Contacts
// ===============================

const contactsRef = db.ref("contacts");

contactsRef.on("value", function (snapshot) {

  // Agar contacts section pehle se HTML me nahi hai
  let contactsSection = document.querySelector(".contacts-section");

  if (!contactsSection) {
    contactsSection = document.createElement("section");
    contactsSection.classList.add("contacts-section");

    document.querySelector(".container").appendChild(contactsSection);
  }

  contactsSection.innerHTML = `
    <div class="contacts-header">
      <h2>All Contacts</h2>
      <span class="count">0 Contacts</span>
    </div>
    
    <div class="contacts-list"></div>
  `;

  const contactsList = contactsSection.querySelector(".contacts-list");
  const count = contactsSection.querySelector(".count");

  let totalContacts = 0;

  snapshot.forEach(function (childSnapshot) {

    totalContacts++;

    const contactId = childSnapshot.key;
    const contact = childSnapshot.val();

    const name = contact.name;
    const email = contact.email;

    // Avatar initials
    const initials = name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();

    // Contact Card
    const contactCard = document.createElement("div");
    contactCard.classList.add("contact-card");

    contactCard.innerHTML = `
      <div class="avatar">${initials}</div>

      <div class="contact-info">
        <h3>${name}</h3>
        <p>${email}</p>
      </div>

      <div class="actions">
        <button class="action-btn edit" title="Edit">
          ✎
        </button>

        <button class="action-btn delete" title="Delete">
          ⌫
        </button>
      </div>
    `;

    // ===============================
    // Delete Contact
    // ===============================

    const deleteBtn = contactCard.querySelector(".delete");

    deleteBtn.addEventListener("click", function () {

      const confirmDelete = confirm(
        `Are you sure you want to delete ${name}?`
      );

      if (!confirmDelete) {
        return;
      }

      db.ref("contacts/" + contactId)
        .remove()
        .then(() => {
          alert("Contact deleted successfully!");
        })
        .catch((error) => {
          console.error("Delete Error:", error);
          alert("Unable to delete contact.");
        });
    });


    // ===============================
    // Edit Contact
    // ===============================

    const editBtn = contactCard.querySelector(".edit");

    editBtn.addEventListener("click", function () {

      const newName = prompt("Enter new name:", name);

      if (newName === null) {
        return;
      }

      const newEmail = prompt("Enter new email:", email);

      if (newEmail === null) {
        return;
      }

      if (
        newName.trim() === "" ||
        newEmail.trim() === ""
      ) {
        alert("Name and email cannot be empty.");
        return;
      }

      db.ref("contacts/" + contactId)
        .update({
          name: newName.trim(),
          email: newEmail.trim()
        })
        .then(() => {
          alert("Contact updated successfully!");
        })
        .catch((error) => {
          console.error("Update Error:", error);
          alert("Unable to update contact.");
        });
    });


    contactsList.appendChild(contactCard);
  });

  // Update contact count
  count.textContent =
    totalContacts +
    (totalContacts === 1 ? " Contact" : " Contacts");
});