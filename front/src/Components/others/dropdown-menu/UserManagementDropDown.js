import { KeyboardArrowDown, KeyboardArrowUpOutlined } from '@mui/icons-material';
import { t } from 'i18next';
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const UserManagementDropdown = () => {
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Array of paths that should open the dropdown
    const userManagementPaths = [
        '/user-management/view',
        '/user-management/add',
        '/user-management/edit',
        '/user-management/delete',
    ];

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    useEffect(() => {
        // Open the dropdown if the current path is in userManagementPaths
        setIsDropdownOpen(userManagementPaths.includes(location.pathname));
    }, [location]); // Re-run when the pathname changes

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="menu-item flex justify-between items-center w-full"
            >
                {t('users-menu')}
                {isDropdownOpen ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDown />}
            </button>

            {isDropdownOpen && (
                <ul className="ml-2 pl-4 py-1 space-y-2 border-l-2">
                    <li>
                        <NavLink to="/user-management/view" className='menu-item block px-4 py-2 hover:bg-gray-200'>
                            View Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/user-management/add" className='menu-item block px-4 py-2 hover:bg-gray-200'>
                            Add User
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/user-management/edit" className='menu-item block px-4 py-2 hover:bg-gray-200'>
                            Edit User
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/user-management/delete" className='menu-item block px-4 py-2 hover:bg-gray-200'>
                            Delete User
                        </NavLink>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default UserManagementDropdown;