const API_BASE_URL = 'http://localhost:5000';

const fetchAllUser = async () => {
    try {
        const allUser = await fetch(`${API_BASE_URL}/allUsers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
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

const UserServices = {
    fetchAllUser
}

export default UserServices