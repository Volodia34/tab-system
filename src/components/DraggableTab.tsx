import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Tab from './Tab';

interface DraggableTab {
    id: string;
    index: number;
    moveTab: (dragIndex: number, hoverIndex: number) => void;
    title: string;
    url: string;
    pinned: boolean;
    onClick: () => void;
    onPin: () => void;
    onUnpin: () => void;
}

const DraggableTab: React.FC<DraggableTab> = ({ id, index, moveTab, ...props }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: 'TAB',
        hover(item: { index: number }) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            moveTab(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'TAB',
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <Tab {...props} />
        </div>
    );
};

export default DraggableTab;