import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import "./login.css";
import axios from "axios";
import LanguageSwitcher from './../others/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('agent')
  const  [error, setError] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate(); 

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Utilisation de useEffect pour rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/smart_verifica/accueil'); // Redirection vers la page d'accueil si connecté
    }
  }, [navigate]);
  async function handleSubmit(event) {
    event.preventDefault()

    if (password !== confirmPassword) {
        setError(t('passwords-do-not-match'))
        return
    }
    try {
      var response= await axios.post("http://localhost:5000/register", {
        email, password, role, name
      })

      console.log("Signup response:", response.data.token);
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      navigate('/smart_verifica/accueil');
    } catch (error) {
      setError(error.response?.data?.message || t('error-occured'))
      
    }
  }

  return (
    <section className="h-screen">
      <div className="h-full max-w-7xl mx-auto">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          <div className="mb-12 grow-0 basis-auto md:w-9/12 lg:w-6/12">
            <img src="/smartverifica.png" alt="logo" className="w-full" />
          </div>

          <div className="mb-12 md:w-8/12 lg:w-5/12">
            <div className="flex-grow flex gap-4 justify-end">
              <div className="flex flex-col items-end gap-3">
                <div className="our__logo font-bold">
                  <img src="/optimum-solutions-blacktext.png" alt="logo" className="w-32" />
                </div>
                <div className="flex items-center gap-6"></div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-center lg:justify-start mb-4">
              <p className="text-2xl font-bold text-gray-800 lg:text-left dark:text-gray-200">
                {t('creer-un-compte')}
              </p>
              <div className="px-2 py-1 ml-auto">
                <LanguageSwitcher changeLanguage={changeLanguage} />
              </div>
            </div>

            {/* Email input */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="email"
                id="name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e=>{setName(e.target.value)})}
              />
              <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                {t('nom')}
              </label>
            </div>

            {/* Email input */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e=>{setEmail(e.target.value)})}
              />
              <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                {t('email')}
              </label>
            </div>

            {/* Password input */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="password"
                id="password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e=>{setPassword(e.target.value)})}
              />
              <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                {t('mot-de-passe')}
              </label>
            </div>

            {/* Confirm Password input */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e=>{setConfirmPassword(e.target.value)})}
              />
              <label htmlFor="confirm_password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                {t('confirmer-mot-de-passe')}
              </label>
            </div>

            {/* Role selection */}
            <div className="relative z-0 w-full mb-6 group">
              <select
                name="role"
                id="role"
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onChange={e=> setRole(e.target.value)}
              >
                <option value="agent" >Agent</option>
                <option value="admin">{t('admin')}</option>
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>} {/* Affichage des erreurs */}

            <div className="text-center lg:text-left">
              <button
                type="button"
                className="inline-block w-full bouton-login text-white px-7 py-3 rounded shadow-md focus:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
                onClick={handleSubmit}
              >
                {t('creer-un-compte')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
