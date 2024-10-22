import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fileService from '../services/fileService';
import Header from '../others/Header';
import { useDispatch, useSelector } from 'react-redux';
import {
  incrementPrevalidation,
  decrementPrevalidation,
  incrementReturned,
  decrementReturned,
  incrementValidationV2,
  decrementValidationV2,
  resetCounts,
} from './../redux/store';
import { useNavigate } from 'react-router-dom';

// Composant pour le menu latéral
function SidebarMenu({ pdfCount }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    prevalidationCount,
    returnedCount,
    validationV2Count,
  } = useSelector((state) => state.documents);

  useEffect(() => {
  
    fileService.fetchFiles()
    .then(data => {
      dispatch(resetCounts());
      // set count
      dispatch(incrementPrevalidation(data.filter(d => !d.validation.v1 && ['progress'].includes(d.status) && d.versions.length < 2).length));
      dispatch(incrementReturned(data.filter(d => d.status === 'returned').length));
      dispatch(incrementValidationV2(data.filter(d => d.validation.v1 && !d.validation.v2 && d.status === 'progress' && d.versions.length === 1).length));
    })
    return () => {
      // status: 'returned'
    }
  }, [])
  
  

  useEffect(()=>{
    var user = localStorage.getItem('user')
    user = JSON.parse(user)
    console.log("user==>", user.role);
    
  }, [])

  return (
    <aside className="min-w-64 h-full bg-slate-100 text-dark border-r border-gray-300">
      <div className='flex items-center justify-between p-6'>
        <div className='text-lg font-bold'>Menu</div>
      </div>
      
      <nav className="space-y-2 p-6">
        <ul className='flex flex-col gap-2'>
          <li>
            <NavLink to="/accueil" className='menu-item'>
              {t('accueil')} <span id='fichierEntrer'>({pdfCount})</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/prevalidation" className='menu-item '>
              {t('prevalidation')} V1 <span id='fichierV1'>({prevalidationCount})</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/validation" className='menu-item '>
              Validation V2 <span id='fichierV2'>({validationV2Count})</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/retourne" className='menu-item '>
              {t('retourne')} <span id='fichierRetourne'>({returnedCount})</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/alldoc" className='menu-item'>
              {t('tous-les-doc')}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function Layout() {
  const navigate = useNavigate(); 
  const { i18n } = useTranslation();
  const [pdfCount, setPdfCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fileService.fetchFiles()
      .then(files => {
        setPdfCount(files.length);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des fichiers:", error);
        setError("Erreur lors de la récupération des fichiers.");
      });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    }
  }, [navigate]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="layout__page">
      <Header changeLanguage={changeLanguage} />
      <div className="flex flex-grow">
        <SidebarMenu changeLanguage={changeLanguage} pdfCount={pdfCount} />
        <main className="flex-1 p-6 bg-white">
          {error && <div className="text-red-600">{error}</div>} {/* Afficher l'erreur si elle existe */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
