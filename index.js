document.addEventListener("DOMContentLoaded", function () {

    // Identify the baseURL
    const baseUrl = "http://localhost:3000";

    // Access the elements of our Html
    const doctorCards = document.getElementById("Doctorcards")


    // fetch our list of doctors from our server and display them in our app

    function fetchDoctorDetails(linkUrl) {
        fetch(linkUrl)
            .then((res) => res.json())
            .then((doctorData) => {

                doctorData.map((data) => {

                    const cards = document.createElement("div");
                    cards.className = "doctor-profiles"
                    cards.innerHTML = `<img src="${data.image}"> <h4>${data.name}</h4> 
                    <p>${data.specialization}<br> Appointments: ${data.appointments}</p>`;


                    doctorCards.appendChild(cards)



                });

            })
        console.log("connection made");

    }
    fetchDoctorDetails(`${baseUrl}/doctors`);

    // Fetch processed appointment details to display on user end under the appointment page

    const bookedAppointments = document.getElementById("list-of-appointments");
    function fetchAppointments(linkUrl) {
        fetch(linkUrl)
            .then((res) => res.json())
            .then((appointmentsData) => {
                appointmentsData.map((data) => {
                    const list = document.createElement("div");
                    list.innerHTML = ` <h4> Doctor: ${data.doctor}</h4>
                    <li> Date: ${data.date}<br> 
                    Time: ${data.time}</li>`;
                    bookedAppointments.appendChild(list)
                });

            });
    }
    fetchAppointments(`${baseUrl}/appointments`);

    //Accessing the submit appointment button and submitting the form in the text field when booking appointment

    document.getElementById('appointmnent-form').addEventListener('submit', function (e) {
        e.preventDefault()

        // fetch the values from the input fields and store them in a variable
        let newAppointment = document.getElementById("doctorname")
        let doctorName = newAppointment.value;
        console.log(doctorName)

        let newAppointmentDate = document.getElementById("appointment-date")
        let appointmentDate = newAppointmentDate.value;
        console.log(appointmentDate)

        let newAppointmentTime = document.getElementById("appointment-time")
        let appointmentTime = newAppointmentTime.value;
        console.log(appointmentTime)

        // creating an object to be posted in JSON format to our server

        let newAppointmentData = {

            "doctor": doctorName,
            "patient": "Melvin Mbae",
            "date": appointmentDate,
            "time": appointmentTime
        }

        postRequest(newAppointmentData)
    })

    //Post request to server. Booking a new appointment and making it persistent.
    function postRequest(newAppointmentData) {
        fetch(`${baseUrl}/appointments`, {
            // Specify the HTTP method
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // convert the object from the input field and convert to JSON
            body: JSON.stringify(newAppointmentData)
        })
            .then(res => res.json())
            .then(appointment => console.log(appointment))
    }

    // Manipulate our buttons with display none and display block since we are designing a single page application

    const myDoctors = document.querySelector("#doctors")
    const doctorButton = document.querySelector("#Doctorbutton")

    doctorButton.addEventListener("click", function () {
        appointments.classList.add("invisible")
        blogNews.classList.add("invisible")
        myDoctors.classList.remove("invisible")
        //myDoctors.classList.add("visible")




    });

    const appointments = document.querySelector(".appointments")
    const appointmentBtn = document.querySelector("#Appointmentsbutton")

    appointmentBtn.addEventListener("click", function () {
        myDoctors.classList.add("invisible")
        appointments.classList.remove("invisible")
        blogNews.classList.add("invisible")


    });

    const blogNews = document.querySelector(".healthNuggets")
    const Healthnuggetsbtn = document.querySelector("#Healthnuggetsbutton")

    Healthnuggetsbtn.addEventListener("click", function () {
        myDoctors.classList.add("invisible")
        appointments.classList.add("invisible")
        blogNews.classList.remove("invisible")


    });


});

