import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Radio,
  Key,
  Link,
  ShieldCheck,
  Send,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Code,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { ContactSettings, CRMIntegrationSettings } from '../../types';
import { CRMService, CRMDispatchResult } from '../../services/crmService';

export const AdminSettingsView: React.FC = () => {
  const { settings, crmSettings } = useStore();
  const [activeTab, setActiveTab] = useState<'crm' | 'contact'>('crm');

  // Contact form state
  const [formData, setFormData] = useState<ContactSettings>({ ...settings });
  const [savedContact, setSavedContact] = useState(false);

  // CRM form state
  const [crmData, setCrmData] = useState<CRMIntegrationSettings>({ ...crmSettings });
  const [savedCrm, setSavedCrm] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<CRMDispatchResult | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await StoreService.saveContactSettings(formData);
    setSavedContact(true);
    setTimeout(() => setSavedContact(false), 2500);
  };

  const handleCrmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await StoreService.saveCRMSettings(crmData);
    setSavedCrm(true);
    setTimeout(() => setSavedCrm(false), 2500);
  };

  const handleTestConnection = async () => {
    if (!crmData.webhookUrl?.trim()) {
      alert('Please enter a Webhook URL before testing.');
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await CRMService.testConnection(crmData);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C9A24A]/20 pb-4">
        <div>
          <h2 className="font-serif text-2xl text-[#00291E]">Settings & Integrations</h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Manage CRM webhook connections, company contact details, and cloud database parameters.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-[#00291E]/10 p-1 rounded-lg border border-[#C9A24A]/30">
          <button
            type="button"
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'crm'
                ? 'bg-[#00291E] text-[#C9A24A] shadow'
                : 'text-[#00291E] hover:bg-white/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>CRM Integration</span>
            {crmData.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="CRM Active" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'contact'
                ? 'bg-[#00291E] text-[#C9A24A] shadow'
                : 'text-[#00291E] hover:bg-white/40'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact & Address</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CRM SYSTEM INTEGRATION */}
      {activeTab === 'crm' && (
        <form onSubmit={handleCrmSubmit} className="space-y-6">
          {savedCrm && (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-lg text-xs font-medium border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>CRM webhook settings saved successfully and live for all new leads!</span>
            </div>
          )}

          {/* Master Enablement Card */}
          <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C9A24A]/20 pb-4">
              <div>
                <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
                  <Radio className="w-5 h-5 text-[#C9A24A]" />
                  <span>Real Estate CRM Webhook Integration</span>
                </h3>
                <p className="text-xs text-[#26342D]/70 font-light mt-1">
                  Automatically forward every website consultation inquiry, private site visit booking, and channel partner registration directly into your CRM system.
                </p>
              </div>

              {/* Master Toggle */}
              <label className="flex items-center gap-3 cursor-pointer self-start sm:self-auto bg-[#F8F0D8] px-4 py-2 rounded-lg border border-[#C9A24A]/30 select-none">
                <input
                  type="checkbox"
                  checked={crmData.enabled}
                  onChange={(e) => setCrmData({ ...crmData, enabled: e.target.checked })}
                  className="w-4 h-4 accent-[#00291E] rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-[#00291E] uppercase tracking-wider">
                  {crmData.enabled ? 'Integration Active' : 'Integration Paused'}
                </span>
              </label>
            </div>

            {/* Webhook URL & Security Token Inputs */}
            <div className="grid grid-cols-1 gap-5 text-xs pt-2">
              <div>
                <label className="block text-[#00291E] font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Link className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>CRM Webhook Endpoint URL *</span>
                </label>
                <input
                  type="url"
                  placeholder="https://your-crm.com/api/v1/leads/webhook OR https://hooks.zapier.com/hooks/catch/..."
                  value={crmData.webhookUrl}
                  onChange={(e) => setCrmData({ ...crmData, webhookUrl: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded-lg p-3 outline-none font-mono text-xs focus:border-[#00291E] focus:ring-1 focus:ring-[#00291E]"
                />
                <span className="text-[11px] text-[#26342D]/60 mt-1 block">
                  Paste the Webhook URL provided by your CRM (Sell.Do, LeadSquared, Salesforce, Zoho, HubSpot, Zapier, Make, etc.).
                </span>
              </div>

              <div>
                <label className="block text-[#00291E] font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#C9A24A]" />
                  <span>Security Token / API Key / Secret</span>
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    placeholder="Enter CRM security token, secret key, or Bearer auth token"
                    value={crmData.securityToken}
                    onChange={(e) => setCrmData({ ...crmData, securityToken: e.target.value })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 rounded-lg p-3 pr-12 outline-none font-mono text-xs focus:border-[#00291E] focus:ring-1 focus:ring-[#00291E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#26342D]/60 hover:text-[#00291E] p-1"
                    title={showToken ? 'Hide token' : 'Show token'}
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[11px] text-[#26342D]/60 mt-1 block">
                  Automatically sent in standard <code className="font-mono bg-white/60 px-1 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code> and <code className="font-mono bg-white/60 px-1 py-0.5 rounded">x-api-key: &lt;token&gt;</code> headers.
                </span>
              </div>

              {/* Header Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Authorization Header Name</label>
                  <input
                    type="text"
                    value={crmData.authHeaderName || 'Authorization'}
                    onChange={(e) => setCrmData({ ...crmData, authHeaderName: e.target.value })}
                    placeholder="Authorization"
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#00291E] font-semibold mb-1">Header Value Format</label>
                  <select
                    value={crmData.authHeaderType || 'bearer'}
                    onChange={(e) => setCrmData({ ...crmData, authHeaderType: e.target.value as any })}
                    className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                  >
                    <option value="bearer">Bearer &lt;token&gt; (Standard)</option>
                    <option value="raw">Raw Token (No 'Bearer' prefix)</option>
                  </select>
                </div>
              </div>

              {/* Event Triggers */}
              <div className="pt-3 border-t border-[#C9A24A]/20">
                <span className="block text-[#00291E] font-bold text-xs uppercase tracking-wider mb-2">
                  Automatic Forwarding Rules
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 bg-[#F8F0D8] p-3 rounded-lg border border-[#C9A24A]/20 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={crmData.sendOnWebsiteLead}
                      onChange={(e) => setCrmData({ ...crmData, sendOnWebsiteLead: e.target.checked })}
                      className="w-4 h-4 accent-[#00291E] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-[#00291E] block">Website Leads</span>
                      <span className="text-[10px] text-[#26342D]/60">Homepage &amp; Contact forms</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 bg-[#F8F0D8] p-3 rounded-lg border border-[#C9A24A]/20 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={crmData.sendOnSiteVisit}
                      onChange={(e) => setCrmData({ ...crmData, sendOnSiteVisit: e.target.checked })}
                      className="w-4 h-4 accent-[#00291E] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-[#00291E] block">Site Visit Bookings</span>
                      <span className="text-[10px] text-[#26342D]/60">With Date, Time &amp; Pickup</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 bg-[#F8F0D8] p-3 rounded-lg border border-[#C9A24A]/20 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={crmData.sendOnChannelPartner}
                      onChange={(e) => setCrmData({ ...crmData, sendOnChannelPartner: e.target.checked })}
                      className="w-4 h-4 accent-[#00291E] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-semibold text-[#00291E] block">Channel Partners</span>
                      <span className="text-[10px] text-[#26342D]/60">Partner registrations</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Test Connection Result Box */}
            {testResult && (
              <div
                className={`p-4 rounded-lg border text-xs space-y-1.5 transition-all ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>
                    {testResult.success ? 'CRM Webhook Reached Successfully!' : 'CRM Connection Test Failed'}
                  </span>
                  {testResult.statusCode && (
                    <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded border text-[10px]">
                      HTTP {testResult.statusCode}
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed">{testResult.message}</p>
                {testResult.responseData && (
                  <pre className="bg-black/80 text-emerald-300 p-2.5 rounded font-mono text-[10px] overflow-x-auto max-h-36">
                    {typeof testResult.responseData === 'string'
                      ? testResult.responseData
                      : JSON.stringify(testResult.responseData, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#C9A24A]/20">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="bg-white/80 hover:bg-white text-[#00291E] border border-[#00291E]/30 font-semibold text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#C9A24A]" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-[#C9A24A]" />
                )}
                <span>{isTesting ? 'Sending Test Lead...' : 'Send Test Lead to Webhook'}</span>
              </button>

              <button
                type="submit"
                className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs tracking-wider uppercase px-7 py-2.5 rounded-lg shadow flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save CRM Configuration</span>
              </button>
            </div>
          </div>

          {/* CRM Payload Reference Card */}
          <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-semibold text-[#00291E] flex items-center gap-2">
              <Code className="w-4 h-4 text-[#C9A24A]" />
              <span>Webhook Payload Schema (JSON sent to your CRM)</span>
            </h4>
            <p className="text-[11px] text-[#26342D]/70 font-light">
              Velora sends a standardized real estate JSON payload with both flat parameters (for CRM form handlers) and structured objects:
            </p>
            <pre className="bg-[#00291E] text-emerald-300 p-4 rounded-lg font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#C9A24A]/30">
{`{
  "event": "lead.created",
  "timestamp": "2026-10-08T08:30:00.000Z",
  "source": "Velora Developers Website",
  "lead_id": "LD-5421",
  "name": "Customer Name",
  "phone": "+91 91583 83808",
  "email": "customer@example.com",
  "project": "Amrutvan",
  "lead_source": "Website Form",
  "status": "New",
  "notes": "Customer message or requirements",
  "site_visit_date": "15 Oct 2026",
  "site_visit_time": "11:00 AM",
  "pickup_location": "Pune",
  "lead": {
    "id": "LD-5421",
    "name": "Customer Name",
    "phone": "+91 91583 83808",
    "email": "customer@example.com",
    "project": "Amrutvan",
    "preferredContact": "WhatsApp"
  }
}`}
            </pre>
          </div>
        </form>
      )}

      {/* TAB 2: CONTACT & ADDRESS SETTINGS */}
      {activeTab === 'contact' && (
        <form onSubmit={handleContactSubmit} className="space-y-6">
          {savedContact && (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg text-xs font-medium border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Contact settings saved successfully!</span>
            </div>
          )}

          {/* Contact Numbers */}
          <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C9A24A]" />
              <span>Phone & Messaging</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Primary Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-mono"
                />
                <span className="text-[10px] text-[#26342D]/60 mt-0.5 block">Used for Floating WhatsApp button</span>
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Alternate Numbers</label>
                <input
                  type="text"
                  value={formData.phoneAlt || ''}
                  onChange={(e) => setFormData({ ...formData, phoneAlt: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Email & Web */}
          <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C9A24A]" />
              <span>Email & Digital Presence</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Official Inquiries Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Website URL</label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C9A24A]" />
              <span>Physical Locations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Site Office Address</label>
                <textarea
                  rows={3}
                  value={formData.siteAddress}
                  onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Corporate Office Address</label>
                <textarea
                  rows={3}
                  value={formData.officeAddress}
                  onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-[#00291E] font-medium border-b border-[#C9A24A]/20 pb-2">
              Social Links & Disclaimers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-[#00291E] font-semibold mb-1">Google Maps URL</label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#00291E] font-semibold mb-1">RERA Disclaimer Copy</label>
              <input
                type="text"
                value={formData.reraText}
                onChange={(e) => setFormData({ ...formData, reraText: e.target.value })}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/30 rounded p-2.5 text-xs outline-none"
              />
            </div>
          </div>

          {/* Supabase Cloud Database Status */}
          <div className="bg-[#FFF8E7] rounded-xl p-6 border border-[#C9A24A]/25 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#C9A24A]/20 pb-2">
              <h3 className="font-serif text-lg text-[#00291E] font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C9A24A]" />
                <span>Supabase Cloud Database Connection</span>
              </h3>
              <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-medium">
                Connected: bbgcvexhjvcvbowhxabc
              </span>
            </div>

            <p className="text-xs text-[#26342D]/75 leading-relaxed font-light">
              Your website is configured to communicate with your Supabase project (<strong>https://bbgcvexhjvcvbowhxabc.supabase.co</strong>).
              To enable cross-browser real-time photo &amp; data persistence, make sure the <code className="bg-[#F8F0D8] px-1.5 py-0.5 rounded text-[#00291E] font-mono">app_store</code> table is created in your Supabase SQL editor.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs tracking-wider uppercase px-8 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Contact Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
