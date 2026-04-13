import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground text-xs mb-6">Last updated: April 13, 2026</p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <Section title="1. Acceptance of Terms">
            By accessing or using REMOTASK AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. We reserve the right to modify these terms at any time, and continued use constitutes acceptance of changes.
          </Section>

          <Section title="2. Eligibility">
            You must be at least 18 years old to use the Service. By registering, you represent that you meet this age requirement and that all information you provide is accurate and complete.
          </Section>

          <Section title="3. Account Registration">
            You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate registration information and to update it as necessary. Each user may only maintain one account. Multiple accounts will be terminated without notice.
          </Section>

          <Section title="4. Tasks & Earnings">
            The Service provides AI training tasks that users can complete for compensation. Task availability, pay rates, and types may change at any time without prior notice. Earnings are credited to your account balance upon successful task completion and review. We reserve the right to withhold payment for tasks that do not meet quality standards.
          </Section>

          <Section title="5. Account Plans & Upgrades">
            The Service offers free and paid account tiers. Paid plans unlock additional tasks and higher earning potential. Plan payments are non-refundable once the plan has been activated and tasks have been accessed. Plan pricing and features may change with notice.
          </Section>

          <Section title="6. Withdrawals & Payments">
            Withdrawals are processed via M-Pesa and other supported payment methods. Minimum withdrawal amounts may apply. Processing times vary but are typically completed within 24 hours. We are not responsible for delays caused by third-party payment processors. Withdrawal fees, if any, will be clearly displayed before confirmation.
          </Section>

          <Section title="7. Prohibited Conduct">
            You agree not to: use automated tools or bots to complete tasks; submit fraudulent, low-quality, or random responses; create multiple accounts; attempt to manipulate earnings or referral systems; reverse-engineer or exploit the Service; or engage in any activity that violates applicable laws.
          </Section>

          <Section title="8. Account Suspension & Termination">
            We reserve the right to suspend or terminate your account at any time for violations of these Terms, suspected fraud, or any behavior that harms the Service or other users. Upon termination, any pending balance may be forfeited if the termination is due to a Terms violation.
          </Section>

          <Section title="9. Intellectual Property">
            All content, branding, and materials within the Service are owned by REMOTASK AI. You may not copy, reproduce, or distribute any part of the Service without written permission. Tasks and their content are proprietary and may not be shared outside the platform.
          </Section>

          <Section title="10. Limitation of Liability">
            The Service is provided "as is" without warranties of any kind. We are not liable for: loss of earnings due to technical issues; payment processing delays by third parties; task availability fluctuations; or any indirect, incidental, or consequential damages arising from use of the Service.
          </Section>

          <Section title="11. Dispute Resolution">
            Any disputes arising from the use of the Service shall first be addressed through our support team at support@remotask-ai.app. If unresolved, disputes shall be settled through binding arbitration in accordance with applicable local laws.
          </Section>

          <Section title="12. Changes to Terms">
            We may update these Terms from time to time. Material changes will be communicated through the app or via email. Continued use of the Service after changes constitutes acceptance of the updated Terms.
          </Section>

          <Section title="13. Contact">
            For questions regarding these Terms, contact us at:
            <br />Email: support@remotask-ai.app
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-foreground font-semibold text-base mb-2">{title}</h2>
    <p>{children}</p>
  </div>
);

export default TermsOfService;
