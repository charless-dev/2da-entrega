
const hbs = require('hbs');
const fs = require('fs');

let listaCursos = [];
let listaInscritos = [];

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

hbs.registerHelper('infoCursos',() => {
	cargarCursos();
	let info = "<p>Lista de cursos disponibles - <em>Haz clic en cada curso para ver su información</em></p><div id='accordion' class='mb-5 mt-4'>";
	listaCursos.forEach(curso => {
		if (curso.estado === "disponible") {
			info += '<div class="card">'
					  +	'<div class="card-header">' 
						  + '<a class="card-link d-block" data-toggle="collapse" href="#curso'+curso.id+'">'
							  + '<strong>Nombre del curso: </strong>'+curso.nombre+'<br>'
							  + '<strong>Descripción: </strong> '+curso.descripcion+'<br>'
							  + '<strong>Valor: </strong> '+curso.valor
						  + '</a>'
					  + '</div>'
					  + '<div id="curso'+curso.id+'" class="collapse" data-parent="#accordion">'
						  + '<div class="card-body">'
							  + '<strong>Nombre del curso: </strong>'+curso.nombre+'<br>'
							  + '<strong>Descripción: </strong> '+curso.descripcion+'<br>'
							  + '<strong>Valor: </strong> '+curso.valor+'<br>'
							  + '<strong>Modalidad: </strong> '+curso.modalidad+'<br>'
							  + '<strong>Intensidad horaria: </strong> '+curso.intensidad
						  + '</div>'
					  + '</div>'
				  + '</div>';
			}
		}
	);
	info += "</div>";
	return info;
});

hbs.registerHelper('listadoCursos', () => {
	cargarCursos();
	let cursos = "";
	listaCursos.forEach(curso => {
		if (curso.estado === "disponible") {
			cursos += "<option>"+curso.nombre+"</option>"
		}
	});
	return cursos;
});

hbs.registerHelper('inscripcion', (documento, nombre, correo, telefono, curso) => {
	cargarInscritos();
	let inscribir = {
		documento: documento,
		nombre: nombre,
		correo: correo,
		telefono: telefono,
		curso: curso
	};
	let duplicado = listaInscritos.find(inscrito => inscrito.documento == inscribir.documento && inscrito.curso == inscribir.curso);
	if (!duplicado) {
		listaInscritos.push(inscribir);
		guardarInscritos();
		let mensaje = "<div class='alert alert-success'><strong>Exito!</strong> "+inscribir.nombre +" se ha inscrito en el curso <strong>" +inscribir.curso+ "</strong> correctamente.</div>";
			return mensaje;
	} else {
		return `<div class="alert alert-danger">
				<strong>Error!</strong> Ya se ha registrado en este curso anteriormente.
				</div>`;
	}
});

let cargarInscritos = () => {
	try {
		listaInscritos = require('./inscritos');
	} catch(e) {
		listaInscritos = [];
	}
}

let guardarInscritos = () => {
	let inscritos = JSON.stringify(listaInscritos);
	fs.writeFile('./src/inscritos.json',inscritos,(err)=>{
		if (err) throw (err);
	});
}

hbs.registerHelper('infoInscritosCursos', () => {
	cargarInscritos();
	cargarCursos();
	let infoInscritosCursos = "<p>Lista de cursos disponibles:</p>";
	listaCursos.forEach(curso => {
		if (curso.estado == "disponible") {
			infoInscritosCursos += "<h4>"+curso.nombre+"</h4>";
			let ins = listaInscritos.filter(u => u.curso === curso.nombre);
			if (ins.length>0) {
				infoInscritosCursos += "<p>Lista de inscritos:</p>";
				ins.forEach(inscrito => {
					infoInscritosCursos += "<p><strong>Documento: </strong>"+inscrito.documento+"<p/>"
										+ "<p><strong>Nombre: </strong>"+inscrito.nombre+"<p/>"		
										+ "<p><strong>Correo: </strong>"+inscrito.correo+"<p/>"		
										+ "<p><strong>Telefono: </strong>"+inscrito.telefono+"<p/><span class='container border-top my-3 d-block'></span>";		
				});
			}else {
				infoInscritosCursos += "<p>Este curso no tiene inscritos</p>";
			}
		}
	});
	return infoInscritosCursos;
});

hbs.registerHelper('cerrarCurso',(c) => {
	cargarCursos();
	let cursoC = listaCursos.find(o => o.nombre == c);
	if (cursoC) {
		cursoC["estado"] = "cerrado"; 
		guardarCursos();
		let mensaje = "<div class='alert alert-success'><strong>Exito!</strong> Se ha cerrado el curso <strong>" +c+ "</strong> correctamente.</div>";
			return mensaje;		
	}
});

hbs.registerHelper('eliminar', (documento, nombre, correo, telefono, curso) => {
	cargarInscritos();
	let inscritos = listaInscritos.filter(ins => ins.documento != documento && ins.curso != curso);
	if (inscritos.length == listaInscritos) {
		return "<div class='alert alert-danger'><strong>Error!</strong> La persona ingresada no esta inscrita en ningun curso</div>";
	} else {
		listaInscritos = inscritos;
		guardarInscritos();
		let mensaje = "<div class='alert alert-success'><strong>Exito!</strong> Se ha eliminado el estudiante <strong>" +nombre+ "</strong> correctamente del curso "+curso+ "</div>";
		return mensaje;			
	}
});