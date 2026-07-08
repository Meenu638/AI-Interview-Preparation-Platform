import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-center px-4">
    <p className="text-6xl font-display font-extrabold text-primary-600">404</p>
    <h1 className="text-2xl font-display font-bold mt-4">Page not found</h1>
    <p className="text-gray-400 mt-2 mb-6">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary">Go Home</Link>
  </div>
);

export default NotFoundPage;
