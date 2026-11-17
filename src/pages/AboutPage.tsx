import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Mail, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { GENERATED_IMAGES } from '../data/defaultData';
import { formatPhoneDisplay, toTelHref } from '../lib/formatters';
import { DocumentHead } from '../components/DocumentHead';
import { PropertyImage } from '../components/PropertyImage';

export const AboutPage: React.FC = () => {
  const { generalConfig, contentConfig, seoConfig } = useSite();

  return (
    <>
      <DocumentHead
        title={seoConfig.pages.about.title}
        description={seoConfig.pages.about.description}
      />

      <div className="bg-[#0B1D33] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-2">
            About Frank Fu Feng
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white text-balance max-w-3xl">
            {contentConfig.aboutHeadline}
          </h1>
        </div>
      </div>

      <section className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-5">
              <div className="bg-white border border-[#E2E6EC] p-3 h-full flex flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#ECEFF3] flex-1">
                  <PropertyImage
                    src={contentConfig.aboutPortraitUrl || GENERATED_IMAGES.frankPortrait}
                    alt={contentConfig.aboutPortraitAlt || 'Frank Fu Feng portrait'}
                    priority
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="pt-4 pb-2 px-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#525C68]">
                  <span className="font-semibold text-[#0B1D33]">{generalConfig.businessName}</span>
                  <span className="font-mono-num">{formatPhoneDisplay(generalConfig.phone)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-[#0B1D33] mb-3">
                    Introduction
                  </h2>
                  <p className="text-base text-[#1E242B] leading-relaxed whitespace-pre-line">
                    {contentConfig.aboutBio}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="bg-white border border-[#E2E6EC] p-6">
                    <h3 className="text-base font-semibold text-[#0B1D33] mb-2">
                      Real Estate Philosophy
                    </h3>
                    <p className="text-sm text-[#525C68] leading-relaxed">
                      {contentConfig.aboutPhilosophy}
                    </p>
                  </div>
                  <div className="bg-white border border-[#E2E6EC] p-6">
                    <h3 className="text-base font-semibold text-[#0B1D33] mb-2">
                      Professional Approach
                    </h3>
                    <p className="text-sm text-[#525C68] leading-relaxed">
                      {contentConfig.aboutApproach}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#E2E6EC] p-6">
                  <h3 className="text-base font-semibold text-[#0B1D33] mb-2">
                    Commitment to Clients
                  </h3>
                  <p className="text-sm text-[#525C68] leading-relaxed mb-4">
                    {contentConfig.aboutCommitment}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#E2E6EC] text-sm text-[#1E242B]">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#9E7E38] shrink-0 mt-0.5" />
                      <span>Dedicated buyer and seller support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#9E7E38] shrink-0 mt-0.5" />
                      <span>Personalized property recommendations</span>
                    </div>
                  </div>
                </div>

                {/* Only render credentials/certifications if explicitly added by Admin */}
                {contentConfig.aboutCredentials && contentConfig.aboutCredentials.length > 0 && (
                  <div className="bg-white border border-[#E2E6EC] p-6">
                    <h3 className="text-base font-semibold text-[#0B1D33] mb-3">
                      Experience &amp; Credentials
                    </h3>
                    <ul className="space-y-2 text-sm text-[#525C68]">
                      {contentConfig.aboutCredentials.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#9E7E38] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="bg-[#0B1D33] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-display text-2xl font-semibold text-white">
                    Speak With Frank Fu Feng
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1">
                    <a href={toTelHref(generalConfig.phone)} className="hover:text-white flex items-center gap-1.5 font-mono-num">
                      <Phone className="w-3.5 h-3.5 text-[#D4B773]" />
                      <span>{formatPhoneDisplay(generalConfig.phone)}</span>
                    </a>
                    <a href={`mailto:${generalConfig.email}`} className="hover:text-white flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#D4B773]" />
                      <span>{generalConfig.email}</span>
                    </a>
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B59449] text-[#0B1D33] text-xs font-semibold hover:bg-[#C9A85B] transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Schedule a Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
