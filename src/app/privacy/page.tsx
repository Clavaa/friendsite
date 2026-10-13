import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "../../components/LegalPage";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.brandName} collects, uses and protects the information you share on this website, by phone and by text message.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const brand = siteConfig.brandName;
  return (
    <LegalPage title="Privacy Policy" updated="October 13, 2026">
      <p>
        This policy explains what {brand} (&ldquo;Sunbird,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;)
        collects when you visit {siteConfig.domain.replace("https://", "")}, fill out a form, call us,
        or exchange text messages with us, and what we do with it.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>What you send us.</strong> When you fill out a form we receive what you enter:
          your name, phone number, ZIP code or state, your child&rsquo;s age range, the choices you
          select, your email address if you give one, and any question you type. When you call or
          text us we receive your phone number and what you tell us.
        </li>
        <li>
          <strong>Basic visit information.</strong> Like most websites, we record which pages are
          viewed, the site that referred you, your device and browser type, and your approximate
          location (country and state). We use this to see how the site is used and to keep it
          working. Our own visit counter does not set cookies.
        </li>
        <li>
          <strong>Advertising tags.</strong> We use Google and Meta (Facebook/Instagram) tags to
          measure whether our ads lead to a call or a form being sent. These services may set
          cookies and receive visit information such as the page viewed. We do not send them the
          contents of your form.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To call, text or email you back about the request you made.</li>
        <li>To check insurance benefits and schedule intake when you ask us to.</li>
        <li>To answer questions and provide customer support.</li>
        <li>To run, protect and improve the website and measure our advertising.</li>
        <li>To meet legal and regulatory obligations.</li>
      </ul>

      <h2>How we share it</h2>
      <p>
        We do not sell your personal information. We share it only with service providers that
        help us operate (for example website hosting, email delivery and our phone system), who may
        use it only to provide those services to us, and when the law requires it.
      </p>

      <h2 id="sms">Text messaging (SMS)</h2>
      <p>
        If you give us your mobile number and agree to receive text messages, we may text you about
        your inquiry, insurance benefit checks, intake and scheduling, appointment reminders and
        replies to messages you send us.
      </p>
      <ul>
        <li>
          <strong>
            No mobile information will be shared with third parties or affiliates for marketing or
            promotional purposes.
          </strong>{" "}
          Information sharing with service providers described above excludes text messaging
          originator opt-in data and consent; this information will not be shared with any third
          parties.
        </li>
        <li>Message frequency varies. Message and data rates may apply.</li>
        <li>
          Reply <strong>STOP</strong> at any time to stop receiving texts. Reply{" "}
          <strong>HELP</strong> for help, or contact us at{" "}
          <a href={siteConfig.phoneHref}>{siteConfig.phone}</a> or{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </li>
        <li>Agreeing to receive texts is never a condition of receiving services.</li>
      </ul>
      <p>
        See our <Link href="/terms#sms">SMS terms</Link> for more detail.
      </p>

      <h2>Health information</h2>
      <p>
        Our website forms ask only for basic contact details. Please do not send medical records or
        detailed health information through the website or by text message. Health information we
        receive in the course of providing care is protected under HIPAA and is handled under our
        Notice of Privacy Practices, not this website policy.
      </p>

      <h2>Children</h2>
      <p>
        This website is written for parents and caregivers. It is not directed to children, and we
        do not knowingly collect information directly from children under 13.
      </p>

      <h2>Keeping information safe</h2>
      <p>
        We limit access to the information you send us to the people who need it to help you, and
        we use reputable providers with safeguards appropriate to the information they handle. No
        method of transmission over the internet is completely secure.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Reply STOP to any text to opt out of text messages.</li>
        <li>
          Ask us to update or delete the contact information you sent through this website by
          emailing <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </li>
        <li>Use your browser settings to block or clear cookies.</li>
      </ul>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy we will post the new version here and update the date at the top.
      </p>

      <h2>Contact us</h2>
      <p>
        {brand}
        <br />
        Phone: <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
        <br />
        Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
      </p>
    </LegalPage>
  );
}
