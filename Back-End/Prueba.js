const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const XLSX = require('xlsx');

app.use(bodyParser.json());

const workbook = XLSX.readFile('datos.xlsx');
const Usuario = [];
const Proyecto = [];

function dividirEtiquetas(etiquetas) {
    return etiquetas.split(', ').map(etiqueta => etiqueta.trim());
}

let firstSheetName = workbook.SheetNames[0];
let worksheet = workbook.Sheets[firstSheetName];
let data = XLSX.utils.sheet_to_json(worksheet);

data.forEach(item => {
    const usuario = {
        id: item.id,
        nombre: item.nombre,
        etiquetas: {
            Tematica: dividirEtiquetas(item.Tematica),
            ConocimientosGenerales: dividirEtiquetas(item.ConocimientosGenerales),
            HabilidadesEspecificas: dividirEtiquetas(item.HabilidadesEspecificas),
            NivelHabilidades: item.NivelHabilidades
        }
    }
    Usuario.push(usuario);
});

firstSheetName = workbook.SheetNames[1];
worksheet = workbook.Sheets[firstSheetName];
data = XLSX.utils.sheet_to_json(worksheet);

data.forEach(item => {
    const proyecto = {
        id: item.id,
        nombre: item.nombre,
        etiquetas: {
            Tematica: dividirEtiquetas(item.Tematica),
            ConocimientosGenerales: dividirEtiquetas(item.ConocimientosGenerales),
            HabilidadesEspecificas: dividirEtiquetas(item.HabilidadesEspecificas),
            NivelHabilidades: item.NivelHabilidades
        }
    }
    Proyecto.push(proyecto);
});

function calcularJaccard(etiquetasUsuario, etiquetasProyecto) {
    const interseccion = etiquetasUsuario.filter(etiqueta => etiquetasProyecto.includes(etiqueta));
    const union = new Set([...etiquetasProyecto]);
    const coeficienteJaccard = interseccion.length / union.size;
    return coeficienteJaccard;
}

function calcularCoincidenciaConPesos(usuario, proyecto, etiquetasExcluyentes) {
    const pesoTematica = 0;
    const pesoConocimientosGenerales = 30;
    const pesoHabilidadesEspecificas = 60;
    const pesoNivelHabilidades = 10;

    const etiquetasUsuario = [...usuario.etiquetas.Tematica, ...usuario.etiquetas.ConocimientosGenerales, ...usuario.etiquetas.HabilidadesEspecificas];
    const etiquetasProyecto = [...proyecto.etiquetas.Tematica, ...proyecto.etiquetas.ConocimientosGenerales, ...proyecto.etiquetas.HabilidadesEspecificas];

    const tieneEtiquetasExcluyentes = etiquetasExcluyentes.some(excluyente => {
        return etiquetasProyecto.includes(excluyente) && !etiquetasUsuario.includes(excluyente);
    });

    if (tieneEtiquetasExcluyentes) {
        return 0;
    }

    const jaccardTematica = calcularJaccard(usuario.etiquetas.Tematica, proyecto.etiquetas.Tematica);
    const jaccardConocimientosGenerales = calcularJaccard(usuario.etiquetas.ConocimientosGenerales, proyecto.etiquetas.ConocimientosGenerales);
    const jaccardHabilidadesEspecificas = calcularJaccard(usuario.etiquetas.HabilidadesEspecificas, proyecto.etiquetas.HabilidadesEspecificas);
    const jaccardNivelHabilidades = calcularJaccard([usuario.etiquetas.NivelHabilidades], [proyecto.etiquetas.NivelHabilidades]);

    const puntajeTematica = pesoTematica * jaccardTematica;
    const puntajeConocimientosGenerales = pesoConocimientosGenerales * jaccardConocimientosGenerales;
    const puntajeHabilidadesEspecificas = pesoHabilidadesEspecificas * jaccardHabilidadesEspecificas;
    const puntajeNivelHabilidades = pesoNivelHabilidades * jaccardNivelHabilidades;

    const totalPuntaje = puntajeTematica + puntajeConocimientosGenerales + puntajeHabilidadesEspecificas + puntajeNivelHabilidades;
    const porcentajeCoincidencia = (totalPuntaje / 100) * 100;

    return porcentajeCoincidencia;
}

app.get('/calcularCoincidenciaConPesos', (req, res) => {
    const etiquetasExcluyentes = req.query.excluyentes.split(',');
    const usuarioId = req.query.Usuario;
    const proyectoId = req.query.Proyecto;

    const usuario = Usuario.find(u => u.id == usuarioId);
    const proyecto = Proyecto.find(p => p.id == proyectoId);

    if (!usuario || !proyecto) {
        res.json({ error: 'Usuario o proyecto no encontrado' });
        return;
    }

    const porcentajeCoincidencia = calcularCoincidenciaConPesos(usuario, proyecto, etiquetasExcluyentes);
    res.json({ porcentajeCoincidencia });
});

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});
