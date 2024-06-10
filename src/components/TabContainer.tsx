import React, { useState, useCallback, useEffect, useRef } from 'react';
import update from 'immutability-helper';
import DraggableTab from './DraggableTab';
import './TabContainer.css';

const TabContainer: React.FC = () => {
    const [tabs, setTabs] = useState([
        { id: '1', title: 'Dashboard', url: '/dashboard', pinned: true },
        { id: '2', title: 'Accounting', url: '/accounting', pinned: false },
        { id: '3', title: 'Sales', url: '/sales', pinned: false },
        { id: '4', title: 'Statistics', url: '/statistics', pinned: false },
        { id: '5', title: 'Post Office', url: '/post-office', pinned: false },
        // other tabs...
    ]);

    const [overflowTabs, setOverflowTabs] = useState([]);
    const containerRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                let totalWidth = 0;
                let lastVisibleIndex = tabs.length;

                for (let i = 0; i < tabs.length; i++) {
                    const tabWidth = 100; // approximate width of a tab
                    totalWidth += tabWidth;
                    if (totalWidth > containerWidth) {
                        lastVisibleIndex = i;
                        break;
                    }
                }
                // @ts-ignore
                setOverflowTabs(tabs.slice(lastVisibleIndex));
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [tabs]);

    return (
        <div className="tab-container" ref={containerRef}>
            {tabs.slice(0, tabs.length - overflowTabs.length).map((tab, index) => (
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
            {overflowTabs.length > 0 && (
                <div className="tab-dropdown">
                    <button className="dropdown-button">...</button>
                    <div className="dropdown-content">
                        {overflowTabs.map((tab: any, index) => (
                            <div key={tab.id} className="dropdown-tab">
                                {tab.title}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TabContainer;