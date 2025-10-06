"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function RegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('');
  // ✅ FIX: Use capitalized values that match the TypeScript interface
  const [membership, setMembership] = useState<'Member' | 'Visitor'>('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // ✅ REMOVED: Don't convert to lowercase
      // const normalizedMembership = membership.toLowerCase() as 'member' | 'visitor';

      // Insert registration into Supabase
      const insertRes: any = await (supabase as any)
        .from('bootcamp_registrations')
        .insert({
          full_name: fullName,
          email,
          phone_number: phone,
          skill,
          membership_status: membership, // ✅ Use the capitalized value directly
          payment_status: 'pending',
        })
        .select();

      if (insertRes?.error) {
        setError(insertRes.error.message || 'Failed to register');
        setLoading(false);
        return;
      }

      const registrationId =
        insertRes?.data?.[0]?.id || insertRes?.[0]?.id || null;

      if (!registrationId) {
        setError('Failed to get registration ID');
        setLoading(false);
        return;
      }

      // Initialize Paystack transaction
      const initRes = await fetch('/api/paystack/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          registrationId,
          memberType: membership, // ✅ Use capitalized value here too
        }),
      });

      const initData = await initRes.json();
      console.log('Paystack init response:', initData);

      if (!initRes.ok) {
        setError(initData?.error || 'Payment initialization failed');
        setLoading(false);
        return;
      }

      // ✅ Redirect to Paystack
      const authorizationUrl = initData?.data?.authorization_url;
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        setError('Payment provider did not return a payment URL');
      }
    } catch (err: any) {
      console.error('Submit Error:', err);
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">
            Register for the Bootcamp
          </h2>
          <p className="mt-2 text-sm text-placeholder-light dark:text-placeholder-dark">
            Fill in your details to secure your spot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-lg">
            {/* Inputs */}
            <input
              id="full-name"
              name="full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full px-3 py-3 border border-input-border-light dark:border-input-border-dark bg-input-light dark:bg-input-dark text-foreground-light dark:text-foreground-dark placeholder-placeholder-light dark:placeholder-placeholder-dark rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />

            <input
              id="email-address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email address"
              required
              className="w-full px-3 py-3 border border-input-border-light dark:border-input-border-dark bg-input-light dark:bg-input-dark text-foreground-light dark:text-foreground-dark placeholder-placeholder-light dark:placeholder-placeholder-dark rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />

            <input
              id="phone-number"
              name="phone-number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
              className="w-full px-3 py-3 border border-input-border-light dark:border-input-border-dark bg-input-light dark:bg-input-dark text-foreground-light dark:text-foreground-dark placeholder-placeholder-light dark:placeholder-placeholder-dark rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />

            {/* Skills Dropdown */}
            <select
              id="skill"
              name="skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full px-3 py-3 border border-input-border-light dark:border-input-border-dark bg-input-light dark:bg-input-dark text-foreground-light dark:text-foreground-dark rounded-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            >
              <option value="">Select Skill</option>
              <option>UI/UX Design</option>
              <option>Backend Development</option>
              <option>Frontend Development</option>
              <option>Data Analysis</option>
              <option>Product Management</option>
              <option>Photography</option>
              <option>Graphic Design</option>
              <option>Social Media Management & Content Creation</option>
              <option>Video Editing</option>
              <option>Livestreaming & Audio Production</option>
            </select>

            {/* Membership */}
            <fieldset>
              <legend className="sr-only">Membership Status</legend>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="member"
                    name="membership-status"
                    type="radio"
                    value="Member" // ✅ Changed to capitalized
                    checked={membership === 'Member'} // ✅ Changed to capitalized
                    onChange={() => setMembership('Member')} // ✅ Changed to capitalized
                    className="h-4 w-4 text-primary border-input-border-light dark:border-input-border-dark focus:ring-primary"
                  />
                  <label
                    htmlFor="member"
                    className="ml-3 text-sm font-medium text-foreground-light dark:text-foreground-dark"
                  >
                    Member / PSF
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="visitor"
                    name="membership-status"
                    type="radio"
                    value="Visitor" // ✅ Changed to capitalized
                    checked={membership === 'Visitor'} // ✅ Changed to capitalized
                    onChange={() => setMembership('Visitor')} // ✅ Changed to capitalized
                    className="h-4 w-4 text-primary border-input-border-light dark:border-input-border-dark focus:ring-primary"
                  />
                  <label
                    htmlFor="visitor"
                    className="ml-3 text-sm font-medium text-foreground-light dark:text-foreground-dark"
                  >
                    Visitor
                  </label>
                </div>
              </div>
            </fieldset>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Processing…' : 'Register & Pay'}
          </button>
        </form>
      </div>
    </div>
  );
}