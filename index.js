document.addEventListener("DOMContentLoaded", function () {
  // Identify the baseURL
  const baseUrl = "http://localhost:3000";

  // Access the elements of our Html
  const doctorCards = document.getElementById("Doctorcards");

  const map = {};

  // fetch our list of doctors from our server and display them in our app

  function fetchDoctorDetails(linkUrl) {
    fetch(linkUrl)
      .then((res) => res.json())
      .then((doctorData) => {
        doctorData.map((data) => {

          // Check doctor name exists in the mapped data
          map[data.name] = true;

          // DOM Render
          const cards = document.createElement("div");
          cards.className = "doctor-profiles";
          cards.innerHTML = `
            <img src="${data.image}"> 
            <h4>${data.name}</h4>          
            <p>
            ${data.specialization}<br> Appointments: ${data.appointments}
            </p>`;

          doctorCards.appendChild(cards);
        });
      });
    console.log("connection made");
  }
  fetchDoctorDetails(`${baseUrl}/doctors`);

  console.log(map);

  //search function to search for doctor by name or specialization

  document.getElementById("search-bar-form").addEventListener("submit", (e) => {
    // console.log("Search form submitted");
    e.preventDefault();
    let searchedWord = document.getElementById("search-doctor").value;
    console.log(`Searched word: ${searchedWord}`);
    if (searchedWord) {
      displaySearchedDoctor(`${baseUrl}/doctors`, searchedWord);
    }
  });

  function displaySearchedDoctor(linkUrl, searchWord) {
    fetch(linkUrl)
      .then((res) => res.json())
      .then((doctorData) => {
        let doctorsThatMatchSearch = [];
        let modifiedsearchWord = searchWord.toLowerCase();

        doctorData.forEach((doc) => {
          if (
            doc.name.toLowerCase().includes(modifiedsearchWord) ||
            doc.specialization.toLowerCase().includes(modifiedsearchWord)
          ) {
            doctorsThatMatchSearch.push(doc.id);
          }
        });

        // console.log(doctorsThatMatchSearch);
        doctorCards.replaceChildren();
        doctorData.map((data) => {
          if (doctorsThatMatchSearch.includes(data.id)) {
            const cards = document.createElement("div");
            cards.className = "doctor-profiles";
            cards.innerHTML = `
              <img src="${data.image}"> 
              <h4>${data.name}</h4> 
              <p>${data.specialization}<br> Appointments: ${data.appointments}</p>`;

            doctorCards.appendChild(cards);
          }
        });
      });
  }

  // Fetch processed appointment details to display on user end under the appointment page

  const bookedAppointments = document.getElementById("list-of-appointments");
  function fetchAppointments(linkUrl) {
    fetch(linkUrl)
      .then((res) => res.json())
      .then((appointmentsData) => {
        appointmentsData.map((data) => {
          const list = document.createElement("div");
          list.className = "my-appointments"
        
          list.innerHTML = ` 
            <h4> Doctor: ${data.doctor}</h4>
            <li> Date: ${data.date}<br> 
            Time: ${data.time}</li>
            <div class = "edit-delete-btn">
              <button id ="edit-appointment"type="button">Edit </button> 
              <button id ="delete-appointment"type="button">Delete </button>
            </div> `;
          bookedAppointments.appendChild(list);
        });
      });
  }
  fetchAppointments(`${baseUrl}/appointments`);

  //Accessing the submit appointment button and submitting the form in the text field when booking appointment

  document.getElementById("btnBook").addEventListener("click", function (e) {
    e.preventDefault();

    // fetch the values from the input fields and store them in a variable
    let newAppointment = document.getElementById("doctorname");
    let doctorName = newAppointment.value;
    console.log(doctorName);

    let newAppointmentDate = document.getElementById("appointment-date");
    let appointmentDate = newAppointmentDate.value;
    console.log(appointmentDate);

    let newAppointmentTime = document.getElementById("appointment-time");
    let appointmentTime = newAppointmentTime.value;
    console.log(appointmentTime);

    // creating an object to be posted in JSON format to our server

    let newAppointmentData = {
      doctor: doctorName,
      patient: "Melvin Mbae",
      date: appointmentDate,
      time: appointmentTime,
    };

    if (map[doctorName]) {
      postRequest(newAppointmentData);
    } else {
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  });

  //Post request to server. Booking a new appointment and making it persistent.
  function postRequest(newAppointmentData) {
    fetch(`${baseUrl}/appointments`, {
      // Specify the HTTP method
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // convert the object from the input field and convert to JSON
      body: JSON.stringify(newAppointmentData),
    })
      .then((res) => res.json())
      .then((_) => {
        Swal.fire({
          title: "Success!",
          text: "Appointment booked",
          icon: "success",
          confirmButtonText: "Okay",
        });
      });
  }

  // Manipulate our buttons with display none and display flex since we are designing a single page application
  const myDoctors = document.querySelector("#doctors");
  const appointments = document.querySelector(".appointments");
  const blogNews = document.querySelector(".healthNuggets");

  const doctorButton = document.querySelector("#Doctorbutton");

  doctorButton.addEventListener("click", function () {
    myDoctors.style.setProperty("display", "flex", "important")
    appointments.style.setProperty("display", "none", "important")
    blogNews.style.setProperty("display", "none", "important")
  });

  const appointmentBtn = document.querySelector("#Appointmentsbutton");

  appointmentBtn.addEventListener("click", function () {
    myDoctors.style.setProperty("display", "none", "important")
    appointments.style.setProperty("display", "flex", "important")
    blogNews.style.setProperty("display", "none", "important")
  });

  const Healthnuggetsbtn = document.querySelector("#Healthnuggetsbutton");

  Healthnuggetsbtn.addEventListener("click", function () {
    myDoctors.style.setProperty("display", "none", "important")
    appointments.style.setProperty("display", "none", "important")
    blogNews.style.setProperty("display", "flex", "important")
  });

  // Default Action
    myDoctors.style.setProperty("display", "flex", "important")
    appointments.style.setProperty("display", "none", "important")
    blogNews.style.setProperty("display", "none", "important")
});
