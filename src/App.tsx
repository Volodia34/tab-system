import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TabContainer from './components/TabContainer';
import Content from './components/Content';

const routes = [
    { path: '/', title: 'Home Page Content' },
    { path: '/dashboard', title: 'Dashboard Content' },
    { path: '/accounting', title: 'Accounting Content' },
    { path: '/sales', title: 'Sales Content' },
    { path: '/statistics', title: 'Statistics Content' },
    { path: '/post-office', title: 'Post Office Content' },
];

const App: React.FC = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <Router>
                <div className="container">
                    <TabContainer />
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<Content title={route.title} />}
                            />
                        ))}
                    </Routes>
                </div>
            </Router>
        </DndProvider>
    );
};

export default App;
