import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "../../components/LegalPage";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: "Terms & SMS Terms",
  description: `Terms for using the ${siteConfig.brandName} website and for receiving text messages from us.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const brand = siteConfig.brandName;
  return (
    <LegalPage title="Terms & Conditions" updated="October 13, 2026">
      <p>
        These terms apply when you use the {brand} website or exchange text messages with us. By
        using the site or opting in to texts, you agree to them.
      </p>

      <h2 id="sms">Text messaging (SMS) terms</h2>
      <ul>
        <li>
          <strong>Program.</strong> {brand} sends text messages to parents and caregivers who have
          given us their mobile number and agreed to be texted. Messages cover your inquiry,
          insurance benefit checks, intake and scheduling, appointment reminders and replies to
          messages you send us.
        </li>
        <li>
          <strong>Frequency.</strong> Message frequency varies with your conversation with us.
        </li>
        <li>
          <strong>Cost.</strong> We do not charge for texts. Message and data rates may apply from
          your mobile carrier.
        </li>
        <li>
          <strong>Opting out.</strong> Reply <strong>STOP</strong> to any message to stop receiving
          texts. You will get one confirmation message and no more after that. Reply{" "}
          <strong>START</strong> to opt back in.
        </li>
        <li>
          <strong>Help.</strong> Reply <strong>HELP</strong>, call{" "}
          <a href={siteConfig.phoneHref}>{siteConfig.phone}</a> or email{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </li>
        <li>
          <strong>Consent.</strong> Agreeing to receive texts is not a condition of receiving
          services from us.
        </li>
        <li>
          <strong>Carriers.</strong> Mobile carriers are not liable for delayed or undelivered
          messages.
        </li>
        <li>
          <strong>Privacy.</strong> No mobile information will be shared with third parties or
          affiliates for marketing or promotional purposes. See our{" "}
          <Link href="/privacy#sms">Privacy Policy</Link>.
        </li>
        <li>
          <strong>Not for emergencies.</strong> Text messages are not monitored around the clock.
          In an emergency call 911.
        </li>
      </ul>

      <h2>Using this website</h2>
      <p>
        The information on this site is general information for families. It is not medical advice,
        a diagnosis, or benefits advice for your specific insurance plan, and reading it does not
        create a provider–client relationship. Services begin only after intake and a signed
        agreement with us.
      </p>
      <p>
        The site&rsquo;s text, images and design belong to {brand} and may not be reused without
        permission. We may update the site and these terms; the date at the top shows the latest
        version.
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
