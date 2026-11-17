import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import type { InquiryType } from '../types/realEstate';

interface InquiryFormProps {
  defaultInquiryType?: InquiryType;
  propertyId?: string;
  propertyTitle?: string;
  propertyAddress?: string;
  showPropertyAddressField?: boolean;
  showPropertyTypeField?: boolean;
  showSubjectField?: boolean;
  allowInquiryTypeSelect?: boolean;
  submitLabel?: string;
  heading?: string;
  subheading?: string;
  externalSelectedType?: InquiryType;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  defaultInquiryType = 'General Contact',
  propertyId = '',
  propertyTitle = '',
  propertyAddress = '',
  showPropertyAddressField = false,
  showPropertyTypeField = false,
  showSubjectField = false,
  allowInquiryTypeSelect = false,
  submitLabel = 'Send Inquiry',
  heading,
  subheading,
  externalSelectedType,
}) => {
  const { submitInquiry } = useSite();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressInput, setAddressInput] = useState(propertyAddress);
  const [propertyTypeInput, setPropertyTypeInput] = useState('House');
  const [inquiryType, setInquiryType] = useState<InquiryType>(defaultInquiryType);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (externalSelectedType) {
      setInquiryType(externalSelectedType);
    }
  }, [externalSelectedType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (trimmedPhone.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please provide a valid phone number.');
      return;
    }
    if (showPropertyAddressField && !addressInput.trim()) {
      setErrorMsg('Please enter the property address for valuation.');
      return;
    }
    if (!trimmedMessage) {
      setErrorMsg('Please include a brief message about how we can help.');
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        propertyId,
        propertyTitle,
        propertyAddress: showPropertyAddressField ? addressInput.trim() : propertyAddress,
        propertyType: showPropertyTypeField ? propertyTypeInput : '',
        inquiryType,
        subject: showSubjectField ? subject.trim() : '',
        message: trimmedMessage,
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      if (showPropertyAddressField) setAddressInput('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? 'Could not submit your inquiry right now. Please try again or call 416-800-5898.'
          : 'Submission failed.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-[#E2E6EC] p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#0B1D33] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display text-2xl font-semibold text-[#0B1D33] mb-2">
              Inquiry Received
            </h3>
            <p className="text-sm text-[#525C68] leading-relaxed mb-5">
              Thank you for reaching out to Frank Fu Feng Real Estate. Your message has been
              recorded and we will follow up promptly.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 border border-[#0B1D33] text-xs font-semibold text-[#0B1D33] hover:bg-[#0B1D33] hover:text-white transition-colors cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white border border-[#E2E6EC] p-6 sm:p-8 space-y-5">
      {heading && (
        <div className="space-y-1.5">
          <h3 className="font-display text-2xl font-semibold text-[#0B1D33]">{heading}</h3>
          {subheading && <p className="text-sm text-[#525C68]">{subheading}</p>}
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="inq-name" className="block text-xs font-semibold text-[#1E242B] mb-1.5">
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="inq-name"
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 border border-[#D4DAE2] bg-white text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
          />
        </div>

        <div>
          <label htmlFor="inq-phone" className="block text-xs font-semibold text-[#1E242B] mb-1.5">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <input
            id="inq-phone"
            type="tel"
            required
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="416-555-0199"
            className="w-full px-3.5 py-2.5 border border-[#D4DAE2] bg-white text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="inq-email" className="block text-xs font-semibold text-[#1E242B] mb-1.5">
          Email Address <span className="text-red-600">*</span>
        </label>
        <input
          id="inq-email"
          type="email"
          required
          maxLength={160}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 border border-[#D4DAE2] bg-white text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
        />
      </div>

      {allowInquiryTypeSelect && (
        <div>
          <label htmlFor="inq-type" className="block text-xs font-semibold text-[#1E242B] mb-1.5">
            Inquiry Type
          </label>
          <select
            id="inq-type"
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value as InquiryType)}
            className="w-full px-3.5 py-2.5 border border-[#D4DAE2] bg-white text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
          >
            <option value="Property Info">Request Property Information</option>
            <option value="Schedule Viewing">Schedule a Viewing</option>
            <option value="Availability">Check Availability</option>
          </select>
        </div>
      )}

      {showPropertyAddressField && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="inq-address" className="block text-xs font-semibold text-[#1E242B] mb-1.5">
              Property Address <span className="text-red-600">*</span>
            </label>
            <input
              id="inq-address"
              type="text"
              required
              maxLength={240}
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Street address & city"
              className="w-full px-3.5 py-2.5 border border-[#D4DAE2] bg-white text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
            />
          </div>
          {showPropertyTypeField && (
            <div>
              <label htmlFor="inq-prop-type" className="block text-xs font-semibold text-[#1E242B] mb-1.5">
                Property Type
              </label>
              <select
                id="inq-prop-type"
                value={propertyTypeInput}
                onChange={(e) => setPropertyTypeInput(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#D4DAE2] bg-white text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
              >
                <option value="House">House</option>
                <option value="Condo">Condo &amp; Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Luxury">Luxury Property</option>
                <option value="Commercial">Commercial Property</option>
                <option value="Investment">Investment Property</option>
              </select>
            </div>
          )}
        </div>
      )}

      {showSubjectField && (
        <div>
          <label htmlFor="inq-subject" className="block text-xs font-semibold text-[#1E242B] mb-1.5">
            Subject
          </label>
          <input
            id="inq-subject"
            type="text"
            maxLength={180}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Buying, selling, leasing, or investment question"
            className="w-full px-3.5 py-2.5 border border-[#D4DAE2] bg-white text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33]"
          />
        </div>
      )}

      <div>
        <label htmlFor="inq-message" className="block text-xs font-semibold text-[#1E242B] mb-1.5">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="inq-message"
          required
          rows={4}
          maxLength={3000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your timeline, preferred viewing window, or questions..."
          className="w-full px-3.5 py-2.5 border border-[#D4DAE2] bg-white text-sm text-[#1E242B] focus:outline-none focus:border-[#0B1D33] resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-6 bg-[#0B1D33] text-white text-sm font-semibold hover:bg-[#163254] disabled:opacity-60 transition-colors cursor-pointer"
      >
        {submitting ? 'Submitting...' : submitLabel}
      </button>
    </form>
  );
};
