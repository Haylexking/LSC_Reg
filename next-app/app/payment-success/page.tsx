"use client";

import React, { Suspense } from "react";
import PaymentSuccess from "../../src/components/PaymentSuccess";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <Suspense fallback={<div>Loading payment confirmation...</div>}>
        <PaymentSuccess />
      </Suspense>
    </div>
  );
}