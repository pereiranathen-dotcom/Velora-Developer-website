import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  User,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Users,
  Car,
  Download,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Radio,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { SiteVisitRequest, Lead } from '../../types';
import { CRMService } from '../../services/crmService';

export const AdminSiteVisitsView: React.FC = () => {
  const { siteVisits, projects, leads, adminUsers, crmSettings } = useStore();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal states
  const [selectedVisit, setSelectedVisit] = useState<SiteVisitRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSyncVisitToCRM = async (visit: SiteVisitRequest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!crmSettings.enabled || !crmSettings.webhookUrl?.trim()) {
      showToast('⚠️ Please configure and enable CRM Webhook in Settings first.');
      return;
    }
    showToast(`Dispatching site visit for "${visit.customerName}" to CRM...`);
    const res = await CRMService.dispatchSiteVisit(visit);
    if (res.success) {
      showToast(`✓ Site visit for "${visit.customerName}" forwarded to CRM!`);
    } else {
      showToast(`CRM Notice: ${res.message}`);
    }
  };

  // Form state for creating / editing a site visit
  const [formData, setFormData] = useState<{
    id?: string;
    customerName: string;
    phone: string;
    email: string;
    project: string;
    preferredDate: string;
    preferredTime: string;
    status: SiteVisitRequest['status'];
    notes: string;
    assignedExecutive: string;
    pickupLocation: string;
    numberOfVisitors: number;
    createMatchingLead: boolean;
  }>({
    customerName: '',
    phone: '',
    email: '',
    project: projects[0]?.name || 'Amrutvan',
    preferredDate: new Date().toISOString().slice(0, 10),
    preferredTime: '11:00 AM',
    status: 'Requested',
    notes: '',
    assignedExecutive: 'Anand Pereira',
    pickupLocation: 'Direct to Site Gate',
    numberOfVisitors: 2,
    createMatchingLead: true,
  });

  // Filtered visits
  const filteredVisits = useMemo(() => {
    return siteVisits.filter((visit) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        visit.customerName.toLowerCase().includes(q) ||
        visit.phone.includes(q) ||
        (visit.email && visit.email.toLowerCase().includes(q)) ||
        visit.id.toLowerCase().includes(q) ||
        visit.project.toLowerCase().includes(q) ||
        (visit.notes && visit.notes.toLowerCase().includes(q)) ||
        (visit.assignedExecutive && visit.assignedExecutive.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'All' || visit.status === statusFilter;
      const matchesProject = projectFilter === 'All' || visit.project === projectFilter;

      let matchesDate = true;
      const todayStr = new Date().toISOString().slice(0, 10);
      if (dateFilter === 'Today') {
        matchesDate = visit.preferredDate === todayStr;
      } else if (dateFilter === 'Upcoming') {
        matchesDate = visit.preferredDate >= todayStr && visit.status !== 'Completed' && visit.status !== 'Cancelled';
      } else if (dateFilter === 'Past') {
        matchesDate = visit.preferredDate < todayStr || visit.status === 'Completed';
      }

      return matchesSearch && matchesStatus && matchesProject && matchesDate;
    });
  }, [siteVisits, searchTerm, statusFilter, projectFilter, dateFilter]);

  // Counts for KPIs
  const totalCount = siteVisits.length;
  const requestedCount = siteVisits.filter((s) => s.status === 'Requested').length;
  const confirmedCount = siteVisits.filter((s) => s.status === 'Confirmed').length;
  const completedCount = siteVisits.filter((s) => s.status === 'Completed').length;
  const cancelledCount = siteVisits.filter((s) => s.status === 'Cancelled').length;

  const getStatusBadge = (status: SiteVisitRequest['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
      case 'Requested':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-semibold animate-pulse';
      case 'Completed':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-semibold';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-300 font-medium';
    }
  };

  const handleStatusChange = (id: string, status: SiteVisitRequest['status'], e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    StoreService.updateSiteVisitStatus(id, status);
    showToast(`✓ Site visit status updated to ${status}`);
    if (selectedVisit && selectedVisit.id === id) {
      setSelectedVisit({ ...selectedVisit, status });
    }
  };

  const handleDelete = (id: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the site visit request for "${name}"?`)) {
      StoreService.deleteSiteVisit(id);
      showToast(`✓ Site visit record deleted.`);
      if (selectedVisit?.id === id) {
        setSelectedVisit(null);
        setIsEditModalOpen(false);
      }
    }
  };

  const handleOpenAddModal = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    setFormData({
      customerName: '',
      phone: '',
      email: '',
      project: projects[0]?.name || 'Amrutvan',
      preferredDate: tomorrowStr,
      preferredTime: '11:00 AM',
      status: 'Confirmed',
      notes: '',
      assignedExecutive: adminUsers[0]?.name || 'Anand Pereira',
      pickupLocation: 'Direct to Site Gate',
      numberOfVisitors: 2,
      createMatchingLead: true,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (visit: SiteVisitRequest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedVisit(visit);
    setFormData({
      id: visit.id,
      customerName: visit.customerName,
      phone: visit.phone,
      email: visit.email || '',
      project: visit.project,
      preferredDate: visit.preferredDate,
      preferredTime: visit.preferredTime,
      status: visit.status,
      notes: visit.notes || '',
      assignedExecutive: visit.assignedExecutive || 'Anand Pereira',
      pickupLocation: visit.pickupLocation || 'Direct to Site Gate',
      numberOfVisitors: visit.numberOfVisitors || 2,
      createMatchingLead: false,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.preferredDate) {
      alert('Customer Name, Phone Number, and Date are required.');
      return;
    }

    if (formData.id) {
      // Edit existing
      const updated: SiteVisitRequest = {
        id: formData.id,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        project: formData.project,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        status: formData.status,
        notes: formData.notes.trim() || undefined,
        assignedExecutive: formData.assignedExecutive,
        pickupLocation: formData.pickupLocation,
        numberOfVisitors: Number(formData.numberOfVisitors) || 2,
        createdAt: selectedVisit?.createdAt || new Date().toISOString().replace('T', ' ').slice(0, 16),
      };

      StoreService.saveSiteVisit(updated);
      setSelectedVisit(updated);
      setIsEditModalOpen(false);
      showToast(`✓ Site visit for ${updated.customerName} updated!`);
    } else {
      // Create new
      const newVisit = StoreService.addSiteVisit({
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        project: formData.project,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        status: formData.status,
        notes: formData.notes.trim() || undefined,
        assignedExecutive: formData.assignedExecutive,
        pickupLocation: formData.pickupLocation,
        numberOfVisitors: Number(formData.numberOfVisitors) || 2,
      });

      // Optionally sync to Leads CRM
      if (formData.createMatchingLead) {
        StoreService.addLead({
          name: formData.customerName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          project: formData.project,
          preferredContact: 'Call',
          status: 'Site Visit',
          source: 'Phone Call',
          message: `Scheduled site visit for ${formData.preferredDate} at ${formData.preferredTime}. Pickup: ${formData.pickupLocation}. Notes: ${formData.notes || 'None'}`,
          siteVisitId: newVisit.id,
          assignedTo: formData.assignedExecutive,
        });
      }

      setIsAddModalOpen(false);
      showToast(`✓ New site visit booked for ${newVisit.customerName}!`);
    }
  };

  // WhatsApp quick trigger
  const handleSendWhatsApp = (visit: SiteVisitRequest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cleanPhone = visit.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Hello ${visit.customerName}, greeting from Velora Developers! This is regarding your site visit to ${visit.project} in Mandangad scheduled for ${visit.preferredDate} at ${visit.preferredTime}. Please let us know if you need location directions or travel assistance.`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Visit ID',
      'Customer Name',
      'Phone',
      'Email',
      'Project',
      'Visit Date',
      'Visit Time',
      'Status',
      'Assigned Executive',
      'Pickup Location',
      'Visitors Count',
      'Notes',
      'Booked On',
    ];

    const rows = filteredVisits.map((v) => [
      v.id,
      `"${v.customerName}"`,
      `"${v.phone}"`,
      `"${v.email || ''}"`,
      `"${v.project}"`,
      v.preferredDate,
      v.preferredTime,
      v.status,
      `"${v.assignedExecutive || ''}"`,
      `"${v.pickupLocation || ''}"`,
      v.numberOfVisitors || 2,
      `"${(v.notes || '').replace(/"/g, '""')}"`,
      v.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `velora_site_visits_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <h2 className="font-serif text-2xl text-[#00291E]">Site Visit Requests & Tours</h2>
            <span className="bg-[#00291E] text-[#C9A24A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#C9A24A]/40">
              Interactive Dispatch
            </span>
          </div>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Schedule, manage, call, WhatsApp, and coordinate prospective buyer site visits to Amrutvan & Green Opulence in Mandangad.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/30 text-[#00291E] text-xs font-medium px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#00291E]" />
            <span className="hidden sm:inline">Export</span> CSV
          </button>

          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 active:scale-[0.98] text-[#00291E] font-bold text-xs tracking-wider uppercase px-4 py-2 rounded shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Site Visit</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive KPI Stat Cards (Click to filter) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => {
            setStatusFilter('All');
            setDateFilter('All');
          }}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'All' && dateFilter === 'All'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Total Visits</span>
            <Users className="w-3.5 h-3.5 text-[#C9A24A]" />
          </div>
          <div className="font-serif text-2xl font-semibold">{totalCount}</div>
          <span className="text-[10px] text-[#C9A24A] font-medium mt-1 block">Click to view all</span>
        </button>

        <button
          onClick={() => setStatusFilter('Requested')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Requested'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Requested</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          </div>
          <div className="font-serif text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {requestedCount}
          </div>
          <span className="text-[10px] opacity-70 mt-1 block">Awaiting confirmation</span>
        </button>

        <button
          onClick={() => setStatusFilter('Confirmed')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Confirmed'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Confirmed</span>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="font-serif text-2xl font-semibold text-emerald-700">
            {confirmedCount}
          </div>
          <span className="text-[10px] opacity-70 mt-1 block">Scheduled & active</span>
        </button>

        <button
          onClick={() => setStatusFilter('Completed')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Completed'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Completed</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="font-serif text-2xl font-semibold text-purple-700">
            {completedCount}
          </div>
          <span className="text-[10px] opacity-70 mt-1 block">Tours finished</span>
        </button>

        <button
          onClick={() => setStatusFilter('Cancelled')}
          className={`p-3.5 rounded-xl border text-left transition-all col-span-2 sm:col-span-1 ${
            statusFilter === 'Cancelled'
              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/50'
              : 'bg-[#FFF8E7] hover:bg-[#F8F0D8] border-[#C9A24A]/25 text-[#00291E]'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-80 mb-1">
            <span>Cancelled</span>
            <X className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <div className="font-serif text-2xl font-semibold text-gray-500">
            {cancelledCount}
          </div>
          <span className="text-[10px] opacity-70 mt-1 block">Inactive / Dropped</span>
        </button>
      </div>

      {/* 3. Interactive Search, Filter & View Controls */}
      <div className="bg-[#FFF8E7] p-4 rounded-xl border border-[#C9A24A]/30 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-[#26342D]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone, notes, ID, executive..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8F0D8] border border-[#C9A24A]/30 focus:border-[#C9A24A] rounded-lg text-xs text-[#00291E] outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Project filter */}
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

          {/* Status filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F0D8] border border-[#C9A24A]/30 rounded-lg text-xs text-[#00291E] outline-none font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Requested">Requested</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date filter */}
          <div className="sm:col-span-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#F8F0D8] border border-[#C9A24A]/30 rounded-lg text-xs text-[#00291E] outline-none font-medium"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today's Visits</option>
              <option value="Upcoming">Upcoming (Active)</option>
              <option value="Past">Past / Completed</option>
            </select>
          </div>
        </div>

        {/* View mode toggle & Results count */}
        <div className="flex items-center justify-between pt-2 border-t border-[#C9A24A]/15 text-xs text-[#26342D]/70">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#00291E]">{filteredVisits.length}</strong> of{' '}
              {totalCount} site visits
            </span>
            {(searchTerm || statusFilter !== 'All' || projectFilter !== 'All' || dateFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                  setProjectFilter('All');
                  setDateFilter('All');
                }}
                className="text-[11px] text-[#C9A24A] font-semibold hover:underline ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#F8F0D8] p-0.5 rounded-lg border border-[#C9A24A]/20">
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
          </div>
        </div>
      </div>

      {/* 4. Visits Display (Cards View or Table View) */}
      {filteredVisits.length === 0 ? (
        <div className="bg-[#FFF8E7] rounded-xl border border-[#C9A24A]/25 p-12 text-center shadow-sm">
          <Calendar className="w-12 h-12 text-[#C9A24A]/60 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-[#00291E]">No site visits match criteria</h3>
          <p className="text-xs text-[#26342D]/70 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, status or project filters, or schedule a new site visit directly.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 bg-[#00291E] hover:bg-[#003D2B] text-white text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>Schedule New Site Visit</span>
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVisits.map((visit) => {
            const todayStr = new Date().toISOString().slice(0, 10);
            const isToday = visit.preferredDate === todayStr;

            return (
              <div
                key={visit.id}
                onClick={() => handleOpenEditModal(visit)}
                className="bg-[#FFF8E7] hover:bg-[#FDF6E2] rounded-xl border-2 border-[#C9A24A]/30 hover:border-[#C9A24A] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group relative"
              >
                <div>
                  {/* Top card bar: ID, today badge, status dropdown */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold text-[#0B4A36] bg-[#F8F0D8] px-2 py-0.5 rounded border border-[#C9A24A]/20">
                        {visit.id}
                      </span>
                      {isToday && (
                        <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider animate-bounce">
                          TODAY
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={visit.status}
                        onChange={(e) =>
                          handleStatusChange(visit.id, e.target.value as SiteVisitRequest['status'])
                        }
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border outline-none cursor-pointer ${getStatusBadge(
                          visit.status
                        )}`}
                      >
                        <option value="Requested">Requested</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Name & Project */}
                  <h3 className="font-serif text-lg text-[#00291E] font-semibold group-hover:text-[#C9A24A] transition-colors leading-snug">
                    {visit.customerName}
                  </h3>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#003D2B] bg-[#C9A24A]/20 px-2 py-0.5 rounded border border-[#C9A24A]/30 inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#00291E]" />
                      {visit.project}
                    </span>
                    {visit.numberOfVisitors && (
                      <span className="text-[10px] text-[#26342D]/70 bg-[#F8F0D8] px-1.5 py-0.5 rounded">
                        👥 {visit.numberOfVisitors} Pax
                      </span>
                    )}
                  </div>

                  {/* Date & Time pill */}
                  <div className="mt-3.5 p-2.5 bg-[#F8F0D8] rounded-lg border border-[#C9A24A]/25 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#00291E] font-medium">
                      <Calendar className="w-4 h-4 text-[#C9A24A]" />
                      <span>{visit.preferredDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#26342D]/80 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-[#C9A24A]" />
                      <span>{visit.preferredTime}</span>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="mt-3 space-y-1.5 text-xs text-[#26342D]/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[#26342D]/60 text-[11px]">Phone:</span>
                      <a
                        href={`tel:${visit.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono font-medium text-[#00291E] hover:text-[#C9A24A] flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-[#C9A24A]" />
                        {visit.phone}
                      </a>
                    </div>

                    {visit.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#26342D]/60 text-[11px]">Email:</span>
                        <a
                          href={`mailto:${visit.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] text-[#26342D] hover:text-[#C9A24A] truncate max-w-[180px] flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3 text-[#C9A24A]" />
                          {visit.email}
                        </a>
                      </div>
                    )}

                    {visit.assignedExecutive && (
                      <div className="flex items-center justify-between pt-1 border-t border-[#C9A24A]/15 text-[11px]">
                        <span className="text-[#26342D]/60">Advisor:</span>
                        <span className="font-semibold text-[#00291E] flex items-center gap-1">
                          <User className="w-3 h-3 text-[#C9A24A]" />
                          {visit.assignedExecutive}
                        </span>
                      </div>
                    )}

                    {visit.pickupLocation && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#26342D]/60">Pickup:</span>
                        <span className="text-[#00291E] truncate max-w-[180px] flex items-center gap-1">
                          <Car className="w-3 h-3 text-[#C9A24A]" />
                          {visit.pickupLocation}
                        </span>
                      </div>
                    )}

                    {visit.notes && (
                      <div className="p-2 bg-[#001D15] text-white rounded text-[11px] border border-[#C9A24A]/30 mt-2 line-clamp-2">
                        <span className="text-[#C9A24A] font-semibold block text-[10px]">Notes:</span>
                        {visit.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Interactive Action Bar */}
                <div className="mt-4 pt-3 border-t border-[#C9A24A]/20 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* Instant Call */}
                    <a
                      href={`tel:${visit.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-[#00291E] hover:bg-[#003D2B] text-[#C9A24A] rounded transition-colors"
                      title="Direct Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    {/* Instant WhatsApp */}
                    <button
                      onClick={(e) => handleSendWhatsApp(visit, e)}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      title="Send WhatsApp Message"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* View / Edit */}
                    <button
                      onClick={(e) => handleOpenEditModal(visit, e)}
                      className="p-1.5 bg-[#F8F0D8] hover:bg-[#C9A24A]/20 text-[#00291E] rounded transition-colors border border-[#C9A24A]/30"
                      title="Edit / Reschedule"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {visit.status === 'Requested' && (
                      <button
                        onClick={(e) => handleStatusChange(visit.id, 'Confirmed', e)}
                        className="px-2.5 py-1 bg-[#00291E] hover:bg-[#003D2B] text-[#DDB75C] font-semibold text-[10px] rounded border border-[#C9A24A]/40 flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3 h-3 text-[#C9A24A]" />
                        <span>Confirm</span>
                      </button>
                    )}

                    {visit.status === 'Confirmed' && (
                      <button
                        onClick={(e) => handleStatusChange(visit.id, 'Completed', e)}
                        className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-[10px] rounded flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Mark Done</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDelete(visit.id, visit.customerName, e)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete Visit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#FFF8E7] rounded-xl border border-[#C9A24A]/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#C9A24A]/20 bg-[#F8F0D8] text-[#26342D]/70 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Visit ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Scheduled Date & Time</th>
                  <th className="py-3 px-4">Executive / Pickup</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A24A]/10">
                {filteredVisits.map((visit) => (
                  <tr
                    key={visit.id}
                    onClick={() => handleOpenEditModal(visit)}
                    className="hover:bg-[#F8F0D8]/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0B4A36]">
                      {visit.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#00291E]">{visit.customerName}</div>
                      <div className="font-mono text-[11px] text-[#26342D]/70 flex items-center gap-1">
                        <Phone className="w-2.5 h-2.5 text-[#C9A24A]" />
                        {visit.phone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#003D2B]">
                      <span className="bg-[#C9A24A]/20 px-2 py-0.5 rounded text-[11px]">
                        {visit.project}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#00291E] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#C9A24A]" />
                        {visit.preferredDate}
                      </div>
                      <div className="text-[10px] text-[#26342D]/60 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#C9A24A]" />
                        {visit.preferredTime}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[11px]">
                      <div>{visit.assignedExecutive || 'Unassigned'}</div>
                      <div className="text-[10px] text-[#26342D]/60 truncate max-w-[140px]">
                        {visit.pickupLocation || 'Direct Gate'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={visit.status}
                        onChange={(e) =>
                          handleStatusChange(visit.id, e.target.value as SiteVisitRequest['status'])
                        }
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border outline-none cursor-pointer ${getStatusBadge(
                          visit.status
                        )}`}
                      >
                        <option value="Requested">Requested</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${visit.phone}`}
                          className="p-1.5 text-[#00291E] hover:text-[#C9A24A] bg-[#F8F0D8] rounded transition-colors"
                          title="Call"
                        >
                          <Phone className="w-3 h-3" />
                        </a>
                        <button
                          onClick={(e) => handleSendWhatsApp(visit, e)}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 rounded transition-colors"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleOpenEditModal(visit, e)}
                          className="p-1.5 text-[#00291E] hover:text-[#C9A24A] bg-[#F8F0D8] rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(visit.id, visit.customerName, e)}
                          className="p-1.5 text-red-600 hover:text-red-800 bg-[#F8F0D8] rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. EDIT & RESCHEDULE MODAL */}
      {isEditModalOpen && selectedVisit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#00291E] text-white p-6 sm:p-7 rounded-xl border border-[#C9A24A]/40 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#C9A24A] font-semibold tracking-wider">
                  Site Visit Management · {selectedVisit.id}
                </span>
                <h3 className="font-serif text-xl text-white font-medium">
                  {selectedVisit.customerName}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Ribbon */}
            <div className="flex items-center gap-2 p-2.5 bg-[#001D15] rounded-lg border border-white/10">
              <a
                href={`tel:${formData.phone}`}
                className="flex-1 bg-[#00291E] hover:bg-[#003D2B] text-[#DDB75C] py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#C9A24A]/30 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Call ({formData.phone})</span>
              </a>

              <button
                type="button"
                onClick={() => handleSendWhatsApp(selectedVisit)}
                className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Customer</span>
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Project Site</label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
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
                  <label className="block text-white/80 font-medium mb-1">Visit Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Visit Time</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  >
                    <option value="09:00 AM">09:00 AM (Morning)</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:30 PM">02:30 PM (Afternoon)</option>
                    <option value="04:00 PM">04:00 PM (Sunset)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Visit Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as SiteVisitRequest['status'],
                      })
                    }
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none font-semibold text-[#DDB75C]"
                  >
                    <option value="Requested">Requested (Pending)</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Assigned Property Advisor</label>
                  <select
                    value={formData.assignedExecutive}
                    onChange={(e) => setFormData({ ...formData, assignedExecutive: e.target.value })}
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
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    placeholder="e.g. Mandangad Bus Stand / Direct to Site Gate"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-1">
                  Tour Notes & Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Interested in East-facing plots. Family of 4 coming by car from Mumbai."
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedVisit.id, selectedVisit.customerName)}
                  className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Visit</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 text-[#00291E] rounded font-bold uppercase tracking-wider"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. SCHEDULE NEW SITE VISIT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#00291E] text-white p-6 sm:p-7 rounded-xl border border-[#C9A24A]/40 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#C9A24A] font-semibold tracking-wider">
                  New Customer Tour Booking
                </span>
                <h3 className="font-serif text-xl text-white font-medium">
                  Schedule Private Site Visit
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVisit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">
                    Phone Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@gmail.com"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Select Project</label>
                  <select
                    value={formData.project}
                    onChange={(e) => setFormData({ ...formData, project: e.target.value })}
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
                  <label className="block text-white/80 font-medium mb-1">Visit Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Time Slot</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as SiteVisitRequest['status'],
                      })
                    }
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none font-semibold text-[#DDB75C]"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Requested">Requested</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Assign Property Advisor</label>
                  <select
                    value={formData.assignedExecutive}
                    onChange={(e) => setFormData({ ...formData, assignedExecutive: e.target.value })}
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
                  <label className="block text-white/80 font-medium mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    placeholder="e.g. Direct to Site Gate"
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-1">
                  Customer Notes & Requirements
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Wants to inspect 2 & 4 Guntha demarcation and road connectivity."
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2 text-white outline-none resize-none"
                />
              </div>

              {/* Sync to Leads CRM checkbox */}
              <div className="p-3 bg-[#001D15] rounded-lg border border-white/10 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="createLeadCheck"
                  checked={formData.createMatchingLead}
                  onChange={(e) =>
                    setFormData({ ...formData, createMatchingLead: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#C9A24A] cursor-pointer"
                />
                <label htmlFor="createLeadCheck" className="text-white/90 text-xs cursor-pointer">
                  <strong>Also create an active record in Leads CRM</strong>
                  <span className="block text-[11px] text-white/60">
                    Keeps site visit and customer lead inquiries synced together seamlessly.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 text-[#00291E] rounded font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Confirm Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
