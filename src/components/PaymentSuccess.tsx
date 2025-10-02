import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const updatePaymentStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const registrationId = params.get('registration_id');
      const reference = params.get('reference');

      if (!registrationId) {
        setError('Invalid registration');
        setLoading(false);
        return;
      }

      try {
        const { error: updateError } = await supabase
          .from('bootcamp_registrations')
          .update({
            payment_status: 'completed',
            payment_reference: reference || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', registrationId);

        if (updateError) {
          setError('Failed to update payment status');
        } else {
          setUpdated(true);
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    updatePaymentStatus();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
            <p className="text-gray-600">Processing your registration...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering for the LSC The Supernatural Army Tech Hub Bootcamp.
            Your payment has been confirmed.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ol className="text-left text-sm text-blue-800 space-y-2">
              <li>1. Check your email for confirmation details</li>
              <li>2. Join our WhatsApp group for updates</li>
              <li>3. Prepare for an amazing learning experience!</li>
            </ol>
          </div>

          <a
            href="https://chat.whatsapp.com/your-group-link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
          >
            Join WhatsApp Group
            <ExternalLink className="ml-2" size={18} />
          </a>

          <div className="mt-6">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
