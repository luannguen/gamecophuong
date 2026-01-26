import React from 'react';

// Wrapper for Material Symbols with optional animation classes
const BaseIcon = ({ name, className = "", ...props }) => (
    <span className={`material-symbols-outlined ${className}`} {...props}>
        {name}
    </span>
);

export const Icon = {
    // Core Icons
    Video: (props) => <BaseIcon name="movie" {...props} />,
    Spinner: ({ className, ...props }) => (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${className}`} {...props} />
    ),
    ArrowLeft: (props) => <BaseIcon name="arrow_back" {...props} />,
    Plus: (props) => <BaseIcon name="add" {...props} />,
    ChevronRight: (props) => <BaseIcon name="chevron_right" {...props} />,
    Edit: (props) => <BaseIcon name="edit" {...props} />,
    Trash: (props) => <BaseIcon name="delete" {...props} />,
    Save: (props) => <BaseIcon name="save" {...props} />,
    Play: (props) => <BaseIcon name="play_arrow" {...props} />,
    Pause: (props) => <BaseIcon name="pause" {...props} />,
    Grid: (props) => <BaseIcon name="grid_view" {...props} />,

    // Lesson Editor / Admin Icons
    X: (props) => <BaseIcon name="close" {...props} />,
    Info: (props) => <BaseIcon name="info" {...props} />,
    BookOpen: (props) => <BaseIcon name="menu_book" {...props} />,
    HelpCircle: (props) => <BaseIcon name="help" {...props} />,
    Translate: (props) => <BaseIcon name="translate" {...props} />,
    Circle: (props) => <BaseIcon name="circle" {...props} />,
    FileText: (props) => <BaseIcon name="description" {...props} />,
    ExternalLink: (props) => <BaseIcon name="open_in_new" {...props} />,
    VideoOff: (props) => <BaseIcon name="videocam_off" {...props} />,
    Settings: (props) => <BaseIcon name="settings" {...props} />,
    Upload: (props) => <BaseIcon name="upload" {...props} />,
    Check: (props) => <BaseIcon name="check" {...props} />,
    Refresh: (props) => <BaseIcon name="refresh" {...props} />,
};

export default Icon;
