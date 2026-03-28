import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Plus, X, Search, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ArticlesPage = () => {
  const articles = useQuery(api.articles.list) || [];
  const addArticle = useMutation(api.articles.add);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    tag: '',
    image: '',
    body: [] as string[],
    relatedCarSlugs: [] as string[],
    gallery: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Default cover image logic
      const submitData = { ...formData };
      if (!submitData.image && submitData.gallery.length > 0) {
        submitData.image = submitData.gallery[0];
      }
      
      await addArticle(submitData);
      setIsAdding(false);
      setFormData({
        slug: '', title: '', excerpt: '', date: new Date().toISOString().split('T')[0],
        tag: '', image: '', body: [], relatedCarSlugs: [], gallery: [],
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add article.');
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Articles</h2>
          <p className="text-[#a0a0a0]">Manage your blog and news.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Article
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0a0]" size={20} />
        <input
          type="text"
          placeholder="Search articles..."
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg py-2 pl-12 pr-4 focus:outline-none focus:border-[#ff3e00]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <motion.div
            key={article._id}
            layout
            className="glass p-4 flex items-center gap-6 group hover:border-[#ff3e00]/50 transition-colors"
          >
            <div className="w-16 h-16 bg-white/5 rounded flex items-center justify-center text-emerald-400">
              <FileText size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{article.title}</h3>
              <div className="flex gap-3 text-xs text-[#a0a0a0] mt-1">
                <span>{article.date}</span>
                <span className="text-[#ff3e00] uppercase font-semibold">{article.tag}</span>
              </div>
            </div>
            <button className="text-[#ff3e00] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Edit <ChevronRight size={16} />
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
              
              <h3 className="text-2xl font-bold mb-6">Create New Article</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="text-sm font-medium">Tag</label>
                    <input 
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.tag}
                      onChange={e => setFormData({...formData, tag: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Excerpt</label>
                  <textarea 
                    required 
                    rows={2}
                    className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="text-sm font-medium">Date</label>
                    <input 
                      type="date"
                      required 
                      className="w-full bg-[#0d0d0d] border border-[#333] rounded px-3 py-2"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>

                {/* Gallery Management */}
                <div className="space-y-4">
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
                              // If this was the cover, update the cover image too
                              const isCover = formData.image === url;
                              setFormData({
                                ...formData, 
                                gallery: newGallery,
                                image: isCover ? e.target.value : formData.image
                              });
                            }}
                          />
                          {url && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              {formData.image === url ? (
                                <span className="text-[10px] bg-[#ff3e00] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Cover</span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => setFormData({...formData, image: url})}
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
                            const isCover = formData.image === url;
                            setFormData({
                              ...formData, 
                              gallery: newGallery,
                              image: isCover ? '' : formData.image
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
                       Click to add images. Cover will be picked from here.
                     </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
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
                    Publish Article
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
