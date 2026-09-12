import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base text-center p-8">
      <div className="text-8xl font-bold font-mono text-blue/20 mb-4">404</div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Page not found</h1>
      <p className="text-sm text-t-3 mb-6">The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">
        Back to dashboard
      </button>
    </div>
  )
}
