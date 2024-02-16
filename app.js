const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));

// Importar el modulo de mysql
const mysql = require('mysql');
app.use(bodyParser.urlencoded({ extended: false }));
// Generar la conexion de mysql
// importante todos datos correctos
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3308,
    user: 'root',
    password: '',
    database: 't2p2'
});

connection.connect();

// Ruta de index principal
app.get('/index', function (req, res) {
    let dir = __dirname + '/public/index.html';

    res.sendFile(dir, (err) => {
        if (err) {
            // console.log('ERROR EN LA UBICACION');
            res.status(err.status);
        } else {
            // console.log('Encontrado correctamente');
        }
    });
});

app.get('/vuelos', function (req, res) {
    let dir = __dirname + '/public/vuelos/index.html';

    res.sendFile(dir, (err) => {
        if (err) {
            // console.log('ERROR EN LA UBICACION');
            res.status(err.status);
        } else {
            // console.log('Encontrado correctamente');
        }
    });
});

app.get('/vuelos-crear', function (req, res) {
    let dir = __dirname + '/public/vuelos/crear.html';
    res.sendFile(dir, (err) => {
        if (err) {
            res.status(err.status);
        }
    });
});

// app.get('/vuelos-edit', function (req, res) {
//     let dir = __dirname + '/public/vuelos/editar.html';

//     res.sendFile(dir, (err) => {
//         if (err) {
//             // console.log('ERROR EN LA UBICACION');
//             res.status(err.status);
//         } else {
//             // console.log('Encontrado correctamente');
//         }
//     });
// });

app.get('/vuelos/detalles/:id', function (req, res) {
    let dir = __dirname + '/public/vuelos/detalles.html';

    res.sendFile(dir, (err) => {
        if (err) {
            // console.log('ERROR EN LA UBICACION');
            res.status(err.status);
        } else {
            // console.log('Encontrado correctamente');
        }
    });
});


// Ruta que devuelve todos los datos de los vuelos
app.get('/vuelos-all', function (req, res) {
    // 1. Generar la query
    let query = "SELECT * FROM vuelos ORDER BY id DESC";
    // conectar a la base de datos
    // connection.connect();

    // Metodo query devuelve valores en un consulta de tipo SELECT
    connection.query(query, [], function (error, results, fields) {
        if (error) {
            // console.log(error);
        }
        if (results) {
            // console.log(results);
            /**
             * Retorna un array con los distintos elementos de cada fila.
             * El nombre de cada posicion se llama RowDataPacket
             */
            // console.log(results.length);
            // for (let i = 0; i < results.length; i++) {
            //     console.log(results[i]['nombre']);
            // }
            res.json(results);
        }
    });

    // cerrar conexion a la base de datos si se cierra la conexion crashea al volver a entrar a una vista que use DB, DEJAR ASI **DE MOMENTO**
    // connection.end();

});

app.get('/vuelos/edit/:id', function (req, res) {

    let dir = __dirname + '/public/vuelos/editar.html';

    res.sendFile(dir, (err) => {
        if (err) {
            res.status(err.status);
        }
    });
});

app.get('/vuelos/encontrar/:id', function (req, res) {
    let query = 'SELECT * FROM vuelos WHERE id= ?'
    let vueloId = req.params.id;
    // console.log('EL ID A EDITAR ES..................... ' + vueloId);
    connection.query(query, [vueloId], function (error, results, fields) {
        if (error) {
            res.status(500).send('Error al seleccionar 1 vuelo de la base de datos');

        } else if (results) {
            // console.log('SELECT REALIZADO');
            res.json(results);
        }

    });
});

app.post('/vuelos/update', function (req, res) {

    let query = 'UPDATE vuelos SET numero_vuelo=?, aerolinea=?, origen=?, destino=?, fecha_salida=?, hora_salida=?, fecha_llegada=?, hora_llegada=? WHERE id=?';
    let numeroVuelo = req.body.numero_vuelo;
    let aerolinea = req.body.aerolinea;
    let origen = req.body.origen;
    let destino = req.body.destino;
    let fechaSalida = req.body.fecha_salida;
    let horaSalida = req.body.hora_salida;
    let fechaLlegada = req.body.fecha_llegada;
    let horaLlegada = req.body.hora_llegada;
    let vueloId = req.body.id;


    console.log('NUMERO DE VUELO DENTRO DE UPDATE...................... ' + vueloId);
    connection.query(query, [numeroVuelo, aerolinea, origen, destino, fechaSalida, horaSalida, fechaLlegada, horaLlegada, vueloId], (error, results, fields) => {
        if (error) {
            console.error('Error al insertar datos en la base de datos:', error);
            // res.status(500).send('Error al insertar datos en la base de datos');
            res.status(500).json({ message: error.message });


        }
        else if (results) {
            // res.status(200).json({ estado: true });
            console.log('Datos de vuelo insertados correctamente');
            res.redirect('/vuelos');
        }



    });
});

app.post('/vuelos-insert', function (req, res) {
    let query = 'INSERT INTO vuelos (numero_vuelo, aerolinea, origen, destino, fecha_salida, hora_salida, fecha_llegada, hora_llegada) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    let numeroVuelo = req.body.numero_vuelo;
    let aerolinea = req.body.aerolinea;
    let origen = req.body.origen;
    let destino = req.body.destino;
    let fechaSalida = req.body.fecha_salida;
    let horaSalida = req.body.hora_salida;
    let fechaLlegada = req.body.fecha_llegada;
    let horaLlegada = req.body.hora_llegada;

    connection.query(query, [numeroVuelo, aerolinea, origen, destino, fechaSalida, horaSalida, fechaLlegada, horaLlegada], (err, results, fields) => {
        if (err) {
            console.error('Error al actualizar datos en la base de datos:', err);
            // res.status(500).send('Error al actualizar datos en la base de datos');
            res.status(500).json({ message: err.message });
        } else if (results) {
            // res.status(200).json({ estado: true });
            res.redirect('/vuelos');
        }
        console.log('Datos de vuelo actualizados correctamente');
    });
})
app.delete('/vuelos/borrar/:id', (req, res) => {
    let vueloId = req.params.id;

    let query = 'DELETE FROM vuelos WHERE id = ?';
    console.log('el id eliminado es ' + vueloId);
    connection.query(query, [vueloId], function (error, results, fields) {
        if (error) {
            res.status(500).send('Error al eliminar el vuelo de la base de datos');


        } else if (results) {
            res.status(200).json({ estado: true });
        }

    });
});


const port = 3000;
app.listen(port, () => {
    console.log(`Servidor: http://localhost:${port}`);
});