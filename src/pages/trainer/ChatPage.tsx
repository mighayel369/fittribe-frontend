import React, { useEffect, useState, useRef } from 'react';
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import { Search, Send, MoreVertical, Users, MessageSquare, Image as ImageIcon, Film, Paperclip, FileText, X } from "lucide-react";
import DEFAULT_IMAGE from '../../assets/default image.png';
import { useChat } from "../../hooks/useChat";
import { ChatService } from '../../services/shared/chat.service';
import { type NonChatList } from '../../types/chatType';
import { FormatDate, formatChatTime } from '../../helperFunctions/formatdate';
import { useLocation } from 'react-router-dom';
import { SizeConvert } from '../../helperFunctions/sizeConversion';
import { MessagePopUp } from '../../components/ChatMessagePopUp';
import Toast from "../../components/Toast";
interface SelectedReceiver {
  id: string;
  name: string;
  profilePic: string;
  unReadCount?: number,
  chatId?: string;
  email?: string;
}

const ChatPage = () => {
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<'chats' | 'clients'>('chats');
  const [selectedReceiver, setSelectedReceiver] = useState<SelectedReceiver | null>(null);
  const [inputText, setInputText] = useState("");
  const [discoveryClients, setDiscoveryClients] = useState<NonChatList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { messages, chatList, sendMessage, loading } = useChat(
    selectedReceiver?.chatId,
    selectedReceiver?.id,
    searchQuery
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("File is too large. Maximum size is 50MB.");
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
    }
  };

  const downloadFile = async (url: string, fileName: string = 'document.pdf') => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      let link = document.createElement("a")
      document.body.appendChild(link);
      link.href = blobUrl
      link.setAttribute('download', fileName)
      link.click()
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (location.state?.receiverId) {
      const { receiverId, name, profilePic, activeChatId } = location.state;

      setSelectedReceiver({
        id: receiverId,
        name: name,
        profilePic: profilePic,
        chatId: activeChatId || undefined,
      });

      setCurrentTab(activeChatId ? 'chats' : 'clients');

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (selectedReceiver?.chatId && (selectedReceiver.unReadCount ?? 0) > 0) {
        try {
          await ChatService.markAsRead('trainer', selectedReceiver.chatId);
        } catch (err:any) {
          const errMesg = err.message || "failed to mark notification as read";
          setToastType("error");
          setToastMessage(errMesg);
        }
      }
    };

    markMessagesAsRead();
  }, [selectedReceiver?.chatId])

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const response = await ChatService.getNonChatLists('trainer');
        setDiscoveryClients(response.data);
      } catch (err: any) {
        const errMesg = err.message || "failed to fetch data";
        setToastType("error");
        setToastMessage(errMesg);
      }
    };
    fetchSidebarData();
  }, [chatList]);

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    let attachment = undefined;

    if (selectedFile) {
      setIsUploading(true);
      console.log(selectedFile)
      const formData = new FormData();
      formData.append('file', selectedFile)
      const response = await ChatService.uploadFiles('trainer', formData)
      console.log(response)
      attachment = {
        url: response.data.url,
        type: response.data.resource_type,
        name: selectedFile.name,
        size: selectedFile.size
      };
    }

    sendMessage(inputText, attachment);

    setInputText("");
    setSelectedFile(null);
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      <TrainerTopBar />
      <TrainerSideBar />

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
      <main className="ml-72 pt-28 px-10 pb-12">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Messages</h1>
            <p className="text-slate-500 mt-1">Direct communication with your clients.</p>
          </div>
        </header>

        <section className="grid grid-cols-4 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 h-[75vh]">


          <div className="col-span-1 border-r border-slate-100 flex flex-col bg-white">
            <div className="p-4 space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setCurrentTab('chats')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${currentTab === 'chats' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <MessageSquare size={14} /> Chats
                </button>
                <button
                  onClick={() => setCurrentTab('clients')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${currentTab === 'clients' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users size={14} /> Clients
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-xs"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 border-t border-slate-100 bg-white">
              {currentTab === 'chats' ? (
                chatList.length > 0 ? (
                  chatList.map((chat) => (
                    <div
                      key={chat.chatId}
                      onClick={() => setSelectedReceiver({
                        id: chat.id,
                        name: chat.name,
                        chatId: chat.chatId,
                        profilePic: chat.profilePic,
                        unReadCount: chat.unReadCount
                      })}
                      className={`group flex items-center gap-4 p-4 cursor-pointer transition-all border-b border-slate-50 relative
                        ${selectedReceiver?.chatId === chat.chatId ? 'bg-indigo-50/60' : 'hover:bg-slate-50'}`}
                    >
                      {selectedReceiver?.chatId === chat.chatId && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                      )}

                      <div className="relative shrink-0">
                        <img
                          src={chat.profilePic || DEFAULT_IMAGE}
                          className="w-12 h-12 rounded-full border border-slate-200 object-cover shadow-sm"
                          alt={chat.name}
                        />

                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-bold text-sm text-slate-900 truncate pr-2">
                            {chat.name}
                          </h4>
                          <span className={`text-[10px] shrink-0 ${chat.unreadCount > 0 ? 'text-indigo-600 font-bold' : 'text-slate-400 font-medium'}`}>
                            {formatChatTime(chat.lastMessageTime)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                          <MessagePopUp message={chat.lastMessage} />

                          {chat.unReadCount > 0 && (
                            <span className="bg-green-500 text-white text-[8px] font-bold  rounded-full min-w-[14px] h-[14px] flex items-center justify-center">
                              {chat.unReadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                    <p className="text-sm">No active conversations</p>
                  </div>
                )
              ) : (
                discoveryClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedReceiver({
                      id: client.id,
                      name: client.name,
                      email: client.email,
                      profilePic: client.profilePic,

                    })}
                    className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50
                      ${selectedReceiver?.id === client.id ? 'bg-indigo-50/60' : ''}`}
                  >
                    <img src={client.profilePic || DEFAULT_IMAGE} alt="" className='rounded-full w-10 h-10 border border-slate-100 object-cover' />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{client.name}</p>
                      <p className="text-[10px] text-slate-400 truncate font-medium">{client.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="col-span-3 flex flex-col bg-slate-50/50 overflow-hidden">
            {selectedReceiver ? (
              <>
                <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center px-8 shadow-sm z-10">
                  <div className="flex items-center gap-3">
                    <img src={selectedReceiver.profilePic || DEFAULT_IMAGE} alt="" className='rounded-full w-10 h-10 object-cover border border-slate-100' />
                    <div>
                      <p className="font-bold text-slate-900">{selectedReceiver.name}</p>
                      <p className="text-[10px] text-green-500 font-medium">Online</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                  {loading ? (
                    <div className="flex justify-center items-center h-full text-slate-400 text-sm">
                      <div className="animate-pulse">Loading history...</div>
                    </div>
                  ) : messages.length > 0 ? (
                    <>
                      {messages.map((msg, index) => {

                        const isMe = msg.sender !== selectedReceiver.id;
                        const currentDate = FormatDate(msg.time || msg.date);
                        const previousDate = index > 0 ? FormatDate(messages[index - 1].date || messages[index - 1].time) : null;
                        const showDateBadge = currentDate !== previousDate;

                        return (
                          <React.Fragment key={msg.id || index}>
                            {showDateBadge && (
                              <div className="flex justify-center my-6">
                                <span className="px-4 py-1 bg-white border border-slate-100 text-[10px] font-bold text-slate-400 rounded-full uppercase tracking-widest shadow-sm">
                                  {currentDate}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                              <div className={`max-w-[85%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>


                                <div className={`shadow-sm relative ${msg.file
                                  ? 'p-1 rounded-xl'
                                  : 'px-4 py-2 rounded-2xl'
                                  } ${isMe
                                    ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                  }`}>


                                  {msg.file && (
                                    <div className='overflow-hidden rounded-lg'>
                                      {msg.type === "image" && (
                                        <img
                                          src={msg.file.url}
                                          alt="Attachment"
                                          className='max-h-72 w-full object-cover'
                                        />
                                      )}
                                      {msg.type === "video" && (
                                        <video
                                          src={msg.file.url}
                                          controls
                                          className='max-h-72 w-full'
                                        />
                                      )}
                                      {msg.type === 'raw' && (
                                        <div
                                          onClick={() => downloadFile(msg.file.url, msg.file.name || "document.pdf")}
                                          className={`group cursor-pointer flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border ${isMe
                                            ? 'bg-black/10 border-black/5 hover:bg-black/20'
                                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >

                                          <div className="relative flex-shrink-0 w-10 h-12 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center">
                                            <span className="text-xl">📄</span>

                                            <div className="absolute -bottom-1 -right-1 bg-red-500 text-[8px] font-bold text-white px-1 rounded-sm uppercase">
                                              PDF
                                            </div>
                                          </div>


                                          <div className="flex flex-col overflow-hidden text-left">
                                            <span className={`text-sm font-semibold truncate max-w-[160px] ${isMe ? 'text-slate-800' : 'text-slate-700'
                                              }`}>
                                              {msg.file.name || "Attached Document"}
                                            </span>

                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] opacity-70 font-medium uppercase tracking-wider">
                                                {isMe ? "Sent" : "Download"}
                                              </span>
                                              <span className="text-[10px] opacity-40">•</span>

                                              <span className="text-[10px] opacity-70 font-medium">
                                                {SizeConvert(msg.file.size) || "PDF File"}
                                              </span>
                                            </div>
                                          </div>


                                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}


                                  {msg.content && (
                                    <div className={`leading-relaxed ${msg.file ? 'px-2 py-1.5 text-[13.5px]' : 'text-sm'}`}>
                                      {msg.content}
                                    </div>
                                  )}


                                  <div className={`flex justify-end items-center gap-1 mt-1 pb-0.5 pr-1 ${msg.file ? 'px-1' : ''}`}>
                                    <span className="text-[10px] text-slate-500/80 font-medium">
                                      {(msg.date || msg.time)
                                        ? new Date(msg.date || msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : "Just now"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                      <MessageSquare size={40} className="opacity-20" />
                      <p className="text-sm">No messages yet. Say hello to {selectedReceiver.name}!</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white border-t border-slate-200">
                  <div className="max-w-5xl mx-auto">

                    {selectedFile && (
                      <div className="mb-3 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            {selectedFile.type.startsWith('image/') ? <ImageIcon size={16} /> :
                              selectedFile.type.startsWith('video/') ? <Film size={16} /> : <FileText size={16} />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">{selectedFile.name}</span>
                            <span className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                        <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                          <X size={16} />
                        </button>
                      </div>
                    )}


                    <div className="relative flex items-center gap-3">

                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,video/*,.pdf"
                      />


                      <label
                        htmlFor="file-upload"
                        className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all cursor-pointer"
                      >
                        <Paperclip size={18} />
                      </label>

                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isUploading ? "Uploading file..." : "Write your message..."}
                        disabled={isUploading}
                        className="flex-1 p-4 bg-slate-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm disabled:opacity-50"
                      />

                      <button
                        onClick={handleSend}
                        disabled={isUploading || (!inputText.trim() && !selectedFile)}
                        className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200 disabled:opacity-50"
                      >
                        {isUploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={32} className="opacity-20" />
                </div>
                <p className="font-medium">Select a client to start chatting</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatPage;