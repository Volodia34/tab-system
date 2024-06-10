import React, { useState, useCallback, useEffect, useRef } from 'react';
import update from 'immutability-helper';
import DraggableTab from './DraggableTab';
import './TabContainer.css';

interface Tab {
    id: string;
    title: string;
    url: string;
    pinned: boolean;
}

const TabContainer: React.FC = () => {
    const initialTabs: Tab[] = JSON.parse(localStorage.getItem('tabs') || '[]') || [
        { id: '1', title: 'Dashboard', url: '/dashboard', pinned: true },
        { id: '2', title: 'Accounting', url: '/accounting', pinned: false },
        { id: '3', title: 'Sales', url: '/sales', pinned: false },
        { id: '4', title: 'Statistics', url: '/statistics', pinned: false },
        { id: '5', title: 'Post Office', url: '/post-office', pinned: false },
        // other tabs...
    ];

    const [tabs, setTabs] = useState<Tab[]>(initialTabs);
    const [overflowTabs, setOverflowTabs] = useState<Tab[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const moveTab = useCallback((dragIndex: number, hoverIndex: number) => {
        setTabs((prevTabs: Tab[]) =>
            update(prevTabs, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevTabs[dragIndex]],
                ],
            })
        );
    }, []);

    const pinTab = (index: number) => {
        setTabs((prevTabs: Tab[]) =>
            update(prevTabs, {
                [index]: { $merge: { pinned: true } },
            })
        );
    };

    const unpinTab = (index: number) => {
        setTabs((prevTabs: Tab[]) =>
            update(prevTabs, {
                [index]: { $merge: { pinned: false } },
            })
        );
    };

    useEffect(() => {
        localStorage.setItem('tabs', JSON.stringify(tabs));
    }, [tabs]);

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
                        {overflowTabs.map((tab, index) => (
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
