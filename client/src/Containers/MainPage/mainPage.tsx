import React from 'react';

interface ContainerProps {
    ChangeAuthentication: (type: boolean) => void;
}

const MainPage: React.FC<ContainerProps> = (props) => {
    return (
        <React.Fragment>
            <h1>MainPage</h1>
        </React.Fragment>
    )
};

export default MainPage;