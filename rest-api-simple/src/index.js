const express = require('express');
const morgan = require('morgan');
//une directorios
const path = require('path');
const app = express();

//Simular BD
const products = [{
        id: 1,
        name: 'laptop'
    },
    {
        id: 2,
        name: 'Microfono'
    },
    {
        id: 3,
        name: 'PC'
    }
];

//Configuraciones
//establesco el puerto
app.set('port', process.env.PORT || 3000);

//midddleware---> procesan lo que nosotros estamos recibiendo en las rutas antes de que lleguen
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//RUTAS DEL SERVIDOR--hacen referencia a las url
//get---> pedir al servidor
app.get('/products', (req, res) => {
    res.json(products);
});

//post--> le envio al servidor
app.post('/products', (req, res) => {
    //console.log(req.body);
    const { name } = req.body; //sintaxis ES6
    //res.send('datos recibidos')
    //inserrta nuevo producto a la bd
    products.push({
        id: products.length + 1,
        name
    });
    res.json('producto creado');
});

//put-->actualizar dato
app.put('/products/:id', (req, res) => {
    //console.log(req.params, req.body);
    //actualizar
    const { id } = req.params;
    const { name } = req.body;
    //se hace el recorrido
    products.forEach((product, i) => {
        if (product.id == id) {
            product.name = name;
        }
    })
    res.json('actualizado satisfactorimente');
});

//delete----> elimina
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    //se hace el recorrido
    products.forEach((product, i) => {
        if (product.id == id) {
            //remueve el pruducto
            products.splice(i, 1);
        }
    })
    res.json('completamente eliminado');
});

//Static files--html,css,js
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

//obtendo el puerto
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});