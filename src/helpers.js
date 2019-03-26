
const hbs = require('hbs');
const fs = require('fs');

let listaCursos = [];

hbs.registerHelper('crearCurso',(ide,nombre,modalidad,intensidad,descripcion,valor) => {
	cargarCursos();
	let curso = {
		id: ide,
		nombre: nombre,
		modalidad: modalidad,
		intensidad: intensidad,		
		descripcion: descripcion,		
		valor: valor,
		estado: "disponible"
	};
	let duplicado = listaCursos.find(val => val.id == curso.id);
	if (!duplicado) {
		listaCursos.push(curso);
		guardarCursos();
		let mensaje = "<div class='alert alert-success'><strong>Exito!</strong> Se ha creado el curso <strong>" +curso.nombre+ "</strong> correctamente.</div>\
					  <p>Lista de cursos creados:</p>"+mostrarCursos();
		return mensaje;			   
	} else {
		return `<div class="alert alert-danger">
				  <strong>Error!</strong> un curso tiene el mismo id ingresado.
				</div>`;
	}
});

let guardarCursos = () => {
	let cursos = JSON.stringify(listaCursos);
	fs.writeFile('./src/listado.json',cursos,(err)=>{
		if (err) throw (err);
	});
};

let cargarCursos = () => {
	try {
		listaCursos = require('./listado.json');
	} catch(e) {
		listaCursos = [];
	}
};

let mostrarCursos = () => {
	cargarCursos();
	let texto = "<table class='table table-bordered'>" +
				"<thead class='thead-dark'>" +
				"<th>Id</th>"+
				"<th>Nombre</th>"+
				"<th>Modalidad</th>"+
				"<th>Intensidad</th>"+
				"<th>Descripcion</th>"+
				"<th>Valor</th>"+
				"<th>Estado</th>"+
				"</thead>"+
				"<tbody>";
	listaCursos.forEach(curso => {
			texto += '<tr>'
				   + '<td>' + curso.id + '</td>'
				   + '<td>' + curso.nombre + '</td>'
				   + '<td>' + curso.modalidad + '</td>'
				   + '<td>' + curso.intensidad + '</td>'
				   + '<td>' + curso.descripcion + '</td>'
				   + '<td>' + curso.valor + '</td>'
				   + '<td>' + curso.estado + '</td>'
				   + '</tr>';				   
		}
	);
	texto += "<tbody></table>";
	return texto;
};