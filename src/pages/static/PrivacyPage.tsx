import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dervora-cream px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-dervora-beige">
        <h1 className="font-heading text-4xl font-bold text-dervora-primary mb-2">Privacy Policy</h1>
        <p className="font-body text-sm text-dervora-dark/50 mb-8 border-b border-gray-100 pb-4">Last Updated: October 2026</p>

        <div className="space-y-8 font-body text-dervora-dark/80 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-bold text-dervora-dark mb-3">Data Collected</h2>
            <p>We collect anonymous data from every visitor to monitor traffic and fix bugs. We ask you to log in and provide certain personal information (such as your name and email address) in order to be able to save your profile and the skincare routines associated with it. You are able to view, change, and remove your data associated with your profile.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-dervora-dark mb-3">Sharing of Data</h2>
            <p>We don't share your personal information with third parties. Only aggregated, anonymized data is periodically transmitted to external services to help us improve Dervora.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-bold text-dervora-dark mb-3">Security</h2>
            <p>We take reasonable steps to secure your personally identifiable information against unauthorized access or disclosure. However, no security or encryption method can be guaranteed to protect information from hackers or human error.</p>
          </section>
          
          <section>
            <h2 className="font-heading text-xl font-bold text-dervora-dark mb-3">Contact</h2>
            <p>Should you have any question or concern, please write to <a href="mailto:dervora.24@gmail.com" className="text-dervora-primary underline">dervora.24@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};