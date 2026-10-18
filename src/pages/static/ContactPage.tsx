import React from 'react';
import { Mail } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dervora-cream px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-dervora-primary mb-4">
          Contact Us
        </h1>
        <p className="font-body text-lg text-dervora-dark/70 mb-8">
          We'd love to hear from you.
        </p>
        <p className="font-body text-base text-dervora-dark/80 mb-10 max-w-lg mx-auto">
          Please send us an email and we'll get back to you as soon as possible.
        </p>
        
        <a 
          href="mailto:dervora.24@gmail.com" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-dervora-primary text-white font-body font-medium rounded-full hover:bg-dervora-primary-dark transition-colors shadow-lg"
        >
          <Mail size={24} />
          dervora.24@gmail.com
        </a>
      </div>
    </div>
  );
};