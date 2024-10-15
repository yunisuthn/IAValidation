import React from 'react';
import {NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Layout() {

  const {t, i18n} = useTranslation()

  const changeLanguage = (lng) =>{
    i18n.changeLanguage(lng)
  }

  return (
    <div className="flex">

      {/* Menu latéral gauche */}
      <aside className="w-64 h-screen bg-sky-500 text-white">

        <div className='flex itmes-center justify-between p-6'>
          <div className='text-lg font-bold'>Menu</div>
          <div className='flex space-x-2'>
            <button 
            onClick={() => changeLanguage('fr')} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              FR
            </button>
            <button 
              onClick={() => changeLanguage('en')} 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              EN
            </button>

          </div>
        </div>
        
        <nav className="space-y-2 p-6">
          <ul>
            <li>
              <NavLink 
                to="/" 
                className='menu-item '
              >
                {t('welcome')}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/prevalid" 
                className='menu-item '
              >
                {t('prevalidation')} (V1)
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/validation" 
                className='menu-item '
              >
                Validation (V2)
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/retourne" 
                className='menu-item '
              >
                {t('retourne')}
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/alldoc" 
                className='menu-item '
              >
                {t('tous-les-doc')}
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
