import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

/**
 * Behavioural + traffic analytics, mounted once from the root layout.
 *
 * - Microsoft Clarity — heatmaps, session recordings, dead/rage-click insight.
 * - Google Analytics 4 — traffic, acquisition channels, and the conversion
 *   events Google Ads reads to optimise spend. Link the GA4 property to Clarity
 *   from Clarity → Settings → Integrations.
 * - Vercel Analytics — page views + Web Vitals for the deployed site. No-ops
 *   automatically off Vercel, so it is safe to leave mounted everywhere.
 *
 * Clarity and GA4 fire only when their IDs are set, so local dev and preview
 * deploys stay out of the production properties.
 */
export function SiteAnalytics() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      {clarityId ? (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${clarityId}");`}
        </Script>
      ) : null}

      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');`}
          </Script>
        </>
      ) : null}

      <VercelAnalytics />
    </>
  );
}
