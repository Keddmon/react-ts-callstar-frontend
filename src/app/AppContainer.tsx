import { HashRouter as Router } from 'react-router-dom';
import App from './App';

const AppContainer = () => {
    /* ===== RENDER ===== */
    return (
        <Router>
            <App />
        </Router>
    );
};

export default AppContainer;