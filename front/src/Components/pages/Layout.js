import React, { useEffect, useState } from 'react';
import {NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fileService from '../services/fileService';

function LanguageSwitcher({changeLanguage}) {

  return(
    <div className='flex space-x-2'>
      <button 
      onClick={()=> changeLanguage('fr')}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
      >
        FR
      </button>
      <button 
      onClick={()=> changeLanguage('en')}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        EN
      </button>
    </div>
  )
}

// Composant pour le menu latéral (Single Responsibility)
function SidebarMenu({ changeLanguage, pdfCount }) {
  const { t } = useTranslation();
  
  return (
    <aside className="w-64 h-screen bg-sky-500 text-white">
      <div className='flex items-center justify-between p-6'>
        <div className='text-lg font-bold'>Menu</div>
        <LanguageSwitcher changeLanguage={changeLanguage}/>
      </div>
      
      <nav className="space-y-2 p-6">
        <ul>
          <li>
            <NavLink to="/" className='menu-item '>
              {t('accueil')} <span id='fichierEntrer'>({pdfCount})</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/prevalid" className='menu-item '>
              {t('prevalidation')} (V1) <span id='fichierV1'>({pdfCount})</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/validation" className='menu-item '>
              Validation (V2) <span id='fichierV2'>(0)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/retourne" className='menu-item '>
              {t('retourne')} <span id='fichierRetourne'>(0)</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/alldoc" className='menu-item '>
              {t('tous-les-doc')}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
function Layout() {

  const {i18n} = useTranslation()
  const [pdfCount, setPdfCount] = useState(0)

  useEffect(()=>{
    fileService.fetchFiles()
      .then(files=>{        
        setPdfCount(files.length)
      })
      .catch(error=> console.error("Erreur lors de la récupération des fichiers:", error) )
  }, [])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex">

      <SidebarMenu changeLanguage={changeLanguage} pdfCount={pdfCount}/>

      {/* Contenu principal */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
