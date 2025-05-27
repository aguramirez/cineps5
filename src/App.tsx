import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Tailwind funciona! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Si ves este diseño con colores y estilos, Tailwind CSS está funcionando correctamente.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Botón de prueba
        </button>
      </div>
    </div>
  )
}

export default App
