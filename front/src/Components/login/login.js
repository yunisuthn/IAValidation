import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./login.css"
import LanguageSwitcher from './../others/LanguageSwitcher'
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const {t, i18n } = useTranslation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate(); 

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  
  // Utilisation de useEffect pour rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');    
    if (token) {
      navigate('/smart_verifica/accueil', {replace: true}); // Redirection vers la page d'accueil si connecté
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      var response = await axios.post("http://localhost:5000/login", {
        email, password
      })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      navigate('/smart_verifica/accueil');
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <section className="h-screen">
      <div className="h-full max-w-7xl mx-auto">
        {/* <!-- Left column container with background--> */}
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="mb-12 grow-0 basis-auto md:w-9/12 lg:w-6/12">
            <img src="/smartverifica.png" alt="logo" className="w-full" />
          </div>

          {/* <!-- Right column container --> */}
          <div className="mb-12 md:w-8/12 lg:w-5/12">

            <div className="flex-grow flex gap-4 justify-end">
              <div className="flex flex-col items-end gap-3">
                <div className="our__logo font-bold">
                  <img src="/optimum-solutions-blacktext.png" alt="logo" className="w-32" />
                </div>
                {/* Menus */}
                <div className="flex items-center gap-6">
                </div>
              </div>
            </div>
            <>
              {/* <!--Sign in section--> */}
              <div className="flex flex-row items-center justify-center lg:justify-start mb-4">
                <p className="text-2xl font-bold text-gray-800 lg:text-left dark:text-gray-200">
                  {t('se-connecter')}
                </p>
                <div className="px-2 py-1 ml-auto">
                  <LanguageSwitcher changeLanguage={changeLanguage} />
                </div>
              </div>


              {/* <!-- Email input --> */}
              <div className="relative z-0 w-full mb-6 group">
                <input type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={e =>setEmail(e.target.value)}/>
                <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{t('email')}</label>
              </div>
              {/* <!--Password input--> */}
              <div className="relative z-0 w-full mb-6 group">
                <input type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " 
                onChange={e=>setPassword(e.target.value)}/>
                <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3  origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{t('mot-de-passe')}</label>
              </div>


              <div className="mb-6 flex items-center justify-between">
                {/* <!-- Remember me checkbox --> */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    {t('Remember me')}
                  </label>
                </div>

                {/* <!--Forgot password link--> */}
                <a href="#!" className="text-sm text-primary hover:underline">
                  {t('mdp-oublier')}
                </a>
              </div>
              <div className="text-center lg:text-left">

                <button
                  type="button"
                  className="inline-block w-full bouton-login text-white px-7 py-3 rounded shadow-md  focus:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
                  onClick={handleSubmit}
                >
                  {t('connexion')}
                </button>
              </div>

            </>
          </div>
        </div>
      </div>
    </section>

  );
}