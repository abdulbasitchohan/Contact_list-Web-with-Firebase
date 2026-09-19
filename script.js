
const form = document.querySelector(".form");
const nameInp = document.getElementById("nameInp");
const emailInp = document.getElementById("emailInp");
const contactsList = document.querySelector(".contacts-list");

// console.log(form + nameInp + emailInp + contactsList);

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = nameInp.value.trim();
    const email = emailInp.value.trim();

    if (name === "" || email === "") {
        alert("Please enter name and email.");
        return;
    }

    const newContact = firebase.database().ref("contacts").push();

    newContact.set({
        name: name,
        email: email
    })
        .then(function () {

            alert("Contact added successfully!");

            nameInp.value = "";
            emailInp.value = "";

        })
        .catch(function (error) {

            console.log(error);
            alert("Something went wrong!");

        });

});


const contactsRef = firebase.database().ref("contacts");


contactsRef.on("value", function (snapshot) {

    // Clear old contacts
    contactsList.innerHTML = "";


    let totalContacts = 0;

    snapshot.forEach(function (childSnapshot) {

        totalContacts++;


        const id = childSnapshot.key;

        const contact = childSnapshot.val();


        const name = contact.name;
        const email = contact.email;

        const card = document.createElement("div");

        card.classList.add("contact-card");


        card.innerHTML = `
    
      <div class="contact-info">
        <h3>${name}</h3>
        <p>${email}</p>
      </div>

      <div class="actions">

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>

    `;

        const deleteBtn = card.querySelector(".delete-btn");


        deleteBtn.addEventListener("click", function () {

            const confirmDelete = confirm(
                "Do you want to delete this contact?"
            );


            if (!confirmDelete) {
                return;
            }


            firebase.database().ref("contacts/" + id)
                .remove()

                .then(function () {

                    alert("Contact deleted successfully!");

                })

                .catch(function (error) {

                    console.log(error);
                    alert("Delete failed!");

                });

        });

        const editBtn = card.querySelector(".edit-btn");


        editBtn.addEventListener("click", function () {

            const newName = prompt(
                "Enter new name:",
                name
            );


            if (newName === null) {
                return;
            }


            const newEmail = prompt(
                "Enter new email:",
                email
            );


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


            firebase.database().ref("contacts/" + id)
                .update({

                    name: newName.trim(),
                    email: newEmail.trim()

                })

                .then(function () {

                    alert("Contact updated successfully!");

                })

                .catch(function (error) {

                    console.log(error);
                    alert("Update failed!");

                });

        });

        contactsList.appendChild(card);

    });

    console.log("Total Contacts:", totalContacts);

});





// {// const setuserlist = async () => {
// //   var userlist = await firebase.database().ref("users").push().key;

// //   var contactList = {
// //     Name: nameInp.value,
// //     Email: emailInp.value,
// //   };

// //   await firebase.database().ref(userlist).set(contactList);
// //   alert("add new quiz");
// // };

// // const setUser = async () => {
// //   await firebase.database().ref("user").set({
// //     name: nameInp.value,
// //     email: emailInp.value,
// //     createdAt: firebase.database.ServerValue.TIMESTAMP,
// //   });
// // };

// // setUser();

// // CONTACT LIST WITH FIREBASE

// // search

// // contact list

// // 1) ui Create

// // email ,username = > add

// // ali           asad

// // ali@gmail.com       safasfasf

// // edit delete      edit delete

// // 2) firebase project create

// // 3) database create

// // 4) keys:

// // html =>add

// // 5)

// // 5) data store : add,edit,delete,
// }