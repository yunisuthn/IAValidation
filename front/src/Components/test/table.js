import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connexion au serveur Socket.io

const Table = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch items from backend
    axios.get('http://localhost:5000/items')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching items:', error));

      console.log("items", items);
      
    // Écouter les événements de verrouillage en temps réel
    socket.on('item-locked', ({ id, isLocked }) => {
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, isLocked } : item
        )
      );
    });

    socket.on('item-unlocked', ({ id, isLocked }) => {
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, isLocked } : item
        )
      );
    });

    return () => {
      socket.off('item-locked');
      socket.off('item-unlocked');
    };
  }, []);

  const handleClick = (id) => {
    socket.emit('lock-item', id); // Notifier le serveur que cet élément est verrouillé
  };

  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item._id}>
            <td>🔗</td> {/* Icone */}
            <td>
              {item.isLocked ? (
                <span style={{ color: 'gray' }}>{item.name} (Locked)</span>
              ) : (
                <Link to={'/info/' + item._id} onClick={() => handleClick(item._id)}>{item.name}</Link>
                // <Link
                //   to={`/info/${item._id}`}
                //   onClick={() => handleClick(item._id)}
                // >
                //   {item.name}
                // </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
