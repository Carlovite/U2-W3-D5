const renderEvents = function (arrayOfEvents) {
  const row = document.getElementById("events-row");

  arrayOfEvents.forEach((event) => {
    const newCol = document.createElement("div");
    newCol.classList.add("col", "col-12", "col-sm-6", "col-md-3");
    // <div class="col col-12 col-sm-6 col-md-3"></div>
    newCol.innerHTML = `
      <div class="card text-bg-dark mb-3">
          <img src="${event.imageUrl}" class="card-img-top" alt="generic picture">
          <div class="card-body">
              <h5 class="card-title">${event.name}</h5>
              <p class="card-text">${event.description}</p>
              <p class="card-text">${event.brand} - Prezzo: ${event.price}€</p>
              <a href="./detail.html?eventId=${event._id}" class="btn btn-danger">Scopri di più</a>
          </div>
      </div>
      `;
    row.appendChild(newCol);
  });
};

const hideSpinner = function () {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.add("d-none");
};

const getEvents = function () {
  fetch("https://striveschool-api.herokuapp.com/api/product/", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI5MDAxYjEzOWM0MzAwMTg4MTQ1YTAiLCJpYXQiOjE2OTcxODU4MTksImV4cCI6MTY5ODM5NTQxOX0.7HTDwBzMOSPcFyGfOxyM-Lo8dO-uJZ01YsHcEJE8f34",
    },
  })
    .then((res) => {
      hideSpinner();

      console.log("Response ottenuta dalla GET", res);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Errore nel contattare il server");
      }
    })
    .then((events) => {
      console.log("EVENTS", events);

      renderEvents(events);
    })
    .catch((err) => {
      hideSpinner();
      console.log("Si è verificato un errore:", err);
    });
};

getEvents();
