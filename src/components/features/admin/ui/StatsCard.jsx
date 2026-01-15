import './StatsCard.css';

/**
 * StatsCard - Reusable statistics display card
 */
export default function StatsCard({
    label,
    value,
    change,
    changeDirection = 'same',
    icon,
    variant = 'default'
}) {
    const formatValue = (val) => {
        if (typeof val === 'number' && val >= 1000) {
            return val.toLocaleString();
        }
        return val;
    };

    return (
        <div className={`stats-card-ui ${variant}`}>
            {icon && <span className="stat-icon">{icon}</span>}
            <div className="stat-content">
                <p className="stat-label">{label}</p>
                <div className="stat-value-row">
                    <span className="stat-number">{formatValue(value)}</span>
                    {change !== undefined && (
                        <span className={`stat-change ${changeDirection}`}>
                            {changeDirection === 'up' ? '+' : changeDirection === 'down' ? '-' : ''}
                            {change}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
