import { useCallback, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import fileService from '../Components/services/fileService';

const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Create a new socket connection
        const socketInstance = io(fileService.API_BASE_URL);

        // Set the socket instance to the state
        setSocket(socketInstance);

        // Listen for socket connection
        socketInstance.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to socket server');
        });

        // Listen for socket disconnection
        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from socket server');
        });

        // Cleanup on component unmount or socket changes
        return () => {
            socketInstance.disconnect(); // Close the connection
        };
    }, []);

    // SOCKET EVENTS
    // method to handle socket event emitter on lock and unlock
    const socketOnLockAndUnlockDocument = useCallback((cb) => {
        if (!socket) return;
        console.log('allo')
        // Écouter les événements de verrouillage et de déverrouillage des fichiers
        socket.on("file-locked", ({ id, ...data }) => {
            cb(prevLockedFiles =>
                prevLockedFiles.map(file =>
                    file._id === id ? { ...file, ...data } : file
                )
            )
        })
        // unlock
        socket.on("file-unlocked", ({ id, ...data }) => {
            cb(prevLockedFiles =>
                prevLockedFiles.map(file =>
                    file._id === id ? { ...file, ...data } : file));
        })
    }, [socket])

    const removeOnLockAndUnlockDocument = () => {
        socket.off("file-locked")
        socket.off("file-unlocked")
    }

    return { socket, isConnected, socketOnLockAndUnlockDocument, removeOnLockAndUnlockDocument };
};

export const useOnLockedAndUnlockedDocument = (callback) => {
    const { socket } = useSocket();

    useEffect(() => {

        if (!socket) return;
        
        // Écouter les événements de verrouillage et de déverrouillage des fichiers
        socket.on("document-lock/unlock", callback);

        console.log('socket is initialised')

        return () => {
            socket.off("document-lock/unlock", callback);
        }

    }, [socket, callback])
}

export default useSocket;
