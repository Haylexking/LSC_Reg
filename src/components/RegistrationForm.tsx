import { useState, FormEvent } from 'react';
import { supabase, BootcampRegistration } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const SKILLS = [
  'UI/UX Design',
  'Frontend Development',
  'Backend Development',
  'Data Analysis',
  'Product Management',
  'Video Editing',
  'Photography',
  'Livestreaming and Audio Production',
  'Social media management & Content creation',
  'Graphic design'
];

const MEMBER_PAYMENT_LINK = 'https://paystack.com/pay/member-fee';
const VISITOR_PAYMENT_LINK = 'https://paystack.com/pay/visitor-fee';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    skill: '',
    membership_status: 'Member' as 'Member' | 'Visitor'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // registrationId is intentionally unused in current UI flow - keep state if we need it later
  const [, setRegistrationId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.full_name || !formData.email || !formData.phone_number || !formData.skill) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const registration: BootcampRegistration = {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        skill: formData.skill,
        membership_status: formData.membership_status,
        payment_status: 'pending'
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: dbError } = (await supabase
        .from('bootcamp_registrations')
        .insert([registration])
        .select()
        .maybeSingle()) as any;

      if (dbError) {
        if (dbError.code === '23505') {
          setError('This email is already registered');
        } else {
          setError('Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      if (data) {
        const id = data.id as string | undefined;
        setRegistrationId(id || null);

        const paymentLink = formData.membership_status === 'Member'
          ? MEMBER_PAYMENT_LINK
          : VISITOR_PAYMENT_LINK;

        const callbackUrl = `${window.location.origin}/payment-success?registration_id=${id}`;
        const fullPaymentLink = `${paymentLink}?callback_url=${encodeURIComponent(callbackUrl)}`;

        window.location.href = fullPaymentLink;
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone_number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-2">
            Select Skill <span className="text-red-500">*</span>
          </label>
          <select
            id="skill"
            value={formData.skill}
            onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a skill...</option>
            {SKILLS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Membership Status <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="membership_status"
                value="Member"
                checked={formData.membership_status === 'Member'}
                onChange={(e) => setFormData({ ...formData, membership_status: e.target.value as 'Member' | 'Visitor' })}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Member</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="membership_status"
                value="Visitor"
                checked={formData.membership_status === 'Visitor'}
                onChange={(e) => setFormData({ ...formData, membership_status: e.target.value as 'Member' | 'Visitor' })}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700">Visitor</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Processing...
            </>
          ) : (
            <>
              Proceed to Payment
            </>
          )}
        </button>

        <p className="mt-4 text-xs text-gray-500 text-center">
          You will be redirected to Paystack to complete your payment
        </p>
      </form>
    </div>
  );
}
