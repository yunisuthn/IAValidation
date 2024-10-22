import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import Deconnect from './Deconnect';
import { useTranslation } from 'react-i18next';

const Header = ({ changeLanguage }) => {

    const handleLogout = Deconnect()
    const { t } = useTranslation();
    return (
        <div className="nav border-b">
            <div className="our__logo font-bold">
                <img src="/smartverifica.png" alt="logo" className="w-44" />
            </div>
            <div className="flex-grow flex gap-4 justify-end">
                <div className="flex flex-col items-end gap-3">
                    <div className="our__logo font-bold">
                        <img src="/optimum-solutions-blacktext.png" alt="logo" className="w-32" />
                    </div>
                    {/* Menus */}
                    <div className="flex items-center gap-6">
                        <LanguageSwitcher changeLanguage={changeLanguage} />
                        <button className="rounded-xl border border-gray-300 text-sm px-2 py-1 text-gray-600 hover:bg-gray-300 hover:border-gray-400 hover:text-dark"
                        onClick={handleLogout}>
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header