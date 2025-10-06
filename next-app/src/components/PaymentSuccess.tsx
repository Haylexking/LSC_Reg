"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

// Map skills to WhatsApp group invite links
const WHATSAPP_LINKS: Record<string, string> = {
  "UI/UX Design": "https://chat.whatsapp.com/GgINJULtVLe54x4tdIcIM9?mode=ems_copy_t",
  "Backend Development": "https://chat.whatsapp.com/Cb8zZllKsGE6ShZmlkkSaj?mode=ems_copy_t",
  "Frontend Development": "https://chat.whatsapp.com/KlDv6XjmxTF4WL7hOEdWdQ?mode=ems_copy_t",
  "Data Analysis": "https://chat.whatsapp.com/JSgNjNoAH7P46y0mFVRwUT?mode=ems_copy_t",
  "Product Management": "https://chat.whatsapp.com/Iwjn2aUum5Q6tUgGARDX2v?mode=ems_copy_t",
  Photography: "https://chat.whatsapp.com/LIJsNGvvCY5D4aZP3B4Bk2?mode=ems_copy_t",
  "Graphic Design": "https://chat.whatsapp.com/J2QmlJUKLaGEHazj6yiezj?mode=ems_copy_t",
  "Social Media management & Content Creation": "https://chat.whatsapp.com/HEscWQuPGpm6c4O8AT19KO?mode=ems_copy_t",
  "Video editing": "https://chat.whatsapp.com/By3roPLIjYZ8mkmQmfKxJH?mode=ems_copy_t",
  "Livestreaming & Audio Production": "https://chat.whatsapp.com/BXtxyL2y7un8Q1U2Z3reDY?mode=ems_copy_t",
  Other: "https://chat.whatsapp.com/EtfDKT1zd692QeESE2wANP?mode=ems_copy_t",
};

function getWhatsappLinkForSkill(skill: string) {
  return WHATSAPP_LINKS[skill] || WHATSAPP_LINKS["Other"];
}

export default function PaymentSuccess() {
  const params = useSearchParams();
  const [skill, setSkill] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const registrationId = params.get("registration_id");
    const reference = params.get("reference");

    if (!registrationId || !reference) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Step 1️⃣ Verify transaction with Paystack
        const verifyRes = await fetch(`/api/paystack/verify?reference=${reference}`);
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || verifyData?.data?.status !== "success") {
          console.error("❌ Paystack verification failed", verifyData);
          setVerified(false);
          setLoading(false);
          return;
        }

        // Step 2️⃣ Fetch the registration record
        const { data, error } = await (supabase as any)
          .from("bootcamp_registrations")
          .select("skill")
          .eq("id", registrationId)
          .single();

        if (error) {
          console.error("❌ Failed to fetch registration", error);
        } else {
          setSkill(data?.skill || null);
        }

        // Step 3️⃣ Update payment status in Supabase
        await (supabase as any)
          .from("bootcamp_registrations")
          .update({ payment_status: "paid" })
          .eq("id", registrationId);

        setVerified(true);
      } catch (err) {
        console.error("❌ Verification error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="text-center py-24">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Verifying your payment, please wait...
        </p>
      </div>
    );
  }

  // ⚠️ Verification failed
  if (!verified) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-red-600">Payment Verification Failed</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          We couldn’t verify your payment. If you were charged, please contact support.
        </p>
      </div>
    );
  }

  // ✅ Success UI
  return (
    <div className="max-w-md w-full space-y-8 text-center">
      <div className="mx-auto bg-primary/10 dark:bg-primary/20 rounded-full h-24 w-24 flex items-center justify-center">
        <div className="bg-primary rounded-full h-16 w-16 flex items-center justify-center">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">
          Payment Successful!
        </h2>
        <p className="mt-4 text-lg text-foreground-light/80 dark:text-foreground-dark/80">
          Congratulations! You are now registered for the{" "}
          <strong>LSC The Supernatural Army Tech Hub Bootcamp.</strong>
        </p>
        <p className="mt-2 text-md text-foreground-light/60 dark:text-foreground-dark/60">
          To get started, please join our official WhatsApp group for important updates and community
          discussions.
        </p>
      </div>
      <div className="pt-4">
        {skill ? (
          (() => {
            const link = getWhatsappLinkForSkill(skill);
            const isFallback = link === WHATSAPP_LINKS["Other"];
            return (
              <a
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {isFallback ? "Join General Group" : `Join WhatsApp Group for ${skill}`}
              </a>
            );
          })()
        ) : (
          <a
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            href={WHATSAPP_LINKS["Other"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join General Group
          </a>
        )}
      </div>
    </div>
  );
}