import { useEffect } from 'react';
import {useSocket} from './useSocket'; // Import the context

const useSocketEvent = (eventName, callback) => {
    const { socket, isConnected } = useSocket(); // Get socket and connection status

    useEffect(() => {
        if (!isConnected) return; // Do nothing if the socket is not connected
        console.log('socket :', socket)
        // Listen for the specific event
        socket.on(eventName, callback);
        console.log(`Listening to ${eventName}`); // Log for debugging

        // Clean up the event listener on unmount
        return () => {
            socket.off(eventName, callback);
            console.log(`Stopped listening to ${eventName}`);
        };
    }, [socket, eventName, callback, isConnected]); // Add isConnected to dependencies
};

export default useSocketEvent;
