import { useState } from 'react'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { CarsPage } from './pages/CarsPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { VideosPage } from './pages/VideosPage'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />
      case 'cars': return <CarsPage />
      case 'articles': return <ArticlesPage />
      case 'videos': return <VideosPage />
      default: return <Dashboard />
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

export default App
