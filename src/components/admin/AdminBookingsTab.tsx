import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MessageCircle,
  User,
  Car,
  FileText,
  ShieldCheck,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Image as ImageIcon,
  AlertTriangle,
  Send,
} from 'lucide-react';
import { CarBooking } from '../../types';
import { api } from '../../services/api';

interface AdminBookingsTabProps {
  bookings: CarBooking[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminBookingsTab: React.FC<AdminBookingsTabProps> = ({ bookings, onRefresh, showToast }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<CarBooking | null>(null);
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Reject dialog state
  const [rejectingBooking, setRejectingBooking] = useState<CarBooking | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Payment not received in account or invalid UTR.');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleVerifyUtr = async (bookingId: string, action: 'approve' | 'reject', reason?: string) => {
    setIsProcessing(true);
    try {
      const res = await api.admin.verifyUtr(bookingId, { action, reason });
      showToast(res.message || `Booking ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(res.booking);
      }
      setRejectingBooking(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || `Failed to ${action} booking UTR.`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, bookingStatus: string, paymentStatus?: string) => {
    try {
      await api.admin.updateBookingStatus(bookingId, bookingStatus, paymentStatus);
      showToast(`Booking status updated to ${bookingStatus.toUpperCase()}`);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({
          ...selectedBooking,
          booking_status: bookingStatus as any,
          payment_status: (paymentStatus || selectedBooking.payment_status) as any,
        });
      }
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update booking status', 'error');
    }
  };

  const handleDeleteBooking = async (bookingId: string, ref: string) => {
    if (!confirm(`Are you sure you want to permanently delete reservation #${ref}? This action cannot be undone.`)) return;
    try {
      await api.admin.deleteBooking(bookingId);
      showToast(`Booking #${ref} has been deleted.`);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(null);
      }
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete booking', 'error');
    }
  };

  const handleSendWhatsAppVoucher = (b: CarBooking) => {
    const phone = b.customer_phone.replace(/[^0-9]/g, '');
    const formattedPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const text = encodeURIComponent(
      `Hello ${b.customer_name},\n\n` +
      `Your car reservation #${b.booking_number} with AR Tours & Travel has been VERIFIED & CONFIRMED!\n\n` +
      `• Vehicle: ${b.car?.brand || ''} ${b.car?.name || 'Selected Car'}\n` +
      `• Pickup: ${b.pickup_date} at ${b.pickup_time || '10:00 AM'} (${b.pickup_location})\n` +
      `• Return: ${b.return_date} at ${b.return_time || '10:00 AM'} (${b.drop_location || b.pickup_location})\n` +
      `• Slot Advance Verified: ₹${b.booking_fee} (PAID via UPI, UTR: ${b.utr_number || 'Confirmed'})\n` +
      `• Balance Payable at Handover: ₹${b.total_amount - b.booking_fee}\n` +
      `• Refundable Security Deposit: ₹${b.security_deposit || 3000}\n\n` +
      `Our concierge driver will contact you prior to delivery. Have a wonderful journey with AR Tours & Travel!`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  const filteredBookings = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      b.booking_number.toLowerCase().includes(q) ||
      b.customer_name.toLowerCase().includes(q) ||
      b.customer_phone.toLowerCase().includes(q) ||
      b.customer_email.toLowerCase().includes(q) ||
      (b.utr_number && b.utr_number.toLowerCase().includes(q)) ||
      (b.car?.name && b.car.name.toLowerCase().includes(q)) ||
      (b.car?.brand && b.car.brand.toLowerCase().includes(q));

    let matchesStatus = true;
    if (statusFilter === 'pending_verification') {
      matchesStatus =
        b.booking_status === 'pending_verification' ||
        b.payment_status === 'awaiting_approval' ||
        b.booking_status === 'pending';
    } else if (statusFilter !== 'all') {
      matchesStatus = b.booking_status.toLowerCase() === statusFilter.toLowerCase();
    }

    return matchesSearch && matchesStatus;
  });

  const pendingUtrCount = bookings.filter(
    b => b.booking_status === 'pending_verification' || b.payment_status === 'awaiting_approval'
  ).length;
  const totalSlotRevenue = bookings.reduce(
    (sum, b) => sum + (b.payment_status === 'paid' ? (b.booking_fee || 499) : 0),
    0
  );
  const confirmedCount = bookings.filter(b => b.booking_status === 'confirmed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Car Rental Bookings &amp; Manual UPI UTR Verifications</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {bookings.length} Bookings
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify customer-submitted 12-digit UPI UTRs, review payment screenshots, approve/reject slot reservations, and issue WhatsApp vouchers.
          </p>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Pending UTR Card */}
        <div
          onClick={() => setStatusFilter(pendingUtrCount > 0 ? 'pending_verification' : 'all')}
          className={`border rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition ${
            pendingUtrCount > 0
              ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/20 shadow-lg shadow-amber-500/10'
              : 'bg-white/[0.02] border-white/10'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">
              Pending UTRs
            </div>
            <div className="text-lg font-black text-white flex items-center gap-1.5">
              <span>{pendingUtrCount}</span>
              {pendingUtrCount > 0 && (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  Action Required
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Total Slot Revenue */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Slot Token Revenue</div>
            <div className="text-lg font-black text-emerald-400">₹{totalSlotRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Confirmed Trips */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Confirmed Bookings</div>
            <div className="text-lg font-black text-cyan-400">{confirmedCount}</div>
          </div>
        </div>

        {/* Total Reservations */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Total Reservations</div>
            <div className="text-lg font-black text-purple-400">{bookings.length}</div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ref, UTR number, customer, phone, car..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">All Reservations</option>
            <option value="pending_verification">⏳ Pending UTR Verification ({pendingUtrCount})</option>
            <option value="confirmed">✓ Confirmed</option>
            <option value="completed">Completed</option>
            <option value="rejected">✕ Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Ref &amp; Date</th>
                <th className="p-3">Renter Details</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Schedule &amp; Hub</th>
                <th className="p-3">UPI &amp; UTR Details</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Verification &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No reservations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(b => {
                  const isAwaitingVerification =
                    b.booking_status === 'pending_verification' ||
                    b.payment_status === 'awaiting_approval';

                  return (
                    <tr
                      key={b.id}
                      className={`transition ${
                        isAwaitingVerification
                          ? 'bg-amber-500/5 hover:bg-amber-500/10'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Booking Number */}
                      <td className="p-3 font-mono font-bold text-amber-400">
                        <div>#{b.booking_number}</div>
                        <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {new Date(b.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* Customer info */}
                      <td className="p-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.customer_name}</span>
                        </div>
                        <div className="text-slate-400 text-[11px] pl-5">{b.customer_phone}</div>
                        <div className="text-slate-400 text-[11px] pl-5">{b.customer_email}</div>
                      </td>

                      {/* Vehicle */}
                      <td className="p-3 font-medium text-slate-200">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            {b.car?.brand} {b.car?.name}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[10px] pl-5">
                          {b.driver_required ? 'With Chauffeur' : 'Self-Drive'}
                        </div>
                      </td>

                      {/* Schedule */}
                      <td className="p-3">
                        <div className="font-semibold text-white">{b.pickup_location}</div>
                        <div className="text-slate-400 text-[11px]">
                          {b.pickup_date} ({b.rental_days} d)
                        </div>
                      </td>

                      {/* UPI & UTR Submission */}
                      <td className="p-3">
                        <div className="flex items-center gap-1 font-mono font-bold text-xs text-white">
                          <span className="text-amber-400">₹{b.booking_fee || 499}</span>
                          <span className="text-slate-500">·</span>
                          <span>UPI</span>
                        </div>

                        {b.utr_number ? (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="font-mono text-[11px] text-amber-300 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/20 select-all">
                              {b.utr_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyUtr(b.utr_number!)}
                              className="p-1 hover:text-white text-slate-400 transition"
                              title="Copy UTR"
                            >
                              {copiedUtr === b.utr_number ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">No UTR</span>
                        )}

                        {b.payment_screenshot && (
                          <button
                            type="button"
                            onClick={() => setPreviewScreenshot(b.payment_screenshot!)}
                            className="mt-1 text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <ImageIcon className="w-3 h-3" />
                            <span>View Screenshot</span>
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        {isAwaitingVerification ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                            <span>Awaiting Review</span>
                          </span>
                        ) : (
                          <select
                            value={b.booking_status}
                            onChange={e => handleUpdateStatus(b.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none transition cursor-pointer ${
                              b.booking_status === 'confirmed'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : b.booking_status === 'completed'
                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                                : b.booking_status === 'rejected'
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                : b.booking_status === 'cancelled'
                                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                                : 'bg-white/10 border-white/20 text-slate-200'
                            }`}
                          >
                            <option value="confirmed" className="bg-slate-900 text-emerald-300">Confirmed</option>
                            <option value="completed" className="bg-slate-900 text-purple-300">Completed</option>
                            <option value="pending_verification" className="bg-slate-900 text-amber-300">Pending Review</option>
                            <option value="rejected" className="bg-slate-900 text-rose-300">Rejected</option>
                            <option value="cancelled" className="bg-slate-900 text-red-300">Cancelled</option>
                          </select>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* If Awaiting Verification: Instant Approve / Reject buttons */}
                          {isAwaitingVerification && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleVerifyUtr(b.id, 'approve')}
                                disabled={isProcessing}
                                title="Approve UTR & Confirm Slot"
                                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-[11px] font-black flex items-center gap-1 transition shadow-sm cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingBooking(b);
                                  setRejectionReason('Payment not found in bank account or invalid UTR.');
                                }}
                                disabled={isProcessing}
                                title="Reject UTR"
                                className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => setSelectedBooking(b)}
                            title="View Full Booking Voucher"
                            className="px-2 py-1 bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white rounded-lg border border-white/10 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>Details</span>
                          </button>

                          <button
                            onClick={() => handleSendWhatsAppVoucher(b)}
                            title="Send WhatsApp Confirmation"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteBooking(b.id, b.booking_number)}
                            title="Delete Booking Record"
                            className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg border border-transparent hover:border-red-500/20 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REJECT UTR CONFIRMATION DIALOG */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Reject UPI Payment</h3>
                <p className="text-xs text-slate-400">Booking #{rejectingBooking.booking_number}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason for Rejection (Customer will be notified)
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingBooking(null)}
                disabled={isProcessing}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifyUtr(rejectingBooking.id, 'reject', rejectionReason)}
                disabled={isProcessing}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREENSHOT PREVIEW MODAL */}
      {previewScreenshot && (
        <div
          onClick={() => setPreviewScreenshot(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-xl max-h-[85vh] bg-slate-900 border border-white/20 rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setPreviewScreenshot(null)}
              className="absolute top-3 right-3 bg-black/70 text-white p-1.5 rounded-full hover:bg-black"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <img
              src={previewScreenshot}
              alt="Payment Screenshot Receipt"
              className="max-h-[80vh] w-auto object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* FULL BOOKING VOUCHER MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">Reservation Voucher</h3>
                  <div className="text-xs text-amber-400 font-mono font-bold">
                    Ref: #{selectedBooking.booking_number}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* UPI UTR Verification Box */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Direct UPI Payment Verification</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    selectedBooking.payment_status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : selectedBooking.payment_status === 'rejected'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  }`}
                >
                  {selectedBooking.payment_status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Submitted UTR / Transaction ID:</span>
                  <div className="font-mono font-bold text-white text-sm tracking-wider flex items-center gap-1 mt-0.5">
                    <span>{selectedBooking.utr_number || 'None provided'}</span>
                    {selectedBooking.utr_number && (
                      <button
                        type="button"
                        onClick={() => handleCopyUtr(selectedBooking.utr_number!)}
                        className="p-1 hover:text-amber-400 transition"
                      >
                        {copiedUtr === selectedBooking.utr_number ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Slot Token Amount:</span>
                  <span className="font-bold text-emerald-400 text-sm">₹{selectedBooking.booking_fee}</span>
                </div>
              </div>

              {selectedBooking.verified_at && (
                <div className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  Verified by <strong className="text-slate-200">{selectedBooking.verified_by || 'Admin'}</strong> on{' '}
                  {new Date(selectedBooking.verified_at).toLocaleString('en-IN')}
                </div>
              )}

              {selectedBooking.rejection_reason && (
                <div className="text-[11px] text-rose-300 pt-1 border-t border-rose-500/20">
                  Rejection Reason: {selectedBooking.rejection_reason}
                </div>
              )}

              {selectedBooking.payment_screenshot && (
                <div className="pt-2 border-t border-white/5">
                  <span className="text-slate-400 block text-[11px] mb-1">Uploaded Payment Screenshot:</span>
                  <img
                    src={selectedBooking.payment_screenshot}
                    alt="Receipt"
                    onClick={() => setPreviewScreenshot(selectedBooking.payment_screenshot!)}
                    className="max-h-36 rounded-xl border border-white/20 cursor-pointer hover:opacity-90 transition object-contain bg-black/40"
                  />
                </div>
              )}
            </div>

            {/* Vehicle & Renter Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/10 space-y-2">
                <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  <span>Reserved Vehicle</span>
                </div>
                <div className="text-base font-bold text-white">
                  {selectedBooking.car?.brand} {selectedBooking.car?.name}
                </div>
                <div className="text-xs text-slate-400">
                  Category: {selectedBooking.car?.category} • Transmission: {selectedBooking.car?.transmission}
                </div>
                <div className="text-xs text-slate-400">
                  Drive Mode:{' '}
                  <span className="text-white font-semibold">
                    {selectedBooking.driver_required ? 'With Chauffeur' : 'Self-Drive'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-white/10 space-y-2">
                <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Renter Credentials</span>
                </div>
                <div className="text-base font-bold text-white">{selectedBooking.customer_name}</div>
                <div className="text-xs text-slate-300">{selectedBooking.customer_phone}</div>
                <div className="text-xs text-slate-400">{selectedBooking.customer_email}</div>
              </div>
            </div>

            {/* Itinerary & Pickup Details */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-white/10 space-y-3 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400">Pickup &amp; Drop Milestones</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block">Pickup Hub:</span>
                  <span className="font-semibold text-white">{selectedBooking.pickup_location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Drop Location:</span>
                  <span className="font-semibold text-white">
                    {selectedBooking.drop_location || selectedBooking.pickup_location}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pickup Date &amp; Time:</span>
                  <span className="font-semibold text-white">
                    {selectedBooking.pickup_date} at {selectedBooking.pickup_time || '10:00 AM'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Return Date &amp; Time:</span>
                  <span className="font-semibold text-white">
                    {selectedBooking.return_date} at {selectedBooking.return_time || '10:00 AM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2 text-xs">
              <div className="text-[10px] uppercase font-bold text-amber-400">Financial Ledger &amp; Tariff</div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Rental Tariff ({selectedBooking.rental_days} Days @ ₹{selectedBooking.rental_rate_per_day}/day):</span>
                  <span className="font-semibold text-white">₹{selectedBooking.total_amount}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Slot Reservation Fee (Paid via UPI):</span>
                  <span>- ₹{selectedBooking.booking_fee}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Refundable Security Deposit (Payable at pickup):</span>
                  <span>₹{selectedBooking.security_deposit || 3000}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-black text-white text-sm">
                  <span>Balance Due on Delivery:</span>
                  <span className="text-amber-400">
                    ₹{selectedBooking.total_amount - selectedBooking.booking_fee}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Status Updates */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                {selectedBooking.booking_status === 'pending_verification' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleVerifyUtr(selectedBooking.id, 'approve')}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition cursor-pointer shadow"
                    >
                      Approve UTR &amp; Reserve Slot
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRejectingBooking(selectedBooking);
                        setRejectionReason('Payment could not be verified with bank.');
                      }}
                      disabled={isProcessing}
                      className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                )}

                {selectedBooking.booking_status === 'confirmed' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'completed', 'paid')}
                    className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-500/30 transition cursor-pointer"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppVoucher(selectedBooking)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Confirmation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
