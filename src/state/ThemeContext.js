import React, { useState } from 'react'

export const ThemeContext = React.createContext({
  isDarkMode: false,
  switchTheme: () => {},
})

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)
  const switchTheme = () => setDarkMode(!darkMode)

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode: darkMode,
        switchTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
