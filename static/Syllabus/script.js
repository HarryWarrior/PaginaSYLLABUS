
let jsonData; 
let fileName = "";
let input;
let  jsonString;
document.addEventListener('DOMContentLoaded', function() {
    let jsonData = {};

    // Cargar el JSON desde una URL específica (puedes cambiar la URL según la materia)
    fetch('/programacion_basica/archivo.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Verifica la estructura del JSON en la consola
            jsonData = data;
            renderJsonEditor(jsonData);
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });

    function renderJsonEditor(data) {
        const jsonEditorTbody = document.getElementById('jsonEditorDiv');
        jsonEditorTbody.innerHTML = ''; // Limpiar cualquier contenido previo

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                // Crear la fila para cada par clave-valor
                let row = document.createElement('tr');
                
                // Crear la celda para la clave
                let cellKey = document.createElement('td');
                cellKey.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                row.appendChild(cellKey);

                // Crear la celda para el valor
                let cellValue = document.createElement('td');
                
                let input;
                if (data[key].length > 50 || data[key].includes('\n')) {
                    // Usar <textarea> para texto largo o que contiene saltos de línea
                    input = document.createElement('textarea');
                } else {
                    // Usar <input> para texto corto
                    input = document.createElement('input');
                    input.type = 'text';
                }
                
                input.value = data[key];
                input.setAttribute('data-key', key); // Añadir un atributo de datos para almacenar la clave asociada
                input.style.width = '100%';
                input.style.height = 'auto';
                
                // Ajustar el tamaño del input/textarea según el texto
                input.style.height = `${Math.max(20, input.scrollHeight)}px`;
                input.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = `${this.scrollHeight}px`;
                });
                
                cellValue.appendChild(input);
                row.appendChild(cellValue);

                // Añadir la fila a la tabla
                jsonEditorTbody.appendChild(row);
            }
        }
    }

    function saveData() {
        // Recopilar datos del formulario
        const inputs = document.querySelectorAll('#jsonEditor input[type="text"], #jsonEditor textarea');
        let updatedData = {};
        inputs.forEach(input => {
            const key = input.getAttribute('data-key');
            updatedData[key] = input.value;
        });

        // Guardar los datos (puedes ajustar esto para enviar los datos a tu servidor)
        console.log('Datos actualizados:', updatedData);
        // Aquí podrías usar fetch para enviar los datos a tu servidor:
        // fetch('/save', { method: 'POST', body: JSON.stringify(updatedData), headers: { 'Content-Type': 'application/json' } });
    }
});





function handleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    fileName = file.name;
    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = function (evt) {
            jsonData = JSON.parse(evt.target.result); // Parseamos el JSON inicial
            
            const jsonEditorDiv = document.getElementById('jsonEditor');
            console.log('JSON leido:', jsonData);
    // Crear elementos HTML para mostrar las claves y los formularios para editar los valores
        for (let key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                // Crear el contenedor div para cada par clave-valor
                let pairDiv = document.createElement('div');
                pairDiv.classList.add('jsonPair'); // Añadir clase al contenedor div
                jsonEditorDiv.appendChild(pairDiv);

                // Crear el elemento de etiqueta para la clave
                let label = document.createElement('label');
                label.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ': '; // Convertir la clave en modo enunciado
                pairDiv.appendChild(label);

                // Crear el elemento de formulario para el valor
                input = document.createElement('input');
                input.type = 'text';
                input.value = jsonData[key];
                input.setAttribute('data-key', key); // Añadir un atributo de datos para almacenar la clave asociada
                pairDiv.appendChild(input);
            }
        }reader.onerror = function (evt) {
            console.error("Error al leer el archivo");
        }
        }
    } else {
        console.error("Por favor selecciona un archivo JSON");
    }
}


// Supongamos que ya has cargado el JSON y está almacenado en una variable llamada "data"

// Función que se activa después de cargar el JSON
function modificarJSON() {
    // Obtener todos los formularios de entrada
    const inputs = document.querySelectorAll('#jsonEditor input');
    
    // Objeto para almacenar los nuevos valores del JSON
    let newData = {};
    
    // Iterar sobre los formularios de entrada y almacenar los nuevos valores
    inputs.forEach(input => {
        const key = input.getAttribute('data-key');
        const value = input.value;
        newData[key] = value;
    });
     jsonString = JSON.stringify(newData,null, 2);
        // Hacer lo que necesites con el nuevo JSON (en este ejemplo solo lo mostramos en la consola)
     console.log('Nuevo JSON:', jsonString);

        // Hacer lo que necesites con el nuevo JSON (en este ejemplo solo lo mostramos en la consola)
           // Crear un blob con el JSON
        let blob = new Blob([jsonString], { type: 'application/json' });
    
        // Crear una URL para el blob
        let url = URL.createObjectURL(blob);
    
        // Crear un enlace de descarga
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName // Nombre del archivo de descarga
        a.textContent = 'Descargar JSON';
    
        // Agregar el enlace al documento
        document.body.appendChild(a);
    
        // Hacer clic en el enlace para descargar el archivo
        a.click();
    
        // Eliminar el enlace del documento
        document.body.removeChild(a);
    
        // Liberar el objeto URL
        URL.revokeObjectURL(url);
    // Por ejemplo, puedes enviar el JSON modificado a algún lugar
    // o utilizarlo en tu aplicación de alguna otra manera
}

document.getElementById('process').addEventListener('click', () => {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const jsonData = JSON.parse(content);
            localStorage.setItem('jsonData', JSON.stringify(jsonData));
            localStorage.setItem('jsonFileName', file.name);
        };
        reader.readAsText(file);
    }
});

document.getElementById('download').addEventListener('click', async () => {
    const jsonData = localStorage.getItem('jsonData');
    const jsonFileName = localStorage.getItem('jsonFileName');

    if (jsonData && jsonFileName) {
        const response = await fetch('http://127.0.0.1:5000/generate_excel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jsonData, jsonFileName }),
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = jsonFileName.replace('.json', '.xlsx');
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            console.error('Error generating Excel');
        }
    } else {
        console.error('No JSON data or file name found');
    }
});
