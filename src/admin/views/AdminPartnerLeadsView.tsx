import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Trash2,
  CheckCircle,
  Phone,
  MessageSquare,
  Plus,
  Mail,
  User,
  MapPin,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  Check,
  Building,
  Briefcase,
  Award,
  ShieldCheck,
  Send,
  UserCheck,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { Lead } from '../../types';
import { CRMService } from '../../services/crmService';

export const AdminPartnerLeadsView: React.FC = () => {
  const { leads, adminUsers, settings, crmSettings } = useStore();
  const [isSyncingCRM, setIsSyncingCRM] = useState(false);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [territoryFilter, setTerritoryFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [activePartner, setActivePartner] = useState<Lead | null>(null);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const partnerStatuses: Lead['status'][] = [
    'New',
    'Contacted',
    'Interested',
    'Follow Up',
    'Converted',
    'Not Interested',
    'Closed',
  ];

  // Isolate Channel Partner leads ONLY
  const partnerLeads = useMemo(() => {
    return leads.filter((l) => l.source === 'Channel Partner');
  }, [leads]);

  // Territories list
  const territories = [
    'All',
    'Mumbai',
    'Navi Mumbai',
    'Thane',
    'Pune',
    'Konkan (Raigad / Ratnagiri)',
    'Other',
  ];

  // Categories list
  const partnerCategories = [
    'All',
    'Real Estate Broker',
    'Property Consultant',
    'Independent Real Estate Agent',
    'Freelance Property Advisor',
    'Referral Partner',
    'Local Network Professional',
    'Marketing Professional',
  ];

  // Filtered Partner Leads
  const filteredPartners = useMemo(() => {
    return partnerLeads.filter((partner) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        partner.name.toLowerCase().includes(q) ||
        partner.phone.includes(q) ||
        (partner.email && partner.email.toLowerCase().includes(q)) ||
        partner.id.toLowerCase().includes(q) ||
        (partner.city && partner.city.toLowerCase().includes(q)) ||
        (partner.partnerType && partner.partnerType.toLowerCase().includes(q)) ||
        (partner.reraNumber && partner.reraNumber.toLowerCase().includes(q)) ||
        (partner.assignedTo && partner.assignedTo.toLowerCase().includes(q)) ||
        (partner.message && partner.message.toLowerCase().includes(q)) ||
        (partner.notes && partner.notes.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || partner.status === statusFilter;
      const matchesTerritory =
        territoryFilter === 'All' || (partner.city && partner.city.includes(territoryFilter));
      const matchesCategory =
        categoryFilter === 'All' || (partner.partnerType && partner.partnerType.includes(categoryFilter));

      return matchesSearch && matchesStatus && matchesTerritory && matchesCategory;
    });
  }, [partnerLeads, search, statusFilter, territoryFilter, categoryFilter]);

  // KPI stats for Channel Partners
  const totalPartnersCount = partnerLeads.length;
  const newPartnersCount = partnerLeads.filter((l) => l.status === 'New').length;
  const activePartnersCount = partnerLeads.filter((l) => l.status === 'Converted' || l.status === 'Interested').length;
  const inFollowUpCount = partnerLeads.filter((l) => l.status === 'Contacted' || l.status === 'Follow Up').length;

  // New Partner Form state
  const [newPartnerData, setNewPartnerData] = useState({
    name: '',
    agency: '',
    phone: '',
    email: '',
    city: 'Mumbai',
    partnerType: 'Real Estate Broker',
    reraNumber: '',
    preferredContact: 'WhatsApp' as 'WhatsApp' | 'Call',
    assignedTo: 'Anand Pereira',
    message: '',
    notes: '',
  });

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerData.name.trim() || !newPartnerData.phone.trim()) {
      alert('Partner Name and Phone Number are required.');
      return;
    }

    const created = StoreService.addLead({
      name: newPartnerData.agency
        ? `${newPartnerData.name.trim()} (${newPartnerData.agency.trim()})`
        : newPartnerData.name.trim(),
      phone: newPartnerData.phone.trim(),
      email: newPartnerData.email.trim(),
      project: 'Channel Partner Program',
      preferredContact: newPartnerData.preferredContact,
      status: 'New',
      source: 'Channel Partner',
      assignedTo: newPartnerData.assignedTo,
      city: newPartnerData.city,
      partnerType: newPartnerData.partnerType,
      reraNumber: newPartnerData.reraNumber.trim() || undefined,
      message: newPartnerData.message.trim(),
      notes: newPartnerData.notes.trim(),
    });

    setIsAddPartnerModalOpen(false);
    showToast(`✓ Channel Partner record registered for ${created.name}!`);
    setNewPartnerData({
      name: '',
      agency: '',
      phone: '',
      email: '',
      city: 'Mumbai',
      partnerType: 'Real Estate Broker',
      reraNumber: '',
      preferredContact: 'WhatsApp',
      assignedTo: 'Anand Pereira',
      message: '',
      notes: '',
    });
  };

  // Status badge styling
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-semibold';
      case 'Contacted':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
      case 'Interested':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-semibold';
      case 'Follow Up':
        return 'bg-orange-100 text-orange-900 border-orange-300 font-semibold';
      case 'Converted':
        return 'bg-emerald-100 text-emerald-950 border-emerald-400 font-bold';
      case 'Not Interested':
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-300 font-medium';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = (id: string, newStatus: Lead['status'], e?: React.ChangeEvent) => {
    if (e) e.stopPropagation();
    StoreService.updateLeadStatus(id, newStatus);
    showToast(`✓ Partner status updated to "${newStatus}"`);
    if (activePartner && activePartner.id === id) {
      setActivePartner({ ...activePartner, status: newStatus });
    }
  };

  const handleSaveNotes = (notes: string) => {
    if (!activePartner) return;
    const updated = { ...activePartner, notes };
    StoreService.saveLead(updated);
    setActivePartner(updated);
    showToast('✓ Partner notes updated.');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove Channel Partner record "${name}"?`)) {
      StoreService.deleteLead(id);
      setActivePartner(null);
      showToast(`✓ Channel Partner "${name}" removed.`);
    }
  };

  const handleSendWhatsApp = (partner: Lead, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanPhone = partner.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${partner.name}, Greetings from Velora Developers Channel Partner Desk! Thank you for partnering with us. We have received your details for our Konkan plotted developments. When is a good time to connect regarding project kits and partner terms?`
    );
    window.open(`https://wa.me/91${cleanPhone}?text=${text}`, '_blank');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Partner ID',
      'Name',
      'Phone',
      'Email',
      'Territory',
      'Category',
      'RERA Number',
      'Status',
      'Assigned Manager',
      'Date Registered',
      'Message',
      'Notes',
    ];

    const rows = filteredPartners.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.phone}"`,
      `"${p.email || ''}"`,
      `"${p.city || ''}"`,
      `"${p.partnerType || ''}"`,
      `"${p.reraNumber || ''}"`,
      p.status,
      `"${p.assignedTo || 'Unassigned'}"`,
      `"${p.date} ${p.time}"`,
      `"${(p.message || '').replace(/"/g, '""')}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `velora_channel_partners_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSyncPartnerToCRM = async (partner: Lead, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!crmSettings.enabled || !crmSettings.webhookUrl?.trim()) {
      showToast('⚠️ Please configure and enable CRM Webhook in Settings first.');
      return;
    }
    showToast(`Dispatching partner "${partner.name}" to CRM...`);
    const res = await CRMService.dispatchLead(partner, 'partner');
    if (res.success) {
      showToast(`✓ Partner "${partner.name}" (${partner.id}) forwarded to CRM!`);
    } else {
      showToast(`CRM Notice: ${res.message}`);
    }
  };

  const handleSyncAllPartnersToCRM = async () => {
    if (!crmSettings.enabled || !crmSettings.webhookUrl?.trim()) {
      showToast('⚠️ Please configure and enable CRM Webhook in Settings first.');
      return;
    }
    const unsynced = partnerLeads.filter((l) => l.crmStatus !== 'synced');
    if (unsynced.length === 0) {
      showToast('✓ All channel partners are already synced to your CRM!');
      return;
    }
    setIsSyncingCRM(true);
    let successCount = 0;
    for (const partner of unsynced) {
      const res = await CRMService.dispatchLead(partner, 'partner');
      if (res.success) successCount++;
    }
    setIsSyncingCRM(false);
    showToast(`✓ Forwarded ${successCount} of ${unsynced.length} partners to CRM!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#00291E] border-2 border-[#C9A24A] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-[#C9A24A] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-2xl text-[#00291E]">Channel Partner Inquiries CRM</h2>
            <span className="bg-[#00291E] text-[#C9A24A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#C9A24A]/40">
              Partner Network
            </span>
          </div>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Manage property brokers, consultants, and referral partners across Mumbai, Navi Mumbai, Thane, Pune & Konkan. Separate from direct customer leads.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {crmSettings.enabled && (
            <button
              onClick={handleSyncAllPartnersToCRM}
              disabled={isSyncingCRM}
              className="bg-[#00291E] hover:bg-[#003D2B] border border-[#C9A24A]/40 text-[#C9A24A] text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Push unsynced channel partners to CRM"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSyncingCRM ? 'Syncing...' : 'Sync to CRM'}</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/30 text-[#00291E] text-xs font-medium px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#00291E]" />
            <span className="hidden sm:inline">Export</span> Partners CSV
          </button>

          <button
            onClick={() => setIsAddPartnerModalOpen(true)}
            className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 active:scale-[0.98] text-[#00291E] font-bold text-xs tracking-wider uppercase px-4 py-2 rounded shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Partner Lead</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Partners */}
        <button
          onClick={() => {
            setStatusFilter('All');
            setTerritoryFilter('All');
            setCategoryFilter('All');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'All'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Total Partners</span>
            <Briefcase className="w-3.5 h-3.5 text-[#C9A24A]" />
          </div>
          <div className="font-serif text-2xl font-semibold">{totalPartnersCount}</div>
          <span className="text-[10px] text-[#C9A24A] font-medium mt-1 block">Registered in CRM</span>
        </button>

        {/* New Applications */}
        <button
          onClick={() => setStatusFilter('New')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'New'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>New Applications</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="font-serif text-2xl font-semibold text-blue-600">{newPartnersCount}</div>
          <span className="text-[10px] text-blue-700 font-medium mt-1 block">Awaiting First Call</span>
        </button>

        {/* In Follow Up / Contacted */}
        <button
          onClick={() => setStatusFilter('Contacted')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Contacted'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Under Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="font-serif text-2xl font-semibold text-amber-600">{inFollowUpCount}</div>
          <span className="text-[10px] text-amber-700 font-medium mt-1 block">Kits Sent / Review</span>
        </button>

        {/* Active Partners */}
        <button
          onClick={() => setStatusFilter('Converted')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Converted'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Verified Partners</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="font-serif text-2xl font-semibold text-emerald-600">{activePartnersCount}</div>
          <span className="text-[10px] text-emerald-700 font-medium mt-1 block">Active Network</span>
        </button>
      </div>

      {/* 3. Search & Interactive Filter Controls */}
      <div className="bg-[#FFF8E7] p-4 rounded-xl border border-[#C9A24A]/25 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#C9A24A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search partner name, agency, mobile, city, RERA..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8F0D8] border border-[#C9A24A]/30 focus:border-[#C9A24A] rounded-lg text-xs outline-none transition-colors"
            />
          </div>

          {/* Territory Filter */}
          <div className="md:col-span-3">
            <select
              value={territoryFilter}
              onChange={(e) => setTerritoryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F0D8] border border-[#C9A24A]/30 focus:border-[#C9A24A] rounded-lg text-xs outline-none"
            >
              {territories.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Operating Territories' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F0D8] border border-[#C9A24A]/30 focus:border-[#C9A24A] rounded-lg text-xs outline-none"
            >
              <option value="All">All Statuses</option>
              {partnerStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="md:col-span-2 flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded border transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#00291E] text-white border-[#00291E]'
                  : 'bg-[#F8F0D8] text-[#26342D]/70 border-[#C9A24A]/30 hover:text-[#00291E]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded border transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[#00291E] text-white border-[#00291E]'
                  : 'bg-[#F8F0D8] text-[#26342D]/70 border-[#C9A24A]/30 hover:text-[#00291E]'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Partner Leads Display */}
      {filteredPartners.length === 0 ? (
        <div className="p-12 text-center bg-[#FFF8E7] rounded-xl border border-[#C9A24A]/25">
          <Briefcase className="w-12 h-12 text-[#C9A24A] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg text-[#00291E] font-medium">No Channel Partner Records Found</h3>
          <p className="text-xs text-[#26342D]/70 max-w-md mx-auto mt-1">
            {search || statusFilter !== 'All' || territoryFilter !== 'All'
              ? 'Try adjusting your search criteria or resetting filters to see partner inquiries.'
              : 'Channel Partner inquiries submitted through /channel-partner will appear here automatically.'}
          </p>
          {(search || statusFilter !== 'All' || territoryFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setTerritoryFilter('All');
                setCategoryFilter('All');
              }}
              className="mt-4 px-4 py-2 bg-[#00291E] text-white text-xs font-semibold rounded hover:bg-[#003D2B] transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-[#FFF8E7] rounded-xl border border-[#C9A24A]/25 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F0D8] border-b border-[#C9A24A]/20 text-[#00291E] font-serif uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Partner Name & Firm</th>
                  <th className="py-3 px-4">Territory & Category</th>
                  <th className="py-3 px-4">MahaRERA No.</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Desk</th>
                  <th className="py-3 px-4">Date Registered</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A24A]/10">
                {filteredPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    onClick={() => setActivePartner(partner)}
                    className="hover:bg-[#F8F0D8]/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0B4A36]">
                      {partner.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#00291E] group-hover:text-[#C9A24A] transition-colors flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-[#C9A24A]" />
                        <span>{partner.name}</span>
                      </div>
                      <div className="font-mono text-[11px] text-[#26342D]/70 flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5 text-[#C9A24A]" />
                        <span>+91 {partner.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-[#00291E] font-medium">
                        <MapPin className="w-3 h-3 text-[#C9A24A]" />
                        <span>{partner.city || 'Konkan / Mumbai'}</span>
                      </div>
                      <span className="text-[10px] text-[#26342D]/60 block mt-0.5">
                        {partner.partnerType || 'Property Consultant'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {partner.reraNumber ? (
                        <span className="font-mono text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                          {partner.reraNumber}
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#26342D]/40">Individual / N/A</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={partner.status}
                        onChange={(e) => handleStatusChange(partner.id, e.target.value as any, e)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border outline-none cursor-pointer ${getStatusColor(
                          partner.status
                        )}`}
                      >
                        {partnerStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-[#00291E]">
                      <span className="text-[11px] font-medium">{partner.assignedTo || 'Anand Pereira'}</span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#26342D]/70">
                      <div>{partner.date}</div>
                      <div className="text-[9px] text-[#26342D]/50">{partner.time}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {crmSettings.enabled && (
                          <button
                            type="button"
                            onClick={(e) => handleSyncPartnerToCRM(partner, e)}
                            className={`p-1.5 rounded transition-colors ${
                              partner.crmStatus === 'synced'
                                ? 'text-emerald-700 hover:text-emerald-900 bg-emerald-100/80'
                                : 'text-[#C9A24A] hover:text-[#00291E] bg-[#00291E]/10'
                            }`}
                            title={
                              partner.crmStatus === 'synced'
                                ? 'Synced to CRM (Click to re-send)'
                                : 'Push to CRM'
                            }
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <a
                          href={`tel:${partner.phone}`}
                          className="p-1.5 text-[#00291E] hover:text-[#C9A24A] bg-[#F8F0D8] rounded transition-colors"
                          title="Call Partner"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={(e) => handleSendWhatsApp(partner, e)}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <div
              key={partner.id}
              onClick={() => setActivePartner(partner)}
              className="bg-[#FFF8E7] rounded-xl border border-[#C9A24A]/25 p-5 shadow-sm hover:shadow-md hover:border-[#C9A24A] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] text-[#0B4A36] font-bold">
                    {partner.id}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(
                      partner.status
                    )}`}
                  >
                    {partner.status}
                  </span>
                </div>

                <h4 className="font-serif text-base text-[#00291E] font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#C9A24A] shrink-0" />
                  <span>{partner.name}</span>
                </h4>

                <div className="space-y-1.5 text-xs text-[#26342D]/80 mt-3 pt-3 border-t border-[#C9A24A]/15">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-[#C9A24A]" />
                    <span className="font-mono">+91 {partner.phone}</span>
                  </div>
                  {partner.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-[#C9A24A]" />
                      <span className="truncate">{partner.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-[#C9A24A]" />
                    <span>{partner.city || 'Territory: Konkan / Mumbai'}</span>
                  </div>
                  {partner.partnerType && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3 text-[#C9A24A]" />
                      <span className="text-[11px]">{partner.partnerType}</span>
                    </div>
                  )}
                  {partner.reraNumber && (
                    <div className="flex items-center gap-2">
                      <Award className="w-3 h-3 text-[#C9A24A]" />
                      <span className="font-mono text-[10px] text-emerald-800">
                        RERA: {partner.reraNumber}
                      </span>
                    </div>
                  )}
                </div>

                {partner.message && (
                  <p className="mt-3 p-2 bg-[#F8F0D8] rounded text-[11px] text-[#26342D]/70 italic line-clamp-2">
                    "{partner.message}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#C9A24A]/20 flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#26342D]/50">{partner.date}</span>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`tel:${partner.phone}`}
                    className="p-1.5 rounded bg-[#F8F0D8] text-[#00291E] hover:text-[#C9A24A]"
                    title="Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={(e) => handleSendWhatsApp(partner, e)}
                    className="p-1.5 rounded bg-emerald-50 text-emerald-700 hover:text-emerald-900"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. ACTIVE PARTNER DETAIL MODAL */}
      {activePartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#00291E] text-white p-6 sm:p-8 rounded-2xl border border-[#C9A24A]/40 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C9A24A] font-bold block">
                  CHANNEL PARTNER PROFILE • {activePartner.id}
                </span>
                <h3 className="font-serif text-2xl text-white font-normal mt-0.5">
                  {activePartner.name}
                </h3>
              </div>
              <button
                onClick={() => setActivePartner(null)}
                className="text-white/60 hover:text-white text-xl p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${activePartner.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#001D15] border border-white/20 text-white hover:text-[#C9A24A] text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Call +91 {activePartner.phone}</span>
              </a>

              <button
                onClick={(e) => handleSendWhatsApp(activePartner, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-800/60 border border-emerald-500/40 text-emerald-200 hover:text-white text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </button>

              {crmSettings.enabled && (
                <button
                  type="button"
                  onClick={() => handleSyncPartnerToCRM(activePartner)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#00291E] border border-[#C9A24A]/40 text-[#C9A24A] hover:text-white text-xs font-semibold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Sync to CRM</span>
                </button>
              )}
            </div>

            {/* Partner Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#001D15] p-4 rounded-xl border border-white/10">
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Operating Market</span>
                <span className="text-white font-medium">{activePartner.city || 'Mumbai / Konkan'}</span>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Category</span>
                <span className="text-white font-medium">{activePartner.partnerType || 'Broker'}</span>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Email</span>
                <span className="text-white font-medium truncate block">{activePartner.email || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">MahaRERA Number</span>
                <span className="text-[#C9A24A] font-mono font-medium">
                  {activePartner.reraNumber || 'Individual / Non-RERA'}
                </span>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Preferred Contact</span>
                <span className="text-white font-medium">{activePartner.preferredContact || 'WhatsApp'}</span>
              </div>
              <div>
                <span className="text-white/50 block text-[10px] uppercase">Registered On</span>
                <span className="text-white font-medium">
                  {activePartner.date} ({activePartner.time})
                </span>
              </div>
              {crmSettings.enabled && (
                <div className="col-span-2 pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white/50 text-[10px] uppercase">CRM Sync Status</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                      activePartner.crmStatus === 'synced'
                        ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                        : activePartner.crmStatus === 'failed'
                        ? 'bg-red-900/60 text-red-300 border border-red-500/40'
                        : 'bg-amber-900/60 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {activePartner.crmStatus === 'synced'
                      ? '✓ Synced to CRM'
                      : activePartner.crmStatus === 'failed'
                      ? `⚠️ Sync Failed${activePartner.crmError ? `: ${activePartner.crmError}` : ''}`
                      : '⏳ Pending Sync'}
                  </span>
                </div>
              )}
            </div>

            {/* Partner Inquiry Note / Message */}
            {activePartner.message && (
              <div>
                <span className="text-white/60 text-xs block mb-1">Partner Registration Notes / Focus:</span>
                <div className="p-3 bg-[#001D15] rounded-lg border border-white/10 text-xs text-white/90 leading-relaxed">
                  {activePartner.message}
                </div>
              </div>
            )}

            {/* Status & Assignment */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-medium">Assigned Partner Desk Manager:</label>
                <select
                  value={activePartner.assignedTo || 'Anand Pereira'}
                  onChange={(e) => {
                    const updated = { ...activePartner, assignedTo: e.target.value };
                    StoreService.saveLead(updated);
                    setActivePartner(updated);
                    showToast(`✓ Assigned to ${e.target.value}`);
                  }}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                >
                  <option value="Anand Pereira">Anand Pereira (Founder)</option>
                  <option value="Brijesh Pereira">Brijesh Pereira (Managing Director)</option>
                  <option value="Vikram Joshi">Vikram Joshi (Senior Sales Desk)</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-medium">Partner Status:</label>
                <select
                  value={activePartner.status}
                  onChange={(e) => handleStatusChange(activePartner.id, e.target.value as any)}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-[#DDB75C] font-semibold outline-none"
                >
                  {partnerStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Internal Manager Notes */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-white/80 text-xs font-medium">
                  Internal Channel Partner Notes (Auto-saves on blur):
                </label>
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Sent Amrutvan master plan and brochure kit. Partner has 3 active buyers from Thane seeking 4 Guntha weekend plots."
                defaultValue={activePartner.notes || ''}
                onBlur={(e) => handleSaveNotes(e.target.value)}
                className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2.5 text-xs text-white outline-none resize-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => handleDelete(activePartner.id, activePartner.name)}
                className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Partner Record</span>
              </button>

              <button
                onClick={() => setActivePartner(null)}
                className="px-5 py-2 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] rounded font-bold text-xs uppercase tracking-wider"
              >
                Close & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD NEW PARTNER MODAL */}
      {isAddPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#00291E] text-white p-6 sm:p-8 rounded-2xl border border-[#C9A24A]/40 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#C9A24A] font-bold tracking-wider">
                  Partner Intake
                </span>
                <h3 className="font-serif text-xl font-normal text-white">
                  Add New Channel Partner
                </h3>
              </div>
              <button
                onClick={() => setIsAddPartnerModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/80 block mb-1 font-medium">Partner Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Varma"
                    value={newPartnerData.name}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, name: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                  />
                </div>

                <div>
                  <label className="text-white/80 block mb-1 font-medium">Agency / Firm Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Varma Realty Associates"
                    value={newPartnerData.agency}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, agency: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/80 block mb-1 font-medium">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10 digit phone"
                    value={newPartnerData.phone}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, phone: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                  />
                </div>

                <div>
                  <label className="text-white/80 block mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    placeholder="partner@example.com"
                    value={newPartnerData.email}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, email: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/80 block mb-1 font-medium">Primary Territory</label>
                  <select
                    value={newPartnerData.city}
                    onChange={(e) => setNewPartnerData({ ...newPartnerData, city: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Navi Mumbai">Navi Mumbai</option>
                    <option value="Thane">Thane</option>
                    <option value="Pune">Pune</option>
                    <option value="Konkan (Raigad / Ratnagiri)">Konkan (Raigad / Ratnagiri)</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/80 block mb-1 font-medium">Partner Category</label>
                  <select
                    value={newPartnerData.partnerType}
                    onChange={(e) =>
                      setNewPartnerData({ ...newPartnerData, partnerType: e.target.value })
                    }
                    className="w-full bg-[#001D15] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                  >
                    <option value="Real Estate Broker">Real Estate Broker</option>
                    <option value="Property Consultant">Property Consultant</option>
                    <option value="Independent Real Estate Agent">Independent Agent</option>
                    <option value="Freelance Property Advisor">Freelance Advisor</option>
                    <option value="Referral Partner">Referral Partner</option>
                    <option value="Local Network Professional">Local Professional</option>
                    <option value="Marketing Professional">Marketing Professional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white/80 block mb-1 font-medium">MahaRERA Registration No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. A52800012345"
                  value={newPartnerData.reraNumber}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, reraNumber: e.target.value })}
                  className="w-full bg-[#001D15] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div>
                <label className="text-white/80 block mb-1 font-medium">Client Requirements / Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Interested in Amrutvan plotted layouts. Direct network in Thane."
                  value={newPartnerData.message}
                  onChange={(e) => setNewPartnerData({ ...newPartnerData, message: e.target.value })}
                  className="w-full bg-[#001D15] border border-white/20 rounded p-2 text-white outline-none focus:border-[#C9A24A]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerModalOpen(false)}
                  className="px-4 py-2 rounded text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold rounded shadow transition-all"
                >
                  Create Partner Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
