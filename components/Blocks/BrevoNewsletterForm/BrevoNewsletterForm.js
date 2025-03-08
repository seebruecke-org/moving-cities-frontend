import Columns from '@/components/Columns';
import { useEffect, useState } from 'react';
import Markdown from '@/components/Markdown';
import Button from '@/components/Button';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function BrevoNewsletterForm({ termsLabel, successMessage }) {
  const { t: tNewsletter } = useTranslation('newsletter');
  const [showSuccess, setShowSuccess] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const { success } = router.query;

  useEffect(() => {
    if (success === 'true') {
      setShowSuccess(true);
    }
  }, [success]);

  const handleFormSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError(null);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/brevo/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstname,
        email,
        newsletterUrl: window.location.href
      })
    });
    const json = await response.json();
    setIsLoading(false);
    if (json.success) {
      setShowSuccess(true);
    } else {
      setError(json.error);
    }
  };

  return (
    <Columns className="max-w-8xl mt-16">
      <span />
      <div className="px-8">
        {showSuccess ? (
          <Markdown>{successMessage}</Markdown>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="text-m font-bold">{tNewsletter('name')}</div>
            <input
              className="mt-5 border border-grey-300 px-4 py-3 block w-full text-s"
              type="text"
              name="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <div className="text-m font-bold mt-12">{tNewsletter('email')}</div>
            <input
              className="mt-5 border border-grey-300 px-4 py-3 block w-full text-s"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="mt-12 flex items-start">
              <input type="checkbox" id="newsletterTerms" required className="mt-2" />
              <label htmlFor="newsletterTerms" className="ml-5">
                <Markdown
                  isSmall={true}
                  classNames={{
                    p: '!text-s'
                  }}
                >
                  {termsLabel}
                </Markdown>
              </label>
            </div>
            {error ? <div className="my-6 text-red-300 text-m">{error}</div> : null}
            <div className="mt-16 text-right">
              <Button priority type="submit" disabled={isLoading}>
                {tNewsletter('submit')}
                <span class="text-red-300 ml-4">⟶</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </Columns>
  );
}
