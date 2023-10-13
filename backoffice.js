// aggiungiamo a questa pagina la logica necessaria per poter operare in MODIFICA
// operiamo in MODIFICA se il nostro link nella barra degli indirizzi prevederà un query parameter chiamato eventId

const addressBarContent = new URLSearchParams(location.search);
const eventId = addressBarContent.get("eventId");
console.log(eventId); // può essere una stringa, nel caso il parametro ci sia, oppure può essere null

// SE e solo SE siamo in modalità modifica, ovvero se eventId è una stringa (e non è null), facciamo una fetch
// aggiuntiva per prelevare i dettagli dell'evento, in modo da ripopolare il form!

if (eventId) {
  // se siamo in modalità modifica...
  fetch("https://striveschool-api.herokuapp.com/api/product/", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI5MDAxYjEzOWM0MzAwMTg4MTQ1YTAiLCJpYXQiOjE2OTcxODU4MTksImV4cCI6MTY5ODM5NTQxOX0.7HTDwBzMOSPcFyGfOxyM-Lo8dO-uJZ01YsHcEJE8f34",
    },
  })
    .then((res) => {
      if (res.ok) {
        // la response è ok! estraiamo i dettagli
        return res.json();
      } else {
        throw new Error("ERRORE NEL RECUPERO DETTAGLIO");
      }
    })
    .then((eventDetails) => {
      // luce verde! abbiamo ottenuto i dettagli
      // dobbiamo ora ripopolare il form!
      const nameInput = document.getElementById("name");
      const descriptionInput = document.getElementById("description");
      const priceInput = document.getElementById("price");
      const imageInput = document.getElementById("imageUrl");
      const brandInput = document.getElementById("brand");

      // li ripopolo con i dettagli di eventDetails
      nameInput.value = eventDetails.name;
      descriptionInput.value = eventDetails.description;
      priceInput.value = eventDetails.price;
      imageInput.value = eventDetails.imageUrl.split(".000Z")[0]; // rimuove '.000Z' dalla stringa
      brandInput.value = eventDetails.brand;
    })
    .catch((err) => {
      console.log("errore", err);
    });
}

// com'è fatto un evento?

// - name (string)
// - description (string)
// - price (number / string)
// - time (string)

// dobbiamo recuperare i dati dal form, impacchettarli, e spedirli alla API tramite una fetch con metodo POST

// prendiamo un riferimento al form, e lavoriamo con il suo submit
const formReference = document.getElementById("form");
formReference.addEventListener("submit", function (e) {
  e.preventDefault(); // fermiamo il comportamento di default
  console.log("invio i dati all'API");

  // dobbiamo ora recuperare i valori individuali degli input
  const nameInput = document.getElementById("name");
  const descriptionInput = document.getElementById("description");
  const priceInput = document.getElementById("price");
  const imageInput = document.getElementById("imageUrl");
  const brandInput = document.getElementById("brand");

  // ora mi basterà leggere le loro proprietà "value" per ottenere i valori correnti del form

  const newEvent = {
    name: nameInput.value,
    description: descriptionInput.value,
    price: priceInput.value,
    imageUrl: imageInput.value,
    brand: brandInput.value,
  };

  console.log("Ecco l'oggetto che manderò alle API", newEvent);

  // METODI HTTP
  // GET -> chiedo dati
  // POST -> creo un nuovo dato
  // PUT -> modifico un dato esistente
  // DELETE -> elimino un dato esistente

  // oggetto pronto! è arrivato il momento di spedirlo all'API

  // attenzione! se siamo in modalità MODIFICA, non devo fare una POST ma devo fare una PUT!
  let methodToUse = "POST";
  if (eventId) {
    methodToUse = "PUT";
  }

  // la POST va sempre fatta sull'indirizzo GENERICO
  // una PUT va sempre fatta su un INDIRIZZO SPECIFICO, COMPLETO DI ID

  let urlToUse = "https://striveschool-api.herokuapp.com/api/product/";
  if (eventId) {
    urlToUse = "https://striveschool-api.herokuapp.com/api/product/" + eventId;
  }

  fetch(urlToUse, {
    method: methodToUse, // dichiaro che questa chiamata non è una GET, ma una POST (o una PUT!)
    body: JSON.stringify(newEvent), // invio il mio evento alle API, ma devo prima trasformarlo in stringa!
    headers: {
      // headers è un oggetto in cui inseriamo le nostre "meta-informazioni"
      "Content-Type": "application/json", // informiamo l'API che anche se il nostro body sta arrivando sotto forma
      // di stringa, in origine era un oggetto! e che quindi va ri-parsato a destinazione
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI5MDAxYjEzOWM0MzAwMTg4MTQ1YTAiLCJpYXQiOjE2OTcxODU4MTksImV4cCI6MTY5ODM5NTQxOX0.7HTDwBzMOSPcFyGfOxyM-Lo8dO-uJZ01YsHcEJE8f34",
    },
  })
    .then((res) => {
      console.log("OGGETTO RESPONSE DELLA NOSTRA CHIAMATA POST", res);
      if (res.ok) {
        // la nostra chiamata POST è andata a buon fine, e l'evento è stato salvato!
        alert("EVENTO SALVATO CORRETTAMENTE!");
      } else {
        // la nostra chiamata POST NON è andata a buon fine, e c'è stato un errore!
        // esplora il tab "Network" per capire cosa è andato storto
        alert("ERRORE NEL SALVATAGGIO DELL'EVENTO");
        throw new Error("Errore nella POST");
      }
    })
    .catch((err) => {
      console.log("Si è verificato un errore:", err);
    });
});

const deleteEvent = function () {
  // questa funzione servirà ad eliminare l'evento corrente
  fetch("https://striveschool-api.herokuapp.com/api/product/" + eventId, {
    method: "DELETE",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI5MDAxYjEzOWM0MzAwMTg4MTQ1YTAiLCJpYXQiOjE2OTcxODU4MTksImV4cCI6MTY5ODM5NTQxOX0.7HTDwBzMOSPcFyGfOxyM-Lo8dO-uJZ01YsHcEJE8f34",
    },
  })
    .then((res) => {
      if (res.ok) {
        // EVENTO ELIMINATO CORRETTAMENTE!
        alert("prodotto ELIMINATO");
        location.assign("./index.html"); // facciamo tornare l'utente in homepage
      } else {
        alert("Problema con l'eliminazione dell'evento");
        throw new Error("Errore nella DELETE");
      }
    })
    .catch((err) => {
      console.log("ERRORE!", err);
    });
};

const myEvent = function () {
  let text;
  if (confirm("Sicuro di voler eliminare??") == true) {
    text = "OK!";
    deleteEvent();
  } else {
    text = "cancel";
  }
  document.getElementById("demo").innerHTML = text;
};
