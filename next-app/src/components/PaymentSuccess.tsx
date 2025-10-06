"use client";
import React, { useEffect } from 'react';

// Map skills to WhatsApp group invite links. Update these with your real group URLs.
const WHATSAPP_LINKS: Record<string, string> = {
  'UI/UX Design': 'https://chat.whatsapp.com/GgINJULtVLe54x4tdIcIM9?mode=ems_copy_t',
  'Backend Development': 'https://chat.whatsapp.com/Cb8zZllKsGE6ShZmlkkSaj?mode=ems_copy_t',
  'Frontend Development': 'https://chat.whatsapp.com/KlDv6XjmxTF4WL7hOEdWdQ?mode=ems_copy_t',
  'Data Analysis': 'https://chat.whatsapp.com/JSgNjNoAH7P46y0mFVRwUT?mode=ems_copy_t',
  'Product Management': 'https://chat.whatsapp.com/Iwjn2aUum5Q6tUgGARDX2v?mode=ems_copy_t',
  'Photography': 'https://chat.whatsapp.com/LIJsNGvvCY5D4aZP3B4Bk2?mode=ems_copy_t',
  'Graphic Design': 'https://chat.whatsapp.com/J2QmlJUKLaGEHazj6yiezj?mode=ems_copy_t',
  'Social Media management & Content Creation': 'https://chat.whatsapp.com/HEscWQuPGpm6c4O8AT19KO?mode=ems_copy_t',
  'Video editing': 'https://chat.whatsapp.com/By3roPLIjYZ8mkmQmfKxJH?mode=ems_copy_t',
  'Livestreaming & Audio Production': 'https://chat.whatsapp.com/BXtxyL2y7un8Q1U2Z3reDY?mode=ems_copy_t',
  'Other': 'https://chat.whatsapp.com/EtfDKT1zd692QeESE2wANP?mode=ems_copy_t',
};

function getWhatsappLinkForSkill(skill: string) {
  return WHATSAPP_LINKS[skill] || WHATSAPP_LINKS['Other'];
}
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function PaymentSuccess() {
  const params = useSearchParams();

  const [skill, setSkill] = React.useState<string | null>(null);

  useEffect(() => {
    const registrationId = params.get('registration_id');
    if (registrationId) {
      (async () => {
        try {
          // fetch the registration so we can show skill-specific whatsapp link
          const { data, error } = await (supabase as any)
            .from('bootcamp_registrations')
            .select('skill')
            .eq('id', registrationId)
            .single();

          if (error) {
            console.error('Failed to fetch registration', error);
          } else {
            setSkill(data?.skill || null);
          }

          // update payment status to 'paid'
          await (supabase as any)
            .from('bootcamp_registrations')
            .update({ payment_status: 'paid' })
            .eq('id', registrationId);
        } catch (err) {
          console.error('Failed to update/fetch registration', err);
        }
      })();
    }
  }, [params]);

  return (
    <div className="max-w-md w-full space-y-8 text-center">
      <div className="mx-auto bg-primary/10 dark:bg-primary/20 rounded-full h-24 w-24 flex items-center justify-center">
        <div className="bg-primary rounded-full h-16 w-16 flex items-center justify-center">
          <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">Payment Successful!</h2>
        <p className="mt-4 text-lg text-foreground-light/80 dark:text-foreground-dark/80">Congratulations! You are now registered for the <strong>LSC The Supernatural Army Tech Hub Bootcamp.</strong></p>
        <p className="mt-2 text-md text-foreground-light/60 dark:text-foreground-dark/60">To get started, please join our official WhatsApp group for important updates and community discussions.</p>
      </div>
      <div className="pt-4">
        {skill ? (
          (() => {
            const link = getWhatsappLinkForSkill(skill);
            const isFallback = link === WHATSAPP_LINKS['Other'];
            return (
              <a
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.25 1.75a8.5 8.5 0 105.033 15.352l2.217 2.217a.75.75 0 101.06-1.06l-2.216-2.218A8.5 8.5 0 0010.25 1.75zm-1.5 6a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zM10 12a1 1 0 112 0 1 1 0 01-2 0z"></path>
                  </svg>
                </span>
                {isFallback ? 'Join General Group' : `Join WhatsApp Group for ${skill}`}
              </a>
            );
          })()
        ) : (
          <a className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" href="#">
            Join WhatsApp Group
          </a>
        )}
      </div>
    </div>
  );
}
