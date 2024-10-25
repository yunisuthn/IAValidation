import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    incrementPrevalidation,
    decrementPrevalidation,
    incrementReturned,
    decrementReturned,
    incrementValidationV2,
    decrementValidationV2,
    incrementValidated,
    decrementValidated,
    resetCounts,
} from './../../redux/store';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import fileService from '../../services/fileService';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const ValidationDropdown = (user) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const {
        prevalidationCount,
        returnedCount,
        validationV2Count,
        validatedCount
    } = useSelector((state) => state.documents);


    // console.log("rolle === ", role);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    useEffect(() => {

        fileService.fetchFiles()
            .then(data => {
                dispatch(resetCounts());
                // set count
                dispatch(incrementPrevalidation(data.filter(d => !d.validation.v1 && ['progress'].includes(d.status) && d.versions.length < 2).length));
                dispatch(incrementReturned(data.filter(d => d.status === 'returned').length));
                dispatch(incrementValidationV2(data.filter(d => d.validation.v1 && !d.validation.v2 && d.status === 'progress' && d.versions.length === 1).length));
                dispatch(incrementValidated(data.filter(d => d.validation.v1 && d.validation.v2 && d.status === 'validated' && d.versions.length === 2).length));
            })
        return () => {
            // status: 'returned'
        }
    }, [])


    useEffect(() => {
        // Array of paths that should open the validation menu
        const validationPaths = ['/validation', '/prevalidation', '/retourne', '/validated'];
        // Open the validation menu if the current path is in validationPaths
        setIsDropDownOpen(validationPaths.includes(location.pathname));

    }, [location]);


    const toggleValidationMenu = () => {
        setIsDropDownOpen(!isDropDownOpen);
    };

    const sc = (count = 0) => count > 9 ? `+9` : count;

    return (
        <li className='dropdown-menu'>
            <button onClick={toggleValidationMenu} className={`menu-item flex justify-between items-center ${isDropDownOpen ? 'open' : 'close'}`}>
                Validation
                {isDropDownOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </button>
            {
                isDropDownOpen && (
                    <ul className="ml-2 pl-4 py-1 space-y-1 border-l-2">
                        {(user.utilisateur.role === "admin" || user.utilisateur.role === "agent V1") && (<li>
                            <NavLink to="/prevalidation" className='menu-item' title={`${t('prevalidation')} ${prevalidationCount}`}>
                                {t('prevalidation')} v1 {prevalidationCount > 0 && <span>{sc(prevalidationCount)}</span>}
                            </NavLink>
                        </li>)}
                        {(user.utilisateur.role === "admin" || user.utilisateur.role === "agent V2") && (<li>
                            <NavLink to="/validation" className='menu-item' title={`Validation ${validationV2Count}`}>
                                Validation v2 {validationV2Count > 0 && <span>{sc(validationV2Count)}</span>}
                            </NavLink>
                        </li>)}
                        <li>
                            <NavLink to="/retourne" className='menu-item' title={`${t('retourne')} ${returnedCount}`}>
                                {t('retourne')} {returnedCount > 0 && <span>{sc(returnedCount)}</span>}
                            </NavLink>
                        </li>
                        {(user.utilisateur.role === "admin" ) && (<li>
                            <NavLink to="/validated" className='menu-item' title={`${t('validated-menu')} ${validatedCount}`}>
                                {t('validated-menu')} {validatedCount > 0 && <span>{sc(validatedCount)}</span>}
                            </NavLink>
                        </li>)}
                    </ul>
                )
            }
        </li>

    )
}

export default ValidationDropdown