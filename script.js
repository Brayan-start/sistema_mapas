// # Crear mapa centrado en La Paz
const mapa = L.map("mapa").setView([-16.4897, -68.1193], 13);

// # Cargar mapa base desde OpenStreetMap
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { 
  maxZoom: 19, 
  attribution: "&copy; OpenStreetMap contributors" 
}).addTo(mapa);

// # Obtener lista HTML
const lista = document.getElementById("lista-coordenadas");

// # Arreglo para almacenar coordenadas
let coordenadas = [];

// # Evento al hacer clic en el mapa
mapa.on("click", function(e) { 
  const lat = e.latlng.lat; 
  const lng = e.latlng.lng; 

  // # Crear marcador en el mapa
  L.marker([lat, lng])
    .addTo(mapa)
    .bindPopup(`Latitud: ${lat.toFixed(6)}<br> Longitud: ${lng.toFixed(6)}`)
    .openPopup();

  // # Guardar coordenadas en el arreglo
  coordenadas.push({ lat, lng });

  // # Mostrar en lista HTML
  const item = document.createElement("li");
  item.textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  lista.appendChild(item);
});


// # Función para guardar en base de datos
function guardarCoordenadas() {
  fetch("http://localhost:5000/guardar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    // # Enviar todas las coordenadas
    body: JSON.stringify(coordenadas)
  })
  .then(res => res.json())
  .then(data => {
    alert("Coordenadas guardadas en la BD");
  })
  .catch(error => {
    console.error("Error:", error);
  });
}


// # Función para generar PDF (CORREGIDA)
function generarPDF() {
  const { jsPDF } = window.jspdf;

  // # Crear documento
  const doc = new jsPDF();

  // # Título
  doc.setFontSize(16);
  doc.text("Reporte de Coordenadas", 10, 10);

  let y = 20;

  // # Verificar si hay coordenadas
  if (coordenadas.length === 0) {
    doc.setFontSize(12);
    doc.text("No hay coordenadas registradas.", 10, y);
  } else {
    // # Recorrer coordenadas
    coordenadas.forEach((coord, index) => {
      doc.setFontSize(12);
      doc.text(
        `${index + 1}. Lat: ${coord.lat.toFixed(6)}  Lng: ${coord.lng.toFixed(6)}`,
        10,
        y
      );
      y += 10;

      // # Salto de página automático
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
  }

  // # Descargar PDF
  doc.save("reporte_coordenadas.pdf");
}