import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Socket, io } from 'socket.io-client';
interface ContainerProps {
    ChangeAuthentication: (type: boolean) => void;
}

const client = new ApolloClient({
    uri: 'https://localhost:8080',
    cache: new InMemoryCache()
});

const MainPage: React.FC<ContainerProps> = (props) => {
    const [socket, setSocket] = useState<null | Socket >(null);
    
    useEffect(() => {
        const ioClient = io('https://localhost:8080', {
            reconnectionDelayMax: 4000
        }); 
        ioClient.emit("join", localStorage.getItem("userID"));
        setSocket(ioClient);
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('receive', (roomID) => {
                console.log(roomID);
            })

            return () => {
                // socket.disconnect();
            }
        }
    })

    return (
        <React.Fragment>
            <ApolloProvider client={client}>

            </ApolloProvider>
        </React.Fragment>
    )
};

export default MainPage;