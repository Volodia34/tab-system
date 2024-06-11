import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import update from 'immutability-helper';
import DraggableTab from './DraggableTab';
import '../styles/TabContainer.css';

interface Tab {
    id: string;
    title: string;
    url: string;
    pinned: boolean;
}

const TAB_WIDTH = 140; // Width of a tab in pixels

const TabContainer: React.FC = () => {
    const navigate = useNavigate();
    const initialTabs: Tab[] = [
        { id: '1', title: 'Dashboard', url: '/dashboard', pinned: true },
        { id: '2', title: 'Accounting', url: '/accounting', pinned: false },
        { id: '3', title: 'Sales', url: '/sales', pinned: false },
        { id: '4', title: 'Statistics', url: '/statistics', pinned: false },
        { id: '5', title: 'Post Office', url: '/post-office', pinned: false },
        { id: '6', title: 'Dashboard', url: '/dashboard', pinned: true },
        { id: '7', title: 'Accounting', url: '/accounting', pinned: false },
        { id: '8', title: 'Sales', url: '/sales', pinned: false },
        { id: '9', title: 'Statistics', url: '/statistics', pinned: false },
        { id: '10', title: 'Post Office', url: '/post-office', pinned: false },
        { id: '11', title: 'Post Office', url: '/post-office', pinned: false },
    ];

    const [tabs, setTabs] = useState<Tab[]>(() => {
        const savedTabs = localStorage.getItem('tabs');
        return savedTabs ? JSON.parse(savedTabs) : initialTabs;
    });

    const [overflowTabs, setOverflowTabs] = useState<Tab[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const moveTab = useCallback((dragIndex: number, hoverIndex: number) => {
        const dragTab = tabs[dragIndex];
        const hoverTab = tabs[hoverIndex];

        if (dragTab.pinned !== hoverTab.pinned) {
            return;
        }

        setTabs((prevTabs) =>
            update(prevTabs, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragTab],
                ],
            })
        );
    }, [tabs]);

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
        localStorage.setItem('tabs', JSON.stringify(tabs));
    }, [tabs]);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                let totalWidth = 0;
                let lastVisibleIndex = tabs.length;

                for (let i = 0; i < tabs.length; i++) {
                    totalWidth += TAB_WIDTH;
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

    const handleTabClick = (url: string) => {
        navigate(url);
    };

    const handleCloseTab = (index: number) => {
        setTabs((prevTabs) => prevTabs.filter((_, i) => i !== index));
    };

    return (
        <div className="tab-container" ref={containerRef}>
            {tabs.slice(0, tabs.length - overflowTabs.length).map((tab, index) => (
                <DraggableTab
                    key={index}
                    index={index}
                    id={tab.id}
                    moveTab={moveTab}
                    title={tab.title}
                    url={tab.url}
                    pinned={tab.pinned}
                    onClick={() => handleTabClick(tab.url)}
                    onPin={() => pinTab(index)}
                    onUnpin={() => unpinTab(index)}
                    onClose={() => handleCloseTab(index)}
                />
            ))}
            {overflowTabs.length > 0 && (
                <div className="tab-dropdown">
                    <button className="dropdown-button">...</button>
                    <div className="dropdown-content">
                        {overflowTabs.map((tab) => (
                            <div key={tab.id} className="dropdown-tab" onClick={() => handleTabClick(tab.url)}>
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
