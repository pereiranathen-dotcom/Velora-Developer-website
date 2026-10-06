import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  X,
  Phone,
  MessageSquare,
  UserCheck,
  Calendar,
  Plus,
  Mail,
  User,
  MapPin,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  Check,
  ArrowRight,
  Send,
  Building,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { Lead, SiteVisitRequest } from '../../types';

export const AdminLeadsView: React.FC = () => {
  const { leads, projects, siteVisits, adminUsers } = useStore();

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [hasSiteVisitFilter, setHasSiteVisitFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [scheduleVisitForLead, setScheduleVisitForLead] = useState<Lead | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const statuses: Lead['status'][] = [
    'New',
    'Contacted',
    'Interested',
    'Site Visit',
    'Follow Up',
    'Converted',
    'Not Interested',
    'Closed',
  ];

  const sources: Lead['source'][] = [
    'Website Form',
    'WhatsApp',
    'Phone Call',
    'Social Media',
    'Other',
  ];

  // Only Customer Leads (Exclude Channel Partner leads)
  const customerLeads = useMemo(() => {
    return leads.filter((l) => l.source !== 'Channel Partner');
  }, [leads]);

  // Map of leads that have an existing site visit
  const leadSiteVisitsMap = useMemo(() => {
    const map = new Map<string, SiteVisitRequest>();
    siteVisits.forEach((visit) => {
      // match by leadId, or by clean phone number and project
      if (visit.leadId) {
        map.set(visit.leadId, visit);
      }
      const cleanVisitPhone = visit.phone.replace(/[^0-9]/g, '');
      customerLeads.forEach((l) => {
        const cleanLeadPhone = l.phone.replace(/[^0-9]/g, '');
        if (cleanLeadPhone && cleanVisitPhone === cleanLeadPhone) {
          map.set(l.id, visit);
        }
      });
    });
    return map;
  }, [siteVisits, customerLeads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return customerLeads.filter((lead) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        lead.id.toLowerCase().includes(q) ||
        lead.project.toLowerCase().includes(q) ||
        (lead.assignedTo && lead.assignedTo.toLowerCase().includes(q)) ||
        (lead.message && lead.message.toLowerCase().includes(q)) ||
        (lead.notes && lead.notes.toLowerCase().includes(q));

      const matchesProject = projectFilter === 'All' || lead.project === projectFilter;
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;

      let matchesVisit = true;
      const hasVisit = leadSiteVisitsMap.has(lead.id);
      if (hasSiteVisitFilter === 'Has Visit') {
        matchesVisit = hasVisit;
      } else if (hasSiteVisitFilter === 'No Visit') {
        matchesVisit = !hasVisit;
      }

      return matchesSearch && matchesProject && matchesStatus && matchesSource && matchesVisit;
    });
  }, [customerLeads, search, projectFilter, statusFilter, sourceFilter, hasSiteVisitFilter, leadSiteVisitsMap]);

  // KPI stats for Customer Leads
  const totalLeadsCount = customerLeads.length;
  const newLeadsCount = customerLeads.filter((l) => l.status === 'New').length;
  const siteVisitLeadsCount = customerLeads.filter((l) => l.status === 'Site Visit').length;
  const interestedLeadsCount = customerLeads.filter((l) => l.status === 'Interested' || l.status === 'Contacted').length;
  const convertedLeadsCount = customerLeads.filter((l) => l.status === 'Converted').length;

  // New Lead form state
  const [newLeadData, setNewLeadData] = useState<{
    name: string;
    phone: string;
    email: string;
    project: string;
    preferredContact: 'Call' | 'WhatsApp';
    status: Lead['status'];
    source: Lead['source'];
    assignedTo: string;
    message: string;
    notes: string;
  }>({
    name: '',
    phone: '',
    email: '',
    project: projects[0]?.name || 'Amrutvan',
    preferredContact: 'Call',
    status: 'New',
    source: 'Phone Call',
    assignedTo: 'Vikram Joshi',
    message: '',
    notes: '',
  });

  // Schedule visit form state
  const [visitScheduleData, setVisitScheduleData] = useState<{
    preferredDate: string;
    preferredTime: string;
    assignedExecutive: string;
    pickupLocation: string;
    numberOfVisitors: number;
    notes: string;
  }>({
    preferredDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    preferredTime: '11:00 AM',
    assignedExecutive: 'Anand Pereira',
    pickupLocation: 'Direct to Site Gate',
    numberOfVisitors: 2,
    notes: '',
  });

  const handleStatusChange = (id: string, newStatus: Lead['status'], e?: React.ChangeEvent<HTMLSelectElement> | React.MouseEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    StoreService.updateLeadStatus(id, newStatus);
    showToast(`✓ Lead status updated to "${newStatus}"`);
    if (activeLead && activeLead.id === id) {
      setActiveLead({ ...activeLead, status: newStatus });
    }
  };

  const handleSaveNotes = (notes: string) => {
    if (!activeLead) return;
    StoreService.updateLeadStatus(activeLead.id, activeLead.status, notes);
    setActiveLead({ ...activeLead, notes });
    showToast('✓ Advisor notes saved.');
  };

  const handleDelete = (id: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Delete lead record for "${name}"?`)) {
      StoreService.deleteLead(id);
      showToast('✓ Lead record removed.');
      if (activeLead?.id === id) setActiveLead(null);
    }
  };

  // WhatsApp quick button
  const handleSendWhatsApp = (lead: Lead, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Hello ${lead.name}, greetings from Velora Developers! We received your inquiry regarding ${lead.project} in Mandangad. How may we assist you with layout maps, pricing, or scheduling a private site visit?`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank');
  };

  // Open "Schedule Site Visit" modal for a specific lead
  const handleOpenScheduleVisitModal = (lead: Lead, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setScheduleVisitForLead(lead);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setVisitScheduleData({
      preferredDate: tomorrow.toISOString().slice(0, 10),
      preferredTime: '11:00 AM',
      assignedExecutive: lead.assignedTo || 'Anand Pereira',
      pickupLocation: 'Direct to Site Gate',
      numberOfVisitors: 2,
      notes: lead.notes || lead.message || '',
    });
  };

  // Submit Schedule Visit for Lead
  const handleConfirmScheduleVisitForLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleVisitForLead) return;

    // Create Site Visit
    const newVisit = StoreService.addSiteVisit({
      customerName: scheduleVisitForLead.name,
      phone: scheduleVisitForLead.phone,
      email: scheduleVisitForLead.email,
      project: scheduleVisitForLead.project,
      preferredDate: visitScheduleData.preferredDate,
      preferredTime: visitScheduleData.preferredTime,
      status: 'Confirmed',
      assignedExecutive: visitScheduleData.assignedExecutive,
      pickupLocation: visitScheduleData.pickupLocation,
      numberOfVisitors: Number(visitScheduleData.numberOfVisitors) || 2,
      notes: visitScheduleData.notes,
      leadId: scheduleVisitForLead.id,
    });

    // Update Lead status to Site Visit and link visit
    const updatedLead: Lead = {
      ...scheduleVisitForLead,
      status: 'Site Visit',
      siteVisitId: newVisit.id,
      notes: `${scheduleVisitForLead.notes ? scheduleVisitForLead.notes + '\n' : ''}[Site Visit Scheduled for ${visitScheduleData.preferredDate} at ${visitScheduleData.preferredTime}]`,
    };
    StoreService.saveLead(updatedLead);

    if (activeLead && activeLead.id === scheduleVisitForLead.id) {
      setActiveLead(updatedLead);
    }

    setScheduleVisitForLead(null);
    showToast(`✓ Site visit scheduled and linked to ${scheduleVisitForLead.name}!`);
  };

  // Submit Create New Lead
  const handleCreateNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.name.trim() || !newLeadData.phone.trim()) {
      alert('Lead Name and Phone Number are required.');
      return;
    }

    const created = StoreService.addLead({
      name: newLeadData.name.trim(),
      phone: newLeadData.phone.trim(),
      email: newLeadData.email.trim(),
      project: newLeadData.project,
      preferredContact: newLeadData.preferredContact,
      status: newLeadData.status,
      source: newLeadData.source,
      assignedTo: newLeadData.assignedTo,
      message: newLeadData.message.trim(),
      notes: newLeadData.notes.trim(),
    });

    setIsAddLeadModalOpen(false);
    showToast(`✓ New lead record created for ${created.name}!`);
    setNewLeadData({
      name: '',
      phone: '',
      email: '',
      project: projects[0]?.name || 'Amrutvan',
      preferredContact: 'Call',
      status: 'New',
      source: 'Phone Call',
      assignedTo: 'Vikram Joshi',
      message: '',
      notes: '',
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Lead ID',
      'Name',
      'Phone',
      'Email',
      'Project',
      'Contact Method',
      'Status',
      'Assigned To',
      'Has Site Visit',
      'Date',
      'Time',
      'Source',
      'Message',
      'Notes',
    ];

    const rows = filteredLeads.map((l) => {
      const visit = leadSiteVisitsMap.get(l.id);
      return [
        l.id,
        `"${l.name}"`,
        `"${l.phone}"`,
        `"${l.email || ''}"`,
        `"${l.project}"`,
        l.preferredContact,
        l.status,
        `"${l.assignedTo || ''}"`,
        visit ? `Yes (${visit.id} on ${visit.preferredDate})` : 'No',
        l.date,
        l.time,
        l.source || 'Website Form',
        `"${(l.message || '').replace(/"/g, '""')}"`,
        `"${(l.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `velora_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-semibold';
      case 'Contacted':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
      case 'Site Visit':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
      case 'Interested':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-semibold';
      case 'Follow Up':
        return 'bg-orange-100 text-orange-900 border-orange-300 font-semibold';
      case 'Converted':
        return 'bg-green-100 text-green-950 border-green-400 font-bold';
      case 'Not Interested':
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-300 font-medium';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
            <h2 className="font-serif text-2xl text-[#00291E]">Customer Leads CRM</h2>
            <span className="bg-[#00291E] text-[#C9A24A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#C9A24A]/40">
              Property Buyers
            </span>
          </div>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Manage genuine property buyer inquiries, assign advisors, schedule site visits directly, and track lead conversion. (Channel partner applications are kept separate in the Partner Inquiries CRM).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/30 text-[#00291E] text-xs font-medium px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#00291E]" />
            <span className="hidden sm:inline">Export</span> Leads CSV
          </button>

          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 active:scale-[0.98] text-[#00291E] font-bold text-xs tracking-wider uppercase px-4 py-2 rounded shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive KPI Stat Cards (Click to filter) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => {
            setStatusFilter('All');
            setHasSiteVisitFilter('All');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'All' && hasSiteVisitFilter === 'All'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Total Leads</span>
            <User className="w-3.5 h-3.5 text-[#C9A24A]" />
          </div>
          <div className="font-serif text-2xl font-semibold">{totalLeadsCount}</div>
          <span className="text-[10px] text-[#C9A24A] font-medium mt-1 block">Click to view all</span>
        </button>

        <button
          onClick={() => setStatusFilter('New')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'New'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>New Inquiries</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          </div>
          <div className="font-serif text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {newLeadsCount}
          </div>
          <span className="text-[10px] opacity-70 mt-1 block">Needs attention</span>
        </button>

        <button
          onClick={() => setStatusFilter('Site Visit')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Site Visit'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Site Visit Stage</span>
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-semibold text-emerald-700">
            {siteVisitLeadsCount}
          </div>
          <span className="text-[10px] opacity-70 mt-1 block">Tour booked / pending</span>
        </button>

        <button
          onClick={() => setStatusFilter('Interested')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Interested'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Interested</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="font-serif text-2xl font-semibold text-purple-700">
            {interestedLeadsCount}
          </div>
          <span className="text-[10px] opacity-70 mt-1 block">Hot prospects</span>
        </button>

        <button
          onClick={() => setStatusFilter('Converted')}
          className={`p-3.5 rounded-xl border text-left transition-all col-span-2 sm:col-span-1 ${
            statusFilter === 'Converted'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Converted</span>
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div className="font-serif text-2xl font-semibold text-green-700">
            {convertedLeadsCount}
          </div>
          <span className="text-[10px] opacity-70 mt-1 block">Booked / Plot Sold</span>
        </button>
      </div>

      {/* 3. Interactive Filter Toolbar */}
      <div className="bg-[#FFF8E7] p-4 rounded-xl border border-[#C9A24A]/30 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-[#26342D]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, email, notes, advisor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8F0D8] border border-[#C9A24A]/30 focus:border-[#C9A24A] rounded-lg text-xs text-[#00291E] outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Project Filter */}
          <div className="sm:col-span-3">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F0D8] border border-[#C9A24A]/30 rounded-lg text-xs text-[#00291E] outline-none font-medium"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F0D8] border border-[#C9A24A]/30 rounded-lg text-xs text-[#00291E] outline-none font-medium"
            >
              <option value="All">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Site Visit Link Filter */}
          <div className="sm:col-span-2">
            <select
              value={hasSiteVisitFilter}
              onChange={(e) => setHasSiteVisitFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F0D8] border border-[#C9A24A]/30 rounded-lg text-xs text-[#00291E] outline-none font-medium"
            >
              <option value="All">All Tour Links</option>
              <option value="Has Visit">Has Site Visit 🚗</option>
              <option value="No Visit">No Site Visit</option>
            </select>
          </div>
        </div>

        {/* View toggle & counts */}
        <div className="flex items-center justify-between pt-2 border-t border-[#C9A24A]/15 text-xs text-[#26342D]/70">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#00291E]">{filteredLeads.length}</strong> of{' '}
              {totalLeadsCount} leads
            </span>
            {(search || projectFilter !== 'All' || statusFilter !== 'All' || hasSiteVisitFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setProjectFilter('All');
                  setStatusFilter('All');
                  setHasSiteVisitFilter('All');
                  setSourceFilter('All');
                }}
                className="text-[11px] text-[#C9A24A] font-semibold hover:underline ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#F8F0D8] p-0.5 rounded-lg border border-[#C9A24A]/20">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-[#00291E] text-white shadow-xs'
                  : 'text-[#26342D]/70 hover:text-[#00291E]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                viewMode === 'cards'
                  ? 'bg-[#00291E] text-white shadow-xs'
                  : 'text-[#26342D]/70 hover:text-[#00291E]'
              }`}
              title="Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Leads Table or Cards View */}
      {filteredLeads.length === 0 ? (
        <div className="bg-[#FFF8E7] rounded-xl border border-[#C9A24A]/25 p-12 text-center shadow-sm">
          <User className="w-12 h-12 text-[#C9A24A]/60 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-[#00291E]">No leads found</h3>
          <p className="text-xs text-[#26342D]/70 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new customer lead record directly.
          </p>
          <button
            onClick={() => setIsAddLeadModalOpen(true)}
            className="mt-4 bg-[#00291E] hover:bg-[#003D2B] text-white text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>Add New Lead</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-[#FFF8E7] rounded-xl border border-[#C9A24A]/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#C9A24A]/20 bg-[#F8F0D8] text-[#26342D]/70 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Lead ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Site Visit Link</th>
                  <th className="py-3 px-4">Assigned Advisor</th>
                  <th className="py-3 px-4">Date / Source</th>
                  <th className="py-3 px-4 text-right">Quick Interactive Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A24A]/10">
                {filteredLeads.map((lead) => {
                  const associatedVisit = leadSiteVisitsMap.get(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setActiveLead(lead)}
                      className="hover:bg-[#F8F0D8]/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0B4A36]">
                        {lead.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#00291E] group-hover:text-[#C9A24A] transition-colors">
                          {lead.name}
                        </div>
                        <div className="font-mono text-[11px] text-[#26342D]/70 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-[#C9A24A]" />
                          {lead.phone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[#003D2B]">
                        <span className="bg-[#C9A24A]/20 px-2 py-0.5 rounded text-[11px]">
                          {lead.project}
                        </span>
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as any, e)}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border outline-none cursor-pointer ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {statuses.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Site Visit Status / Button */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        {associatedVisit ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded text-[11px]">
                            <Calendar className="w-3 h-3 text-emerald-600" />
                            <span className="font-medium">
                              {associatedVisit.preferredDate} ({associatedVisit.status})
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleOpenScheduleVisitModal(lead, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#00291E] hover:bg-[#003D2B] text-[#DDB75C] font-semibold rounded text-[10px] border border-[#C9A24A]/40 shadow-xs transition-transform active:scale-95"
                          >
                            <Calendar className="w-3 h-3 text-[#C9A24A]" />
                            <span>Book Visit</span>
                          </button>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#26342D]/80">
                        {lead.assignedTo || 'Unassigned'}
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-[#26342D]/70 whitespace-nowrap">
                        <div>{lead.date}</div>
                        <div className="text-[9px] text-[#26342D]/50">{lead.source || 'Website'}</div>
                      </td>

                      {/* Interactive Action Buttons */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Call Button */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 text-[#00291E] hover:text-[#C9A24A] bg-[#F8F0D8] rounded transition-colors"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* WhatsApp Button */}
                          <button
                            type="button"
                            onClick={(e) => handleSendWhatsApp(lead, e)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          {/* Schedule Tour Button */}
                          <button
                            type="button"
                            onClick={(e) => handleOpenScheduleVisitModal(lead, e)}
                            className="p-1.5 text-[#00291E] hover:text-[#C9A24A] bg-[#F8F0D8] rounded transition-colors"
                            title="Schedule / Edit Site Visit"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>

                          {/* View & Notes */}
                          <button
                            type="button"
                            onClick={() => setActiveLead(lead)}
                            className="p-1.5 text-[#00291E] hover:text-[#C9A24A] bg-[#F8F0D8] rounded transition-colors"
                            title="View Details & Notes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={(e) => handleDelete(lead.id, lead.name, e)}
                            className="p-1.5 text-red-600 hover:text-red-800 bg-[#F8F0D8] rounded transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLeads.map((lead) => {
            const associatedVisit = leadSiteVisitsMap.get(lead.id);

            return (
              <div
                key={lead.id}
                onClick={() => setActiveLead(lead)}
                className="bg-[#FFF8E7] hover:bg-[#FDF6E2] rounded-xl border-2 border-[#C9A24A]/30 hover:border-[#C9A24A] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-[#0B4A36] bg-[#F8F0D8] px-2 py-0.5 rounded border border-[#C9A24A]/20">
                      {lead.id}
                    </span>

                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as any, e)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border outline-none cursor-pointer ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg text-[#00291E] font-semibold group-hover:text-[#C9A24A] transition-colors">
                    {lead.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#003D2B] bg-[#C9A24A]/20 px-2 py-0.5 rounded">
                      {lead.project}
                    </span>
                    <span className="text-[10px] text-[#26342D]/60 bg-[#F8F0D8] px-1.5 py-0.5 rounded">
                      Source: {lead.source || 'Website'}
                    </span>
                  </div>

                  {/* Site visit badge in card */}
                  <div className="mt-3">
                    {associatedVisit ? (
                      <div className="p-2 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-950 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-semibold">Visit: {associatedVisit.preferredDate}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase">{associatedVisit.status}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleOpenScheduleVisitModal(lead, e)}
                        className="w-full py-1.5 bg-[#00291E] hover:bg-[#003D2B] text-[#DDB75C] font-semibold text-xs rounded border border-[#C9A24A]/40 flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#C9A24A]" />
                        <span>Schedule Site Visit</span>
                      </button>
                    )}
                  </div>

                  {/* Contact info */}
                  <div className="mt-3 space-y-1.5 text-xs text-[#26342D]/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[#26342D]/60 text-[11px]">Phone:</span>
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono font-medium text-[#00291E] hover:text-[#C9A24A] flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-[#C9A24A]" />
                        {lead.phone}
                      </a>
                    </div>

                    {lead.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#26342D]/60 text-[11px]">Email:</span>
                        <a
                          href={`mailto:${lead.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-[#26342D] hover:text-[#C9A24A] truncate max-w-[180px] flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3 text-[#C9A24A]" />
                          {lead.email}
                        </a>
                      </div>
                    )}

                    {lead.assignedTo && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#C9A24A]/15 text-[11px]">
                        <span className="text-[#26342D]/60">Advisor:</span>
                        <span className="font-semibold text-[#00291E]">{lead.assignedTo}</span>
                      </div>
                    )}

                    {lead.message && (
                      <div className="p-2 bg-[#F8F0D8] rounded text-[11px] text-[#26342D]/90 border border-[#C9A24A]/15 mt-2 line-clamp-2">
                        <span className="text-[#00291E] font-semibold block text-[10px]">Inquiry:</span>
                        {lead.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="mt-4 pt-3 border-t border-[#C9A24A]/20 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <a
                      href={`tel:${lead.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-[#00291E] hover:bg-[#003D2B] text-[#C9A24A] rounded transition-colors"
                      title="Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={(e) => handleSendWhatsApp(lead, e)}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveLead(lead)}
                      className="p-1.5 bg-[#F8F0D8] hover:bg-[#C9A24A]/20 text-[#00291E] rounded transition-colors border border-[#C9A24A]/30"
                      title="View & Notes"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(lead.id, lead.name, e)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. LEAD DETAIL & NOTES MODAL */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#00291E] text-white p-6 sm:p-7 rounded-xl border border-[#C9A24A]/40 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#C9A24A] font-semibold tracking-wider">
                  {activeLead.id} · {activeLead.source || 'Website'}
                </span>
                <h3 className="font-serif text-xl text-white font-medium">{activeLead.name}</h3>
              </div>
              <button
                onClick={() => setActiveLead(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick action buttons banner */}
            <div className="flex items-center gap-2 p-2.5 bg-[#001D15] rounded-lg border border-white/10">
              <a
                href={`tel:${activeLead.phone}`}
                className="flex-1 bg-[#00291E] hover:bg-[#003D2B] text-[#DDB75C] py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#C9A24A]/30 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Call ({activeLead.phone})</span>
              </a>

              <button
                type="button"
                onClick={() => handleSendWhatsApp(activeLead)}
                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenScheduleVisitModal(activeLead)}
                className="flex-1 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Visit</span>
              </button>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/50 block">Phone</span>
                <a href={`tel:${activeLead.phone}`} className="text-[#C9A24A] font-bold font-mono">
                  {activeLead.phone}
                </a>
              </div>
              <div>
                <span className="text-white/50 block">Email</span>
                <span className="text-white/90 truncate block">
                  {activeLead.email || 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-white/50 block">Project Interested</span>
                <span className="text-white font-medium">{activeLead.project}</span>
              </div>
              <div>
                <span className="text-white/50 block">Preferred Contact</span>
                <span className="text-white font-medium">{activeLead.preferredContact}</span>
              </div>
            </div>

            {/* Customer Requirement Message */}
            <div>
              <span className="text-white/50 text-xs block mb-1">Customer Inquiry:</span>
              <p className="bg-[#001D15] p-3 rounded text-xs text-white/90 leading-relaxed border border-white/10">
                {activeLead.message || 'No specific requirement message recorded.'}
              </p>
            </div>

            {/* Advisor Assigned & Status row */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-white/70 block mb-1 font-medium">Assigned Advisor:</label>
                <select
                  value={activeLead.assignedTo || 'Unassigned'}
                  onChange={(e) => {
                    const updated = { ...activeLead, assignedTo: e.target.value };
                    StoreService.saveLead(updated);
                    setActiveLead(updated);
                    showToast(`✓ Assigned to ${e.target.value}`);
                  }}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                >
                  <option value="Anand Pereira">Anand Pereira (Founder)</option>
                  <option value="Brijesh Pereira">Brijesh Pereira (Managing Director)</option>
                  <option value="Vikram Joshi">Vikram Joshi (Senior Sales)</option>
                  <option value="Sunita Rao">Sunita Rao (Site Coordinator)</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/70 block mb-1 font-medium">Update Status:</label>
                <select
                  value={activeLead.status}
                  onChange={(e) => handleStatusChange(activeLead.id, e.target.value as any)}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-[#DDB75C] font-semibold outline-none"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advisor Internal Notes */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-white/80 text-xs font-medium">
                  Advisor Internal Notes & Next Steps:
                </label>
                <span className="text-[10px] text-white/40">Auto-saves on blur</span>
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Called customer on 2 Oct; scheduled site visit for Sunday at 11am."
                defaultValue={activeLead.notes || ''}
                onBlur={(e) => handleSaveNotes(e.target.value)}
                className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2.5 text-xs text-white outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => handleDelete(activeLead.id, activeLead.name)}
                className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <button
                onClick={() => setActiveLead(null)}
                className="px-5 py-2 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] rounded font-bold text-xs uppercase tracking-wider"
              >
                Close & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD NEW LEAD MODAL */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#00291E] text-white p-6 sm:p-7 rounded-xl border border-[#C9A24A]/40 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#C9A24A] font-semibold tracking-wider">
                  Lead Intake
                </span>
                <h3 className="font-serif text-xl text-white font-medium">Record New Customer Lead</h3>
              </div>
              <button
                onClick={() => setIsAddLeadModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    placeholder="e.g. 98220 12345"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    placeholder="ramesh@gmail.com"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Select Project</label>
                  <select
                    value={newLeadData.project}
                    onChange={(e) => setNewLeadData({ ...newLeadData, project: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none font-semibold text-[#C9A24A]"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Lead Source</label>
                  <select
                    value={newLeadData.source}
                    onChange={(e) => setNewLeadData({ ...newLeadData, source: e.target.value as any })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  >
                    {sources.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Initial Status</label>
                  <select
                    value={newLeadData.status}
                    onChange={(e) => setNewLeadData({ ...newLeadData, status: e.target.value as any })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Preferred Contact</label>
                  <select
                    value={newLeadData.preferredContact}
                    onChange={(e) =>
                      setNewLeadData({ ...newLeadData, preferredContact: e.target.value as any })
                    }
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  >
                    <option value="Call">Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-1">Assign Property Advisor</label>
                <select
                  value={newLeadData.assignedTo}
                  onChange={(e) => setNewLeadData({ ...newLeadData, assignedTo: e.target.value })}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                >
                  <option value="Anand Pereira">Anand Pereira (Founder)</option>
                  <option value="Brijesh Pereira">Brijesh Pereira (Managing Director)</option>
                  <option value="Vikram Joshi">Vikram Joshi (Senior Sales)</option>
                  <option value="Sunita Rao">Sunita Rao (Site Coordinator)</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-1">Inquiry Requirements / Message</label>
                <textarea
                  rows={2}
                  value={newLeadData.message}
                  onChange={(e) => setNewLeadData({ ...newLeadData, message: e.target.value })}
                  placeholder="e.g. Inquired about 4 Guntha plot on Pandharpur Road."
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 text-[#00291E] rounded font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. SCHEDULE SITE VISIT FOR LEAD MODAL */}
      {scheduleVisitForLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#00291E] text-white p-6 sm:p-7 rounded-xl border border-[#C9A24A]/40 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#C9A24A] font-semibold tracking-wider">
                  Convert Lead to Site Visit · {scheduleVisitForLead.id}
                </span>
                <h3 className="font-serif text-xl text-white font-medium">
                  Book Visit for {scheduleVisitForLead.name}
                </h3>
              </div>
              <button
                onClick={() => setScheduleVisitForLead(null)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#001D15] rounded-lg border border-white/10 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-white/60">Phone:</span>
                <span className="font-mono text-[#C9A24A] font-semibold">{scheduleVisitForLead.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Project:</span>
                <span className="text-white font-medium">{scheduleVisitForLead.project}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmScheduleVisitForLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={visitScheduleData.preferredDate}
                    onChange={(e) =>
                      setVisitScheduleData({ ...visitScheduleData, preferredDate: e.target.value })
                    }
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Time Slot</label>
                  <select
                    value={visitScheduleData.preferredTime}
                    onChange={(e) =>
                      setVisitScheduleData({ ...visitScheduleData, preferredTime: e.target.value })
                    }
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  >
                    <option value="10:00 AM">10:00 AM (Morning)</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM (Sunset)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Assign Property Advisor</label>
                  <select
                    value={visitScheduleData.assignedExecutive}
                    onChange={(e) =>
                      setVisitScheduleData({
                        ...visitScheduleData,
                        assignedExecutive: e.target.value,
                      })
                    }
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  >
                    <option value="Anand Pereira">Anand Pereira (Founder)</option>
                    <option value="Brijesh Pereira">Brijesh Pereira (Managing Director)</option>
                    <option value="Vikram Joshi">Vikram Joshi (Senior Sales)</option>
                    <option value="Sunita Rao">Sunita Rao (Site Coordinator)</option>
                    {adminUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Pickup / Meeting Point</label>
                  <input
                    type="text"
                    value={visitScheduleData.pickupLocation}
                    onChange={(e) =>
                      setVisitScheduleData({ ...visitScheduleData, pickupLocation: e.target.value })
                    }
                    placeholder="e.g. Direct Site Gate"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-1">Visit Notes & Logistics</label>
                <textarea
                  rows={2}
                  value={visitScheduleData.notes}
                  onChange={(e) =>
                    setVisitScheduleData({ ...visitScheduleData, notes: e.target.value })
                  }
                  placeholder="e.g. Pick up at bus stand; coordinate keys with site manager."
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setScheduleVisitForLead(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 text-[#00291E] rounded font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Confirm & Link Visit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
