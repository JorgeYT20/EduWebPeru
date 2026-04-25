import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { users } from './mockData';
import { motion } from 'framer-motion';
import { School, User, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      login(foundUser);
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] font-sans p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-[12px] shadow-xl w-full max-w-md border-t-4 border-[#8B0000]"
      >
        <div className="text-center mb-8">
          <div className="mx-auto bg-[#8B0000] w-16 h-16 flex items-center justify-center rounded-full mb-4 shadow-lg">
            <School className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#333333]">EduWebPeru</h1>
          <p className="text-gray-500 text-sm mt-2">Sistema de Gestión Académica</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mb-6 p-3 bg-red-50 text-[#8B0000] rounded-[12px] flex items-center text-sm font-medium border border-red-100"
          >
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-[12px] focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none transition-shadow text-[#333333] bg-gray-50 focus:bg-white"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-[12px] focus:ring-2 focus:ring-[#8B0000] focus:border-[#8B0000] outline-none transition-shadow text-[#333333] bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#8B0000] text-white py-3 rounded-[12px] hover:bg-[#6b0000] transition-colors font-semibold shadow-md"
          >
            Ingresar al Sistema
          </motion.button>
        </form>
        
        <div className="mt-8 border-t border-gray-100 pt-6">
           <p className="text-xs text-gray-400 text-center font-medium">
             Demo: director, profesor, alumno (Clave: 123456)
           </p>
        </div>
      </motion.div>
    </div>
  );
}
