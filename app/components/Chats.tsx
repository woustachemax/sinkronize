'use client';

import { useEffect, useState, useRef } from 'react';
import  io from 'socket.io-client';

type Friend = {
  id: string;
  username: string;
  skills: string[];
};

type Message = {
  text: string;
  fromMe: boolean;
};

type ReceiveMessagePayload = {
  from: string;
  message: string;
};

type SendMessagePayload = {
  to: string;
  message: string;
};

const socket = io('http://localhost:3000'); 

export default function Chat() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [messageInput, setMessageInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null); 

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;

    fetch('/api/friends', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.friends) {
          setFriends(data.friends);
        }
      });
  }, [token]);

  useEffect(() => {
    const handleReceiveMessage = ({ from, message }: ReceiveMessagePayload) => {
      setMessages((prev) => {
        const chat = prev[from] || [];
        return {
          ...prev,
          [from]: [...chat, { text: message, fromMe: false }],
        };
      });
    };

    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, []);

  const handleSend = () => {
    if (!selectedFriend || !messageInput.trim()) return;

    const payload: SendMessagePayload = {
      to: selectedFriend.id,
      message: messageInput,
    };

    socket.emit('send-message', payload);

    setMessages((prev) => {
      const chat = prev[selectedFriend.id] || [];
      return {
        ...prev,
        [selectedFriend.id]: [...chat, { text: messageInput, fromMe: true }],
      };
    });

    setMessageInput('');
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedFriend]);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-black 0 p-4 border-r border-gray-800 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Friends</h2>
        {friends.length === 0 && (
          <p className="text-sm text-gray-500">No friends found</p>
        )}
        {friends.map((friend) => (
          <div
            key={friend.id}
            onClick={() => setSelectedFriend(friend)}
            className={`p-2 rounded cursor-pointer mb-2 ${
              selectedFriend?.id === friend.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
            }`}
          >
            <p className="font-medium">{friend.username}</p>
            <p className="text-xs text-gray-600">{friend.skills.join(', ')}</p>
          </div>
        ))}
      </aside>

      <main className="flex-1 p-4 flex flex-col">
        {selectedFriend ? (
          <>
            <div className="border-b pb-2 mb-4">
              <h2 className="text-xl font-semibold">
                Chatting with {selectedFriend.username}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {(messages[selectedFriend.id] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded max-w-xs ${
                    msg.fromMe ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-200 self-start'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message"
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleSend}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 flex-1 flex items-center justify-center">
            <p>Select a friend to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}
