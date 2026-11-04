import { createFileRoute } from "@tanstack/react-router";
import { meta } from "@/components/site";
import { PolicyEmail, PolicyPage } from "@/components/policy";

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    meta(
      "Refund & Cancellation Policy | RoboRoots",
      "How refunds and cancellations work for donations to RoboRoots.",
    ),
  component: () => (
    <PolicyPage
      title="Refund & Cancellation Policy"
      intro={
        <p>
          Thank you for supporting RoboRoots. Because donations go straight to robotics kits,
          learning materials and workshops for students, they are generally final. We understand
          mistakes happen, so here is how we handle them.
        </p>
      }
      sections={[
        [
          "When we refund",
          <>
            <p>We will refund a donation if, within 30 days of the donation date:</p>
            <ul>
              <li>you were charged twice or by mistake (for example, a duplicate payment),</li>
              <li>you entered the wrong amount, or</li>
              <li>your card was used without your permission.</li>
            </ul>
            <p>Other refund requests are reviewed case by case.</p>
          </>,
        ],
        [
          "How to request a refund",
          <p>
            Email <PolicyEmail /> with your name, the donation date, the amount and the email used
            for the payment. We aim to reply within 5 business days.
          </p>,
        ],
        [
          "How refunds are paid",
          <p>
            Approved refunds go back to the original payment method through Stripe. Depending on
            your bank, it usually takes 5 to 10 business days to appear. Stripe's processing fees
            may not be returned by the payment processor.
          </p>,
        ],
        [
          "Recurring donations",
          <p>
            If you set up a recurring donation, you can cancel at any time by emailing us or using
            the link in your Stripe receipt. Cancelling stops future payments. Past payments follow
            the refund rules above.
          </p>,
        ],
        [
          "Workshops",
          <p>
            For paid fundraising workshops, you can get a full refund if you cancel at least 48
            hours before the session. If RoboRoots cancels a workshop, you will get a full refund or
            a place in another session.
          </p>,
        ],
        [
          "Contact us",
          <p>
            Questions? Email <PolicyEmail />.
          </p>,
        ],
      ]}
    />
  ),
});
