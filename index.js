document.addEventListener("DOMContentLoaded", function () {
  // Identify the baseURL
  const baseUrl = "http://localhost:3000";

  // Access the elements of our Html
  const doctorCards = document.getElementById("Doctorcards");

  const map = {};
  const appointmentsMap = {};
  const cachedDoctors = [];

  function addSearchDoctors(doc) {
    const card = document.createElement("div");
    card.className = "doctor-profiles";
    card.innerHTML = `
              <img src="${doc.image}"> 
              <h4>${doc.name}</h4> 
              <p>${doc.specialization}<br> Appointments: ${doc.appointments}</p>`;

    doctorCards.appendChild(card);
  }

  // fetch our list of doctors from our server and display them in our app

  function fetchDoctorDetails(linkUrl) {
    fetch(linkUrl)
      .then((res) => res.json())
      .then((doctorData) => {
        doctorData.map((data) => {
          // Check doctor name exists in the mapped data
          map[data.name] = true;
          cachedDoctors.push(data);

          addSearchDoctors(data);
        });
      });
  }
  fetchDoctorDetails(`${baseUrl}/doctors`);

  //search function to search for doctor by name or specialization

  const searchInput = document.getElementById("search-doctor");
  searchInput.addEventListener("input", (e) => {
    e.preventDefault();
    let searchedWord = searchInput.value;
    displaySearchedDoctor(searchedWord);
  });

  function displaySearchedDoctor(searchWord) {
    let modifiedSearchWord = searchWord.toLowerCase();

    doctorCards.replaceChildren();

    cachedDoctors.forEach((doc) => {
      const matchFound =
        doc.specialization.toLowerCase().includes(modifiedSearchWord) ||
        doc.name.toLowerCase().includes(modifiedSearchWord);
      if (matchFound) {
        addSearchDoctors(doc);
      }
    });
  }

  function addAppointment(data) {
    const list = document.createElement("div");
    list.id = `appointment-${data.id}`;
    list.className = "my-appointments";
    let options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const date = new Date(data.date);
    const appointmentDate = new Intl.DateTimeFormat("en-US", options).format(
      date,
    );

    const id = `delete-${data.id}`;

    list.innerHTML = ` 
            <h4> Doctor: ${data.doctor}</h4>
            <li> Date: ${appointmentDate}<br> 
            Time: ${data.time}</li>
            <div class = "edit-delete-btn">
              <button id ="edit-appointment"type="button">Edit </button> 
              <button id =${id} class="delete-btn" type="button">Delete </button>
            </div> 
      `;

    bookedAppointments.appendChild(list);

    const btn = document.getElementById(id);

    btn.addEventListener("click", () => {
      const appointmentId = id.split("-")[1];
      deleteRequest(appointmentId);
    });
  }

  // Fetch processed appointment details to display on user end under the appointment page
  const bookedAppointments = document.getElementById("list-of-appointments");
  function fetchAppointments(linkUrl) {
    fetch(linkUrl)
      .then((res) => res.json())
      .then((appointmentsData) => {
        appointmentsData.map((data) => {
          appointmentsMap[data.id] = data;
          addAppointment(data);
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

    let newAppointmentDate = document.getElementById("appointment-date");
    let appointmentDate = newAppointmentDate.value;

    let newAppointmentTime = document.getElementById("appointment-time");
    let appointmentTime = newAppointmentTime.value;

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
      .then((data) => {
        addAppointment(data);
        Swal.fire({
          title: "Success!",
          text: `Appointment booked with ${data.doctor}`,
          icon: "success",
          confirmButtonText: "Okay",
        });
      });
  }

  function removeAppointment(id) {
    const appointmentCard = document.getElementById(id);
    console.log({ appointmentCard });

    appointmentCard.remove();
  }
  // Delete Request

  function deleteRequest(id) {
    fetch(`${baseUrl}/appointments/${id}`, {
      // Specify the HTTP method
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        removeAppointment(`appointment-${id}`);
        Swal.fire({
          title: "Success!",
          text: `Appointment with ${appointmentsMap[id].doctor} deleted`,
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
    myDoctors.style.setProperty("display", "flex", "important");
    appointments.style.setProperty("display", "none", "important");
    blogNews.style.setProperty("display", "none", "important");
  });

  const appointmentBtn = document.querySelector("#Appointmentsbutton");

  appointmentBtn.addEventListener("click", function () {
    myDoctors.style.setProperty("display", "none", "important");
    appointments.style.setProperty("display", "flex", "important");
    blogNews.style.setProperty("display", "none", "important");
  });

  const Healthnuggetsbtn = document.querySelector("#Healthnuggetsbutton");

  Healthnuggetsbtn.addEventListener("click", function () {
    myDoctors.style.setProperty("display", "none", "important");
    appointments.style.setProperty("display", "none", "important");
    blogNews.style.setProperty("display", "flex", "important");
  });

  // Default Action
  myDoctors.style.setProperty("display", "flex", "important");
  appointments.style.setProperty("display", "none", "important");
  blogNews.style.setProperty("display", "none", "important");
});
