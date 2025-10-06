"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
  const res: any = await (supabase as any).from('bootcamp_registrations').select('*').order('created_at', { ascending: false });
        setRows(res?.data || []);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-3xl w-full mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Admin - Registrations</h2>
      {loading ? <div>Loading...</div> : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-left">Email</th>
              <th className="border px-2 py-1 text-left">Phone</th>
              <th className="border px-2 py-1 text-left">Skill</th>
              <th className="border px-2 py-1 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id || i}>
                <td className="border px-2 py-1">{r.full_name}</td>
                <td className="border px-2 py-1">{r.email}</td>
                <td className="border px-2 py-1">{r.phone_number}</td>
                <td className="border px-2 py-1">{r.skill}</td>
                <td className="border px-2 py-1">{r.payment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
