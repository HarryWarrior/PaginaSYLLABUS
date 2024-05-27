// Carga del archivo JSON y renderizado del contenido
fetch('iframes.json')
    .then(response => response.json())
    .then(data => {
        const menuList = document.getElementById('menu-list');
        const exerciseDisplay = document.getElementById('exerciseDisplay');

        data.programacion_basica.forEach((exercise, index) => {
            // Crear elementos del menú
            const menuItem = document.createElement('li');
            const menuLink = document.createElement('a');
            menuLink.href = `#ejercicio${index + 1}`;
            menuLink.textContent = exercise.titulo;
            menuItem.appendChild(menuLink);
            menuList.appendChild(menuItem);

            // Crear contenedores de ejercicios
            const exerciseContainer = document.createElement('div');
            exerciseContainer.className = 'exercise-container';
            exerciseContainer.id = `ejercicio${index + 1}`;

            // Añadir título e iframe
            const exerciseTitle = document.createElement('h3');
            exerciseTitle.textContent = exercise.titulo;
            exerciseContainer.appendChild(exerciseTitle);

            exerciseContainer.innerHTML += exercise.iframe;

            // Crear formulario de opinión
            const form = document.createElement('form');
            form.onsubmit = (event) => enviarOpinion(event);

            const formTitle = document.createElement('h2');
            formTitle.textContent = 'Opinión del Profesor';
            form.appendChild(formTitle);

            const labelOpinion = document.createElement('label');
            labelOpinion.setAttribute('for', `opinion${index + 1}`);
            labelOpinion.textContent = '¿Debería guardarse este ejercicio en el repositorio para los estudiantes?';
            form.appendChild(labelOpinion);

            const textarea = document.createElement('textarea');
            textarea.id = `opinion${index + 1}`;
            textarea.name = 'opinion';
            textarea.placeholder = 'Escriba su opinión aquí...';
            form.appendChild(textarea);

            const br = document.createElement('br');
            form.appendChild(br);

            const labelGuardar = document.createElement('label');
            labelGuardar.setAttribute('for', `guardar${index + 1}`);
            labelGuardar.textContent = '¿Recomienda guardar este ejercicio? (Sí/No)';
            form.appendChild(labelGuardar);

            const select = document.createElement('select');
            select.id = `guardar${index + 1}`;
            select.name = 'guardar';
            const optionSi = document.createElement('option');
            optionSi.value = 'si';
            optionSi.textContent = 'Sí';
            select.appendChild(optionSi);
            const optionNo = document.createElement('option');
            optionNo.value = 'no';
            optionNo.textContent = 'No';
            select.appendChild(optionNo);
            form.appendChild(select);

            const br2 = document.createElement('br');
            form.appendChild(br2);

            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Enviar Opinión';
            form.appendChild(submitButton);

            // Añadir formulario al contenedor de ejercicios
            exerciseContainer.appendChild(form);

            // Añadir contenedor de ejercicios al display
            exerciseDisplay.appendChild(exerciseContainer);
        });
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

// Función para manejar el envío del formulario
function enviarOpinion(event) {
    event.preventDefault();
    alert('Opinión enviada. ¡Gracias por su retroalimentación!');
}
