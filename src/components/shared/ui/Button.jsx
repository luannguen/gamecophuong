import './Button.css';

/**
 * Button - Reusable button component
 */
export default function Button({
    children,
    variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
    size = 'medium', // 'small' | 'medium' | 'large'
    disabled = false,
    loading = false,
    icon,
    onClick,
    type = 'button',
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn-${variant} btn-${size} ${loading ? 'loading' : ''} ${className}`}
            {...props}
        >
            {loading && <span className="spinner-small" />}
            {icon && !loading && (
                <span className="material-symbols-outlined btn-icon">{icon}</span>
            )}
            <span className="btn-text">{children}</span>
        </button>
    );
}
