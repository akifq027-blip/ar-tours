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
      `Your car reservation #${b.booking_number} with AR Tours & Travel is confirmed!\n` +
      `Vehicle: ${b.car?.brand || ''} ${b.car?.name || 'Selected Car'}\n` +
      `Pickup: ${b.pickup_date} (${b.pickup_location})\n` +
      `Duration: ${b.rental_days} Days\n` +
      `Slot Advance Paid: ₹${b.booking_fee} (PAID)\n` +
      `Balance Due on Delivery: ₹${b.total_amount - b.booking_fee}\n\n` +
      `Our concierge desk will deliver the vehicle on time. Thank you!`
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
      (b.car?.name && b.car.name.toLowerCase().includes(q)) ||
      (b.car?.brand && b.car.brand.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'all' || b.booking_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalSlotRevenue = bookings.reduce((sum, b) => sum + (b.payment_status === 'paid' ? (b.booking_fee || 99) : 0), 0);
  const confirmedCount = bookings.filter(b => b.booking_status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.booking_status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Car Rental Reservations &amp; Slot Vouchers</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {bookings.length} Bookings
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            View full renter vouchers, manage slot payment status, update booking stages, or remove cancelled records.
          </p>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Total Bookings</div>
            <div className="text-lg font-black text-white">{bookings.length}</div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">₹99 Slot Advance</div>
            <div className="text-lg font-black text-emerald-400">₹{totalSlotRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Confirmed Trips</div>
            <div className="text-lg font-black text-cyan-400">{confirmedCount}</div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Completed Returns</div>
            <div className="text-lg font-black text-purple-400">{completedCount}</div>
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
            placeholder="Search by booking ref, customer name, phone, car..."
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
            <option value="all">All Reservation Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
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
                <th className="p-3">Rental Dates &amp; Depot</th>
                <th className="p-3">Slot Payment</th>
                <th className="p-3">Booking Status</th>
                <th className="p-3 text-right">Actions</th>
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
                filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-mono font-bold text-amber-400">
                      <div>#{b.booking_number}</div>
                      <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                        {new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.customer_name}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] pl-5">{b.customer_phone}</div>
                      <div className="text-slate-400 text-[11px] pl-5">{b.customer_email}</div>
                    </td>

                    <td className="p-3 font-medium text-slate-200">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-amber-400" />
                        <span>{b.car?.brand} {b.car?.name}</span>
                      </div>
                      <div className="text-slate-400 text-[10px] pl-5">
                        {b.with_driver ? 'Chauffeur Driven' : 'Self-Drive'}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-white">{b.pickup_location}</div>
                      <div className="text-slate-400 text-[11px]">
                        {b.pickup_date} to {b.return_date} ({b.rental_days} days)
                      </div>
                    </td>

                    <td className="p-3 font-bold">
                      <div className="text-emerald-400">₹{b.booking_fee}</div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase inline-block mt-0.5 ${
                        b.payment_status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {b.payment_status}
                      </span>
                    </td>

                    <td className="p-3">
                      <select
                        value={b.booking_status}
                        onChange={e => handleUpdateStatus(b.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none transition cursor-pointer ${
                          b.booking_status === 'confirmed'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : b.booking_status === 'completed'
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                            : b.booking_status === 'cancelled'
                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                            : 'bg-white/10 border-white/20 text-slate-200'
                        }`}
                      >
                        <option value="confirmed" className="bg-slate-900 text-emerald-300">Confirmed</option>
                        <option value="completed" className="bg-slate-900 text-purple-300">Completed</option>
                        <option value="pending" className="bg-slate-900 text-amber-300">Pending</option>
                        <option value="cancelled" className="bg-slate-900 text-red-300">Cancelled</option>
                      </select>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          title="View Full Booking Voucher"
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white rounded-lg border border-white/10 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Voucher</span>
                        </button>

                        <button
                          onClick={() => handleSendWhatsAppVoucher(b)}
                          title="WhatsApp Booking Details"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                  Drive Mode: <span className="text-white font-semibold">{selectedBooking.with_driver ? 'With Chauffeur' : 'Self-Drive'}</span>
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
                  <span className="font-semibold text-white">{selectedBooking.drop_location || selectedBooking.pickup_location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pickup Date &amp; Time:</span>
                  <span className="font-semibold text-white">{selectedBooking.pickup_date} at {selectedBooking.pickup_time || '10:00 AM'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Return Date &amp; Time:</span>
                  <span className="font-semibold text-white">{selectedBooking.return_date} at {selectedBooking.return_time || '10:00 AM'}</span>
                </div>
              </div>
            </div>

            {/* Financial & Razorpay Breakdown */}
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-2 text-xs">
              <div className="text-[10px] uppercase font-bold text-amber-400">Financial Ledger &amp; Slot Fee</div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Rental Tariff ({selectedBooking.rental_days} Days @ ₹{selectedBooking.car?.price_per_day || (selectedBooking.total_amount / selectedBooking.rental_days)}/day):</span>
                  <span className="font-semibold text-white">₹{selectedBooking.total_amount}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Slot Reservation Fee (Online Paid):</span>
                  <span>- ₹{selectedBooking.booking_fee}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Refundable Security Deposit (Payable at pickup):</span>
                  <span>₹{selectedBooking.car?.security_deposit || 3000}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-black text-white text-sm">
                  <span>Balance Due on Delivery:</span>
                  <span className="text-amber-400">₹{selectedBooking.total_amount - selectedBooking.booking_fee}</span>
                </div>
              </div>
            </div>

            {/* Actions & Status Updates */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'completed', 'paid')}
                  className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition cursor-pointer"
                >
                  Mark as Completed
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled', 'refunded')}
                  className="px-3 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold hover:bg-red-500/30 transition cursor-pointer"
                >
                  Cancel &amp; Refund
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppVoucher(selectedBooking)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Voucher</span>
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
