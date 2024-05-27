from flask import Flask, request, send_file,render_template
from openpyxl import load_workbook
from openpyxl.drawing.image import Image
import json
from flask_cors import CORS
from pyexcelerate import Workbook
from fpdf import FPDF
import openpyxl
import os

app = Flask(__name__)
CORS(app)

# Definir las claves y celdas correspondientes
claves_celdas = {
    "Código del Espacio": "D9",
    "Espacio Académico": "D8",
    "Teórico": "B15",
    "Teórico-práctico": "F15",
    "Práctico": "D15",
    "Número de Créditos": "H9",
    "Horas Trabajo Directo": "E10",
    "Horas Trabajo Colaborativo": "G10",
    "Horas Trabajo Autónomo": "I10",
    "Básico": "B13",
    "Complementario": "E13",
    "Intríseco": "G13",
    "Extrínseco": "I13",
    "Conocimientos previos del curso": "A19",
    "Contenidos y Unidades Temáticas": "A45",
    "Enfoque de Aprendizaje y Enseñanza": "A51",
    "Materiales de Estudio": "A75",
    "Justificacion Del Espacio": "A25",
    "Objetivos":"A31",
    "Competencias":"A38",
    "Metodologia":"A51",
    "Resultados de Aprendizaje1":"H38",
    "Resultados de Aprendizaje2":"H39",
    "Resultados de Aprendizaje3":"H40",
    "Resultados de Aprendizaje4":"H41",
    "Resultados de Aprendizaje5":"H42",
    "Resultados de Aprendizaje6":"H43",
    "Recursos":"A67"
}
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/iframes.json')
def get_iframes():
    with open('iframes.json') as f:
        data = f.read()
    return jsonify(data)
@app.route('/programacion_basica')
def programacion_basica():
    return render_template('materias/programacion_basica.html')
@app.route('/syllabus')
def syllabus():
    return render_template('Syllabus.html')
@app.route('/generate_excel', methods=['POST'])
def generate_excel():
    data = request.json
    json_data = json.loads(data['jsonData'])
    json_file_name = data['jsonFileName']

    # Cargar el libro de Excel
    libro_excel = openpyxl.load_workbook('static/Syllabus/Formato.xlsx')
    hoja_excel = libro_excel.active
    
    for key, value in json_data.items():
        if key.startswith('image_'):
            # Si la clave comienza con 'image_', se trata de una celda con imagen
            image_path = value  # Ruta de la imagen proporcionada en el JSON
            image_cell = key.split('_')[1]  # Obtener la celda de la clave
            img = Image(image_path)
            hoja_excel.add_image(img, image_cell)
    # Actualizar las celdas en el archivo Excel con la información del JSON
    for clave, celda in claves_celdas.items():
        valor = json_data.get(clave, "")
        hoja_excel[celda].value = valor
        

        
    
    # Guardar el libro de Excel con la información actualizada
    nombre_archivo_excel = os.path.splitext(json_file_name)[0] + ".xlsx"
    libro_excel.save(nombre_archivo_excel)

    
    


    return send_file(nombre_archivo_excel, as_attachment=True)
@app.route('/generate_pdf', methods=['POST'])
def generate_pdf():
    data = request.json
    json_data = json.loads(data['jsonData'])
    json_file_name = data['jsonFileName']

    # Cargar el libro de Excel
    libro_excel = openpyxl.load_workbook('Formato.xlsx')
    hoja_excel = libro_excel.active

    # Actualizar las celdas en el archivo Excel con la información del JSON
    for clave, celda in claves_celdas.items():
        valor = json_data.get(clave, "")
        hoja_excel[celda].value = valor

    
    # Guardar el libro de Excel con la información actualizada
    nombre_archivo_excel = os.path.splitext(json_file_name)[0] + ".xlsx"
    libro_excel.save(nombre_archivo_excel)
    # Convertir el archivo Excel a PDF
    pdf_filename = nombre_archivo_excel.replace('.xlsx', '.pdf')
    os.system(f'libreoffice --headless --convert-to pdf {nombre_archivo_excel}')

    
    


    return send_file(pdf_filename, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)