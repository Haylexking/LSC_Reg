import { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import PaymentSuccess from './components/PaymentSuccess';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'success' | 'admin'>('home');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/payment-success') {
      setCurrentPage('success');
    } else if (path === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  if (currentPage === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code2 className="text-white" size={28} />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                LSC The Supernatural Army
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Tech Hub Bootcamp</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentPage === 'home' ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Join Our Tech Bootcamp
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Register now to secure your spot in our comprehensive tech training program.
                Learn from industry experts and transform your career.
              </p>
            </div>

            <RegistrationForm />

            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Available Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    'UI/UX Design',
                    'Frontend Development',
                    'Backend Development',
                    'Data Analysis',
                    'Product Management',
                    'Video Editing',
                    'Photography',
                    'Livestreaming and Audio Production',
                    'Social Media Management',
                    'Graphic Design'
                  ].map((skill) => (
                    <div
                      key={skill}
                      className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center"
                    >
                      <p className="text-sm font-medium text-gray-800">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <PaymentSuccess />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2025 LSC The Supernatural Army Tech Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
