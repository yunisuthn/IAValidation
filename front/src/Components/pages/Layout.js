import React from 'react';
import {NavLink, Outlet, useLocation } from 'react-router-dom';

function Layout() {

  return (
    <div className="flex">
      {/* Menu latéral gauche */}
      <aside className="w-64 h-screen bg-sky-500 text-white">
        <div className="p-6 text-lg font-bold">Menu</div>
        <nav className="space-y-2 p-6">
          <ul>
            <li>
              <NavLink 
                to="/" 
                className='menu-item '
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/prevalid" 
                className='menu-item '
              >
                Pre validation
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/validation" 
                className='menu-item '
              >
                Validation 
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/retourne" 
                className='menu-item '
              >
                Retourne
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/alldoc" 
                className='menu-item '
              >
                Tous les documents
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
