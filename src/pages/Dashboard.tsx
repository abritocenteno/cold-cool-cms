import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Car, FileText, Video } from 'lucide-react';

export const Dashboard = () => {
  const cars = useQuery(api.cars.list) || [];
  const articles = useQuery(api.articles.list) || [];
  const videos = useQuery(api.videos.list) || [];

  const stats = [
    { label: 'Total Cars', value: cars.length, icon: Car, color: 'text-blue-400' },
    { label: 'Total Articles', value: articles.length, icon: FileText, color: 'text-emerald-400' },
    { label: 'Total Videos', value: videos.length, icon: Video, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="text-[#a0a0a0]">Here's what's happening with your website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 flex items-center gap-4"
          >
            <div className={`p-3 rounded-full bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-[#a0a0a0]">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Cars</h3>
          <div className="space-y-4">
            {cars.slice(0, 5).map((car: any) => (
              <div key={car._id} className="flex justify-between items-center border-b border-[#333] pb-2">
                <span>{car.title}</span>
                <span className="text-xs text-[#a0a0a0] px-2 py-1 bg-white/5 rounded">{car.category}</span>
              </div>
            ))}
            {cars.length === 0 && <p className="text-[#a0a0a0]">No cars found.</p>}
          </div>
        </div>

        <div className="glass p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Articles</h3>
          <div className="space-y-4">
            {articles.slice(0, 5).map((article: any) => (
              <div key={article._id} className="flex justify-between items-center border-b border-[#333] pb-2">
                <span>{article.title}</span>
                <span className="text-xs text-[#a0a0a0] px-2 py-1 bg-white/5 rounded">{article.date}</span>
              </div>
            ))}
            {articles.length === 0 && <p className="text-[#a0a0a0]">No articles found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
