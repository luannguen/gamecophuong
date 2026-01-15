import { useState, useEffect, useRef } from 'react';
import './Modal.css';

/**
 * Modal - Reusable modal dialog
 */
export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'medium', // 'small' | 'medium' | 'large' | 'full'
    closeOnOverlay = true,
}) {
    const modalRef = useRef();

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal-content modal-${size}`} ref={modalRef}>
                {title && (
                    <div className="modal-header">
                        <h2>{title}</h2>
                        <button className="close-btn" onClick={onClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                )}
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </div>
    );
}
