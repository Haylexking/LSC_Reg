"use client";
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function RegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('');
  const [membership, setMembership] = useState<'Member' | 'Visitor'>('Member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Insert registration with pending payment
      const insertRes: any = await (supabase as any)
        .from('bootcamp_registrations')
        .insert({
          full_name: fullName,
          email,
          phone_number: phone,
          skill,
          membership_status: membership,
          payment_status: 'pending'
        })
        .select();

      if (insertRes?.error) {
        setError(insertRes.error.message || 'Failed to register');
        setLoading(false);
        return;
      }

      const registrationId = insertRes?.data?.[0]?.id || insertRes?.[0]?.id || null;

      // Determine amount in kobo (Paystack expects the smallest currency unit)
      const nairaAmount = membership === 'Visitor' ? 10000 : 5000;
      const amountKobo = nairaAmount * 100;

      // Call server API to initialize Paystack transaction
      const initRes = await fetch('/api/paystack/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountKobo,
          email,
          fullName,
          registrationId,
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok) {
        setError(initData?.error || 'Payment initialization failed');
        setLoading(false);
        return;
      }

      // Redirect user to Paystack authorization URL
      const authorizationUrl = initData?.data?.authorization_url;
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        setError('Payment provider did not return a payment URL');
      }
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">Register for the Bootcamp</h2>
          <p className="mt-2 text-sm text-placeholder-light dark:text-placeholder-dark">Fill in your details to secure your spot.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input name="remember" type="hidden" value="true" />
          <div className="space-y-4 rounded-lg">
            <div>
              <label className="sr-only" htmlFor="full-name">Full Name</label>
              <input
                id="full-name"
                name="full-name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Full Name"
                required
                className="relative block w-full px-3 py-3 border border-input-border-light dark:border-input-border-dark bg-input-light dark:bg-input-dark text-foreground-light dark:text-foreground-dark placeholder-placeholder-light dark:placeholder-placeholder-dark rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="email-address">Email address</label>
              <input
                id="email-address"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                required
                className="relative block w-full px-3 py-3 border border-input-border-light dark:border-input-border-dark bg-input-light dark:bg-input-dark text-foreground-light dark:text-foreground-dark placeholder-placeholder-light dark:placeholder-placeholder-dark rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="phone-number">Phone Number</label>
              <input
                id="phone-number"
                name="phone-number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone Number"
                required
                className="relative block w-full px-3 py-3 border border-input-border-light dark:border-input-border-dark bg-input-light dark:bg-input-dark text-foreground-light dark:text-foreground-dark placeholder-placeholder-light dark:placeholder-placeholder-dark rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="skill">Select Skill</label>
              <select
                id="skill"
                name="skill"
                value={skill}
                onChange={e => setSkill(e.target.value)}
                className="relative block w-full px-3 py-3 border border-input-border-light dark:border-input-border-dark bg-input-light dark:bg-input-dark text-foreground-light dark:text-foreground-dark rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              >
                <option value="">Select Skill</option>
                <option>UI/UX Design</option>
                <option>Backend Development</option>
                <option>Frontend Development</option>
                <option>Data Analysis</option>
                <option>Product Management</option>
                <option>Photography</option>
                <option>Graphic Design</option>
                <option>Social Media management & Content Creation</option>
                <option>Video editing</option>
                <option>Livestreaming & Audio Production</option>
              </select>
            </div>
            <fieldset>
              <legend className="sr-only">Membership Status</legend>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="member"
                    name="membership-status"
                    type="radio"
                    value="member"
                    checked={membership === 'Member'}
                    onChange={() => setMembership('Member')}
                    className="h-4 w-4 text-primary border-input-border-light dark:border-input-border-dark focus:ring-primary"
                  />
                  <label className="ml-3 block text-sm font-medium text-foreground-light dark:text-foreground-dark" htmlFor="member">Member</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="visitor"
                    name="membership-status"
                    type="radio"
                    value="visitor"
                    checked={membership === 'Visitor'}
                    onChange={() => setMembership('Visitor')}
                    className="h-4 w-4 text-primary border-input-border-light dark:border-input-border-dark focus:ring-primary"
                  />
                  <label className="ml-3 block text-sm font-medium text-foreground-light dark:text-foreground-dark" htmlFor="visitor">Visitor</label>
                </div>
              </div>
            </fieldset>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary"
            >
              {loading ? 'Processing…' : 'Register & Pay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
