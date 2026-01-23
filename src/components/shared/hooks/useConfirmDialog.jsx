import React, { useState, useContext, createContext, useCallback } from 'react';
import EnhancedModal from '../ui/EnhancedModal';

const ConfirmDialogContext = createContext(null);

export const ConfirmDialogProvider = ({ children }) => {
    const [config, setConfig] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const showConfirm = useCallback(({
        title = 'Confirmation',
        message = 'Are you sure?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        type = 'warning'
    }) => {
        return new Promise((resolve) => {
            setConfig({
                title,
                message,
                confirmText,
                cancelText,
                type,
                onConfirm: () => {
                    setIsOpen(false);
                    resolve(true);
                },
                onCancel: () => {
                    setIsOpen(false);
                    resolve(false);
                }
            });
            setIsOpen(true);
        });
    }, []);

    const handleClose = () => {
        if (config?.onCancel) config.onCancel();
    };

    return (
        <ConfirmDialogContext.Provider value={{ showConfirm }}>
            {children}
            {config && (
                <EnhancedModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    title={config.title}
                    maxWidth="sm"
                    showControls={false}
                    footer={
                        <>
                            <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium" onClick={config.onCancel}>
                                {config.cancelText}
                            </button>
                            <button
                                className={`px-4 py-2 rounded-lg text-white font-medium ${config.type === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                                        config.type === 'success' ? 'bg-green-500 hover:bg-green-600' :
                                            'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                onClick={config.onConfirm}
                            >
                                {config.confirmText}
                            </button>
                        </>
                    }
                >
                    <div className="flex items-center gap-4">
                        <span className={`material-symbols-outlined text-3xl ${config.type === 'danger' ? 'text-red-500' :
                                config.type === 'success' ? 'text-green-500' :
                                    'text-amber-500'
                            }`}>
                            {config.type === 'danger' ? 'warning' : config.type === 'success' ? 'check_circle' : 'help'}
                        </span>
                        <p className="text-gray-600 text-base">{config.message}</p>
                    </div>
                </EnhancedModal>
            )}
        </ConfirmDialogContext.Provider>
    );
};

export const useConfirmDialog = () => {
    const context = useContext(ConfirmDialogContext);
    if (!context) {
        throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
    }
    return context;
};
