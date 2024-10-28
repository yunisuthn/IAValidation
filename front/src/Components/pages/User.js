import React, { useCallback, useEffect, useState } from 'react';
import AllUsers from '../others/dropdown-menu/AllUser';
import UserServices from '../services/serviceUser';


// Hook pour gérer les fichiers (Single Responsibility)

const User=()=> {

    const [users, setUsers] = useState([])

    useEffect (()=>{
        UserServices.fetchAllUser()
            .then(data=>{
                setUsers(data)
            })
            .catch(error=>console.error("Erreur lors de la récupération des users"))
    }, [])
    return (
        <div className="flex flex-col items-start h-full w-full flex-grow">
            <div className='w-full overflow-x-auto h-full'>
                <AllUsers data={users} />
            </div>
        </div>
    );
}

export default User;