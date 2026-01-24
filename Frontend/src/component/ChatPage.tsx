import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { echo } from '../lib/echo';

/* ================= TYPE ================= */
type Chat = {
  id: number;
  partner: {
    id: number;
    name: string;
    photo?: string | null;
    is_active: boolean;
  };
};

type Message = {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
};

const API = 'http://127.0.0.1:8000/api';

/* ================= HELPER ================= */
const getPhotoUrl = (photo?: string | null) => {
  if (!photo) return '/avatar-default.png'; // ganti kalau mau
  return `http://127.0.0.1:8000/storage/${photo}`;
};

const ChatPage: React.FC = () => {
  const { chatId: chatIdFromUrl } = useParams<{ chatId: string }>();

  let user: any = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {}

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ================= LOAD CHAT LIST ================= */
  useEffect(() => {
    if (!user?.id) return;

    setLoadingChats(true);
    fetch(`${API}/chats/${user.id}`)
      .then(res => res.json())
      .then((data: Chat[]) => {
        setChats(data);

        if (data.length > 0) {
          if (chatIdFromUrl) {
            const found = data.find(c => c.id === Number(chatIdFromUrl));
            setActiveChat(found || data[0]);
          } else {
            setActiveChat(data[0]);
          }
        }
      })
      .finally(() => setLoadingChats(false));
  }, [user?.id, chatIdFromUrl]);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    if (!activeChat) return;

    setLoadingMessages(true);
    fetch(`${API}/messages/${activeChat.id}`)
      .then(res => res.json())
      .then(setMessages)
      .finally(() => setLoadingMessages(false));
  }, [activeChat]);

  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    if (!activeChat) return;

    echo.channel(`chat.${activeChat.id}`)
      .listen('NewMessage', (e: any) => {
        setMessages(prev => [...prev, e.message]);
      });

    return () => {
      echo.leave(`chat.${activeChat.id}`);
    };
  }, [activeChat]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const tempMessage: Message = {
      id: Date.now(),
      sender_id: user.id,
      message: input,
      created_at: new Date().toISOString(),
    };

    // optimistic UI
    setMessages(prev => [...prev, tempMessage]);
    setInput('');

    try {
      await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: activeChat.id,
          sender_id: user.id,
          message: tempMessage.message,
        }),
      });
    } catch (err) {
      console.error('Gagal kirim pesan:', err);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] bg-white rounded-xl border flex overflow-hidden">

      {/* ========== SIDEBAR ========== */}
      <div className="w-64 border-r bg-slate-50">
        <div className="p-4 font-bold border-b">Chat</div>

        {loadingChats && (
          <p className="p-4 text-sm text-slate-400">Memuat chat...</p>
        )}

        {!loadingChats && chats.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Belum ada chat</p>
        )}

        {chats.map(chat => (
          <button
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className={`w-full px-4 py-3 text-left hover:bg-slate-100
              ${activeChat?.id === chat.id ? 'bg-slate-200' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={getPhotoUrl(chat.partner.foto)}
                  alt={chat.partner.name}
                  className="w-9 h-9 rounded-full object-cover border"
                />
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white
                    ${chat.partner.is_active ? 'bg-green-500' : 'bg-slate-400'}
                  `}
                />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">
                  {chat.partner.name}
                </p>
                <p className="text-xs text-slate-500">
                  {chat.partner.is_active ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ========== CHAT ROOM ========== */}
      <div className="flex-1 flex flex-col">

        {!activeChat && (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Pilih chat dulu
          </div>
        )}

        {activeChat && (
          <>
            {/* HEADER */}
            <div className="p-4 border-b flex items-center gap-3">
              <div className="relative">
                <img
                  src={getPhotoUrl(activeChat.partner.foto)}
                  alt={activeChat.partner.name}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                    ${activeChat.partner.is_active ? 'bg-green-500' : 'bg-slate-400'}
                  `}
                />
              </div>

              <div>
                <p className="font-semibold">
                  {activeChat.partner.name}
                </p>
                <p className="text-xs text-slate-500">
                  {activeChat.partner.is_active ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
              {loadingMessages && (
                <p className="text-sm text-slate-400">Memuat pesan...</p>
              )}

              {!loadingMessages && messages.length === 0 && (
                <p className="text-sm text-slate-400">Belum ada pesan</p>
              )}

              {messages.map(m => (
                <div
                  key={m.id}
                  className={`mb-2 flex ${
                    m.sender_id === user.id
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded max-w-xs text-sm ${
                      m.sender_id === user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border'
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 border-t flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="flex-1 border rounded px-3 py-2"
                placeholder="Ketik pesan..."
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 text-white p-2 rounded"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
