import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail } from 'lucide-react';
import { getFirestore, collection, query, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

interface FoodRequest {
  id: string;
  petType: string;
  foodType: string;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'ready' | 'completed';
  timestamp: Date;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const db = getFirestore();

  useEffect(() => {
    if (user?.isAdmin) {
      const q = query(collection(db, 'requests'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedRequests: FoodRequest[] = [];
        querySnapshot.forEach((doc) => {
          fetchedRequests.push({ id: doc.id, ...doc.data() } as FoodRequest);
        });
        setRequests(fetchedRequests);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSelectRequest = (id: string) => {
    setSelectedRequests(prev =>
      prev.includes(id) ? prev.filter(reqId => reqId !== id) : [...prev, id]
    );
  };

  const handleReadyForPickup = async () => {
    for (const id of selectedRequests) {
      await updateDoc(doc(db, 'requests', id), { status: 'ready' });
      // Here you would also implement email notification logic
    }
    setSelectedRequests([]);
  };

  const handleSendMessage = async (id: string) => {
    if (message.trim()) {
      await addDoc(collection(db, 'messages'), {
        requestId: id,
        message,
        timestamp: new Date(),
      });
      setMessage('');
      // Here you would also implement email notification logic
    }
  };

  if (!user?.isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="mb-4">
        <button
          onClick={handleReadyForPickup}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          disabled={selectedRequests.length === 0}
        >
          Mark Selected as Ready for Pickup
        </button>
      </div>
      <div className="space-y-4">
        {requests.map(request => (
          <div key={request.id} className="border p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{request.name}</h2>
              <input
                type="checkbox"
                checked={selectedRequests.includes(request.id)}
                onChange={() => handleSelectRequest(request.id)}
                className="h-5 w-5"
              />
            </div>
            <p>Pet Type: {request.petType}</p>
            <p>Food Type: {request.foodType}</p>
            <p>Quantity: {request.quantity}</p>
            <p>Email: {request.email}</p>
            <p>Phone: {request.phone}</p>
            <p>Status: {request.status}</p>
            <p>Timestamp: {new Date(request.timestamp).toLocaleString()}</p>
            <div className="mt-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter custom message"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={() => handleSendMessage(request.id)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <Mail className="mr-2" />
                Send Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;