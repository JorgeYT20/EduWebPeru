import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { studentsData as initialStudents, initialAnnouncements } from './mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Search, User as UserIcon, BookOpen, AlertTriangle, Send, Award, Calendar } from 'lucide-react';
import CourseDetail from './CourseDetail';

const formatNota = (nota) => nota < 10 ? `0${nota}` : `${nota}`;

const getPromedio = (n1, n2, pc, ef) => Math.round((n1 + n2 + pc + ef) / 4);

const NotaDisplay = ({ nota }) => {
  const isRed = nota < 11;
  return (
    <span className={`font-bold ${isRed ? 'text-[#B91C1C]' : 'text-[#1E40AF]'}`}>
      {formatNota(nota)}
    </span>
  );
};

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [students, setStudents] = useState(initialStudents);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  const renderContent = () => {
    switch (user.role) {
      case 'ADMIN': return <AdminDashboard students={students} />;
      case 'TEACHER': return <TeacherDashboard students={students} setStudents={setStudents} announcements={announcements} setAnnouncements={setAnnouncements} user={user} />;
      case 'STUDENT': return <StudentDashboard student={students.find(s => s.dni === user.dni) || students[0]} announcements={announcements} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#333333]">
      <nav className="bg-[#8B0000] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-[#C5A059] mr-2" />
              <span className="font-bold text-lg sm:text-xl tracking-tight truncate hidden sm:block">I.E. Institución Emblemática EduWebPeru</span>
              <span className="font-bold text-xl tracking-tight sm:hidden">EduWebPeru</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-sm font-medium bg-white/10 px-4 py-2 rounded-[12px]">
                <UserIcon className="w-4 h-4 mr-2 text-[#C5A059]" />
                {user.name} <span className="text-white/70 ml-1">({user.role})</span>
              </div>
              <button 
                onClick={logout} 
                className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5 text-[#C5A059]" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}

function AdminDashboard({ students }) {
  const [searchDni, setSearchDni] = useState('');
  
  const filteredStudent = searchDni ? students.find(s => s.dni === searchDni) : null;
  
  const riskStudents = students.filter(s => {
    return s.courses.some(c => {
      const prom = getPromedio(c.notes.n1, c.notes.n2, c.notes.pc, c.notes.ef);
      return prom < 11 || (c.attendanceTotal / 200 * 100) < 70;
    });
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b-2 border-[#C5A059] pb-2 inline-block">Panel del Director</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center"><Search className="w-5 h-5 mr-2 text-[#8B0000]"/> Buscar Alumno</h3>
          <div className="flex space-x-2">
            <input 
              type="text" 
              maxLength={8}
              placeholder="DNI (8 dígitos)"
              className="flex-1 border border-gray-200 rounded-[12px] px-4 py-2 outline-none focus:ring-2 focus:ring-[#8B0000] bg-gray-50 focus:bg-white transition-all"
              value={searchDni}
              onChange={(e) => setSearchDni(e.target.value)}
            />
          </div>
          {filteredStudent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-5 bg-gray-50 rounded-[12px] border border-gray-200 shadow-inner">
              <p className="font-bold text-lg text-[#333333]">{filteredStudent.name}</p>
              <p className="text-sm text-gray-500 mb-3">DNI: {filteredStudent.dni}</p>
              <div className="mt-2 text-sm space-y-2 max-h-60 overflow-y-auto pr-1">
                {filteredStudent.courses.map((c, i) => {
                  const prom = getPromedio(c.notes.n1, c.notes.n2, c.notes.pc, c.notes.ef);
                  return (
                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded-md border border-gray-100">
                      <span className="font-medium text-gray-700">{c.name}</span>
                      <div className="bg-gray-100 px-3 py-1 rounded-full"><NotaDisplay nota={prom} /></div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          {searchDni && !filteredStudent && searchDni.length === 8 && (
            <p className="text-[#B91C1C] mt-3 text-sm font-medium">No se encontró alumno con ese DNI.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-4 text-[#B91C1C] flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/> Alumnos en Riesgo Académico</h3>
          <ul className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{maxHeight: '400px'}}>
            {riskStudents.map(s => (
              <li key={s.id} className="p-4 bg-red-50 rounded-[12px] border border-red-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[#B91C1C]">{s.name}</span>
                    <span className="block text-xs text-red-500 font-medium">DNI: {s.dni}</span>
                  </div>
                </div>
                <div className="text-xs mt-3 space-y-1">
                  {s.courses.map((c, i) => {
                    const prom = getPromedio(c.notes.n1, c.notes.n2, c.notes.pc, c.notes.ef);
                    if (prom < 11 || (c.attendanceTotal / 200 * 100) < 70) {
                      return (
                        <div key={i} className="flex justify-between text-[#B91C1C] bg-white/60 p-1.5 rounded">
                          <span className="font-medium truncate w-2/3">{c.name}</span>
                          <span className="w-1/3 text-right">Prom: <NotaDisplay nota={prom} /> | Asist: {((c.attendanceTotal / 200) * 100).toFixed(0)}%</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </li>
            ))}
            {riskStudents.length === 0 && <p className="text-sm text-gray-500">No hay alumnos en riesgo actualmente.</p>}
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-[#8B0000]"/> Rendimiento Global (Promedios)</h3>
        <div className="flex h-56 items-end space-x-2 sm:space-x-4 border-b border-l border-gray-200 pb-2 pl-2 sm:pl-4 pt-4 overflow-x-auto">
           {['Matemática', 'Comunicación', 'Ciencias Sociales', 'Ciencia y Tecnología', 'DPCC', 'Arte y Cultura', 'Educación Física', 'Inglés'].map((courseName, idx) => {
             // We use a short name for DPCC to fit better
             const fullCourseName = courseName === 'DPCC' ? 'Desarrollo Personal Ciudadanía y Cívica (DPCC)' : courseName;
             let totalSum = 0;
             let count = 0;
             students.forEach(s => {
               const c = s.courses.find(co => co.name === fullCourseName);
               if (c) {
                 totalSum += getPromedio(c.notes.n1, c.notes.n2, c.notes.pc, c.notes.ef);
                 count++;
               }
             });
             const avg = count ? totalSum / count : 0;
             const heightPercent = (avg / 20) * 100;
             return (
               <div key={idx} className="flex-1 flex flex-col items-center justify-end group min-w-[60px]">
                 <div className="opacity-0 group-hover:opacity-100 mb-2 text-xs sm:text-sm font-bold text-[#8B0000] bg-red-50 px-2 py-1 rounded transition-opacity">
                   {avg.toFixed(1)}
                 </div>
                 <motion.div 
                   initial={{ height: 0 }} animate={{ height: `${heightPercent}%` }} transition={{ duration: 1, type: "spring" }}
                   className="w-full max-w-[60px] bg-[#8B0000] rounded-t-lg cursor-pointer hover:bg-[#6b0000] transition-colors shadow-md relative overflow-hidden"
                 >
                    <div className="absolute top-0 left-0 right-0 h-2 bg-white/20"></div>
                 </motion.div>
                 <span className="text-[10px] sm:text-xs mt-3 text-center text-gray-600 font-medium w-full truncate px-1" title={fullCourseName}>{courseName}</span>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ students, setStudents, announcements, setAnnouncements, user }) {
  const courses = [
    'Matemática', 'Comunicación', 'Ciencias Sociales', 'Ciencia y Tecnología', 
    'Desarrollo Personal Ciudadanía y Cívica (DPCC)', 'Arte y Cultura', 'Educación Física', 'Inglés'
  ];
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  
  // Asistencia states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleNoteChange = (studentId, noteKey, value) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = 0;
    if (num > 20) num = 20;
    if (num < 0) num = 0;

    const updated = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          courses: s.courses.map(c => {
            if (c.name === selectedCourse) {
              return { ...c, notes: { ...c.notes, [noteKey]: num } };
            }
            return c;
          })
        };
      }
      return s;
    });
    setStudents(updated);
  };

  const handleAttendance = (studentId, status) => {
    const updated = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          courses: s.courses.map(c => {
            if (c.name === selectedCourse) {
              const currentStatus = c.dailyAttendance[selectedDate];
              let newTotal = c.attendanceTotal;
              
              if (currentStatus !== status) {
                 if (status === 'present' && currentStatus !== 'present') {
                    newTotal++;
                 } else if (status === 'absent' && currentStatus === 'present') {
                    newTotal--;
                 }
              }
              
              return { 
                ...c, 
                attendanceTotal: newTotal,
                dailyAttendance: {
                  ...c.dailyAttendance,
                  [selectedDate]: status
                }
              };
            }
            return c;
          })
        };
      }
      return s;
    });
    setStudents(updated);
  };

  const handlePostAnnouncement = () => {
    if (newAnnouncement.trim()) {
      setAnnouncements([{
        id: Date.now(),
        author: user.name,
        content: newAnnouncement,
        date: new Date().toLocaleDateString('es-PE')
      }, ...announcements]);
      setNewAnnouncement('');
    }
  };

  // Calcular Resumen Diario de Asistencia
  let totalPresent = 0;
  let totalAbsent = 0;
  
  students.forEach(s => {
    const c = s.courses.find(course => course.name === selectedCourse);
    if (c) {
      const status = c.dailyAttendance[selectedDate];
      if (status === 'present') totalPresent++;
      else if (status === 'absent') totalAbsent++;
    }
  });

  const attendancePercent = totalPresent + totalAbsent > 0 
    ? ((totalPresent / (totalPresent + totalAbsent)) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold border-b-2 border-[#C5A059] pb-2 inline-block">Portal Docente</h2>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-[12px] p-1 shadow-sm w-full sm:w-auto">
            <span className="pl-3 pr-2 text-sm text-gray-500 font-medium">Curso:</span>
            <select 
              className="bg-transparent px-3 py-1.5 outline-none font-semibold text-[#8B0000] cursor-pointer max-w-[200px] truncate"
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              title={selectedCourse}
            >
              {courses.map(c => <option key={c} value={c}>{c.length > 25 ? c.substring(0, 25) + '...' : c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-[#8B0000]" />
            <h3 className="font-semibold text-lg">Registro de Notas y Asistencia</h3>
          </div>
          
          <div className="flex items-center bg-white px-4 py-2 rounded-[12px] shadow-sm border border-gray-200">
             <Calendar className="w-4 h-4 text-[#8B0000] mr-2" />
             <span className="text-sm font-medium text-gray-600 mr-2">Fecha:</span>
             <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="outline-none text-[#1E40AF] font-bold bg-transparent cursor-pointer"
             />
          </div>
        </div>
        
        {/* Resumen Diario de Asistencia */}
        <div className="bg-blue-50/40 p-4 border-b border-gray-100 grid grid-cols-3 gap-2 sm:gap-4 text-center">
           <div className="bg-white p-2 sm:p-3 rounded-[12px] shadow-sm border border-gray-100">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Presentes</p>
              <p className="text-xl sm:text-2xl font-bold text-[#059669]">{totalPresent}</p>
           </div>
           <div className="bg-white p-2 sm:p-3 rounded-[12px] shadow-sm border border-gray-100">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Ausentes</p>
              <p className="text-xl sm:text-2xl font-bold text-[#B91C1C]">{totalAbsent}</p>
           </div>
           <div className="bg-white p-2 sm:p-3 rounded-[12px] shadow-sm border border-gray-100">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">% Asistencia Día</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1E40AF]">{attendancePercent}%</p>
           </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold sticky left-0 bg-gray-100 z-10 shadow-[1px_0_0_rgba(0,0,0,0.05)]">Alumno</th>
                <th className="px-2 py-4 text-center font-bold">Nota 1</th>
                <th className="px-2 py-4 text-center font-bold">Nota 2</th>
                <th className="px-2 py-4 text-center font-bold">Prác. Cal.</th>
                <th className="px-2 py-4 text-center font-bold">Ex. Final</th>
                <th className="px-4 py-4 text-center font-bold bg-[#8B0000]/5 text-[#8B0000]">Promedio</th>
                <th className="px-4 py-4 text-center font-bold border-l border-gray-200">Control Asistencia</th>
                <th className="px-4 py-4 text-center font-bold">Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map(s => {
                const course = s.courses.find(c => c.name === selectedCourse);
                if (!course) return null;
                const prom = getPromedio(course.notes.n1, course.notes.n2, course.notes.pc, course.notes.ef);
                const status = course.dailyAttendance[selectedDate]; // 'present', 'absent', or undefined
                
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800 sticky left-0 bg-white group-hover:bg-gray-50 z-10 shadow-[1px_0_0_rgba(0,0,0,0.05)]">{s.name}</td>
                    {['n1', 'n2', 'pc', 'ef'].map(noteKey => (
                      <td key={noteKey} className="px-2 py-3">
                        <input 
                          type="number" min="0" max="20"
                          className="w-14 mx-auto block text-center border border-gray-200 rounded-[8px] p-2 outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] font-medium bg-gray-50 focus:bg-white transition-all"
                          value={course.notes[noteKey]}
                          onChange={(e) => handleNoteChange(s.id, noteKey, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center text-xl bg-[#8B0000]/5">
                      <NotaDisplay nota={prom} />
                    </td>
                    <td className="px-4 py-3 text-center border-l border-gray-100">
                       <div className="flex items-center justify-center space-x-2">
                         <button 
                            onClick={() => handleAttendance(s.id, 'present')}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${status === 'present' ? 'bg-[#059669] text-white border-[#059669] shadow-md' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-[#059669]/10 hover:text-[#059669]'}`}
                         >
                            Asistió
                         </button>
                         <button 
                            onClick={() => handleAttendance(s.id, 'absent')}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${status === 'absent' ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-md' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-[#B91C1C]/10 hover:text-[#B91C1C]'}`}
                         >
                            Faltó
                         </button>
                       </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                       <div className="flex flex-col items-center">
                          <span className={`text-xs font-bold ${((course.attendanceTotal/200)*100) < 70 ? 'text-orange-500' : 'text-[#059669]'}`}>
                            {((course.attendanceTotal/200)*100).toFixed(0)}%
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{course.attendanceTotal}/200</span>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><Send className="w-5 h-5 mr-2 text-[#C5A059]"/> Publicar Anuncio a los Alumnos</h3>
        <textarea 
          className="w-full border border-gray-200 rounded-[12px] p-4 outline-none focus:ring-2 focus:ring-[#C5A059] focus:border-[#C5A059] resize-none bg-gray-50 focus:bg-white transition-all"
          rows="3"
          placeholder="Escriba un mensaje importante, tarea o recordatorio..."
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
        ></textarea>
        <div className="mt-4 flex justify-end">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePostAnnouncement}
            className="bg-[#C5A059] text-white px-8 py-2.5 rounded-[12px] font-bold hover:bg-[#b08d4a] transition-colors shadow-md flex items-center"
          >
            <Send className="w-4 h-4 mr-2"/> Publicar
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function StudentDashboard({ student, announcements }) {
  const [activeCourse, setActiveCourse] = useState(null);

  if (!student) return <div className="text-center py-10 font-medium">Cargando datos...</div>;

  if (activeCourse) {
    return <CourseDetail course={activeCourse} announcements={announcements} onBack={() => setActiveCourse(null)} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold border-b-2 border-[#C5A059] pb-2 inline-block">Libreta Digital</h2>
        <span className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-semibold border border-gray-100">
          Periodo 2026
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {student.courses.map((c, i) => {
          const prom = getPromedio(c.notes.n1, c.notes.n2, c.notes.pc, c.notes.ef);
          const attendancePercent = (c.attendanceTotal / 200) * 100;
          const isCritical = attendancePercent < 70;
          
          return (
            <motion.div 
              key={i} whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCourse(c)}
              className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:border-[#C5A059] transition-colors"
            >
              <div className="bg-[#8B0000] text-white p-5 font-semibold flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10 text-lg tracking-wide truncate pr-4">{c.name}</div>
                <BookOpen className="w-6 h-6 opacity-30 relative z-10 flex-shrink-0" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase text-gray-400 font-bold tracking-wider mb-1">Promedio Final</span>
                    <span className="text-4xl"><NotaDisplay nota={prom} /></span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded">Sobre 20</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">Asistencia Acumulada</span>
                    <span className={`font-bold ${isCritical ? 'text-orange-500' : 'text-[#059669]'}`}>
                      {attendancePercent.toFixed(0)}% <span className="text-xs font-normal opacity-70">({c.attendanceTotal}/200)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, attendancePercent)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${isCritical ? 'bg-orange-500' : 'bg-[#059669]'}`} 
                    ></motion.div>
                  </div>
                  {isCritical && <p className="text-[10px] text-orange-500 font-bold mt-1">¡Riesgo de repitencia por inasistencia!</p>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-[16px] shadow-sm border border-gray-100 mt-8">
        <h3 className="text-xl font-bold mb-6 flex items-center text-[#333333]"><Calendar className="w-6 h-6 mr-3 text-[#C5A059]"/> Mural de Anuncios Institucionales</h3>
        <div className="space-y-4">
          <AnimatePresence>
            {announcements.map((a) => (
              <motion.div 
                key={a.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="p-5 border-l-4 border-[#C5A059] bg-gray-50 hover:bg-gray-100 transition-colors rounded-r-[12px] relative"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="bg-[#8B0000] text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 shadow-sm">
                      {a.author.charAt(0)}
                    </div>
                    <span className="font-bold text-[#333333]">{a.author}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">{a.date}</span>
                </div>
                <p className="text-[#333333] leading-relaxed text-sm pl-11">{a.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {announcements.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No hay anuncios recientes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
