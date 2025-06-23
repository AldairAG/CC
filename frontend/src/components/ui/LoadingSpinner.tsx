interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4`}></div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
