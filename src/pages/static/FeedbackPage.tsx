import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';

// GANTI DENGAN ACCESS KEY DARI WEB3FORMS
const WEB3FORMS_ACCESS_KEY = '72d83d03-c18b-4afc-81aa-04723575eb37'

export const FeedbackPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [issues, setIssues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckbox = (val: string) => {
    setIssues(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Mengirim feedback...');

    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New Dervora Feedback from ${email}`,
        from_name: 'Dervora User',
        email: email,
        message: message,
        issues_reported: issues.length > 0 ? issues.join(', ') : 'No specific issues selected',
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Terima kasih! Feedback Anda berhasil terkirim.', { id: toastId });
        setMessage('');
        setEmail('');
        setIssues([]);
      } else {
        toast.error('Gagal mengirim feedback. Silakan coba lagi.', { id: toastId });
      }
    } catch (error) {
      toast.error('Terjadi kesalahan jaringan.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dervora-cream px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-dervora-beige">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mb-2">
          Have feedback?
        </h1>
        <p className="font-body text-dervora-dark/70 mb-8">We'd love to hear it!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dervora-primary font-body text-sm resize-none"
            required
          />

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-body font-semibold text-dervora-dark mb-2">Notice something that needs to be updated?</h3>
            <p className="font-body text-sm text-dervora-dark/60 mb-4">Let us know:</p>
            <div className="grid grid-cols-2 gap-3">
              {['Product Name', 'Ingredients', 'Directions', 'Other', 'Category', 'Product Image'].map(item => (
                <label key={item} className="flex items-center gap-2 cursor-pointer font-body text-sm text-dervora-dark/80">
                  <input 
                    type="checkbox" 
                    checked={issues.includes(item)}
                    onChange={() => handleCheckbox(item)}
                    className="w-4 h-4 rounded border-gray-300 text-dervora-primary focus:ring-dervora-primary"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-body font-semibold text-dervora-dark mb-2">How can we reach you?</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dervora-primary font-body text-sm"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>
        </form>
      </div>
    </div>
  );
};