import React, { createContext, useContext, useState, useEffect } from 'react';

// Import base PrimeReact CSS
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export type ThemeType = 'lara-light-indigo' | 'lara-dark-indigo';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'lara-light-indigo';
  });

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme', theme);

    // Apply base theme to document
    let linkId = 'primereact-theme-base';
    let baseThemeElem = document.getElementById(linkId) as HTMLLinkElement;
    if(!baseThemeElem) {
      baseThemeElem = document.createElement('link');
      baseThemeElem.id = linkId;
      baseThemeElem.rel = 'stylesheet';
      baseThemeElem.href = '/themes/primereact.min.css';
      document.head.appendChild(baseThemeElem);
    }
    // Apply flex theme
    linkId = 'primereact-theme-flex';
    let flexThemeElem = document.getElementById(linkId) as HTMLLinkElement;
    if (!flexThemeElem) {
      flexThemeElem = document.createElement('link');
      flexThemeElem.id = linkId;
      flexThemeElem.rel = 'stylesheet';
      flexThemeElem.href = '/themes/primeflex.css';
      document.head.appendChild(flexThemeElem);
    } 


    // Update theme stylesheet
    linkId = 'primereact-theme-link';
    let themeLink = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.id = linkId;
      themeLink.rel = 'stylesheet';
      document.head.appendChild(themeLink);
    }
    
    themeLink.href = `/themes/${theme}.css`;
    
    // Add/remove dark mode class to body
    if (theme.includes('dark')) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
