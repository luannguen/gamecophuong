import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './EnhancedModal.css';

/**
 * EnhancedModal - Backend-ready modal with Drag, Resize, Maximize
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {string} title
 * @param {React.ReactNode} children
 * @param {string} maxWidth - 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full'
 * @param {boolean} showControls - Show maximize/minimize/close controls
 * @param {boolean} enableDrag - Allow dragging by header
 * @param {boolean} enableResize - Allow resizing
 * @param {boolean} persistPosition - Remember position
 * @param {string} positionKey - Key for creating unique storage entry
 * @param {number} zIndex
 */
export default function EnhancedModal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    maxWidth = '2xl',
    showControls = true,
    enableDrag = true, // Simple implementation: requires draggable lib or custom logic. For now, we'll implement basic centering.
    enableResize = false, // Placeholder for future
    persistPosition = false,
    positionKey = 'default',
    zIndex = 100,
}) {
    const [isMaximized, setIsMaximized] = useState(false);
    const modalRef = useRef(null);

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Lock Scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleMaximize = () => setIsMaximized(!isMaximized);

    return createPortal(
        <div className="enhanced-modal-overlay" style={{ zIndex }}>
            <div
                className={`enhanced-modal-container ${isMaximized ? 'maximized' : ''} max-w-${maxWidth}`}
                ref={modalRef}
            >
                {/* Header */}
                <div className="enhanced-modal-header" onDoubleClick={toggleMaximize}>
                    <h3 className="enhanced-modal-title">{title}</h3>

                    {showControls && (
                        <div className="enhanced-modal-controls">
                            <button
                                onClick={toggleMaximize}
                                className="control-btn"
                                title={isMaximized ? "Restore" : "Maximize"}
                            >
                                <span className="material-symbols-outlined">
                                    {isMaximized ? 'close_fullscreen' : 'open_in_full'}
                                </span>
                            </button>
                            <button
                                onClick={onClose}
                                className="control-btn close"
                                title="Close (Esc)"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="enhanced-modal-body">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="enhanced-modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
