const API_BASE_URL = 'https://level-ambiguous-snagglefoot.glitch.me';
const token = () => localStorage.getItem('token');

const fetchAllUser = async () => {
    try {
        const allUser = await fetch(`${API_BASE_URL}/allUsers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token()}`,
            }
        })

        if (!allUser.ok) {
            throw new Error(`Erreur lors de la récupération des utilisateurs `);
        }

        const users = await allUser.json()
        return users

    } catch (error) {
        console.error(`Erreur lors de la récupération des utilisateurs: `, error);
        throw error
    }
}

const saveUser = async (data) => {
    
    const result = await fetch(`${API_BASE_URL}/registerUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token()}`,
        },
        body: JSON.stringify(data)
    })
    
    return result;
}

const UserServices = {
    fetchAllUser, saveUser
}

export default UserServices