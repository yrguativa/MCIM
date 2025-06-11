import { Link } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
    return (
        <div className="success-container">
            <div className="success-content">
                <h1>¡Inscripción Completada!</h1>
                <p>El equipo ha sido registrado exitosamente para el Torneo de Voleibol 2025.</p>
                <p>Un representante del torneo se pondrá en contacto con el delegado del equipo para confirmar los detalles.</p>
                <Link to="/" className="back-button">Registrar otro equipo</Link>
            </div>
        </div>
    );
};

export default SuccessPage;
