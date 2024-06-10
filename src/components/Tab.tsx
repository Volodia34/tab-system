import React from 'react';

interface TabProps {
    title: string;
    url: string;
    pinned: boolean;
    onClick: () => void;
    onPin: () => void;
    onUnpin: () => void;
}

const Tab: React.FC<TabProps> = ({ title, url, pinned, onClick, onPin, onUnpin }) => {
    return (
        <div className={`tab ${pinned ? 'pinned' : ''}`} onClick={onClick}>
            {title}
            <button onClick={pinned ? onUnpin : onPin}>
                {pinned ? 'Unpin' : 'Pin'}
            </button>
        </div>
    );
};

export default Tab;
