const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const workbook = XLSX.readFile('datos.xlsx');

app.use(bodyParser.json());

// Almacenar datos de Usuario y Proyecto como estructuras de arrays
const usuarios = [];
const proyectos = [];

// Función para dividir las etiquetas separadas por ', ' en un array
function dividirEtiquetas(etiquetas) {
    return etiquetas.split(', ').map(etiqueta => etiqueta.trim());
}

// RECOPILAR USUARIOS -----------------------------------------------------------------------
let firstSheetName = workbook.SheetNames[0];
let worksheet = workbook.Sheets[firstSheetName];
let data = XLSX.utils.sheet_to_json(worksheet);

data.forEach(item => {
    const usuario = {
        id: item.id,
        nombre: item.Nombre,
        etiquetas: {
            Tematica: dividirEtiquetas(item.Tematica),
            ConocimientosGenerales: dividirEtiquetas(item.ConocimientosGenerales),
            HabilidadesEspecificas: dividirEtiquetas(item.HabilidadesEspecificas),
            NivelHabilidades: item.NivelHabilidades
        }
    }
    usuarios.push(usuario);
});

console.log('Usuarios:', usuarios);

// RECOPILAR PROYECTOS -----------------------------------------------------------------------
firstSheetName = workbook.SheetNames[1];
worksheet = workbook.Sheets[firstSheetName];
data = XLSX.utils.sheet_to_json(worksheet);

data.forEach(item => {
    const proyecto = {
        id: item.id,
        nombre: item.Nombre,
        etiquetas: {
            Tematica: dividirEtiquetas(item.Tematica),
            ConocimientosGenerales: dividirEtiquetas(item.ConocimientosGenerales),
            HabilidadesEspecificas: dividirEtiquetas(item.HabilidadesEspecificas),
            NivelHabilidades: item.NivelHabilidades
        }
    }
    proyectos.push(proyecto);
});

console.log('Proyectos:', proyectos);

// Función para obtener proyectos recomendados para un usuario específico
function obtenerProyectosRecomendados(usuarioId, etiquetasUsuario) {
    const proyectosRecomendados = proyectos
        .map(proyecto => {
            const etiquetasProyecto = proyecto.etiquetas;
            const etiquetasComunes = {
                Tematica: etiquetasProyecto.Tematica.filter(etiqueta => etiquetasUsuario.Tematica.includes(etiqueta)),
                ConocimientosGenerales: etiquetasProyecto.ConocimientosGenerales.filter(etiqueta => etiquetasUsuario.ConocimientosGenerales.includes(etiqueta)),
                HabilidadesEspecificas: etiquetasProyecto.HabilidadesEspecificas.filter(etiqueta => etiquetasUsuario.HabilidadesEspecificas.includes(etiqueta)),
                NivelHabilidades: etiquetasProyecto.NivelHabilidades === etiquetasUsuario.NivelHabilidades ? [etiquetasUsuario.NivelHabilidades] : []
            };

            const porcentajeCoincidencia = (
                (etiquetasComunes.Tematica.length +
                etiquetasComunes.ConocimientosGenerales.length +
                etiquetasComunes.HabilidadesEspecificas.length +
                etiquetasComunes.NivelHabilidades.length) /
                (etiquetasUsuario.Tematica.length +
                etiquetasUsuario.ConocimientosGenerales.length +
                etiquetasUsuario.HabilidadesEspecificas.length +
                etiquetasUsuario.NivelHabilidades.length) * 100
            ).toFixed(2);

            return {
                id: proyecto.id,
                nombre: proyecto.nombre,
                porcentajeCoincidencia: porcentajeCoincidencia,
                etiquetasComunes: etiquetasComunes
            };
        })
        .filter(proyecto => proyecto.porcentajeCoincidencia > 0)
        .sort((a, b) => b.porcentajeCoincidencia - a.porcentajeCoincidencia);

    return proyectosRecomendados;
}

// Obtener proyectos recomendados para un usuario específico
app.get('/proyectos-recomendados/:usuarioId', (req, res) => {
    const usuarioId = req.params.usuarioId;
    const usuario = usuarios.find(user => user.id === parseInt(usuarioId));
    if (!usuario) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
    }

    const proyectosRecomendados = obtenerProyectosRecomendados(usuarioId, usuario.etiquetas);
    res.json(proyectosRecomendados);
});

// Iniciar el servidor en el puerto 4000
app.listen(4000, () => {
    console.log('Servidor iniciado en el puerto 4000');
});
