import React, { useEffect, useState, useRef } from 'react';
import UserNavBar from "../../layout/UserNavBar";
import { Send,  ChevronLeft} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useChat } from "../../hooks/useChat";
import { FormatDate } from '../../helperFunctions/formatdate';
import { PublicTrainersService } from '../../services/public/trainers';
import defaultImage from './../../assets/default image.png'
const ChatPage = () => {
  const navigate = useNavigate();
  const { trainerId, chatId } = useParams();
  const [input, setInput] = useState("");
  const [trainer, setTrainer] = useState<any>(null);
  const [fetchingTrainer, setFetchingTrainer] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, loading } = useChat(chatId, trainerId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        if (!trainerId) return;
        setFetchingTrainer(true);
        const response = await PublicTrainersService.getTrainerDetails(trainerId);
        setTrainer(response.trainer);
      } catch (err: any) {
        console.error("Failed to fetch trainer:", err.response?.data?.message);
      } finally {
        setFetchingTrainer(false);
      }
    };
    if (trainerId) fetchTrainer();
  }, [trainerId]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <UserNavBar />

      <main className="pt-32 pb-10 max-w-4xl mx-auto px-6 h-[calc(100vh-40px)]">
        <div className="flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden h-full">

          <header className="p-5 border-b border-slate-100 flex justify-between items-center px-8 bg-white z-10 min-h-[90px]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <ChevronLeft size={24} />
              </button>

              {fetchingTrainer ? (
                <div className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    <div className="h-3 w-20 bg-slate-100 rounded"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={trainer?.profilePic || defaultImage}
                      alt={trainer?.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-100"
                    />
                  </div>

                  <div>
                      <p className="font-bold text-sm text-slate-900">{trainer?.name}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {/* <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Video size={20} /></button>
              <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Info size={20} /></button>
              <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"><MoreHorizontal size={20} /></button> */}
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30"
          >
            {loading ? (
              <div className="flex justify-center items-center h-full text-slate-400 text-sm">Loading history...</div>
            ) : (
              <>
                {messages.map((msg, index) => {
                  const isMe = msg.sender !== trainerId;

                  const currentDate = FormatDate(msg.time || msg.date);
                  const previousDate = index > 0 ? FormatDate(messages[index - 1].date) : null;
                  const showDateBadge = currentDate !== previousDate;

                  return (
                    <React.Fragment key={index}>
                      {showDateBadge && (
                        <div className="flex justify-center my-4">
                          <span className="px-4 py-1 bg-white border border-slate-100 text-[10px] font-bold text-slate-400 rounded-full uppercase tracking-widest shadow-sm">
                            {currentDate}
                          </span>
                        </div>
                      )}

                      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                            }`}>
                            {msg.text || msg.content}
                          </div>
                          <span className="text-[10px] mt-1.5 font-medium text-slate-400 px-1">
                            {msg.date ? new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-100">
            <div className="max-w-3xl mx-auto flex items-center gap-3 bg-slate-100 p-2 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 focus-within:border-indigo-200 border border-transparent transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                type="text"
                placeholder={`Message ${trainer?.name || 'Coach'}...`}
                className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-slate-700 placeholder:text-slate-400"
              />
              <button
                onClick={handleSend}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ChatPage;