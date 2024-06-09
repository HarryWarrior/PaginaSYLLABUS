from flask import Flask, request, send_file,render_template, jsonify, send_from_directory
from openpyxl import load_workbook
from openpyxl.drawing.image import Image
import json
from flask_cors import CORS
from pyexcelerate import Workbook
from fpdf import FPDF
from bs4 import BeautifulSoup
import openpyxl
import os

app = Flask(__name__, static_folder='static')
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
    return data

@app.route('/programacion_basica')
def programacion_basica():
    return render_template('materias/programacion_basica.html')


@app.route('/programacion_basica/syllabus')
def programacion_basica_syllabus():
 # Cargar el JSON
    with open('static/jsonfiles/1_2_Programación_Basica.json', encoding='utf-8') as json_file:
        datos_materia = json.load(json_file)

    # Leer el formato HTML desde un archivo
    with open('formato.html', 'r', encoding='utf-8') as file:
        formato_html = file.read()

    # Parsear el HTML
    soup = BeautifulSoup(formato_html, 'html.parser')

    # Recorrer las claves del JSON y modificar el HTML
    for clave, valor in datos_materia.items():
        # Buscar el elemento por ID
        elemento_a_modificar = soup.find(id=clave)
        # Si el elemento existe, modificar su contenido
        if elemento_a_modificar:
            elemento_a_modificar.string = valor

    # Obtener el HTML modificado
    formato_html_modificado = str(soup)

    # Guardar el nuevo HTML
    with open('nuevo_formato.html', 'w', encoding='utf-8') as file:
        file.write(formato_html_modificado)

    # Renderizar el HTML modificado en la respuesta
    return render_template('mostrar_html.html', formato_html=formato_html_modificado)

@app.route('/descargar_nuevo_formato')
def descargar_nuevo_formato():
    return send_file('nuevo_formato.html', as_attachment=True)



@app.route('/programacion_basica/archivo.json')
def get_programacion_basica_jsonfile():
    with open('static/jsonfiles/1_2_Programación_Basica.json', encoding='utf-8') as f:
        data = f.read()
    return data  


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
    #img1 = Image('static/Syllabus/logo.jpg')
    #img2 = Image('static/Syllabus/sigud.PNG')
    #hoja_excel.add_image(img1, 'A1')  # Insertar la primera imagen en la celda A1
    #hoja_excel.add_image(img2, 'G1 ')  # Insertar la segunda imagen en la celda D5
    # Actualizar las celdas en el archivo Excel con la información del JSON
    for clave, celda in claves_celdas.items():
        valor = json_data.get(clave, "")
        hoja_excel[celda].value = valor
        

        
    
    # Guardar el libro de Excel con la información actualizada
    nombre_archivo_excel = os.path.splitext(json_file_name)[0] + ".xlsx"
    libro_excel.save(nombre_archivo_excel)

    
    


    return send_file(nombre_archivo_excel, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)