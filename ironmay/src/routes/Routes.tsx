import { Route, Routes } from 'react-router-dom';

import LoginPage from '../pages/Login'
import SignUpPage from '../pages/SignUp'
import HomePage from '../pages/Home'

const  PageRoutes = () => {
    return(
        <>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/home" element={<HomePage />} />
        </Routes>
        </>
    );
}

export default PageRoutes;