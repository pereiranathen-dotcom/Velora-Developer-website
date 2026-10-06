import { useState, useEffect } from 'react';
import { StoreService } from '../services/store';
import {
  Project,
  LocationMilestone,
  GalleryItem,
  Testimonial,
  Lead,
  SiteVisitRequest,
  WebsiteContent,
  ContactSettings,
  SEOSettings,
  AdminUser,
  PromotionalPopupSettings,
  ChannelPartnerContent,
} from '../types';

export function useStore() {
  const [projects, setProjects] = useState<Project[]>(StoreService.getProjects);
  const [locations, setLocations] = useState<LocationMilestone[]>(StoreService.getLocations);
  const [gallery, setGallery] = useState<GalleryItem[]>(StoreService.getGallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(StoreService.getTestimonials);
  const [leads, setLeads] = useState<Lead[]>(StoreService.getLeads);
  const [siteVisits, setSiteVisits] = useState<SiteVisitRequest[]>(StoreService.getSiteVisits);
  const [content, setContent] = useState<WebsiteContent>(StoreService.getWebsiteContent);
  const [channelPartnerContent, setChannelPartnerContent] = useState<ChannelPartnerContent>(
    StoreService.getChannelPartnerContent
  );
  const [settings, setSettings] = useState<ContactSettings>(StoreService.getContactSettings);
  const [seo, setSeo] = useState<SEOSettings>(StoreService.getSEOSettings);
  const [popupSettings, setPopupSettings] = useState<PromotionalPopupSettings>(StoreService.getPopupSettings);
  const [isAdmin, setIsAdmin] = useState<boolean>(StoreService.isAdminAuthenticated);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(StoreService.getAdminUsers);
  const [currentUser, setCurrentUser] = useState<AdminUser>(StoreService.getCurrentUser);

  useEffect(() => {
    const handleUpdate = () => {
      setProjects(StoreService.getProjects());
      setLocations(StoreService.getLocations());
      setGallery(StoreService.getGallery());
      setTestimonials(StoreService.getTestimonials());
      setLeads(StoreService.getLeads());
      setSiteVisits(StoreService.getSiteVisits());
      setContent(StoreService.getWebsiteContent());
      setChannelPartnerContent(StoreService.getChannelPartnerContent());
      setSettings(StoreService.getContactSettings());
      setSeo(StoreService.getSEOSettings());
      setPopupSettings(StoreService.getPopupSettings());
      setIsAdmin(StoreService.isAdminAuthenticated());
      setAdminUsers(StoreService.getAdminUsers());
      setCurrentUser(StoreService.getCurrentUser());
    };

    window.addEventListener('velora_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('velora_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    projects,
    locations,
    gallery,
    testimonials,
    leads,
    siteVisits,
    content,
    channelPartnerContent,
    settings,
    seo,
    popupSettings,
    isAdmin,
    adminUsers,
    currentUser,
  };
}
