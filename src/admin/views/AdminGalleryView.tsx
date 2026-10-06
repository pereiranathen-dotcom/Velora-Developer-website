import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, X, Save, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { GalleryItem } from '../../types';
import { ImageDimensionBadge } from '../../components/common/ImageDimensionBadge';

export const AdminGalleryView: React.FC = () => {
  const { gallery, projects } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newModalOpen, setNewModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('project');
  const [project, setProject] = useState('Amrutvan');
  const [altText, setAltText] = useState('');

  const categories = ['all', 'project', 'location', 'lifestyle', 'amenities', 'master-plan'];

  const filtered = gallery.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleToggleActive = (item: GalleryItem) => {
    StoreService.saveGalleryItem({
      ...item,
      active: !item.active,
    });
  };

  const handleDelete = (id: string, itemTitle: string) => {
    if (window.confirm(`Delete "${itemTitle}" from gallery?`)) {
      StoreService.deleteGalleryItem(id);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    StoreService.saveGalleryItem({
      id: `gal-${Date.now()}`,
      title,
      image: imageUrl,
      category,
      project,
      alt: altText || title,
      displayOrder: gallery.length + 1,
      active: true,
    });

    setTitle('');
    setImageUrl('');
    setAltText('');
    setNewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#00291E]">Gallery Management</h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Organize project photography, scenic milestones, master layout blueprints, and lifestyle spaces.
          </p>
          <div className="mt-2">
            <ImageDimensionBadge
              dimensions="1200 × 800 px"
              aspectRatio="3:2 / 4:3 (Landscape)"
              maxSize="1.5 MB"
              formats="JPG, PNG, WebP"
            />
          </div>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs uppercase font-medium px-4 py-1.5 rounded-full transition-all ${
              selectedCategory === cat
                ? 'bg-[#00291E] text-white shadow-sm'
                : 'bg-[#FFF8E7] text-[#00291E] hover:bg-[#C9A24A]/20 border border-[#C9A24A]/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-[#FFF8E7] rounded-xl overflow-hidden border shadow-sm flex flex-col justify-between transition-all ${
              item.active ? 'border-[#C9A24A]/30' : 'border-gray-300 opacity-60'
            }`}
          >
            <div className="aspect-[4/3] bg-[#00291E] relative overflow-hidden">
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-[#00291E]/90 text-[#C9A24A] text-[10px] font-semibold uppercase px-2 py-0.5 rounded">
                {item.category}
              </div>
              <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                {item.project}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <h4 className="font-serif text-sm text-[#00291E] font-medium leading-snug">
                {item.title}
              </h4>

              <div className="mt-4 pt-3 border-t border-[#C9A24A]/15 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`flex items-center gap-1 text-[11px] font-medium ${
                    item.active ? 'text-emerald-700' : 'text-gray-500'
                  }`}
                >
                  {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.active ? 'Visible' : 'Hidden'}</span>
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload/Add Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#00291E] text-white p-6 sm:p-7 rounded-xl border border-[#C9A24A]/40 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg text-[#F8F0D8]">Add Gallery Image</h3>
              <button onClick={() => setNewModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <ImageDimensionBadge
              variant="dark"
              dimensions="1200 × 800 px"
              aspectRatio="3:2 / 4:3 (Landscape)"
              maxSize="1.5 MB"
              formats="JPG, PNG, WebP"
            />

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/80 mb-1 font-medium">Image Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amrutvan Sunset Promenade"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none capitalize"
                  >
                    <option value="project">Project</option>
                    <option value="location">Location</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="amenities">Amenities</option>
                    <option value="master-plan">Master Plan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 mb-1 font-medium">Project</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Alt Text</label>
                <input
                  type="text"
                  placeholder="Accessible description for image"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9A24A] text-[#00291E] font-semibold rounded uppercase text-xs shadow"
                >
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
