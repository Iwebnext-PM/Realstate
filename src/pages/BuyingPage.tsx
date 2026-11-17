import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { GENERATED_IMAGES } from '../data/defaultData';
import { formatPhoneDisplay, toTelHref } from '../lib/formatters';
import { DocumentHead } from '../components/DocumentHead';
import { InquiryForm } from '../components/InquiryForm';
import { PropertyImage } from '../components/PropertyImage';

export const BuyingPage: React.FC = () => {
  const { generalConfig, contentConfig, seoConfig } = useSite();

  return (
    <>
      <DocumentHead
        title={seoConfig.pages.buying.title}
        description={seoConfig.pages.buying.description}
      />

      <section className="bg-[#0B1D33] text-white py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4B773] mb-3">
              Buyer Advisory
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white text-balance mb-4">
              {contentConfig.buyingHeadline}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-8">
              {contentConfig.buyingIntro}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/properties?listingType=Sale"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#B59449] text-[#0B1D33] text-xs font-semibold hover:bg-[#C9A85B] transition-colors whitespace-nowrap"
              >
                <span>Browse Properties For Sale</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={toTelHref(generalConfig.phone)}
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-colors font-mono-num whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-[#D4B773]" />
                <span>Call {formatPhoneDisplay(generalConfig.phone)}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] overflow-hidden border border-white/15">
              <PropertyImage
                src={GENERATED_IMAGES.penthouseInterior}
                alt="Sunlit modern interior living room"
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9E7E38] mb-2">
                Acquisition Roadmap
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B1D33]">
                Five Steps to Purchasing With Confidence
              </h2>
            </div>

            <div className="space-y-4">
              {contentConfig.buyingSteps.map((step) => (
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

            <div className="bg-white border border-[#E2E6EC] p-6 sm:p-7 space-y-3">
              <h3 className="font-display text-2xl font-semibold text-[#0B1D33]">
                What to Prepare Before Viewing
              </h3>
              <ul className="space-y-2.5 text-sm text-[#525C68]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9E7E38] shrink-0 mt-0.5" />
                  <span>Confirmed budget range and mortgage pre-approval status.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9E7E38] shrink-0 mt-0.5" />
                  <span>Must-have criteria versus flexible preferences (bedrooms, parking, transit, outdoor space).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#9E7E38] shrink-0 mt-0.5" />
                  <span>Target move-in or closing timeline so offer terms align cleanly.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <InquiryForm
              defaultInquiryType="Property Info"
              heading="Start Your Property Search"
              subheading="Share what you are looking for and Frank Fu Feng will assemble tailored recommendations."
              submitLabel="Request Buyer Consultation"
            />
          </div>
        </div>
      </section>
    </>
  );
};
