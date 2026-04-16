import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Loader2, Inbox } from "lucide-react";
import TrainerTopBar from "../../layout/TrainerTopBar";
import TrainerSideBar from "../../layout/TrainerSideBar";
import DEFAULT_IMAGE from '../../assets/default image.png';
import { sharedReviewService } from '../../services/shared/review.shared';


interface Review {
    name: string;
    profilePic: string;
    program: string;
    comment: string;
    rating: number;
    time: string;
}

const ReviewsPage = () => {
    const [reviewsData, setReviewsData] = useState<{
        reviews: Review[];
        totalReviewCount: number;
        rating: number;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await sharedReviewService.getReviewList('trainer');
                if (response.success) {
                    setReviewsData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <TrainerTopBar />
            <TrainerSideBar />

            <main className="ml-72 pt-28 px-10 pb-12">
                <header className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900">Client Feedback</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Real-time insights from your training sessions.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                            <Star size={28} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">
                                {reviewsData?.rating.toFixed(1) || "0.0"}
                            </p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Average Rating</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                            <MessageSquare size={28} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">
                                {reviewsData?.totalReviewCount || 0}
                            </p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Reviews</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col h-[calc(100vh-450px)]">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 px-2">Recent Reviews</h2>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {reviewsData && reviewsData.reviews.length > 0 ? (
                            reviewsData.reviews.map((review, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={review.profilePic || DEFAULT_IMAGE}
                                                className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50"
                                                alt=""
                                            />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-base">{review.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                                                        {review.program}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="text-[11px] text-slate-400 font-medium">{review.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < review.rating ? "text-amber-400" : "text-slate-200"}
                                                    fill={i < review.rating ? "currentColor" : "none"}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-sm leading-relaxed font-medium pl-16">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                    <Inbox className="text-slate-300" size={32} />
                                </div>
                                <p className="text-slate-500 font-bold">No reviews found yet.</p>
                                <p className="text-slate-400 text-sm">Feedback from your clients will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReviewsPage;