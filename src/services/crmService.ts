import { Lead, SiteVisitRequest, CRMIntegrationSettings } from '../types';
import { INITIAL_CRM_SETTINGS } from '../data/initialData';

export interface CRMDispatchResult {
  success: boolean;
  statusCode?: number;
  message: string;
  responseData?: any;
}

function getStoredCRMSettings(): CRMIntegrationSettings {
  if (typeof window !== 'undefined') {
    const memory = (window as any).__velora_crm_settings;
    if (memory && (memory.webhookUrl || memory.enabled !== undefined)) {
      return { ...INITIAL_CRM_SETTINGS, ...memory };
    }
  }
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('velora_crm_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) return { ...INITIAL_CRM_SETTINGS, ...parsed };
      }
    } catch {
      // ignore
    }
  }
  return INITIAL_CRM_SETTINGS;
}

/**
 * Real Estate CRM Webhook Integration Service
 * Dispatches website inquiries, site visits, and partner registrations to the configured CRM webhook.
 */
export const CRMService = {
  /**
   * Format a website inquiry / lead into a comprehensive CRM payload
   */
  formatLeadPayload(lead: Lead, type: 'lead' | 'partner' = 'lead') {
    const isPartner = type === 'partner' || Boolean(lead.partnerType || lead.reraNumber);
    const eventType = isPartner ? 'channel_partner.registered' : 'lead.created';

    const nameParts = (lead.name || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || (nameParts[0] ? '—' : '');

    return {
      event: eventType,
      timestamp: new Date().toISOString(),
      source: 'Velora Developers Website',
      // Top-level direct fields for flat CRM parsers (Sell.Do, LeadSquared, Zoho, Zapier)
      lead_id: lead.id,
      name: lead.name,
      full_name: lead.name,
      first_name: firstName,
      last_name: lastName,
      FirstName: firstName,
      LastName: lastName,
      phone: lead.phone,
      mobile: lead.phone,
      Phone: lead.phone,
      MobilePhone: lead.phone,
      email: lead.email,
      Email: lead.email,
      project: lead.project,
      project_name: lead.project,
      Project: lead.project,
      preferred_contact: lead.preferredContact,
      lead_source: lead.source || (isPartner ? 'Channel Partner Form' : 'Website Form'),
      LeadSource: lead.source || (isPartner ? 'Channel Partner Form' : 'Website Form'),
      status: lead.status || 'New',
      notes: lead.notes || lead.message || '',
      requirement: lead.message || '',
      Description: lead.notes || lead.message || '',
      city: lead.city || '',
      City: lead.city || '',
      State: 'Maharashtra',
      Country: 'India',
      Company: isPartner ? (lead.partnerType ? `${lead.name} (${lead.partnerType})` : lead.name) : 'Individual Buyer',
      partner_type: lead.partnerType || '',
      rera_number: lead.reraNumber || '',
      created_date: lead.date,
      created_time: lead.time,
      website_url: typeof window !== 'undefined' ? window.location.origin : 'https://www.veloradevelopers.com',
      // Nested object for structured CRM APIs (Salesforce, HubSpot, Webhooks)
      lead: {
        id: lead.id,
        name: lead.name,
        firstName,
        lastName,
        phone: lead.phone,
        email: lead.email,
        project: lead.project,
        preferredContact: lead.preferredContact,
        source: lead.source,
        message: lead.message,
        date: lead.date,
        time: lead.time,
        status: lead.status,
        city: lead.city,
        partnerType: lead.partnerType,
        reraNumber: lead.reraNumber,
      },
    };
  },

  /**
   * Format a site visit request into a comprehensive CRM payload
   */
  formatSiteVisitPayload(visit: SiteVisitRequest) {
    const nameParts = (visit.customerName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || (nameParts[0] ? '—' : '');

    return {
      event: 'site_visit.scheduled',
      timestamp: new Date().toISOString(),
      source: 'Velora Developers Website',
      // Flat fields for direct CRM mapping
      lead_id: visit.id,
      name: visit.customerName,
      full_name: visit.customerName,
      first_name: firstName,
      last_name: lastName,
      FirstName: firstName,
      LastName: lastName,
      phone: visit.phone,
      mobile: visit.phone,
      Phone: visit.phone,
      MobilePhone: visit.phone,
      email: visit.email || '',
      Email: visit.email || '',
      project: visit.project,
      project_name: visit.project,
      Project: visit.project,
      preferred_date: visit.preferredDate,
      preferred_time: visit.preferredTime,
      site_visit_date: visit.preferredDate,
      site_visit_time: visit.preferredTime,
      pickup_location: visit.pickupLocation || '',
      number_of_visitors: visit.numberOfVisitors || 1,
      status: visit.status || 'Requested',
      notes: visit.notes || '',
      Description: `Site visit requested for ${visit.preferredDate} at ${visit.preferredTime}. Pickup: ${visit.pickupLocation || 'Self'}. Notes: ${visit.notes || 'None'}`,
      lead_source: 'Website - Private Site Visit Booking',
      LeadSource: 'Website - Private Site Visit Booking',
      created_at: visit.createdAt,
      website_url: typeof window !== 'undefined' ? window.location.origin : 'https://www.veloradevelopers.com',
      // Nested object
      site_visit: {
        id: visit.id,
        customerName: visit.customerName,
        firstName,
        lastName,
        phone: visit.phone,
        email: visit.email,
        project: visit.project,
        preferredDate: visit.preferredDate,
        preferredTime: visit.preferredTime,
        status: visit.status,
        pickupLocation: visit.pickupLocation,
        numberOfVisitors: visit.numberOfVisitors,
        createdAt: visit.createdAt,
        notes: visit.notes,
      },
    };
  },

  /**
   * Core dispatcher to send a formatted payload to the CRM webhook URL
   */
  async dispatch(payload: any, customSettings?: CRMIntegrationSettings): Promise<CRMDispatchResult> {
    const settings = customSettings || getStoredCRMSettings();

    if (!settings.enabled || !settings.webhookUrl?.trim()) {
      return {
        success: false,
        message: 'CRM integration is disabled or no Webhook URL is configured.',
      };
    }

    const webhookUrl = settings.webhookUrl.trim();
    const securityToken = settings.securityToken?.trim() || '';
    const authHeaderName = settings.authHeaderName?.trim() || 'Authorization';
    const authHeaderType = settings.authHeaderType || 'bearer';

    // 1. Attempt server-side proxy dispatch (avoids browser CORS issues)
    try {
      const proxyRes = await fetch('/api/crm/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookUrl,
          securityToken,
          authHeaderName,
          authHeaderType,
          payload,
        }),
      });

      if (proxyRes.ok) {
        const data = await proxyRes.json();
        return {
          success: Boolean(data.success),
          statusCode: data.statusCode || proxyRes.status,
          message: data.success ? 'Successfully delivered to CRM' : (data.error || 'CRM returned error status'),
          responseData: data.data,
        };
      }
    } catch {
      // If server proxy is not reachable (e.g. static hosting on CDN), proceed to direct fetch
    }

    // 2. Direct client-side fetch fallback
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (securityToken) {
        headers[authHeaderName] = authHeaderType === 'raw' ? securityToken : `Bearer ${securityToken}`;
        headers['x-api-key'] = securityToken;
        headers['x-webhook-token'] = securityToken;
      }

      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      let resData: any = null;
      try {
        resData = await res.json();
      } catch {
        resData = await res.text().catch(() => null);
      }

      return {
        success: res.ok,
        statusCode: res.status,
        message: res.ok ? 'Successfully delivered to CRM' : `CRM responded with status ${res.status}`,
        responseData: resData,
      };
    } catch (err: any) {
      console.warn('Direct CRM webhook delivery note:', err?.message || err);
      return {
        success: false,
        message: `Network error connecting to CRM: ${err?.message || 'Check Webhook URL & CORS'}`,
      };
    }
  },

  /**
   * Dispatch a newly created website inquiry / lead
   */
  async dispatchLead(lead: Lead, type: 'lead' | 'partner' = 'lead'): Promise<CRMDispatchResult> {
    const settings = getStoredCRMSettings();
    if (!settings.enabled || !settings.webhookUrl) {
      return { success: false, message: 'CRM is disabled' };
    }

    if (type === 'partner' && !settings.sendOnChannelPartner) {
      return { success: false, message: 'Channel partner forwarding is disabled' };
    }
    if (type === 'lead' && !settings.sendOnWebsiteLead) {
      return { success: false, message: 'Website lead forwarding is disabled' };
    }

    const payload = this.formatLeadPayload(lead, type);
    return await this.dispatch(payload, settings);
  },

  /**
   * Dispatch a scheduled site visit
   */
  async dispatchSiteVisit(visit: SiteVisitRequest): Promise<CRMDispatchResult> {
    const settings = getStoredCRMSettings();
    if (!settings.enabled || !settings.webhookUrl || !settings.sendOnSiteVisit) {
      return { success: false, message: 'Site visit forwarding is disabled' };
    }

    const payload = this.formatSiteVisitPayload(visit);
    return await this.dispatch(payload, settings);
  },

  /**
   * Send a test lead payload to verify the configured Webhook URL and Token
   */
  async testConnection(settings: CRMIntegrationSettings): Promise<CRMDispatchResult> {
    const testPayload = {
      event: 'test_connection',
      timestamp: new Date().toISOString(),
      source: 'Velora Developers CRM Connection Test',
      test: true,
      lead_id: 'TEST-001',
      name: 'Nathen Pereira (Test Lead)',
      phone: '+91 93221 33592',
      email: 'veloradevelopers.inquiry@gmail.com',
      project: 'Amrutvan (Ratnagiri)',
      lead_source: 'Website Integration Test',
      requirement: 'Testing webhook URL and security token delivery.',
      status: 'Test',
      website_url: typeof window !== 'undefined' ? window.location.origin : 'https://www.veloradevelopers.com',
      lead: {
        id: 'TEST-001',
        name: 'Nathen Pereira (Test Lead)',
        phone: '+91 93221 33592',
        email: 'veloradevelopers.inquiry@gmail.com',
        project: 'Amrutvan',
        notes: 'Verification test payload triggered from Velora Admin Panel.',
      },
    };

    return await this.dispatch(testPayload, { ...settings, enabled: true });
  },
};

