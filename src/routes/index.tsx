import { Route, Routes } from 'react-router-dom';

/**
 * pages
 * ---
 */
import {
    Main
} from './pages';

const Routemap = () => {

    /* ===== RENDER ===== */
    return (
        <Routes>
            <Route
                path='/'
                element={<Main />}
            />
        </Routes>
    );
};

export default Routemap;