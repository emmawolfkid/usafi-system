const itemsContainer = document.querySelector('.items');
const totalDisplay = document.getElementById('total');
const totalInput = document.getElementById('totalInput');
const servicesInput = document.getElementById('servicesInput');
const searchInput = document.getElementById('search');

let allServices = [];
let selectedServices = [];

fetch('services.json')
  .then(res => res.json())
  .then(data => {
    allServices = data.services;
    renderServices(allServices);
  });

function renderServices(services) {
  itemsContainer.innerHTML = "";

  services.forEach(service => {
    const div = document.createElement('div');
    div.classList.add('item-card');

    div.innerHTML = `
      <label>
        <input type="checkbox" value="${service.price}" data-name="${service.name}">
        <span>${service.name}</span>
        <strong>${service.price} TZS</strong>
      </label>
    `;

    itemsContainer.appendChild(div);
  });

  attachEvents();
}

function attachEvents() {
  document.querySelectorAll('.items input').forEach(cb => {
    cb.addEventListener('change', updateTotal);
  });
}

function updateTotal() {
  let total = 0;
  selectedServices = [];

  document.querySelectorAll('.items input').forEach(i => {
    if (i.checked) {
      const price = parseInt(i.value);
      total += price;

      selectedServices.push({
        name: i.dataset.name,
        price: price
      });
    }
  });

  totalDisplay.textContent = total;
  totalInput.value = total;
  servicesInput.value = JSON.stringify(selectedServices);
}

searchInput.addEventListener('input', () => {
  const search = searchInput.value.toLowerCase();

  const filtered = allServices.filter(service =>
    service.name.toLowerCase().includes(search)
  );

  renderServices(filtered);
});

/* FORM SUBMIT + WHATSAPP */
const form = document.querySelector('form');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.querySelector('[name="name"]').value;
  const phone = document.querySelector('[name="phone"]').value;
  const location = document.querySelector('[name="location"]').value;
  const date = document.querySelector('[name="date"]').value;
  const time = document.querySelector('[name="time"]').value;
  const services = JSON.parse(servicesInput.value || "[]");
  const total = totalInput.value;

  let serviceText = "";
  services.forEach(s => {
    serviceText += `${s.name} - ${s.price} TZS\n`;
  });

  const message = `🧹 CLEANING BOOKING REQUEST

Name: ${name}
Phone: ${phone}
Location: ${location}
Date: ${date}
Time: ${time}

Services:
${serviceText}

Total: ${total} TZS`;

  const whatsappNumber = "255765042935";

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');

  // Save for receipt
  localStorage.setItem('bookingName', name);
  localStorage.setItem('bookingPhone', phone);
  localStorage.setItem('bookingLocation', location);
  localStorage.setItem('bookingDate', date);
  localStorage.setItem('bookingTime', time);
  localStorage.setItem('bookingServices', JSON.stringify(services));
  localStorage.setItem('bookingTotal', total);

  setTimeout(() => {
    window.location.href = 'receipt.html';
  }, 1000);
});