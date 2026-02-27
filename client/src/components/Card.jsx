const Card = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-primary-500',
      bgLight: 'bg-primary-50',
      text: 'text-primary-600',
      gradient: 'from-primary-500 to-primary-600'
    },
    green: {
      bg: 'bg-success-500',
      bgLight: 'bg-success-50',
      text: 'text-success-600',
      gradient: 'from-success-500 to-success-600'
    },
    yellow: {
      bg: 'bg-warning-500',
      bgLight: 'bg-warning-50',
      text: 'text-warning-600',
      gradient: 'from-warning-500 to-warning-600'
    },
    red: {
      bg: 'bg-danger-500',
      bgLight: 'bg-danger-50',
      text: 'text-danger-600',
      gradient: 'from-danger-500 to-danger-600'
    },
    purple: {
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      text: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600'
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-4xl font-bold text-secondary-900">{value}</p>
        </div>
        {icon && (
          <div className={`${colors.bgLight} p-4 rounded-2xl`}>
            <div className="text-3xl">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
