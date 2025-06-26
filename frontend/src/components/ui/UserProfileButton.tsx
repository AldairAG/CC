import { useUser } from '../../hooks/useUser';
import { USER_ROUTES } from '../../constants/ROUTERS';
import { useHistory } from 'react-router-dom';

const UserProfileButton = () => {
    const { user } = useUser();
    const navigate = useHistory();

    const handleNavigateToProfile = () => {
        navigate.push(USER_ROUTES.USER_PROFILE);
    };

    return (
        <div className="flex items-center space-x-3">
            {/* Información del Usuario (solo desktop) */}
            <div className="hidden md:flex flex-col items-end text-sm">
                <span className="font-medium text-white">{user?.username || 'Usuario'}</span>
                <span className="text-gold-500 font-semibold">
                    ${user?.saldo?.toLocaleString() || '0'}
                </span>
            </div>

            {/* Botón de Perfil - Versión Desktop */}
            <button
                onClick={handleNavigateToProfile}
                className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-casino hover:shadow-neon-red transform hover:scale-105"
                title="Mi Perfil"
            >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-gold-500">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-medium">Mi Perfil</span>
            </button>
            
            {/* Botón de Perfil - Versión Mobile */}
            <button
                onClick={handleNavigateToProfile}
                className="sm:hidden relative flex items-center justify-center w-12 h-12 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-casino hover:shadow-neon-red transform hover:scale-105"
                title={`Mi Perfil - ${user?.username || 'Usuario'}`}
            >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-gold-500">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* Indicador de saldo (solo mobile) */}
                {user?.saldo && user.saldo > 0 && (
                    <div className="absolute -top-1 -right-1 bg-gold-500 text-dark-900 text-xs px-1 py-0.5 rounded-full min-w-[20px] text-center font-bold">
                        ${user.saldo > 999 ? '999+' : user.saldo}
                    </div>
                )}
            </button>
        </div>
    );
};

export default UserProfileButton;
