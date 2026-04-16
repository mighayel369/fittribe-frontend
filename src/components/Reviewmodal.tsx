import React, { useState } from "react";
import { FaStar, FaTimes ,FaExclamationCircle} from "react-icons/fa";

interface ReviewModalProps {
  booking: any;
  onClose: () => void;
  onSubmit: (reviewData: { rating: number; comment: string }) => Promise<void>;
  loading?: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose, onSubmit, loading }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please provide a short comment about your experience.");
      return;
    }

    if (comment.trim().length < 10) {
        setError("Your comment must be at least 10 characters long.");
        return;
    }
    await onSubmit({ rating, comment: comment.trim() });
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-gray-900 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">Feedback</p>
          <h2 className="text-2xl font-black">Rate Your Session</h2>
          <p className="text-xs text-gray-400 mt-2 font-medium">
            How was your training with <span className="text-white">{booking?.trainerName}</span>?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold animate-in slide-in-from-top-1">
              <FaExclamationCircle className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-125 focus:outline-none"
                >
                  <FaStar
                    size={32}
                    className={`transition-colors duration-200 ${
                      star <= (hover || rating) ? "text-amber-500" : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              {rating > 0 ? `${rating} Stars Selected` : "Tap to rate"}
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
              Your Experience (Optional)
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-red-500/10 focus:outline-none transition-all resize-none"
              placeholder="Tell us what you liked or how the trainer can improve..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? "Submitting..." : "Post Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;