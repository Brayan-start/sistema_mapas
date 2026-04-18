# # Importar librerías
from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

# # Crear aplicación Flask
app = Flask(__name__)
CORS(app)

# # Función para conectar a SQLite
def get_db_connection():
    conn = sqlite3.connect('mapa.db')
    conn.row_factory = sqlite3.Row
    return conn

# # Crear tabla si no existe
def crear_tabla():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS coordenadas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitud REAL,
            longitud REAL
        )
    ''')
    conn.commit()
    conn.close()

# # Ruta principal (SOLUCIONA EL ERROR "Not Found")
@app.route('/')
def inicio():
    return "Servidor funcionando correctamente"

# # Ruta para guardar coordenadas
@app.route('/guardar', methods=['POST'])
def guardar():
    datos = request.json

    # # Validar que lleguen datos
    if not datos:
        return jsonify({"error": "No se recibieron datos"}), 400

    conn = get_db_connection()

    # # Insertar cada coordenada
    for coord in datos:
        conn.execute(
            'INSERT INTO coordenadas (latitud, longitud) VALUES (?, ?)',
            (coord['lat'], coord['lng'])
        )

    conn.commit()
    conn.close()

    return jsonify({"mensaje": "Coordenadas guardadas correctamente"})

# # Ejecutar servidor
if __name__ == '__main__':
    crear_tabla()  # # Crear tabla automáticamente
    app.run(debug=True)