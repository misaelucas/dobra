import React, { useEffect, useState } from 'react'

function Notification({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true) // State to control visibility for fade effect
  const colorClass =
    type === 'error' ? 'bg-red-500 text-red-700' : '!bg-green-500 text-white'
  const icon = type === 'error' ? '⚠️' : '✅'

  useEffect(() => {
    const timer = setTimeout(() => {
      // Start fade out after 1 second
      setIsVisible(false)
      // Then close the notification completely after another 0.5 seconds
      setTimeout(() => {
        onClose()
      }, 500) // Delay for fade-out duration
    }, 1000)

    return () => clearTimeout(timer) // Cleanup the timer
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center text-lg font-semibold p-4 bg-black bg-opacity-60 z-50 ${!isVisible ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}`}
    >
      <div
        className={`w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md ${colorClass} ${!isVisible ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}`}
      >
        <div className="p-4 flex justify-between items-center">
          <span className="text-lg">{icon}</span>
          <span className="mx-3">{message}</span>
          <button onClick={onClose} className="text-xl hover:text-gray-600">
            &times;
          </button>
        </div>
      </div>
    </div>
  )
}

export default Notification
