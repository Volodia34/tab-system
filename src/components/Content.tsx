import React from 'react';

interface ContentProps {
    title: string;
}

const Content: React.FC<ContentProps> = ({ title, }) => {
    return (
        <div className='content'>
            <h1>{title}</h1>
        </div>
    );
};

export default Content;
