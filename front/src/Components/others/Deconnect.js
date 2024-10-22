import { useNavigate } from 'react-router-dom';

const Deconnect = () =>{
    const navigate = useNavigate()

    const handleLogout = ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')

    }

    return handleLogout
}

export default Deconnect