const express = require("express");
const app = express();
const bodyParser = require('body-parser');

//creo la conexion de la base de datos
const mysql = require('mysql');
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_whatsapp"
});

//middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//rutas
///ruta cargar el <COMBOBOX-SELECT LIST>
app.get('/usuarios', (req, res) => {
    //consulta
    conexion.query('SELECT codigo_usuario, nombre_usuario, url_imagen_perfil FROM tbl_usuarios', (err, resultado) => {
        //manejando el error
        if (err) {
            throw err;
        } else
            res.send(resultado);
    });
});

//Ruta de enviar mensaje <BOTON ENVIAR>
app.post("/enviarMensaje", function(req, res) {
    let { codigoEmisor, codigoReceptor, mensaje } = req.body;
    //consulta
    conexion.query(
        "INSERT INTO tbl_mensajes (codigo_usuario_emisor,codigo_usuario_receptor, mensaje,hora_mensaje) " +
        "VALUES (?, ? ,? , sysdate())", [codigoEmisor, codigoReceptor, mensaje], (err, resultado) => {
            if (err) {
                throw err;
            } else {
                res.send(resultado)
            }
        }
    );
});

// ruta para <CARGAR LOS MENSAJES>
app.post("/mensajes", (req, res) => {
    let codigoEmisor = req.body.codigoEmisor;
    let codigoReceptor = req.body.codigoReceptor;
    //consulta
    conexion.query("select codigo_usuario_emisor as codigo, mensaje, date_format(hora_mensaje,'%H:%i:%S') hora " +
        "from tbl_mensajes " +
        "where (codigo_usuario_emisor = ? or codigo_usuario_emisor = ?) " +
        "and (codigo_usuario_receptor= ? or codigo_usuario_receptor = ?) ", [codigoEmisor, codigoReceptor, codigoEmisor, codigoReceptor], (err, filas, campos) => {
            if (err) {
                throw err;
            } else {
                res.send(filas);
            }
        }
    );
});

//ruta para el <BOTON DE ELIMINAR>
app.post("/eliminarConversacion", function(req, res) {
    let { codigoEmisor, codigoReceptor } = req.body;
    //consulta
    conexion.query(
        "DELETE FROM tbl_mensajes " +
        "WHERE (codigo_usuario_emisor = ? and codigo_usuario_receptor = ?) or " +
        " (codigo_usuario_emisor = ? and codigo_usuario_receptor = ?)", [codigoEmisor, codigoReceptor, codigoReceptor, codigoEmisor], (err, resultado) => {
            if (err) {
                throw err;
            } else {
                res.send(resultado);
            }
        }
    );
});

//puerto de escucha del servidor
app.listen(4000, () => {
    console.log('Escuchando en el puerto 4000');
});