import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Compass,
  Palmtree,
  Mail,
  User,
} from 'lucide-react';
import { TourEnquiry, PilgrimageEnquiry, ContactMessage } from '../../types';
import { api } from '../../services/api';

interface AdminEnquiriesTabProps {
  tourEnquiries: TourEnquiry[];
  pilgrimEnquiries: PilgrimageEnquiry[];
  contactMessages: ContactMessage[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminEnquiriesTab: React.FC<AdminEnquiriesTabProps> = ({
  tourEnquiries,
  pilgrimEnquiries,
  contactMessages,
  onRefresh,
  showToast,
}) => {
  const [subTab, setSubTab] = useState<'tour' | 'pilgrim' | 'contact'>('tour');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleUpdateStatus = async (type: 'tour' | 'pilgrim' | 'contact', id: string, status: string) => {
    try {
      await api.admin.updateEnquiryStatus(type, id, status);
      showToast(`Lead status updated to ${status.toUpperCase()}`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update enquiry status', 'error');
    }
  };

  const handleDeleteEnquiry = async (type: 'tour' | 'pilgrim' | 'contact', id: string, leadName: string) => {
    if (!confirm(`Are you sure you want to delete lead from "${leadName}"?`)) return;
    try {
      await api.admin.deleteEnquiry(type, id);
      showToast(`Enquiry deleted.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete enquiry', 'error');
    }
  };

  const handleWhatsAppLead = (phone: string, name: string, title?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formatted = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Hello ${name},\n\n` +
      `Thank you for reaching out to AR Tours & Travel regarding ${title ? `"${title}"` : 'your travel requirements'}.\n` +
      `Our holiday and pilgrimage specialist is here to assist you with custom quotes, flight schedules, and discounts.\n` +
      `When would be a convenient time for a quick 2-minute call?`
    );
    window.open(`https://wa.me/${formatted}?text=${text}`, '_blank');
  };

  // Filter Tour Enquiries
  const filteredTourEnquiries = tourEnquiries.filter(te => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      te.full_name.toLowerCase().includes(q) ||
      te.phone.toLowerCase().includes(q) ||
      te.email.toLowerCase().includes(q) ||
      (te.tour_title && te.tour_title.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || te.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Filter Pilgrimage Enquiries
  const filteredPilgrimEnquiries = pilgrimEnquiries.filter(pe => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      pe.full_name.toLowerCase().includes(q) ||
      pe.phone.toLowerCase().includes(q) ||
      pe.email.toLowerCase().includes(q) ||
      (pe.package_title && pe.package_title.toLowerCase().includes(q)) ||
      (pe.departure_city && pe.departure_city.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || pe.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Filter Contact Messages
  const filteredContactMessages = contactMessages.filter(cm => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      cm.name.toLowerCase().includes(q) ||
      cm.email.toLowerCase().includes(q) ||
      (cm.phone && cm.phone.toLowerCase().includes(q)) ||
      cm.subject.toLowerCase().includes(q) ||
      cm.message.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || cm.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>Enquiries &amp; Customer Leads Management</span>
          <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
            {tourEnquiries.length + pilgrimEnquiries.length + contactMessages.length} Leads
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Follow up with clients via 1-click WhatsApp or Call, update conversation status, and manage incoming leads.
        </p>
      </div>

      {/* Sub-tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => { setSubTab('tour'); setStatusFilter('all'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            subTab === 'tour'
              ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Palmtree className="w-4 h-4" />
          <span>Tour Enquiries ({tourEnquiries.length})</span>
        </button>

        <button
          onClick={() => { setSubTab('pilgrim'); setStatusFilter('all'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            subTab === 'pilgrim'
              ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Hajj &amp; Umrah Leads ({pilgrimEnquiries.length})</span>
        </button>

        <button
          onClick={() => { setSubTab('contact'); setStatusFilter('all'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
            subTab === 'contact'
              ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>General Desk Messages ({contactMessages.length})</span>
        </button>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads by name, phone number, email, destination..."
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
            <option value="all">All Stages</option>
            <option value="new">New Lead</option>
            <option value="contacted">Contacted</option>
            <option value="in_discussion">In Discussion</option>
            <option value="booked">Booked</option>
            <option value="closed">Closed / Cancelled</option>
          </select>
        </div>
      </div>

      {/* 1. TOUR ENQUIRIES TABLE */}
      {subTab === 'tour' && (
        <div className="bg-white/[0.03] backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Tour Package</th>
                  <th className="p-3">Client Contact</th>
                  <th className="p-3">Travel Date</th>
                  <th className="p-3">Group Size</th>
                  <th className="p-3">Special Requests</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTourEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No holiday tour leads found.
                    </td>
                  </tr>
                ) : (
                  filteredTourEnquiries.map(te => (
                    <tr key={te.id} className="hover:bg-white/5 transition">
                      <td className="p-3">
                        <div className="font-bold text-white text-xs">{te.tour_title}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">
                          Received: {new Date(te.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-white">{te.full_name}</div>
                        <div className="text-slate-400 text-[11px]">{te.phone}</div>
                        <div className="text-slate-400 text-[11px]">{te.email}</div>
                      </td>

                      <td className="p-3 text-slate-200 font-medium">{te.travel_date}</td>

                      <td className="p-3 text-slate-300">
                        {te.number_of_adults} Adults
                        {te.number_of_children > 0 && `, ${te.number_of_children} Children`}
                      </td>

                      <td className="p-3 text-slate-400 max-w-xs">
                        <p className="line-clamp-2">{te.special_requests || '—'}</p>
                      </td>

                      <td className="p-3">
                        <select
                          value={te.status}
                          onChange={e => handleUpdateStatus('tour', te.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none transition cursor-pointer ${
                            te.status === 'booked'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : te.status === 'contacted' || te.status === 'in_discussion'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-white/10 border-white/20 text-slate-200'
                          }`}
                        >
                          <option value="new" className="bg-slate-900 text-white">New Lead</option>
                          <option value="contacted" className="bg-slate-900 text-amber-300">Contacted</option>
                          <option value="in_discussion" className="bg-slate-900 text-cyan-300">In Discussion</option>
                          <option value="booked" className="bg-slate-900 text-emerald-300">Booked</option>
                          <option value="closed" className="bg-slate-900 text-slate-400">Closed</option>
                        </select>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleWhatsAppLead(te.phone, te.full_name, te.tour_title)}
                            title="Chat on WhatsApp"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`tel:${te.phone}`}
                            title="Call Customer"
                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/20 transition cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDeleteEnquiry('tour', te.id, te.full_name)}
                            title="Delete Lead"
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
      )}

      {/* 2. PILGRIMAGE ENQUIRIES TABLE */}
      {subTab === 'pilgrim' && (
        <div className="bg-white/[0.03] backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Pilgrimage Title</th>
                  <th className="p-3">Pilgrim Name &amp; Contact</th>
                  <th className="p-3">Departure City</th>
                  <th className="p-3">Preferred Month</th>
                  <th className="p-3">Pax &amp; Room</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPilgrimEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No Hajj or Umrah consultation leads found.
                    </td>
                  </tr>
                ) : (
                  filteredPilgrimEnquiries.map(pe => (
                    <tr key={pe.id} className="hover:bg-white/5 transition">
                      <td className="p-3">
                        <div className="font-bold text-white text-xs">{pe.package_title || pe.pilgrimage_type}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">
                          Received: {new Date(pe.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-white">{pe.full_name}</div>
                        <div className="text-slate-400 text-[11px]">{pe.phone}</div>
                        <div className="text-slate-400 text-[11px]">{pe.email}</div>
                      </td>

                      <td className="p-3 text-slate-200 font-medium">{pe.departure_city}</td>
                      <td className="p-3 text-slate-200">{pe.preferred_month}</td>

                      <td className="p-3 text-slate-300">
                        <div>{pe.number_of_people} Pilgrims</div>
                        <div className="text-[10px] text-amber-400">{pe.room_sharing || 'Quad Sharing'}</div>
                      </td>

                      <td className="p-3">
                        <select
                          value={pe.status}
                          onChange={e => handleUpdateStatus('pilgrim', pe.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none transition cursor-pointer ${
                            pe.status === 'booked'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : pe.status === 'contacted' || pe.status === 'in_discussion'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-white/10 border-white/20 text-slate-200'
                          }`}
                        >
                          <option value="new" className="bg-slate-900 text-white">New Lead</option>
                          <option value="contacted" className="bg-slate-900 text-amber-300">Contacted</option>
                          <option value="in_discussion" className="bg-slate-900 text-cyan-300">In Discussion</option>
                          <option value="booked" className="bg-slate-900 text-emerald-300">Booked</option>
                          <option value="closed" className="bg-slate-900 text-slate-400">Closed</option>
                        </select>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleWhatsAppLead(pe.phone, pe.full_name, pe.package_title)}
                            title="Chat on WhatsApp"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`tel:${pe.phone}`}
                            title="Call Pilgrim"
                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/20 transition cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleDeleteEnquiry('pilgrim', pe.id, pe.full_name)}
                            title="Delete Lead"
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
      )}

      {/* 3. CONTACT MESSAGES TABLE */}
      {subTab === 'contact' && (
        <div className="bg-white/[0.03] backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Subject / Interest</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Received</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredContactMessages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No general contact messages found.
                    </td>
                  </tr>
                ) : (
                  filteredContactMessages.map(cm => (
                    <tr key={cm.id} className="hover:bg-white/5 transition">
                      <td className="p-3">
                        <div className="font-bold text-white">{cm.name}</div>
                        <div className="text-slate-400 text-[11px]">{cm.email}</div>
                        {cm.phone && <div className="text-slate-400 text-[11px]">{cm.phone}</div>}
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-white">{cm.subject}</div>
                        {cm.service_interest && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            {cm.service_interest}
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-slate-300 max-w-sm">
                        <p className="line-clamp-3">{cm.message}</p>
                      </td>

                      <td className="p-3 text-slate-400 text-[11px]">
                        {new Date(cm.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>

                      <td className="p-3">
                        <select
                          value={cm.status}
                          onChange={e => handleUpdateStatus('contact', cm.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none transition cursor-pointer ${
                            cm.status === 'resolved'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : cm.status === 'in_review'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-white/10 border-white/20 text-slate-200'
                          }`}
                        >
                          <option value="unread" className="bg-slate-900 text-white">Unread</option>
                          <option value="in_review" className="bg-slate-900 text-amber-300">In Review</option>
                          <option value="resolved" className="bg-slate-900 text-emerald-300">Resolved</option>
                        </select>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {cm.phone && (
                            <button
                              onClick={() => handleWhatsAppLead(cm.phone!, cm.name, cm.subject)}
                              title="Chat on WhatsApp"
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteEnquiry('contact', cm.id, cm.name)}
                            title="Delete Message"
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
      )}
    </div>
  );
};
