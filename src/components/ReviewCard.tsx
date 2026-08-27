import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between group text-slate-200">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-700 text-slate-700'
                }`}
              />
            ))}
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md">
            {review.service_type}
          </span>
        </div>

        {review.title && (
          <h4 className="font-bold text-white text-sm mb-1 group-hover:text-amber-400 transition-colors">{review.title}</h4>
        )}

        <div className="relative">
          <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
            "{review.comment}"
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30 backdrop-blur-md shadow-sm">
            {review.user_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>{review.user_name}</span>
              <CheckCircle className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400">{review.user_location || 'Verified Traveler'}</div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400">
          {new Date(review.created_at).toLocaleDateString('en-IN', {
            month: 'short',
            year: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
};
