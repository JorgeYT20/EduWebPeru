export const users = [
  { username: 'director', password: '123456', role: 'ADMIN', name: 'Director Principal' },
  { username: 'profesor', password: '123456', role: 'TEACHER', name: 'Profesor Carlos' },
  { username: 'alumno', password: '123456', role: 'STUDENT', name: 'Alumno Juan Pérez', dni: '70000001' }
];

const generateCourses = (baseNotes, baseAttendance) => {
  const courseNames = [
    'Matemática', 'Comunicación', 'Ciencias Sociales', 'Ciencia y Tecnología', 
    'Desarrollo Personal Ciudadanía y Cívica (DPCC)', 'Arte y Cultura', 'Educación Física', 'Inglés'
  ];
  return courseNames.map((name, i) => ({
    name,
    notes: {
      n1: Math.min(20, Math.max(0, baseNotes + (i % 3) - 1)),
      n2: Math.min(20, Math.max(0, baseNotes - (i % 2))),
      pc: Math.min(20, Math.max(0, baseNotes + 1)),
      ef: Math.min(20, Math.max(0, baseNotes))
    },
    attendanceTotal: baseAttendance + i,
    dailyAttendance: {}
  }));
};

export const studentsData = [
  { id: 1, dni: '70000001', name: 'Juan Pérez', courses: generateCourses(14, 150) },
  { id: 2, dni: '70000002', name: 'María Gómez', courses: generateCourses(16, 180) },
  { id: 3, dni: '70000003', name: 'Carlos Quispe', courses: generateCourses(10, 130) },
  { id: 4, dni: '70000004', name: 'Ana Condori', courses: generateCourses(18, 190) },
  { id: 5, dni: '70000005', name: 'Luis Huamán', courses: generateCourses(12, 145) },
  { id: 6, dni: '70000006', name: 'Rosa Mamani', courses: generateCourses(11, 135) },
  { id: 7, dni: '70000007', name: 'José Flores', courses: generateCourses(15, 160) },
  { id: 8, dni: '70000008', name: 'Carmen Chuquimia', courses: generateCourses(13, 155) },
  { id: 9, dni: '70000009', name: 'Miguel Yupanqui', courses: generateCourses(9, 120) },
  { id: 10, dni: '70000010', name: 'Jorge Sánchez', courses: generateCourses(14, 170) },
  { id: 11, dni: '70000011', name: 'Lucero Rojas', courses: generateCourses(17, 185) },
  { id: 12, dni: '70000012', name: 'Diego Vargas', courses: generateCourses(12, 140) },
  { id: 13, dni: '70000013', name: 'Elena Castro', courses: generateCourses(15, 175) },
  { id: 14, dni: '70000014', name: 'Fernando Mendoza', courses: generateCourses(16, 188) },
  { id: 15, dni: '70000015', name: 'Patricia Ríos', courses: generateCourses(19, 195) }
];

export const initialAnnouncements = [
  { id: 1, author: 'Dirección', course: 'General', content: 'Bienvenidos al nuevo año escolar en I.E. Institución Emblemática EduWebPeru. Recuerden revisar constantemente la plataforma.', date: '2026-04-01' },
  { id: 2, author: 'Profesor Carlos', course: 'Matemática', content: 'Recuerden que la próxima semana tenemos práctica calificada de Álgebra.', date: '2026-04-20' },
  { id: 3, author: 'Profesor Carlos', course: 'Comunicación', content: 'Deben leer el capítulo 3 de "Los Ríos Profundos" para el control de lectura.', date: '2026-04-22' }
];
