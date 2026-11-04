import { createFileRoute, Link } from "@tanstack/react-router";
import { meta } from "@/components/site";
import { PolicyEmail, PolicyPage } from "@/components/policy";
import { POLICY_LOCATION } from "@/content/site";

const link = "font-semibold text-primary underline";

export const Route = createFileRoute("/terms")({
  head: () =>
    meta(
      "Terms & Conditions | RoboRoots",
      "The terms for using the RoboRoots website and donating.",
    ),
  component: () => (
    <PolicyPage
      title="Terms & Conditions"
      intro={
        <p>
          These terms apply to your use of the RoboRoots website, including our free lessons and our
          donation pages. By using the website you agree to them.
        </p>
      }
      sections={[
        [
          "About RoboRoots",
          <p>
            RoboRoots is a student-led initiative founded by Vyom Agrawal, based in{" "}
            {POLICY_LOCATION}. We provide robotics and STEM education to underserved students
            through workshops, curriculum, online lessons and lab-building support.
          </p>,
        ],
        [
          "Using our lessons and materials",
          <>
            <p>
              Our videos, slides, worksheets and curriculum are free for personal and classroom
              learning. Teachers and non-profit programs may share them with students, with credit
              to RoboRoots.
            </p>
            <p>
              Please do not sell our materials or present them as your own. For other uses, email{" "}
              <PolicyEmail />.
            </p>
          </>,
        ],
        [
          "Safety",
          <p>
            Some activities involve tools, batteries and electronics. Students should work with
            adult supervision and follow the safety guidance in each lesson. RoboRoots is not
            responsible for injury or damage caused by misuse of materials or equipment.
          </p>,
        ],
        [
          "Donations",
          <>
            <ul>
              <li>Donations are voluntary and are processed securely by Stripe.</li>
              <li>
                Donations support RoboRoots programs such as robotics kits, lab setup, learning
                materials and workshops. We may use funds where they are needed most within these
                programs.
              </li>
              <li>
                Donations are a gift and do not buy goods or services. Unless your receipt says
                otherwise, they may not be tax-deductible.
              </li>
              <li>
                Refunds are covered by our{" "}
                <Link to="/refund-policy" className={link}>
                  Refund Policy
                </Link>
                .
              </li>
            </ul>
          </>,
        ],
        [
          "Third-party services",
          <p>
            Our website uses services such as Stripe, YouTube and Google Drive. Your use of those
            services is also covered by their own terms. We are not responsible for content on
            websites we link to.
          </p>,
        ],
        [
          "No warranty",
          <p>
            We work hard to keep our lessons accurate and the website available, but everything is
            provided "as is" without warranties of any kind. To the extent allowed by law, RoboRoots
            is not liable for indirect or consequential losses from using the website.
          </p>,
        ],
        [
          "Your privacy",
          <p>
            See our{" "}
            <Link to="/privacy" className={link}>
              Privacy Policy
            </Link>{" "}
            for how we handle your information.
          </p>,
        ],
        [
          "Changes and governing law",
          <p>
            We may update these terms from time to time. The date at the top shows the latest
            version. These terms are governed by the laws of {POLICY_LOCATION}.
          </p>,
        ],
        [
          "Contact us",
          <p>
            Questions about these terms? Email <PolicyEmail />.
          </p>,
        ],
      ]}
    />
  ),
});
