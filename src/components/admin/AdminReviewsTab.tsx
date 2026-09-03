import React, { useState } from 'react';
import {
  Star,
  Plus,
  Trash2,
  CheckCircle,
  EyeOff,
  Eye,
  Search,
  Filter,
  User,
  MapPin,
  XCircle,
  MessageSquareQuote,
  ShieldCheck,
} from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';

interface AdminReviewsTabProps {
  reviews: Review[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({ reviews, onRefresh, showToast }) => {
  const [search, setSearch] = useState('');
  const [filterApproved, setFilterApproved] = useState<'all' | 'approved' | 'hidden'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    user_name: '',
    user_location: 'Mumbai, MH',
    service_type: 'Car Rental',
    rating: 5,
    title: 'Flawless Service & Brand New Innova',
    comment: '',
    approved: true,
  });

  const handleOpenAdd = () => {
    setReviewForm({
      user_name: '',
      user_location: 'Mumbai, MH',
      service_type: 'Car Rental',
      rating: 5,
      title: 'Flawless Service & Brand New Innova',
      comment: '',
      approved: true,
    });
    setIsModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.user_name.trim() || !reviewForm.comment.trim()) {
      showToast('Please provide both customer name and review comment.', 'error');
      return;
    }

    try {
      await api.admin.createReview({
        user_name: reviewForm.user_name.trim(),
        user_location: reviewForm.user_location.trim(),
        service_type: reviewForm.service_type,
        rating: Number(reviewForm.rating),
        title: reviewForm.title.trim() || 'Verified Experience',
        comment: reviewForm.comment.trim(),
        approved: reviewForm.approved,
      });

      showToast(`Review from "${reviewForm.user_name}" published!`);
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to publish review.', 'error');
    }
  };

  const handleToggleApproved = async (review: Review) => {
    try {
      const nextApproved = !review.approved;
      await api.admin.updateReview(review.id, nextApproved);
      showToast(`Review is now ${nextApproved ? 'Approved & Visible' : 'Hidden from site'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update review moderation status', 'error');
    }
  };

  const handleDeleteReview = async (id: string, reviewerName: string) => {
    if (!confirm(`Are you sure you want to delete review by "${reviewerName}"?`)) return;
    try {
      await api.admin.deleteReview(id);
      showToast(`Review by "${reviewerName}" removed.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete review', 'error');
    }
  };

  // Filter
  const filteredReviews = reviews.filter(r => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      r.user_name.toLowerCase().includes(q) ||
      (r.user_location && r.user_location.toLowerCase().includes(q)) ||
      r.service_type.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q);

    const matchesStatus =
      filterApproved === 'all' ||
      (filterApproved === 'approved' && r.approved) ||
      (filterApproved === 'hidden' && !r.approved);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Customer Testimonials &amp; Reviews Moderation</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {reviews.length} Reviews
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Moderate public testimonials, toggle visibility on the live website, or add verified offline customer feedback.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Review</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Total Reviews</div>
            <div className="text-lg font-black text-white">{reviews.length}</div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Approved &amp; Live</div>
            <div className="text-lg font-black text-emerald-400">
              {reviews.filter(r => r.approved).length}
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Average Rating</div>
            <div className="text-lg font-black text-yellow-400">
              {reviews.length > 0
                ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                : '5.0'} ★
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Hidden / Pending</div>
            <div className="text-lg font-black text-purple-400">
              {reviews.filter(r => !r.approved).length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews by customer name, location, comments..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterApproved}
            onChange={e => setFilterApproved(e.target.value as any)}
            className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">All Moderation States</option>
            <option value="approved">Approved &amp; Public</option>
            <option value="hidden">Hidden / Unapproved</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white/[0.02] border border-white/10 rounded-3xl text-slate-500 text-xs">
            No customer reviews found matching your search.
          </div>
        ) : (
          filteredReviews.map(r => (
            <div
              key={r.id}
              className={`p-5 rounded-3xl border transition flex flex-col justify-between shadow-xl ${
                r.approved
                  ? 'bg-white/[0.03] border-white/10 hover:border-amber-500/30'
                  : 'bg-red-950/20 border-red-500/30'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    r.approved
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {r.approved ? 'Live' : 'Hidden'}
                  </span>
                </div>

                {r.title && (
                  <h4 className="text-sm font-bold text-white line-clamp-1">"{r.title}"</h4>
                )}

                <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed">
                  "{r.comment}"
                </p>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{r.user_name}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{r.user_location || 'Verified Traveler'}</span>
                    </span>

                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-amber-300">
                      {r.service_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleApproved(r)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer border ${
                    r.approved
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {r.approved ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Review</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Approve Live</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteReview(r.id, r.user_name)}
                  title="Delete Review"
                  className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl border border-transparent hover:border-red-500/20 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 max-w-lg w-full rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Add Verified Customer Feedback</h3>
                <p className="text-xs text-slate-400">
                  Publish testimonials from offline clients, phone feedback, or WhatsApp reviews.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.user_name}
                    onChange={e => setReviewForm({ ...reviewForm, user_name: e.target.value })}
                    placeholder="e.g. Farhan Merchant"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">City / State</label>
                  <input
                    type="text"
                    value={reviewForm.user_location}
                    onChange={e => setReviewForm({ ...reviewForm, user_location: e.target.value })}
                    placeholder="e.g. Bandra, Mumbai"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Service Provided</label>
                  <select
                    value={reviewForm.service_type}
                    onChange={e => setReviewForm({ ...reviewForm, service_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="Car Rental">Car Rental (Self-Drive &amp; Chauffeur)</option>
                    <option value="Tour Package">Holiday &amp; Tour Package</option>
                    <option value="Umrah Pilgrimage">Umrah Pilgrimage Package</option>
                    <option value="Hajj Pilgrimage">Hajj Pilgrimage Package</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Star Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none font-bold text-amber-400"
                  >
                    <option value={5}>★★★★★ 5 Stars (Exceptional)</option>
                    <option value={4}>★★★★☆ 4 Stars (Very Good)</option>
                    <option value={3}>★★★☆☆ 3 Stars (Good)</option>
                    <option value={2}>★★☆☆☆ 2 Stars (Fair)</option>
                    <option value={1}>★☆☆☆☆ 1 Star (Poor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Headline / Title</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="e.g. Excellent service and pristine car condition!"
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Review Comments *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Write the customer's verbatim testimonial here..."
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewForm.approved}
                    onChange={e => setReviewForm({ ...reviewForm, approved: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-white/20 focus:ring-emerald-400"
                  />
                  <span className="font-bold text-slate-200 text-xs">Instantly Approve for Public Display</span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
