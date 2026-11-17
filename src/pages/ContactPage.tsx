import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { formatPhoneDisplay, toTelHref } from '../lib/formatters';
import { DocumentHead } from '../components/DocumentHead';
import { InquiryForm } from '../components/InquiryForm';
import { LocationCard } from '../components/LocationCard';

export const ContactPage: React.FC = () => {
  const { generalConfig, seoConfig } = useSite();

  const socialItems = [
    { label: 'LinkedIn', url: generalConfig.socialLinks.linkedin },
    { label: 'Instagram', url: generalConfig.socialLinks.instagram },
    { label: 'Facebook', url: generalConfig.socialLinks.facebook },
    { label: 'YouTube', url: generalConfig.socialLinks.youtube },
    { label: 'WeChat', url: generalConfig.socialLinks.wechat },
  ].filter((item) => item.url && item.url.trim().length > 0);

  return (
    <>
      <DocumentHead
        title={seoConfig.pages.contact.title}
        description={seoConfig.pages.contact.description}
      />

      <div className="bg-[#0B1D33] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-2">
            Direct Consultation
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white text-balance mb-3">
            Contact {generalConfig.businessName}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Reach out directly by phone, email, or the inquiry form below to discuss property listings, private viewings, or selling strategy.
          </p>
        </div>
      </div>

      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Direct Info & Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E2E6EC] p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-1">
                  Business Contact
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#0B1D33]">
                  {generalConfig.businessName}
                </h2>
              </div>

              <div className="space-y-4 border-t border-[#E2E6EC] pt-5">
                <a
                  href={toTelHref(generalConfig.phone)}
                  className="flex items-center gap-4 p-4 border border-[#E2E6EC] hover:border-[#0B1D33] transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#0B1D33] text-[#D4B773] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#525C68]">
                      Click to Call
                    </p>
                    <p className="text-base font-semibold font-mono-num text-[#0B1D33] group-hover:text-[#9E7E38]">
                      {formatPhoneDisplay(generalConfig.phone)}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${generalConfig.email}`}
                  className="flex items-center gap-4 p-4 border border-[#E2E6EC] hover:border-[#0B1D33] transition-colors group"
                >
                  <div className="w-10 h-10 bg-[#0B1D33] text-[#D4B773] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#525C68]">
                      Email Address
                    </p>
                    <p className="text-base font-semibold text-[#0B1D33] group-hover:text-[#9E7E38] break-all">
                      {generalConfig.email}
                    </p>
                  </div>
                </a>

                {generalConfig.businessLocation && (
                  <div className="flex items-start gap-4 p-4 border border-[#E2E6EC]">
                    <div className="w-10 h-10 bg-[#F1F3F6] text-[#0B1D33] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#525C68]">
                        Business Location
                      </p>
                      <p className="text-sm text-[#0B1D33] mt-0.5">
                        {generalConfig.businessLocation}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {socialItems.length > 0 && (
                <div className="pt-4 border-t border-[#E2E6EC]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#525C68] mb-3">
                    Connect Online
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {socialItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 border border-[#D4DAE2] text-xs font-semibold text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <LocationCard
              title={generalConfig.businessName}
              address={generalConfig.businessLocation}
              subtitle="Business location and map link can be updated in Admin Settings."
              lat={generalConfig.mapLat}
              lng={generalConfig.mapLng}
            />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <InquiryForm
              defaultInquiryType="General Contact"
              showSubjectField
              heading="Send a Message"
              subheading="All inquiries are delivered directly to our management inbox for prompt response."
              submitLabel="Send Message"
            />
          </div>
        </div>
      </section>
    </>
  );
};
