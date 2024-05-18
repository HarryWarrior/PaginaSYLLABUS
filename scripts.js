function enviarOpinion(event) {
    event.preventDefault();
    const form = event.target;
    const opinion = form.querySelector('textarea').value;
    const guardar = form.querySelector('select').value;
    if (opinion.trim() === '' || guardar.trim() === '') {
        alert('Por favor, complete todos los campos antes de enviar.');
        return;
    }
    alert('Gracias por su opinión.');
    form.reset();
}

