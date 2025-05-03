'use client';

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';

type Friend = {
  id: string;
  username: string;
  skills: { talents: string }[];
};

type Message = {
  text: string;
  fromMe: boolean;
  timestamp?: number;
};

type ReceiveMessagePayload = {
  from: string;
  message: string;
};

type SendMessagePayload = {
  to: string;
  message: string;
};

export default function Chat() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [messageInput, setMessageInput] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedFriends = JSON.parse(localStorage.getItem('friends') || '[]');
    if (storedFriends.length > 0) {
      setFriends(storedFriends);
    }
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetch('/api/user/friends', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.friends) {
          setFriends(data.friends);
          localStorage.setItem('friends', JSON.stringify(data.friends));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch friends", err);
        setLoading(false);
      });
      
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserId(payload.id);
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }, [router]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io({
        path: '/api/socket',
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      if (userId) {
        socketRef.current.emit('join-room', userId);
      }
      
      socketRef.current.on('receive-message', ({ from, message }: ReceiveMessagePayload) => {
        setMessages((prev) => ({
          ...prev,
          [from]: [
            ...(prev[from] || []), 
            { 
              text: message, 
              fromMe: false,
              timestamp: Date.now()
            }
          ],
        }));
      });
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current?.id);
      });
      
      socketRef.current.on('connect_error', (err: Error) => {
        console.error('Socket connection error:', err);
      });
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedFriend]);

  const handleSend = () => {
    if (!selectedFriend || !messageInput.trim() || !socketRef.current) return;
    
    const payload: SendMessagePayload = {
      to: selectedFriend.id,
      message: messageInput,
    };
    
    socketRef.current.emit('send-message', payload);
    
    setMessages((prev) => ({
      ...prev,
      [selectedFriend.id]: [
        ...(prev[selectedFriend.id] || []), 
        { 
          text: messageInput, 
          fromMe: true,
          timestamp: Date.now()
        }
      ],
    }));
    
    setMessageInput('');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading friends...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <aside className="w-64 bg-black p-4 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Friends</h2>
        {friends.length === 0 && (
          <p className="text-sm text-gray-400">No friends found</p>
        )}
        
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => setSelectedFriend(friend)}
            className={`p-2 rounded cursor-pointer mb-2 ${
              selectedFriend?.id === friend.id 
                ? 'bg-blue-600' 
                : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold mr-2">
                {friend.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{friend.username}</p>
                <p className="text-xs text-gray-400">
                  {friend.skills?.map(s => s.talents).join(', ') || 'No skills'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </aside>
      
      <main className="flex-1 p-4 flex flex-col">
        {selectedFriend ? (
          <>
            <div className="border-b border-gray-700 pb-2 mb-4">
              <h2 className="text-xl font-semibold">
                Chatting with {selectedFriend.username}
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">
              {(messages[selectedFriend.id] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.fromMe 
                      ? 'bg-blue-600 text-white self-end ml-auto' 
                      : 'bg-gray-700 self-start'
                  }`}
                >
                  {msg.text}
                  {msg.timestamp && (
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder="Type a message"
                className="border border-gray-700 bg-gray-800 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleSend} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-400 flex-1 flex items-center justify-center">
            <p>Select a friend to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}