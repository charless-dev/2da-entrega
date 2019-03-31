
var express = require('express');
var app = express();
var path = require('path');
var hbs = require('hbs');
var bodyParser = require('body-parser');
require('./helpers');

//Configurar directorios
const dirNode_modules = path.join(__dirname , '../node_modules');
const directoriopublico = path.join(__dirname,'../public');
const directoriopartials = path.join(__dirname,'../partials');
hbs.registerPartials(directoriopartials);

//Estalecer configuraciones servidor
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(directoriopublico));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
app.set('view engine', 'hbs');

//Rutas

app.get('/crear',(req,res) => {
	res.render('crear');
})

app.post('/crear',(req,res) => {
	res.render('cursoCredo',{
		ide: req.body.ide,
		nombre: req.body.nombre,
		modalidad: req.body.modalidad,
		intensidad: req.body.intensidad,		
		descripcion: req.body.descripcion,
		valor: req.body.valor
	});
})

app.get('/info-cursos', (req, res) => {
	res.render('infoCursos');
});

app.get('/inscripcion',(req,res) => {
	res.render('inscripcion');
});

app.post('/inscripcion',(req,res) => {
	res.render('inscripcionCreada', {
		documento: req.body.documento,
		nombre: req.body.nombre,
		correo: req.body.correo,
		telefono: req.body.telefono,
		curso: req.body.curso
	});
});

app.get('/inscritos-cursos',(req,res) => {
	res.render('infoInscritosCursos');
})

app.post('/inscritos-cursos',(req,res) => {
	res.render('cursoCerrado', {
		curso: req.body.curso
	});
})

app.get('/eliminar',(req,res) => {
	res.render('eliminiar');
});

app.post('/eliminar',(req,res) => {
	res.render('eliminado', {
		documento: req.body.documento,
		nombre: req.body.nombre,
		correo: req.body.correo,
		telefono: req.body.telefono,
		curso: req.body.curso
	});
});

app.listen(3000,()=>{
	console.log('Servidor activo')
});