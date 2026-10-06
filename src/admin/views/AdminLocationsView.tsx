import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Building2,
  Navigation,
  Factory,
  Save,
  X,
  Upload,
  CheckCircle2,
  Loader2,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { LocationMilestone } from '../../types';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { ASSETS } from '../../data/initialData';
import { ImageDimensionBadge } from '../../components/common/ImageDimensionBadge';

export const AdminLocationsView: React.FC = () => {
  const { locations, content } = useStore();
  const [editingItem, setEditingItem] = useState<LocationMilestone | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Strategic Location Photo state
  const [locationPhoto, setLocationPhoto] = useState(content.locationImage || ASSETS.scenicRoad);
  const [locationPhotoAlt, setLocationPhotoAlt] = useState(
    content.locationImageAlt ||
      'Scenic winding mountain highway during sunset with white car driving to Mandangad Ratnagiri'
  );
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const optimized = await optimizeImageFile(file, 1600, 1000, 0.78);
      setLocationPhoto(optimized);
      StoreService.saveWebsiteContent({
        ...content,
        locationImage: optimized,
        locationImageAlt: locationPhotoAlt,
      });
      showToast('✓ Strategic Location highway photo updated and saved live to website!');
    } catch {
      showToast('Could not optimize image. Try another photo.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSavePhotoManual = () => {
    StoreService.saveWebsiteContent({
      ...content,
      locationImage: locationPhoto,
      locationImageAlt: locationPhotoAlt,
    });
    showToast('✓ Strategic Location photo saved live to website!');
  };

  const handleResetPhotoDefault = () => {
    setLocationPhoto(ASSETS.scenicRoad);
    StoreService.saveWebsiteContent({
      ...content,
      locationImage: ASSETS.scenicRoad,
    });
    showToast('Restored authentic Velora highway photo.');
  };

  const handleOpenNew = () => {
    setEditingItem({
      id: `loc-${Date.now()}`,
      name: '',
      distance: '',
      icon: 'map-pin',
      displayOrder: locations.length + 1,
    });
    setModalOpen(true);
  };

  const handleEdit = (item: LocationMilestone) => {
    setEditingItem({ ...item });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.distance) return;
    StoreService.updateLocation(editingItem);
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" from location list?`)) {
      StoreService.deleteLocation(id);
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'map-pin':
        return <MapPin className="w-4 h-4 text-[#C9A24A]" />;
      case 'building':
        return <Building2 className="w-4 h-4 text-[#C9A24A]" />;
      case 'highway':
        return <Navigation className="w-4 h-4 text-[#C9A24A]" />;
      case 'factory':
        return <Factory className="w-4 h-4 text-[#C9A24A]" />;
      default:
        return <MapPin className="w-4 h-4 text-[#C9A24A]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[#00291E] border-2 border-[#C9A24A] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#C9A24A] shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#00291E]">Location & Connectivity Management</h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Manage nearby towns, highway access distances, and industrial zone milestones shown on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location Milestone</span>
        </button>
      </div>

      {/* STRATEGIC LOCATION PHOTO MANAGEMENT CARD */}
      <div className="bg-[#FFF8E7] rounded-xl p-5 sm:p-6 border-2 border-[#C9A24A]/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C9A24A]/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-[#00291E] text-[#C9A24A] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Homepage Section 6 Photo
              </span>
              <h3 className="font-serif text-lg text-[#00291E] font-medium">
                Strategic Location Highway Cover Photo
              </h3>
            </div>
            <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
              Change the prominent highway photography displayed on the homepage right next to the location milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-2 rounded shadow flex items-center gap-1.5 transition-all">
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>Upload Highway Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={handlePhotoUpload}
              />
            </label>

            <button
              type="button"
              onClick={handleResetPhotoDefault}
              className="text-xs text-[#26342D]/70 hover:text-[#00291E] px-2 py-1.5 underline"
            >
              Reset Default
            </button>
          </div>
        </div>

        {/* Dimension Specification Badge */}
        <ImageDimensionBadge
          variant="banner"
          context="Strategic Location Highway Photo"
          dimensions="1600 × 1000 px"
          aspectRatio="16:10 (Scenic Highway Ratio)"
          maxSize="1.5 MB"
          formats="JPG, PNG, WebP"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-5 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#00291E] border border-[#C9A24A]/40 shadow-md">
            <img
              src={locationPhoto}
              alt="Strategic Location Live Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00291E]/95 border border-[#C9A24A]/40 p-2.5 rounded-lg text-white max-w-[170px] shadow-xl pointer-events-none">
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#C9A24A] block">Highways</span>
              <span className="text-[10px] text-white/90 font-medium block">Mumbai-Goa Highway (NH-66)</span>
            </div>
            <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
              Current Live Photo
            </span>
          </div>

          <div className="md:col-span-7 space-y-3 text-xs">
            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Image URL / Data String
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationPhoto}
                  onChange={(e) => setLocationPhoto(e.target.value)}
                  placeholder="https://... or upload photo from computer"
                  className="flex-1 bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] font-mono text-[11px] outline-none"
                />
                <button
                  type="button"
                  onClick={handleSavePhotoManual}
                  className="px-4 py-2 bg-[#00291E] hover:bg-[#0B4A36] text-[#C9A24A] font-bold rounded text-xs flex items-center gap-1 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#00291E] font-semibold mb-1">
                Image Alt Tag (SEO)
              </label>
              <input
                type="text"
                value={locationPhotoAlt}
                onChange={(e) => setLocationPhotoAlt(e.target.value)}
                className="w-full bg-[#F8F0D8] border border-[#C9A24A]/40 focus:border-[#00291E] rounded px-3 py-2 text-[#00291E] text-xs outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF8E7] rounded-xl border border-[#C9A24A]/25 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#C9A24A]/20 bg-[#F8F0D8] text-[#26342D]/60 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Icon</th>
              <th className="py-3 px-4">Milestone / Destination</th>
              <th className="py-3 px-4">Distance</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C9A24A]/10">
            {locations.map((loc) => (
              <tr key={loc.id} className="hover:bg-[#F8F0D8]/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-7 h-7 rounded-full bg-[#00291E] flex items-center justify-center">
                    {getIcon(loc.icon)}
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold text-[#00291E]">{loc.name}</td>
                <td className="py-3 px-4 font-bold text-[#0B4A36]">{loc.distance}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(loc)}
                      className="p-1.5 text-[#00291E] hover:text-[#C9A24A]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id, loc.name)}
                      className="p-1.5 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#00291E] text-white p-6 rounded-xl border border-[#C9A24A]/40 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg text-[#F8F0D8]">
                {editingItem.name ? 'Edit Location' : 'New Location Milestone'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/80 mb-1 font-medium">Place Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandangad Town"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Distance *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 km / 190 km / 0 km"
                  value={editingItem.distance}
                  onChange={(e) => setEditingItem({ ...editingItem, distance: e.target.value })}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Icon Type</label>
                <select
                  value={editingItem.icon}
                  onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value as any })}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                >
                  <option value="map-pin">Map Pin</option>
                  <option value="building">City / Building</option>
                  <option value="highway">Highway / Road</option>
                  <option value="factory">Industrial / MIDC</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9A24A] text-[#00291E] font-semibold rounded uppercase text-xs shadow"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
