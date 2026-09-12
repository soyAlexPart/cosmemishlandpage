/*
  LÚMINA — versión inicial de solicitud por WhatsApp

  La página NO crea todavía una cita en Google Calendar.
  Recopila los datos y abre WhatsApp con un mensaje prellenado.

  IMPORTANTE:
  Cambia WHATSAPP_NUMBER por el número de WhatsApp de la cabina,
  incluyendo código de país y SIN +, espacios ni guiones.
  Ejemplo México: 524431234567
*/
const WHATSAPP_NUMBER = "524661600980";

const form = document.querySelector("#bookingForm");
const panels = [...document.querySelectorAll(".step-panel")];
const choices = [...document.querySelectorAll(".choice")];
const dateInput = document.querySelector("#date");
const slotsBox = document.querySelector("#slots");
const selectedSlot = document.querySelector("#selectedSlot");
const summary = document.querySelector("#summary");
const formMessage = document.querySelector("#formMessage");

let selectedService = {
  service: choices[0].dataset.service,
  duration: Number(choices[0].dataset.duration),
  price: choices[0].dataset.price
};

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().slice(0, 10);

function goToStep(step) {
    panels.forEach(p =>
        p.classList.toggle("active", Number(p.dataset.step) === step)
    );

    document.querySelectorAll(".steps span").forEach((s, i) =>
        s.classList.toggle("active", i === step - 1)
    );

    // Solo desplazar cuando se avance a otro paso
    if (step !== 1) {
        window.scrollTo({
            top: document.querySelector("#agenda").offsetTop - 20,
            behavior: "smooth"
        });
    }
}

choices.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    choices.forEach(c=>c.classList.remove("selected"));
    btn.classList.add("selected");
    selectedService = {
      service: btn.dataset.service,
      duration: Number(btn.dataset.duration),
      price: btn.dataset.price
    };
  });
});

document.querySelector('[data-step="1"] .continue').addEventListener("click", ()=>goToStep(2));

document.querySelectorAll(".back-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>goToStep(1));
});

dateInput.addEventListener("change", ()=>{
  selectedSlot.value = "";
  document.querySelector('[data-step="2"] .continue').disabled = true;

  // Por ahora son horarios de ejemplo. Después sustituiremos esta parte
  // por la consulta a n8n + Google Calendar.
  renderDemoSlots();
});

function renderDemoSlots(){
  renderSlots(["10:00","11:30","13:00","16:00","17:00","18:30"]);
}

function renderSlots(slots){
  if(!slots.length){
    slotsBox.innerHTML = '<div class="loading">No hay horarios disponibles para este día. Prueba otra fecha.</div>';
    return;
  }

  slotsBox.innerHTML = slots.map(time =>
    `<button type="button" class="slot" data-time="${time}">${time}</button>`
  ).join("");

  slotsBox.querySelectorAll(".slot").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      slotsBox.querySelectorAll(".slot").forEach(x=>x.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSlot.value = btn.dataset.time;
      document.querySelector('[data-step="2"] .continue').disabled = false;
    });
  });
}

document.querySelector('[data-step="2"] .continue').addEventListener("click", ()=>{
  if(!selectedSlot.value) return;

  summary.innerHTML =
    `<strong>${escapeHtml(selectedService.service)}</strong><br>` +
    `${escapeHtml(formatDate(dateInput.value))} · ${escapeHtml(selectedSlot.value)} · ${selectedService.duration} min`;

  goToStep(3);
});

form.addEventListener("submit", (e)=>{
  e.preventDefault();

  if(WHATSAPP_NUMBER.includes("X")){
    formMessage.className = "form-message error";
    formMessage.textContent = "Primero configura el número de WhatsApp de la cabina en app.js.";
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());

  const message = [
    "✨ *SOLICITUD DE CITA — LÚMINA*",
    "",
    `*Tratamiento:* ${selectedService.service}`,
    `*Duración:* ${selectedService.duration} min`,
    `*Fecha solicitada:* ${formatDate(data.date)}`,
    `*Hora solicitada:* ${data.selectedSlot}`,
    "",
    "*DATOS DE LA CLIENTA*",
    `*Nombre:* ${data.name}`,
    `*WhatsApp:* ${data.phone}`,
    `*Correo:* ${data.email || "No proporcionado"}`,
    "",
    "*COMENTARIOS IMPORTANTES*",
    data.comments?.trim() || "No indicó alergias, padecimientos o comentarios adicionales.",
    "",
    "La clienta solicita confirmar esta cita por WhatsApp."
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  formMessage.className = "form-message ok";
  formMessage.innerHTML = "Listo. Se abrirá WhatsApp con todos tus datos. Solo falta enviarlos a la cabina.";

  window.open(url, "_blank", "noopener,noreferrer");
});

function formatDate(value){
  if(!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[char]));
}

// ===== BOTÓN VOLVER ARRIBA =====

const topButton = document.getElementById("topButton");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        topButton.classList.add("show");
    } else {
        topButton.classList.remove("show");
    }
});

topButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});