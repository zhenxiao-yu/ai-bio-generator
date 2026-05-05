import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

export const metadata = {
  title: `Privacy Policy · ${SITE_NAME}`,
  description: `Privacy policy for ${SITE_NAME} — what data we collect, how we use it, and your rights.`,
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-8 md:px-10 slg:px-16 lg:px-24 max-w-[860px] mx-auto">
      {/* Back nav */}
      <Button asChild variant="ghost" size="sm" className="mb-8 gap-1.5 text-muted-foreground hover:text-foreground -ml-2">
        <Link href="/">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to BioLoom
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-10">
        Last updated: May 5, 2025 &nbsp;·&nbsp; Effective immediately
      </p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-foreground/90 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold mb-3">1. Overview</h2>
          <p>
            {SITE_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a free, open-source AI bio generator available at{" "}
            <a href={SITE_URL} className="text-primary underline underline-offset-4">{SITE_URL}</a>.
            We are committed to protecting your privacy. This policy explains what information is
            collected when you use {SITE_NAME}, how it is used, and your rights.
          </p>
          <p className="mt-3">
            <strong>Short version:</strong> We do not create accounts, do not store your bios on our
            servers, and do not sell your data to anyone.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">2. Information We Collect</h2>

          <h3 className="font-medium mb-2 text-foreground">2a. Information you provide</h3>
          <p>
            When you generate a bio, the text you enter (your name, role, interests, tone
            preferences) is sent to our API endpoint and forwarded to a third-party AI provider
            (Groq or Google Gemini) to generate bio suggestions. This content is <strong>not stored</strong> by
            us after the response is returned. Review the third-party providers&apos; privacy policies:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><a href="https://groq.com/privacy-policy/" className="text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer">Groq Privacy Policy</a></li>
            <li><a href="https://policies.google.com/privacy" className="text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          </ul>

          <h3 className="font-medium mb-2 mt-5 text-foreground">2b. Automatically collected information</h3>
          <p>
            We use <strong>Vercel Analytics</strong> and <strong>Vercel Speed Insights</strong> to understand
            aggregate usage patterns (page views, performance metrics). These tools collect anonymised data
            including approximate geolocation (country/region), browser type, and device type. No personally
            identifiable information is stored. See{" "}
            <a href="https://vercel.com/legal/privacy-policy" className="text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.
          </p>
          <p className="mt-3">
            We also collect anonymous, aggregated event data (e.g., &quot;bio_copied&quot;, &quot;platform_changed&quot;)
            to understand which features are used. No bio content or personal details are included in
            these events.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. Local Storage</h2>
          <p>
            {SITE_NAME} stores your generated bios and preferences (theme, history) in your browser&apos;s
            <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono mx-1">localStorage</code>.
            This data <strong>never leaves your device</strong> and is not transmitted to our servers.
            You can clear it at any time by clearing your browser&apos;s local storage or site data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">4. Cookies</h2>
          <p>
            {SITE_NAME} does not use tracking cookies or advertising cookies. Vercel may set
            functional cookies necessary for deployment and performance monitoring. We do not
            use third-party advertising networks.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">5. Third-Party Services</h2>
          <p>We rely on the following third-party services to operate {SITE_NAME}:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Vercel</strong> — hosting, analytics, edge functions</li>
            <li><strong>Groq</strong> — AI language model inference (primary)</li>
            <li><strong>Google Gemini</strong> — AI language model inference (fallback)</li>
          </ul>
          <p className="mt-3">
            Each of these services operates under their own privacy policies linked above. We encourage
            you to review them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">6. Data Retention</h2>
          <p>
            We do not retain your bio generation inputs or outputs on our servers. Server-side
            request logs (IP addresses, timestamps, HTTP status codes) may be retained by Vercel
            per their standard infrastructure logging practices, typically for up to 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">7. Children&apos;s Privacy</h2>
          <p>
            {SITE_NAME} is not directed at children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you believe we have
            inadvertently collected such information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the
            top of this page reflects when changes were last made. Continued use of {SITE_NAME}
            after any changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">9. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please open an issue on our{" "}
            <a
              href="https://github.com/zhenxiao-yu/ai-bio-generator/issues"
              className="text-primary underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            .
          </p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          {SITE_NAME} is open-source. Review the full source code on{" "}
          <a href="https://github.com/zhenxiao-yu/ai-bio-generator" className="text-primary underline underline-offset-4" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
        <div className="flex gap-3 text-xs text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        </div>
      </div>
    </main>
  );
}
