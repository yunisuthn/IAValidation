import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import "./../login/login.css";
import LanguageSwitcher from '../others/LanguageSwitcher';
import { useNavigate } from 'react-router-dom';
import UserServices from "../services/serviceUser";
import { Alert } from '@mui/material';

export default function AddUser() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('agent V1')
  const  [error, setError] = useState(false)
  const  [success, setSuccess] = useState(false)
  const [name, setName] = useState('')
  const [firstname, setFirstname] = useState('')
  const navigate = useNavigate(); 

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      // Créer un objet avec les données utilisateur
      const userData = {
        email,
        role,
        name,
        firstname,
      };
      // Appeler la fonction saveUser pour enregistrer l'utilisateur
      const response = await UserServices.saveUser(userData);
  
      if (response.ok) {
        setSuccess(true)
        setError(false)
      }else{
        setError(true)
        setSuccess(false)
      }
  
    } catch (error) {
      setError(false);
    }
  }

  return (
    <section className="h-screen">
      <div className="h-full max-w-7xl mx-auto">
        {/* <div className="g-6 flex h-full flex-wrap items-center justify-center"> */}

          <div className="mb-12 md:w-8/12 lg:w-5/12">
            <div className="flex flex-row items-center justify-center lg:justify-start mb-4">
              <p className="text-2xl font-bold text-gray-800 lg:text-left dark:text-gray-200">
                {t('creer-un-compte')}
              </p>
              <div className="px-2 py-1 ml-auto hidden">
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

            <div className="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="firstname"
                id="firstname"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                onChange={(e=>{setFirstname(e.target.value)})}
              />
              <label htmlFor="firstname" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                {t('prenom')}
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
            {/* <div className="relative z-0 w-full mb-6 group">
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
            </div> */}

            {/* Confirm Password input */}
            {/* <div className="relative z-0 w-full mb-6 group">
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
            </div> */}

            {/* Role selection */}
            <div className="relative z-0 w-full mb-6 group">
              <select
                name="role"
                id="role"
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                onChange={e=> setRole(e.target.value)}
              >
                <option value="agent V1" >Agent V1</option>
                <option value="agent V2" >Agent V2</option>
                <option value="admin">{t('admin')}</option>
              </select>
            </div>
            
            {error && (
              <Alert severity="error" onClose={() => setError(false)}>
                <div className={`text-center text-sm text-red-600 `}>{t('warning-add-user')}</div>
              </Alert>
            )} 
            {success && (
              <Alert severity="success" onClose={() => setSuccess(false)}>
                <div className={`text-center text-sm text-green-600 `}>{t('warning-add-user')}</div>
              </Alert>
            )}

            <div className="text-center lg:text-left">
              <button
                type="button"
                className="inline-block w-full bouton-login text-white px-7 py-3 rounded shadow-md transition duration-150 ease-in-out"
                onClick={handleSubmit}
              >
                {t('creer-un-compte')}
              </button>
            </div>
          </div>
        {/* </div> */}
      </div>
    </section>
  );
}
