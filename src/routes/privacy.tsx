import { createFileRoute } from "@tanstack/react-router";
import { meta } from "@/components/site";
import { PolicyEmail, PolicyPage } from "@/components/policy";
import { POLICY_LOCATION } from "@/content/site";

export const Route = createFileRoute("/privacy")({
  head: () =>
    meta(
      "Privacy Policy | RoboRoots",
      "How RoboRoots collects, uses and protects your information.",
    ),
  component: () => (
    <PolicyPage
      title="Privacy Policy"
      intro={
        <p>
          RoboRoots is a student-led initiative founded by Vyom Agrawal that brings robotics and
          STEM education to underserved students. This policy explains what information we collect
          when you visit our website, contact us or donate, and how we use it.
        </p>
      }
      sections={[
        [
          "Information we collect",
          <>
            <ul>
              <li>
                <strong>Contact form:</strong> your name, email, organization (optional) and message
                when you contact us.
              </li>
              <li>
                <strong>Donations:</strong> donations are processed by Stripe. Stripe collects your
                payment details directly. We never see or store your full card number. We receive
                your name, email, donation amount, date and billing country.
              </li>
              <li>
                <strong>Basic technical data:</strong> like most websites, our hosting provider may
                log standard information such as your browser type and IP address for security and
                reliability.
              </li>
            </ul>
            <p>Visitors do not need an account to use this website.</p>
          </>,
        ],
        [
          "How we use your information",
          <ul>
            <li>
              To reply to your messages and coordinate workshops, partnerships or volunteering.
            </li>
            <li>To process donations, send receipts and keep basic financial records.</li>
            <li>To share occasional updates about RoboRoots if you ask us to.</li>
            <li>To keep the website secure and working properly.</li>
          </ul>,
        ],
        [
          "How we share information",
          <>
            <p>
              We do not sell or rent your personal information. We only share it with services that
              help us run RoboRoots:
            </p>
            <ul>
              <li>Stripe, to process donations.</li>
              <li>Web3Forms, to deliver contact form messages to our email.</li>
              <li>Supabase and our website host, to store and serve website content.</li>
              <li>
                YouTube and Google Drive, which host the videos and documents embedded on our pages.
              </li>
            </ul>
            <p>We may also disclose information if required by law.</p>
          </>,
        ],
        [
          "Cookies and embedded content",
          <p>
            We do not use advertising cookies. Videos are embedded from YouTube in privacy-enhanced
            mode, and documents may be embedded from Google or Microsoft viewers. These services may
            set their own cookies when you play or open content, under their own privacy policies.
          </p>,
        ],
        [
          "Children's privacy",
          <>
            <p>
              Our lessons are made for students, but the website does not ask children to create
              accounts or submit personal information. If you are under 13, please ask a parent or
              guardian before contacting us or donating.
            </p>
            <p>
              Photos of workshops are shared with permission from program partners. If you would
              like a photo of yourself or your child removed, email us and we will take it down.
            </p>
          </>,
        ],
        [
          "How long we keep information",
          <p>
            We keep contact messages only as long as needed to respond and follow up. Donation
            records are kept as long as needed for accounting and legal purposes.
          </p>,
        ],
        [
          "Your choices",
          <p>
            You can ask us to access, correct or delete your personal information, or to stop
            sending you updates, by emailing <PolicyEmail />.
          </p>,
        ],
        [
          "Changes to this policy",
          <p>
            We may update this policy from time to time. The date at the top of this page shows when
            it last changed.
          </p>,
        ],
        [
          "Contact us",
          <p>
            Questions about privacy? Email <PolicyEmail />. RoboRoots, {POLICY_LOCATION}.
          </p>,
        ],
      ]}
    />
  ),
});
