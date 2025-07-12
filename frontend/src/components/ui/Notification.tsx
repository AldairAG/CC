import React from 'react';

interface NotificationProps {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ type, title, message, onClose }) => {
    const getNotificationStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '📢';
        }
    };

    return (
        <div className={`p-4 rounded-lg border ${getNotificationStyles()}`}>
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                    <div className="text-lg">{getIcon()}</div>
                    <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm mt-1">{message}</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="sr-only">Cerrar</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Notification;
