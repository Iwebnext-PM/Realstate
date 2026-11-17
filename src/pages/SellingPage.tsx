import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { GENERATED_IMAGES } from '../data/defaultData';
import { formatPhoneDisplay, toTelHref } from '../lib/formatters';
import { DocumentHead } from '../components/DocumentHead';
import { InquiryForm } from '../components/InquiryForm';
import { PropertyImage } from '../components/PropertyImage';

export const SellingPage: React.FC = () => {
  const { generalConfig, contentConfig, seoConfig } = useSite();

  return (
    <>
      <DocumentHead
        title={seoConfig.pages.selling.title}
        description={seoConfig.pages.selling.description}
      />

      <section className="bg-[#0B1D33] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-3">
              Seller Representation
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white text-balance mb-4">
              {contentConfig.sellingHeadline}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-8">
              {contentConfig.sellingIntro}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm">
              <a
                href={toTelHref(generalConfig.phone)}
                className="inline-flex items-center gap-2 text-white hover:text-[#D4B773] transition-colors font-mono-num"
              >
                <Phone className="w-4 h-4 text-[#D4B773]" />
                <span>{formatPhoneDisplay(generalConfig.phone)}</span>
              </a>
              <a
                href={`mailto:${generalConfig.email}`}
                className="inline-flex items-center gap-2 text-white hover:text-[#D4B773] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D4B773]" />
                <span>{generalConfig.email}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] overflow-hidden border border-white/15">
              <PropertyImage
                src={GENERATED_IMAGES.luxuryKitchen}
                alt="Professionally photographed luxury kitchen interior"
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Seller Process Steps */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-2">
                Our Selling Process
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1D33]">
                From Property Preparation to Closing Table
              </h2>
            </div>

            <div className="space-y-4">
              {contentConfig.sellingSteps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white border border-[#E2E6EC] p-6 sm:p-7 flex items-start gap-5"
                >
                  <span className="font-mono-num text-lg font-semibold text-[#9E7E38] shrink-0">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0B1D33] mb-1.5">{step.title}</h3>
                    <p className="text-sm text-[#525C68] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Valuation Request Form */}
          <div className="lg:col-span-5">
            <InquiryForm
              defaultInquiryType="Property Valuation"
              showPropertyAddressField
              showPropertyTypeField
              heading="Request a Property Valuation"
              subheading="Enter your property details to arrange a confidential market evaluation and selling consultation."
              submitLabel="Request Property Valuation"
            />
          </div>
        </div>
      </section>
    </>
  );
};
