import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { formatPhoneDisplay } from '../lib/formatters';
import { DocumentHead } from '../components/DocumentHead';

export const LegalPage: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  const { generalConfig } = useSite();
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';

  return (
    <>
      <DocumentHead
        title={`${title} | ${generalConfig.businessName}`}
        description={`${title} for ${generalConfig.businessName}.`}
      />

      <div className="bg-[#0B1D33] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-slate-300 mt-2">{generalConfig.businessName}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6 text-sm text-[#1E242B] leading-relaxed">
        {isPrivacy ? (
          <>
            <section className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                1. Information Collected
              </h2>
              <p>
                When you submit a property inquiry, viewing request, property valuation form, or contact message through this website, {generalConfig.businessName} collects the contact details you provide (such as your name, email address, phone number, and message) solely to respond to your request.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                2. How Information Is Used
              </h2>
              <p>
                Your submitted details are used exclusively to provide requested real estate information, arrange property viewings, prepare requested property valuations, and communicate regarding real estate services. We do not sell personal contact details to third parties.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                3. Privacy Requests
              </h2>
              <p>
                To request updates or deletion of an inquiry you submitted, please contact {generalConfig.email} or call {formatPhoneDisplay(generalConfig.phone)}.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                1. Informational Purpose
              </h2>
              <p>
                Property listings, descriptions, measurements, pricing, and availability displayed on this website are provided for general informational purposes and are subject to verification, prior sale, lease, or change without notice.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                2. No Binding Offer
              </h2>
              <p>
                Viewing a property listing or submitting an inquiry form on this website does not constitute a binding purchase, lease, or representation agreement.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                3. Contact
              </h2>
              <p>
                Questions regarding these terms may be directed to {generalConfig.email} or {formatPhoneDisplay(generalConfig.phone)}.
              </p>
            </section>
          </>
        )}

        <div className="pt-6 border-t border-[#E2E6EC]">
          <Link to="/" className="text-xs font-semibold text-[#0B1D33] underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};
