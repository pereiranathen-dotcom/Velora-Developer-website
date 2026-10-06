import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Star, Eye, EyeOff, X, Save } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { Testimonial } from '../../types';

export const AdminTestimonialsView: React.FC = () => {
  const { testimonials } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const handleOpenNew = () => {
    setEditingItem({
      id: `test-${Date.now()}`,
      customerName: '',
      location: 'Mumbai',
      quote: '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      rating: 5,
      active: true,
      displayOrder: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const handleEdit = (test: Testimonial) => {
    setEditingItem({ ...test });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.customerName || !editingItem.quote) return;
    StoreService.saveTestimonial(editingItem);
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete testimonial from "${name}"?`)) {
      StoreService.deleteTestimonial(id);
    }
  };

  const handleToggleActive = (test: Testimonial) => {
    StoreService.saveTestimonial({
      ...test,
      active: !test.active,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[#00291E]">Testimonial Management</h2>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Manage genuine client reviews, site visit feedback, and testimonials shown on the website.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className={`bg-[#FFF8E7] rounded-xl p-6 border shadow-sm flex flex-col justify-between transition-all ${
              test.active ? 'border-[#C9A24A]/30' : 'border-gray-300 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-[#C9A24A]">
                  {Array.from({ length: test.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-[#26342D]/50 font-mono">{test.date}</span>
              </div>

              <p className="text-xs text-[#26342D]/85 leading-relaxed font-light italic">
                "{test.quote}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#C9A24A]/15 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-[#00291E] block">
                  {test.customerName}
                </span>
                <span className="text-[10px] text-[#0B4A36]">{test.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(test)}
                  className="p-1.5 text-[#00291E] hover:text-[#C9A24A]"
                  title={test.active ? 'Hide on website' : 'Show on website'}
                >
                  {test.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleEdit(test)}
                  className="p-1.5 text-[#00291E] hover:text-[#C9A24A]"
                  title="Edit testimonial"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(test.id, test.customerName)}
                  className="p-1.5 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {modalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#00291E] text-white p-6 sm:p-7 rounded-xl border border-[#C9A24A]/40 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-lg text-[#F8F0D8]">
                {editingItem.customerName ? 'Edit Testimonial' : 'New Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/80 mb-1 font-medium">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={editingItem.customerName}
                  onChange={(e) => setEditingItem({ ...editingItem, customerName: e.target.value })}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Customer City / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai / Pune / Thane"
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-1 font-medium">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Customer review statement..."
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none resize-none"
                />
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
