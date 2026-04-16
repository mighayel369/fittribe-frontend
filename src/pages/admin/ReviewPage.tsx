import  { useState, useEffect } from 'react';
import { Star, Trash2 } from "lucide-react";
import DEFAULT_IMAGE from '../../assets/default image.png';
import AdminTopBar from "../../layout/AdminTopBar";
import AdminSideBar from "../../layout/AdminSideBar";
import { adminReviewService } from '../../services/admin/admin.review.service';
import { sharedReviewService } from '../../services/shared/review.shared';
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

const AdminReviewsPage = () => {
    const [data, setData] = useState<any>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error">("success");

    const fetchReviews = async () => {
        try {
            const response = await sharedReviewService.getReviewList('admin');
            if (response.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleOpenFlagModal = (reviewId: string) => {
        setSelectedReviewId(reviewId);
        setShowModal(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedReviewId) return;

        try {
            const response = await adminReviewService.flagReview(selectedReviewId);

            if (response.success) {
                setToastType("success");
                setToastMessage("Review status updated successfully");
                setShowModal(false);
                setSelectedReviewId(null);
                fetchReviews();
            }
        } catch (err: any) {
            console.error(err);
            setToastType("error");
            setToastMessage("An unexpected error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage(null)}
                />
            )}
            <AdminTopBar />
            <AdminSideBar />

            <main className="ml-72 pt-28 px-10 pb-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Review Moderation</h1>
                        <p className="text-slate-500 font-medium">Monitor platform quality and handle flagged content.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 border-b pb-2">Total Reviews</h3>
                        <p className="text-2xl font-black text-slate-900 mt-2">{data?.totalReviews || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 border-b pb-2">Flagged Content</h3>
                        <p className="text-2xl font-black text-rose-600 mt-2">{data?.flaggedCount || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 border-b pb-2">New Today</h3>
                        <p className="text-2xl font-black text-indigo-600 mt-2">+{data?.newToday || 0}</p>
                    </div>
                </div>

                <section className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm overflow-hidden">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Recent Feedback Activity</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Client</th>
                                    <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Trainer & Program</th>
                                    <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Review</th>
                                    <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Rating</th>
                                    <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Status</th>
                                    <th className="pb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data?.reviews.map((review: any) => (
                                    <tr key={review.reviewId} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-5 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={review.clientProfilePic || DEFAULT_IMAGE}
                                                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-50"
                                                    alt={review.clientName}
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{review.clientName}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{review.time}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <p className="text-sm font-bold text-slate-700">{review.trainerName}</p>
                                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{review.program}</p>
                                        </td>
                                        <td className="py-5 px-4 max-w-xs">
                                            <p className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < review.rating ? "text-amber-400" : "text-slate-200"}
                                                        fill={i < review.rating ? "currentColor" : "none"}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${!review.reviewStatus ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {review.reviewStatus ? 'Published' : 'Flagged'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    className={`p-2 rounded-xl transition-all ${review.reviewStatus ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                                                    onClick={() => handleOpenFlagModal(review.reviewId)}
                                                    title={review.reviewStatus ? "Flag Review" : "Unflag Review"}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-50">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            Showing {data?.reviews.length || 0} of {data?.totalReviews || 0} results
                        </p>
                    </div>
                </section>

                <Modal
                    isVisible={showModal}
                    title={
                        data?.reviews.find((r: any) => r.reviewId === selectedReviewId)?.reviewStatus
                            ? 'Flag this review?'
                            : 'Restore this review?'
                    }
                    onCancel={() => {
                        setShowModal(false);
                        setSelectedReviewId(null);
                    }}
                    onConfirm={handleConfirmAction}
                >
                    <p className="text-sm text-slate-500">
                        This will change the visibility of the review on the platform.
                    </p>
                </Modal>
            </main>
        </div>
    );
};

export default AdminReviewsPage;