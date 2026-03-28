import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Plus, X, Search, Car as CarIcon, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CarsPage = () => {
  const cars = useQuery(api.cars.list) || [];
  const addCar = useMutation(api.cars.add);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    category: '',
    url: '',
    spec: '',
    year: '',
    engine: '',
    power: '',
    drivetrain: '',
    weight: '',
    origin: '',
    description: '',
    gallery: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Default cover image logic
      const submitData = { ...formData };
      if (!submitData.url && submitData.gallery.length > 0) {
        submitData.url = submitData.gallery[0];
      }
      
      await addCar(submitData);
      setIsAdding(false);
      setFormData({
        slug: '', title: '', category: '', url: '', spec: '', year: '',
        engine: '', power: '', drivetrain: '', weight: '', origin: '',
        description: '', gallery: [],
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add car. Make sure all fields are filled correctly.');
    }
  };

  const filteredCars = cars.filter(car => 
    car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Cars</h2>
          <p className="text-[#a0a0a0]">Manage your vehicle inventory.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Car
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0a0]" size={20} />
        <input
          type="text"
          placeholder="Search cars..."
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-2 pl-12 pr-4 focus:outline-none focus:border-[#ff3e00]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <motion.div
            key={car._id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass flex flex-col p-4 group"
          >
            <div className="aspect-video bg-white/5 rounded-lg mb-4 flex items-center justify-center text-[#ff3e00]">
              <CarIcon size={48} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold truncate pr-2">{car.title}</h3>
                <span className="text-xs text-[#a0a0a0] px-2 py-1 bg-white/5 rounded whitespace-nowrap">{car.year}</span>
              </div>
              <p className="text-sm text-[#a0a0a0] mb-4">{car.category}</p>
              <div className="flex justify-between items-center text-xs text-[#a0a0a0]">
                 <span>{car.engine}</span>
                 <span>{car.power}</span>
              </div>
            </div>
            <button className="mt-4 flex items-center gap-1 text-sm text-[#ff3e00] opacity-0 group-hover:opacity-100 transition-opacity">
              Edit Details <ChevronRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-[#a0a0a0] hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-2xl font-bold mb-6">Add New Car</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* General Info */}
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-[#ff3e00] uppercase tracking-wider mb-3">General Information</h4>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input 
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <input 
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-xs"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <input 
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year</label>
                    <input 
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.year}
                      onChange={e => setFormData({...formData, year: e.target.value})}
                    />
                  </div>

                  {/* Spec Sheet Section */}
                  <div className="md:col-span-2 pt-2">
                    <h4 className="text-xs font-bold text-[#ff3e00] uppercase tracking-wider mb-3">Spec Sheet</h4>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Engine</label>
                    <input 
                      placeholder="e.g. 2.6L RB26DETT Twin-Turbo I6"
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.engine}
                      onChange={e => setFormData({...formData, engine: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Power</label>
                    <input 
                      placeholder="e.g. 280 PS (factory) / est. 330+ PS"
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.power}
                      onChange={e => setFormData({...formData, power: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Drivetrain</label>
                    <input 
                      placeholder="e.g. ATTESA E-TS Pro AWD"
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.drivetrain}
                      onChange={e => setFormData({...formData, drivetrain: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kerb Weight</label>
                    <input 
                      placeholder="e.g. 1,560 kg"
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.weight}
                      onChange={e => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Origin</label>
                    <input 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.origin}
                      onChange={e => setFormData({...formData, origin: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium">Quick Spec Summary</label>
                    <input 
                      placeholder="e.g. RB26DETT // R34 GT-R V-SPEC"
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-xs"
                      value={formData.spec}
                      onChange={e => setFormData({...formData, spec: e.target.value})}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea 
                    required 
                    rows={3}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* Gallery Management */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Gallery Images ({formData.gallery.length}/15)</label>
                    {formData.gallery.length < 15 && (
                      <button 
                        type="button"
                        onClick={() => setFormData({
                          ...formData, 
                          gallery: [...formData.gallery, '']
                        })}
                        className="text-xs text-[#ff3e00] hover:underline"
                      >
                        + Add Image URL
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {formData.gallery.map((url, index) => (
                      <div key={index} className="flex gap-2 items-center group">
                        <div className="relative flex-1">
                          <input 
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2 text-xs"
                            value={url}
                            onChange={e => {
                              const newGallery = [...formData.gallery];
                              newGallery[index] = e.target.value;
                              // If this was the cover, update the cover URL too
                              const isCover = formData.url === url;
                              setFormData({
                                ...formData, 
                                gallery: newGallery,
                                url: isCover ? e.target.value : formData.url
                              });
                            }}
                          />
                          {url && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              {formData.url === url ? (
                                <span className="text-[10px] bg-[#ff3e00] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Cover</span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => setFormData({...formData, url: url})}
                                  className="text-[10px] bg-white/10 text-[#a0a0a0] px-1.5 py-0.5 rounded font-bold hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100 uppercase tracking-tighter"
                                >
                                  Make Cover
                                </button>
                              )}
                              <div className="w-8 h-8 rounded border border-[#333] overflow-hidden bg-black flex items-center justify-center p-1">
                                 <img src={url} alt="preview" className="max-w-full max-h-full object-cover" />
                              </div>
                            </div>
                          )}
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newGallery = formData.gallery.filter((_, i) => i !== index);
                            // If we remove the cover image, clear the cover selection
                            const isCover = formData.url === url;
                            setFormData({
                              ...formData, 
                              gallery: newGallery,
                              url: isCover ? '' : formData.url
                            });
                          }}
                          className="p-2 text-[#a0a0a0] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {formData.gallery.length === 0 && (
                     <div className="border border-dashed border-[#333] rounded-lg p-8 text-center text-[#a0a0a0] text-sm hover:border-[#ff3e00]/50 transition-colors cursor-pointer"
                        onClick={() => setFormData({...formData, gallery: ['']})}
                     >
                       No images added. Click to add your first image URL.
                     </div>
                  )}

                  {formData.gallery.length >= 15 && (
                    <p className="text-xs text-amber-500">Maximum of 15 images reached.</p>
                  )}
                </div>
                
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-[#a0a0a0] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                  >
                    Save Vehicle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
