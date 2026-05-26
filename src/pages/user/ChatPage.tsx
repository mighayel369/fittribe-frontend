import React, { useEffect, useState, useRef } from 'react';
import UserNavBar from "../../layout/UserNavBar";
import { Send, ChevronLeft, Image as ImageIcon, Film, Paperclip, FileText, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useChat } from "../../hooks/useChat";
import { FormatDate } from '../../helperFunctions/formatdate';
import { PublicTrainersService } from '../../services/public/trainers';
import defaultImage from './../../assets/default image.png'
import { ChatService } from '../../services/shared/chat.service';
import { SizeConvert } from '../../helperFunctions/sizeConversion';
const ChatPage = () => {
  const navigate = useNavigate();
  const { trainerId, chatId } = useParams();
  const [inputText, setInputText] = useState("");
  const [trainer, setTrainer] = useState<any>(null);
  const [fetchingTrainer, setFetchingTrainer] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const { messages, sendMessage, loading } = useChat(chatId, trainerId);
  const [isUploading, setIsUploading] = useState(false);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleSend = async () => {
    if (!inputText.trim() && !selectedFile) return;

    let attachment = undefined;

    if (selectedFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile)
      const response = await ChatService.uploadFiles('user', formData)
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
              </>
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
                  accept="image/*,video/*,.pdf,.doc,.docx"
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

        </div>
      </main>
    </div>
  );
};

export default ChatPage;