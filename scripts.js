function cargarEjercicio(ruta) {
    const iframe = document.getElementById('h5pContent');
    iframe.src = ruta;
}

function enviarOpinion(event) {
    event.preventDefault();
    const opinion = document.getElementById('opinion').value;
    const guardar = document.getElementById('guardar').value;
    if (opinion.trim() === '' || guardar.trim() === '') {
        alert('Por favor, complete todos los campos antes de enviar.');
        return;
    }
    alert('Gracias por su opinión.');
    document.getElementById('opinionForm').reset();
}

