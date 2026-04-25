import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

const formatNota = (nota) => nota < 10 ? `0${nota}` : `${nota}`;
const getPromedio = (n1, n2, pc, ef) => Math.round((n1 + n2 + pc + ef) / 4);

export default function CourseDetail({ course, announcements, onBack }) {
  const [selectedMonth, setSelectedMonth] = useState('Abril');
  const prom = getPromedio(course.notes.n1, course.notes.n2, course.notes.pc, course.notes.ef);
  
  // Color Logic for Score
  let scoreColor = '#1E40AF'; // Default Blue
  if (prom < 11) scoreColor = '#B91C1C'; // Red
  else if (prom > 16) scoreColor = '#C5A059'; // Gold

  const scorePercentage = (prom / 20) * 100;

  // Simulate monthly attendance based on overall logic for demo purposes
  const months = ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // Mock monthly breakdown to make the filter interactive
  const totalDaysInMonth = 20; // assumed 20 class days per month
  // Randomize a little based on the total attendance to show interaction
  const getSimulatedMonthAttendance = (month) => {
     const monthIndex = months.indexOf(month);
     const base = Math.floor(course.attendanceTotal / 10); 
     const variation = (course.name.length + monthIndex) % 3;
     const asistidos = Math.min(totalDaysInMonth, Math.max(0, base + variation - 1));
     const faltados = totalDaysInMonth - asistidos;
     return { asistidos, faltados, total: totalDaysInMonth };
  };

  const monthData = getSimulatedMonthAttendance(selectedMonth);
  const attendancePercentTotal = (course.attendanceTotal / 200) * 100;
  const isCritical = attendancePercentTotal < 70;

  const courseAnnouncements = announcements.filter(a => a.course === course.name);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center text-[#8B0000] font-bold hover:text-[#6b0000] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Regresar a Libreta
      </button>

      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-[#8B0000] text-white p-6 relative overflow-hidden">
          <div className="relative z-10 flex items-center">
            <BookOpen className="w-8 h-8 mr-4 opacity-80" />
            <div>
              <h2 className="text-2xl font-bold tracking-wide">{course.name}</h2>
              <p className="text-white/70 text-sm mt-1">Detalle Académico y Rendimiento</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-10 -mt-20"></div>
          <div className="absolute bottom-0 right-10 w-24 h-24 bg-white/10 rounded-full -mb-10"></div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* A. Barra de Progreso de Notas */}
          <div className="space-y-6">
             <h3 className="text-lg font-bold text-[#333333] border-b border-gray-100 pb-2">Rendimiento Académico</h3>
             
             <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-medium">Progreso Actual</span>
                <span className="text-3xl font-bold" style={{ color: scoreColor }}>{formatNota(prom)} <span className="text-lg text-gray-400 font-normal">/ 20</span></span>
             </div>
             
             <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${scorePercentage}%` }}
                 transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                 className="h-full rounded-full"
                 style={{ backgroundColor: scoreColor }}
               ></motion.div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="bg-gray-50 p-3 rounded-[12px] text-center border border-gray-100">
                  <span className="block text-xs text-gray-500 font-bold mb-1">Nota 1</span>
                  <span className="text-xl font-bold text-[#333333]">{formatNota(course.notes.n1)}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-[12px] text-center border border-gray-100">
                  <span className="block text-xs text-gray-500 font-bold mb-1">Nota 2</span>
                  <span className="text-xl font-bold text-[#333333]">{formatNota(course.notes.n2)}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-[12px] text-center border border-gray-100">
                  <span className="block text-xs text-gray-500 font-bold mb-1">Prác. Cal.</span>
                  <span className="text-xl font-bold text-[#333333]">{formatNota(course.notes.pc)}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-[12px] text-center border border-gray-100">
                  <span className="block text-xs text-gray-500 font-bold mb-1">Ex. Final</span>
                  <span className="text-xl font-bold text-[#333333]">{formatNota(course.notes.ef)}</span>
                </div>
             </div>
          </div>

          {/* B. Módulo de Asistencia con Filtro */}
          <div className="space-y-6">
             <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-lg font-bold text-[#333333]">Control de Asistencia</h3>
                <select 
                  className="bg-gray-50 border border-gray-200 text-[#8B0000] font-bold rounded-[8px] px-3 py-1 outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer text-sm"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
             </div>

             <div className="bg-gray-50 p-4 rounded-[12px] border border-gray-100">
                <div className="flex justify-between items-end mb-3">
                   <span className="text-gray-500 font-medium text-sm">Resumen de {selectedMonth}</span>
                   <span className="font-bold text-[#333333]">
                     <span className="text-[#059669]">{monthData.asistidos} Asistencias</span> | <span className="text-[#B91C1C]">{monthData.faltados} Faltas</span>
                   </span>
                </div>
                <div className="w-full bg-red-100 rounded-full h-3 overflow-hidden flex">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${(monthData.asistidos / monthData.total) * 100}%` }}
                     transition={{ duration: 0.8, ease: "easeOut" }}
                     className="h-full bg-[#059669]"
                   ></motion.div>
                </div>
                <p className="text-right text-[10px] text-gray-400 font-bold mt-1">Total Días: {monthData.total}</p>
             </div>

             <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-sm font-bold text-gray-600">Asistencia Anual (200 días)</span>
                   <span className={`font-bold ${isCritical ? 'text-orange-500' : 'text-[#059669]'}`}>{attendancePercentTotal.toFixed(0)}%</span>
                </div>
                {isCritical && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 bg-red-50 border border-red-200 p-3 rounded-[8px] flex items-start"
                  >
                     <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                     <p className="text-xs text-red-700 font-bold leading-relaxed">
                        ⚠️ Alerta: Riesgo de inhabilitación por inasistencias.
                     </p>
                  </motion.div>
                )}
             </div>
          </div>

        </div>
      </div>

      {/* C. Muro de Anuncios del Curso */}
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center">
            <MessageSquare className="w-5 h-5 mr-3 text-[#C5A059]" />
            <h3 className="font-bold text-lg text-[#333333]">Mural de Anuncios del Curso</h3>
         </div>
         <div className="p-6">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {courseAnnouncements.length > 0 ? (
                courseAnnouncements.map((a, idx) => (
                  <motion.div 
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#C5A059] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-[12px] border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                         <span className="font-bold text-[#8B0000] text-sm">{a.author}</span>
                         <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{a.date}</span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{a.content}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 relative z-10 bg-white">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-20 text-[#C5A059]" />
                  <p className="font-medium text-sm">Aún no hay anuncios específicos para este curso.</p>
                </div>
              )}
            </div>
         </div>
      </div>
    </motion.div>
  );
}
