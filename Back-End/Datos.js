const XLSX = require('xlsx');

const Usuario = [

    {
        id: 1,
        nombre: "Manuel Cardelle",
        etiquetas: {
            Tematica: ['Tecnologia', 'Informatica'],
            SkillsGenerales: ['Programación', 'Trabajo en equipo'],
            SkillsEspecificas: ['JavaScript', 'Python', 'HTML'],
            NivelSkills: 'Intermedio'
        }
    },
    {
        id: 2,
        nombre: "Rocio Moran",
        etiquetas: {
            Tematica: ['Informatica', 'Ingeniería'],
            SkillsGenerales: ['Programación', 'Trabajo en equipo', 'Diseño Industrial'],
            SkillsEspecificas: ['JavaScript', 'CSS', 'HTML', 'AutoCad'],
            NivelSkills: 'Intermedio'
        }
    },
    {
        id: 3,
        nombre: "Tamara Sandobal",
        etiquetas: {
            Tematica: ['Química'],
            SkillsGenerales: ['Analítica'],
            SkillsEspecificas: ['HPLC', 'CG'],
            NivelSkills: 'Avanzado'
        }
    },
    {
        id: 4,
        nombre: "Juan Kopke",
        etiquetas: {
            Tematica: ['Psicologia'],
            SkillsGenerales: ['TCC'],
            SkillsEspecificas: ['Mindfulness'],
            NivelSkills: 'Avanzado'
        }
    },
    {
        id: 5,
        nombre: "Santiago Fernandez",
        etiquetas: {
            Tematica: ['Astronomia', 'Biologia'],
            SkillsGenerales: ['Astrofisica', 'Microbiologia'],
            SkillsEspecificas: ['Agujeros Negros', 'Supernova', 'Cepario'],
            NivelSkills: 'Basico'
        }
    },
    {
        id: 6,
        nombre: "Santiago Rodriguez",
        etiquetas: {
            Tematica: ['Matematica'],
            SkillsGenerales: ['Estadistica'],
            SkillsEspecificas: ['R Studio', 'Excel'],
            NivelSkills: 'Intermedio'
        }
    }
];

const Proyecto = [
    {
        id: 1,
        nombre: "Proyecto 1",
        etiquetas: {
            Tematica: ['Informatica', 'Biologia'],
            SkillsGenerales: ['Programacion', 'Sistemas Biologicos'],
            SkillsEspecificas: ['Machine Learning', 'Clustering', 'R Studio'],
            NivelSkills: 'Intermedio'
        }
    },
    {
        id: 2,
        nombre: "Proyecto 2",
        etiquetas: {
            Tematica: ['Informatica'],
            SkillsGenerales: ['Programacion', 'Trabajo en Equipo'],
            SkillsEspecificas: ['HTML', 'CSS', 'Python'],
            NivelSkills: 'Intermedio'
        }
    },
    {
        id: 3,
        nombre: "Proyecto 3",
        etiquetas: {
            Tematica: ['Psicologia', 'Terapia Ocupacional'],
            SkillsGenerales: ['TCC'],
            SkillsEspecificas: ['Mindfulness'],
            NivelSkills: ['Intermedio', 'Basico']
        }
    },
    {
        id: 4,
        nombre: "Proyecto 4",
        etiquetas: {
            Tematica: ['Astronomia'],
            SkillsGenerales: ['Astrofisica'],
            SkillsEspecificas: ['Agujeros Negros'],
            NivelSkills: ['Intermedio', 'Avanzado']
        }
    },
    {
        id: 5,
        nombre: "Proyecto 5",
        etiquetas: {
            Tematica: ['Química', 'Toxicología'],
            SkillsGenerales: ['Analitica'],
            SkillsEspecificas: ['HPLC', 'Evaluacion de Riesgo Ambiental', 'Excel'],
            NivelSkills: 'Intermedio'
        }
    },
    {
        id: 6,
        nombre: "Proyecto 6",
        etiquetas: {
            Tematica: ['Matematica'],
            SkillsGenerales: ['Estadistica'],
            SkillsEspecificas: ['R Studio', 'Python'],
            NivelSkills: 'Intermedio'
        }
    }

];

// Función para combinar las etiquetas en una cadena separada por comas
function combinarEtiquetas(etiquetas) {
    return etiquetas.join(', '); // Puedes usar otro carácter en lugar de la coma si prefieres
}

// Convertir datos de usuarios para Excel
const datosUsuarioParaExcel = Usuario.map(usuario => ({
    id: usuario.id,
    nombre: usuario.nombre,
    Tematica: combinarEtiquetas(usuario.etiquetas.Tematica),
    SkillsGenerales: combinarEtiquetas(usuario.etiquetas.SkillsGenerales),
    SkillsEspecificas: combinarEtiquetas(usuario.etiquetas.SkillsEspecificas),
    NivelSkills: usuario.etiquetas.NivelSkills
}));

// Convertir datos de usuarios para Excel
const datosProyectoParaExcel = Proyecto.map(proyecto => ({
    id: proyecto.id,
    nombre: proyecto.nombre,
    Tematica: combinarEtiquetas(proyecto.etiquetas.Tematica),
    SkillsGenerales: combinarEtiquetas(proyecto.etiquetas.SkillsGenerales),
    SkillsEspecificas: combinarEtiquetas(proyecto.etiquetas.SkillsEspecificas),
    NivelSkills: proyecto.etiquetas.NivelSkills
}));



// Crear un libro de trabajo
const workbook = XLSX.utils.book_new();

// Crear hojas de trabajo para Usuario y Proyecto
const usuarioWorksheet = XLSX.utils.json_to_sheet(datosUsuarioParaExcel);
const proyectoWorksheet = XLSX.utils.json_to_sheet(datosProyectoParaExcel);

// Agregar las hojas al libro de trabajo
XLSX.utils.book_append_sheet(workbook, usuarioWorksheet, 'Usuarios');
XLSX.utils.book_append_sheet(workbook, proyectoWorksheet, 'Proyectos');

// Escribir el libro de trabajo en un archivo Excel
XLSX.writeFile(workbook, 'datos.xlsx');

console.log('Archivo Excel creado correctamente.');