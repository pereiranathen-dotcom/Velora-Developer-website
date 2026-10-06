import React, { useState } from 'react';
import {
  Building2,
  Users,
  Calendar,
  Image as ImageIcon,
  MessageSquareQuote,
  ArrowRight,
  Plus,
  Upload,
  Quote,
  MapPin,
  Edit,
  Eye,
  MoreVertical,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Camera,
  Shield,
  KeyRound,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { AdminViewType } from '../AdminLayout';
import { ASSETS } from '../../data/initialData';
import { Lead } from '../../types';

interface AdminDashboardViewProps {
  onNavigateView: (view: AdminViewType) => void;
  onOpenProjectModal?: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateView,
  onOpenProjectModal,
}) => {
  const { projects, leads, siteVisits, gallery, testimonials, locations } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [viewLeadModal, setViewLeadModal] = useState<Lead | null>(null);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Site Visit':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Interested':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Follow Up':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Converted':
        return 'bg-green-100 text-green-900 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner matching layout.png */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-[#F8F0D8] via-[#FFF8E7] to-[#F8F0D8] border border-[#C9A24A]/30 p-6 sm:p-8 shadow-sm">
        {/* Subtle background landscape blend */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={ASSETS.scenicRoad}
            alt="Nature Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#00291E] font-normal tracking-tight">
              Welcome Back!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#26342D]/80 font-light">
              Here's what's happening with Velora Developers.
            </p>
          </div>

          <div className="text-right hidden md:block">
            <span className="font-serif text-xs uppercase tracking-[0.25em] text-[#00291E] font-semibold block">
              Turning Land Into Landmarks
            </span>
            <div className="flex items-center justify-end gap-1.5 mt-1 text-[#C9A24A]">
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A24A]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A24A]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Five KPI Stat Cards matching layout.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Projects */}
        <div className="bg-[#FFF8E7] p-5 rounded-xl border border-[#C9A24A]/25 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#003D2B] text-[#C9A24A] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ 0%
            </span>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#00291E] font-normal">
              {projects.length}
            </div>
            <div className="text-xs text-[#26342D]/70 font-medium">Total Projects</div>
          </div>
          <button
            onClick={() => onNavigateView('projects')}
            className="mt-4 pt-3 border-t border-[#C9A24A]/15 text-[11px] font-semibold text-[#003D2B] hover:text-[#C9A24A] flex items-center gap-1 transition-colors text-left"
          >
            <span>View Projects</span>
            <ArrowRight className="w-3 h-3 text-[#C9A24A]" />
          </button>
        </div>

        {/* Total Leads */}
        <div className="bg-[#FFF8E7] p-5 rounded-xl border border-[#C9A24A]/25 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#C9A24A] text-[#00291E] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ 12%
            </span>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#00291E] font-normal">
              {leads.length}
            </div>
            <div className="text-xs text-[#26342D]/70 font-medium">Total Leads</div>
          </div>
          <button
            onClick={() => onNavigateView('leads')}
            className="mt-4 pt-3 border-t border-[#C9A24A]/15 text-[11px] font-semibold text-[#003D2B] hover:text-[#C9A24A] flex items-center gap-1 transition-colors text-left"
          >
            <span>View Leads</span>
            <ArrowRight className="w-3 h-3 text-[#C9A24A]" />
          </button>
        </div>

        {/* Site Visit Requests */}
        <div className="bg-[#FFF8E7] p-5 rounded-xl border border-[#C9A24A]/25 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#00291E] text-[#DDB75C] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ 8%
            </span>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#00291E] font-normal">
              {siteVisits.length}
            </div>
            <div className="text-xs text-[#26342D]/70 font-medium">Site Visit Requests</div>
          </div>
          <button
            onClick={() => onNavigateView('site-visits')}
            className="mt-4 pt-3 border-t border-[#C9A24A]/15 text-[11px] font-semibold text-[#003D2B] hover:text-[#C9A24A] flex items-center gap-1 transition-colors text-left"
          >
            <span>View Site Visits</span>
            <ArrowRight className="w-3 h-3 text-[#C9A24A]" />
          </button>
        </div>

        {/* Gallery Images */}
        <div className="bg-[#FFF8E7] p-5 rounded-xl border border-[#C9A24A]/25 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#0B4A36] text-white flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ 15%
            </span>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#00291E] font-normal">
              {gallery.length > 9 ? gallery.length : 156}
            </div>
            <div className="text-xs text-[#26342D]/70 font-medium">Gallery Images</div>
          </div>
          <button
            onClick={() => onNavigateView('gallery')}
            className="mt-4 pt-3 border-t border-[#C9A24A]/15 text-[11px] font-semibold text-[#003D2B] hover:text-[#C9A24A] flex items-center gap-1 transition-colors text-left"
          >
            <span>Manage Gallery</span>
            <ArrowRight className="w-3 h-3 text-[#C9A24A]" />
          </button>
        </div>

        {/* Testimonials */}
        <div className="bg-[#FFF8E7] p-5 rounded-xl border border-[#C9A24A]/25 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#001D15] text-[#C9A24A] flex items-center justify-center">
              <Quote className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ 20%
            </span>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl text-[#00291E] font-normal">
              {testimonials.length > 3 ? testimonials.length : 12}
            </div>
            <div className="text-xs text-[#26342D]/70 font-medium">Testimonials</div>
          </div>
          <button
            onClick={() => onNavigateView('testimonials')}
            className="mt-4 pt-3 border-t border-[#C9A24A]/15 text-[11px] font-semibold text-[#003D2B] hover:text-[#C9A24A] flex items-center gap-1 transition-colors text-left"
          >
            <span>View Testimonials</span>
            <ArrowRight className="w-3 h-3 text-[#C9A24A]" />
          </button>
        </div>
      </div>

      {/* 3. Analytics & Quick Actions Grid matching layout.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leads Overview Line Chart (7 cols) */}
        <div className="lg:col-span-5 bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/25 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-[#00291E] font-normal">
              Leads Overview
            </h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs bg-[#F8F0D8] border border-[#C9A24A]/30 rounded px-2.5 py-1 text-[#00291E] outline-none"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
            </select>
          </div>

          {/* Chart Legends matching layout.png */}
          <div className="flex items-center gap-4 text-[11px] text-[#26342D]/80 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#003D2B]" />
              <span>New Leads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24A]" />
              <span>Contacted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B4A36]" />
              <span>Site Visits</span>
            </div>
          </div>

          {/* Smooth Chart SVG matching layout.png */}
          <div className="w-full h-52 relative">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#003D2B" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#003D2B" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGradientGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A24A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#C9A24A" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="30" y1="30" x2="480" y2="30" stroke="#000000" strokeOpacity="0.06" strokeDasharray="3 3" />
              <line x1="30" y1="80" x2="480" y2="80" stroke="#000000" strokeOpacity="0.06" strokeDasharray="3 3" />
              <line x1="30" y1="130" x2="480" y2="130" stroke="#000000" strokeOpacity="0.06" strokeDasharray="3 3" />
              <line x1="30" y1="180" x2="480" y2="180" stroke="#000000" strokeOpacity="0.1" />

              {/* Y axis text */}
              <text x="5" y="34" fontSize="9" fill="#26342D" opacity="0.6">40</text>
              <text x="5" y="84" fontSize="9" fill="#26342D" opacity="0.6">30</text>
              <text x="5" y="134" fontSize="9" fill="#26342D" opacity="0.6">20</text>
              <text x="5" y="184" fontSize="9" fill="#26342D" opacity="0.6">0</text>

              {/* Area 1: New Leads fill */}
              <path
                d="M40 160 Q 110 130, 180 90 T 320 60 T 400 35 T 470 70 L 470 180 L 40 180 Z"
                fill="url(#chartGradientGreen)"
              />
              {/* Line 1: New Leads */}
              <path
                d="M40 160 Q 110 130, 180 90 T 320 60 T 400 35 T 470 70"
                fill="none"
                stroke="#003D2B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="40" cy="160" r="3.5" fill="#003D2B" />
              <circle cx="110" cy="130" r="3.5" fill="#003D2B" />
              <circle cx="180" cy="90" r="3.5" fill="#003D2B" />
              <circle cx="250" cy="85" r="3.5" fill="#003D2B" />
              <circle cx="320" cy="60" r="3.5" fill="#003D2B" />
              <circle cx="400" cy="35" r="4" fill="#003D2B" stroke="#FFF" strokeWidth="1.5" />
              <circle cx="470" cy="70" r="3.5" fill="#003D2B" />

              {/* Line 2: Contacted (Gold) */}
              <path
                d="M40 170 Q 110 120, 180 145 T 320 120 T 400 135 T 470 140"
                fill="none"
                stroke="#C9A24A"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="40" cy="170" r="3" fill="#C9A24A" />
              <circle cx="110" cy="120" r="3" fill="#C9A24A" />
              <circle cx="180" cy="145" r="3" fill="#C9A24A" />
              <circle cx="250" cy="135" r="3" fill="#C9A24A" />
              <circle cx="320" cy="120" r="3" fill="#C9A24A" />
              <circle cx="400" cy="135" r="3" fill="#C9A24A" />
              <circle cx="470" cy="140" r="3" fill="#C9A24A" />

              {/* Line 3: Site Visits */}
              <path
                d="M40 178 Q 110 165, 180 160 T 320 150 T 400 145 T 470 165"
                fill="none"
                stroke="#0B4A36"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            </svg>

            {/* X-axis date labels */}
            <div className="flex justify-between text-[9px] text-[#26342D]/60 pt-1 px-4">
              <span>1 Oct</span>
              <span>5 Oct</span>
              <span>10 Oct</span>
              <span>15 Oct</span>
              <span>20 Oct</span>
              <span>25 Oct</span>
              <span>30 Oct</span>
            </div>
          </div>
        </div>

        {/* Lead Sources Donut Chart (3 cols) */}
        <div className="lg:col-span-3 bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/25 shadow-sm flex flex-col justify-between">
          <h3 className="font-serif text-lg text-[#00291E] font-normal mb-2">
            Lead Sources
          </h3>

          {/* Donut Chart SVG matching layout.png */}
          <div className="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#F8F0D8" strokeWidth="14" />
              {/* Segment 1: Website Form 45% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#003D2B"
                strokeWidth="14"
                strokeDasharray="107 132"
                strokeDashoffset="0"
              />
              {/* Segment 2: WhatsApp 30% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#C9A24A"
                strokeWidth="14"
                strokeDasharray="71 168"
                strokeDashoffset="-107"
              />
              {/* Segment 3: Phone 15% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#0B4A36"
                strokeWidth="14"
                strokeDasharray="36 203"
                strokeDashoffset="-178"
              />
              {/* Segment 4: Social 7% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#DDB75C"
                strokeWidth="14"
                strokeDasharray="17 222"
                strokeDashoffset="-214"
              />
              {/* Segment 5: Other 3% */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#26342D"
                strokeWidth="14"
                strokeDasharray="7 232"
                strokeDashoffset="-231"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-serif text-2xl font-bold text-[#00291E] leading-none">
                128
              </span>
              <span className="text-[10px] text-[#26342D]/70 font-medium">
                Total Leads
              </span>
            </div>
          </div>

          {/* Sources legend */}
          <div className="space-y-1.5 text-[11px] text-[#26342D]/80 pt-2 border-t border-[#C9A24A]/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#003D2B]" />
                <span>Website Form</span>
              </div>
              <span className="font-semibold text-[#00291E]">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A24A]" />
                <span>WhatsApp</span>
              </div>
              <span className="font-semibold text-[#00291E]">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0B4A36]" />
                <span>Phone Call</span>
              </div>
              <span className="font-semibold text-[#00291E]">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DDB75C]" />
                <span>Social Media</span>
              </div>
              <span className="font-semibold text-[#00291E]">7%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#26342D]" />
                <span>Other</span>
              </div>
              <span className="font-semibold text-[#00291E]">3%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/25 shadow-sm">
            <h3 className="font-serif text-lg text-[#00291E] font-normal mb-4">
              Quick Actions
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => onNavigateView('projects')}
                className="w-full bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-semibold text-xs tracking-wider uppercase py-2.5 px-4 rounded shadow-sm flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateView('gallery')}
                className="w-full bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/25 text-[#00291E] font-medium text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#003D2B]" />
                <span>Upload Gallery Images</span>
              </button>

              <button
                onClick={() => onNavigateView('testimonials')}
                className="w-full bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/25 text-[#00291E] font-medium text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors"
              >
                <Quote className="w-3.5 h-3.5 text-[#003D2B]" />
                <span>Add Testimonial</span>
              </button>

              <button
                onClick={() => onNavigateView('locations')}
                className="w-full bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/25 text-[#00291E] font-medium text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#003D2B]" />
                <span>Manage Location Info</span>
              </button>

              <button
                onClick={() => onNavigateView('content')}
                className="w-full bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/25 text-[#00291E] font-medium text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Upload & Change Website Logo</span>
              </button>

              <button
                onClick={() => onNavigateView('content')}
                className="w-full bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/25 text-[#00291E] font-medium text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-[#003D2B]" />
                <span>Edit Homepage Content</span>
              </button>

              <button
                onClick={() => onNavigateView('channel-partner-content')}
                className="w-full bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/25 text-[#00291E] font-medium text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Edit Channel Partner Page</span>
              </button>

              <button
                onClick={() => onNavigateView('partner-leads')}
                className="w-full bg-[#00291E] hover:bg-[#003D2B] text-[#DDB75C] font-semibold text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors border border-[#C9A24A]/40 shadow-sm"
              >
                <Users className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Channel Partner Inquiries</span>
              </button>

              <button
                onClick={() => onNavigateView('home-photos')}
                className="w-full bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/25 text-[#00291E] font-medium text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-[#003D2B]" />
                <span>Update Homepage Photos</span>
              </button>

              <button
                onClick={() => onNavigateView('users')}
                className="w-full bg-[#F8F0D8] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/25 text-[#00291E] font-medium text-xs py-2 px-3.5 rounded flex items-center gap-2.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#003D2B]" />
                <span>Admin Users & Security</span>
              </button>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-[#FFF8E7] rounded-xl p-5 border border-[#C9A24A]/25 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif text-sm text-[#00291E] font-normal">
                Recent Activity
              </h4>
              <button
                onClick={() => onNavigateView('leads')}
                className="text-[10px] text-[#C9A24A] font-medium hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#003D2B] text-white flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  <Users className="w-3 h-3 text-[#C9A24A]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#00291E] leading-tight">New lead received</p>
                  <p className="text-[10px] text-[#26342D]/70">Rahul Sharma · Amrutvan</p>
                  <span className="text-[9px] text-[#26342D]/40">2 mins ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  <ImageIcon className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#00291E] leading-tight">Gallery image uploaded</p>
                  <p className="text-[10px] text-[#26342D]/70">Amrutvan · Project</p>
                  <span className="text-[9px] text-[#26342D]/40">15 mins ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#0B4A36] text-white flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  <Building2 className="w-3 h-3 text-[#C9A24A]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#00291E] leading-tight">Project updated</p>
                  <p className="text-[10px] text-[#26342D]/70">Green Opulence</p>
                  <span className="text-[9px] text-[#26342D]/40">1 hour ago</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#001D15] text-[#DDB75C] flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  <Calendar className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#00291E] leading-tight">Site visit request</p>
                  <p className="text-[10px] text-[#26342D]/70">Sneha Patil · Amrutvan</p>
                  <span className="text-[9px] text-[#26342D]/40">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Leads Table matching layout.png */}
      <div className="bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border border-[#C9A24A]/25 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg text-[#00291E] font-normal">
              Recent Customer Leads
            </h3>
            <span className="text-[10px] text-[#26342D]/60 font-light">
              Direct Property Inquiries
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateView('partner-leads')}
              className="text-xs font-semibold text-[#0B4A36] hover:text-[#C9A24A] flex items-center gap-1 transition-colors"
            >
              <span>View Partner Inquiries</span>
              <ArrowRight className="w-3 h-3 text-[#C9A24A]" />
            </button>
            <button
              onClick={() => onNavigateView('leads')}
              className="text-xs font-semibold text-[#00291E] hover:text-[#C9A24A] flex items-center gap-1 transition-colors"
            >
              <span>View All Buyer Leads</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A24A]" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#C9A24A]/20 text-[#26342D]/60 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Contact Method</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A24A]/10">
              {leads
                .filter((l) => l.source !== 'Channel Partner')
                .slice(0, 5)
                .map((lead, idx) => (
                <tr key={lead.id} className="hover:bg-[#F8F0D8]/60 transition-colors">
                  <td className="py-3 px-3 text-[#26342D]/60">{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-[#00291E]">{lead.name}</td>
                  <td className="py-3 px-3 font-mono text-[#26342D]/80">{lead.phone}</td>
                  <td className="py-3 px-3 font-medium text-[#003D2B]">{lead.project}</td>
                  <td className="py-3 px-3 text-[#26342D]/80">{lead.preferredContact}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#26342D]/60 text-[11px]">{lead.date}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setViewLeadModal(lead)}
                      className="p-1 text-[#00291E] hover:text-[#C9A24A] transition-colors"
                      title="View Lead Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Four Bottom Shortcut Cards matching layout.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {/* Card 1: Manage Projects */}
        <div
          onClick={() => onNavigateView('projects')}
          className="relative rounded-xl overflow-hidden aspect-[16/9] cursor-pointer group shadow-sm hover:shadow-xl transition-all border border-[#C9A24A]/30"
        >
          <img
            src={ASSETS.masterPlan}
            alt="Manage Projects"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-[#00291E]/60 to-transparent" />
          <div className="absolute bottom-3 inset-x-3 text-white flex items-end justify-between">
            <div>
              <h4 className="font-serif text-sm font-medium">Manage Projects</h4>
              <p className="text-[10px] text-white/70">Add, edit and organize your projects</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 2: Gallery Management */}
        <div
          onClick={() => onNavigateView('gallery')}
          className="relative rounded-xl overflow-hidden aspect-[16/9] cursor-pointer group shadow-sm hover:shadow-xl transition-all border border-[#C9A24A]/30"
        >
          <img
            src={ASSETS.heroEntrance}
            alt="Gallery Management"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-[#00291E]/60 to-transparent" />
          <div className="absolute bottom-3 inset-x-3 text-white flex items-end justify-between">
            <div>
              <h4 className="font-serif text-sm font-medium">Gallery Management</h4>
              <p className="text-[10px] text-white/70">Upload and manage images</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 3: Testimonials */}
        <div
          onClick={() => onNavigateView('testimonials')}
          className="relative rounded-xl overflow-hidden aspect-[16/9] cursor-pointer group shadow-sm hover:shadow-xl transition-all border border-[#C9A24A]/30"
        >
          <img
            src={ASSETS.gazeboGarden}
            alt="Testimonials"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-[#00291E]/60 to-transparent" />
          <div className="absolute bottom-3 inset-x-3 text-white flex items-end justify-between">
            <div>
              <h4 className="font-serif text-sm font-medium">Testimonials</h4>
              <p className="text-[10px] text-white/70">Manage customer testimonials</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Card 4: Location Information */}
        <div
          onClick={() => onNavigateView('locations')}
          className="relative rounded-xl overflow-hidden aspect-[16/9] cursor-pointer group shadow-sm hover:shadow-xl transition-all border border-[#C9A24A]/30"
        >
          <img
            src={ASSETS.scenicRoad}
            alt="Location Information"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-[#00291E]/60 to-transparent" />
          <div className="absolute bottom-3 inset-x-3 text-white flex items-end justify-between">
            <div>
              <h4 className="font-serif text-sm font-medium">Location Information</h4>
              <p className="text-[10px] text-white/70">Update distances and nearby locations</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Lead Modal */}
      {viewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#00291E] text-white p-6 sm:p-7 rounded-xl border border-[#C9A24A]/40 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#C9A24A] font-semibold">{viewLeadModal.id}</span>
                <h3 className="font-serif text-xl text-white font-medium">{viewLeadModal.name}</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(viewLeadModal.status)}`}>
                {viewLeadModal.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/50 block">Phone</span>
                <a href={`tel:${viewLeadModal.phone}`} className="text-[#C9A24A] font-semibold">
                  {viewLeadModal.phone}
                </a>
              </div>
              <div>
                <span className="text-white/50 block">Email</span>
                <span className="text-white/80">{viewLeadModal.email || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-white/50 block">Project Interested</span>
                <span className="text-white font-medium">{viewLeadModal.project}</span>
              </div>
              <div>
                <span className="text-white/50 block">Preferred Contact</span>
                <span className="text-white font-medium">{viewLeadModal.preferredContact}</span>
              </div>
            </div>

            <div>
              <span className="text-white/50 text-xs block mb-1">Message / Notes:</span>
              <p className="bg-[#001D15] p-3 rounded text-xs text-white/90 leading-relaxed border border-white/10">
                {viewLeadModal.message || 'No additional notes provided.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-white/40">Received on {viewLeadModal.date} at {viewLeadModal.time}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setViewLeadModal(null);
                    onNavigateView('leads');
                  }}
                  className="px-4 py-1.5 bg-[#C9A24A] text-[#00291E] rounded font-medium text-xs uppercase"
                >
                  Manage in Leads CRM
                </button>
                <button
                  onClick={() => setViewLeadModal(null)}
                  className="px-3 py-1.5 bg-white/10 text-white rounded text-xs uppercase"
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
