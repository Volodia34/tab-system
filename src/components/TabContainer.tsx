import React, { useState, useCallback } from 'react';
import update from 'immutability-helper';
import DraggableTab from './DraggableTab';

const TabContainer: React.FC = () => {
    const [tabs, setTabs] = useState([
        { id: '1', title: 'Dashboard', url: '/dashboard', pinned: true },
        { id: '2', title: 'Accounting', url: '/accounting', pinned: false },
        // other tabs...
    ]);

    const moveTab = useCallback((dragIndex: number, hoverIndex: number) => {
        setTabs((prevTabs) =>
            update(prevTabs, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevTabs[dragIndex]],
                ],
            })
        );
    }, []);

    const pinTab = (index: number) => {
        setTabs((prevTabs) =>
            update(prevTabs, {
                [index]: { $merge: { pinned: true } },
            })
        );
    };

    const unpinTab = (index: number) => {
        setTabs((prevTabs) =>
            update(prevTabs, {
                [index]: { $merge: { pinned: false } },
            })
        );
    };

    return (
        <div className="tab-container">
            {tabs.map((tab, index) => (
                <DraggableTab
                    key={tab.id}
                    index={index}
                    id={tab.id}
                    moveTab={moveTab}
                    title={tab.title}
                    url={tab.url}
                    pinned={tab.pinned}
                    onPin={() => pinTab(index)}
                    onUnpin={() => unpinTab(index)} onClick={function (): void {
                    throw new Error('Function not implemented.');
                }}                />
            ))}
        </div>
    );
};

export default TabContainer;