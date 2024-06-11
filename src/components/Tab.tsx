import React, { useState, useRef } from 'react';

interface TabProps {
    title: string;
    pinned: boolean;
    onClick: () => void;
    onPin: () => void;
    onUnpin: () => void;
    onClose: () => void;
}

const Tab: React.FC<TabProps> = ({ title, pinned, onClick, onPin, onUnpin, onClose }) => {
    const [isCloseButtonVisible, setCloseButtonVisibility] = useState(false);
    const [isContextMenuVisible, setContextMenuVisibility] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const handlePinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        pinned ? onUnpin() : onPin();
    };

    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
    };

    const handleMouseEnter = () => {
        setCloseButtonVisibility(true);
        setContextMenuVisibility(true);
    };

    const handleMouseLeave = () => {
        setCloseButtonVisibility(false);
        if (contextMenuRef.current && !contextMenuRef.current.contains(document.activeElement)) {
            setContextMenuVisibility(false);
        }
    };

    const handleContextMenuMouseEnter = () => {
        setContextMenuVisibility(true);
    };

    const handleContextMenuMouseLeave = () => {
        setContextMenuVisibility(false);
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    return (
        <div
            className={`tab ${pinned ? 'pinned' : ''}`}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {title}
            <div className={`close-button ${isCloseButtonVisible ? 'visible' : ''}`} onClick={handleCloseClick}>
                x
            </div>
            {!isDragging && isContextMenuVisible && (
                <div
                    className="context-menu"
                    ref={contextMenuRef}
                    onMouseEnter={handleContextMenuMouseEnter}
                    onMouseLeave={handleContextMenuMouseLeave}
                >
                    <div className="context-menu-item" onClick={handlePinClick}>
                        {pinned ? '📌 Tab unpinnen' : '📍 Tab anpinnen'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tab;
