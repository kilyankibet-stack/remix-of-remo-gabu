import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-xs mb-6">Last updated: April 13, 2026</p>

        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <Section title="1. Introduction">
            REMOTASK AI ("we", "our", "us") operates the REMOTASK AI mobile application (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
          </Section>

          <Section title="2. Information We Collect">
            <strong className="text-foreground">Personal Information:</strong> When you register, we collect your full name, email address, phone number, and country of residence.
            <br /><br />
            <strong className="text-foreground">Financial Information:</strong> We collect M-Pesa phone numbers and transaction details for payment processing. We do not store credit card or bank account numbers directly.
            <br /><br />
            <strong className="text-foreground">Usage Data:</strong> We automatically collect information about how you interact with the Service, including task completion records, timestamps, device information, and IP address.
          </Section>

          <Section title="3. How We Use Your Information">
            We use the collected information to: provide and maintain the Service; process payments and withdrawals; send notifications about tasks and earnings; improve our Service and user experience; comply with legal obligations; and prevent fraud and abuse.
          </Section>

          <Section title="4. Data Sharing & Disclosure">
            We do not sell your personal information. We may share data with: payment processors (M-Pesa/Lipwa) to facilitate withdrawals; cloud service providers who help us operate the Service; and law enforcement if required by applicable law.
          </Section>

          <Section title="5. Data Retention">
            We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data by contacting us at support@remotask-ai.app.
          </Section>

          <Section title="6. Data Security">
            We implement industry-standard security measures including encryption in transit (TLS), secure database storage, and access controls. However, no method of electronic transmission is 100% secure.
          </Section>

          <Section title="7. Children's Privacy">
            Our Service is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.
          </Section>

          <Section title="8. Your Rights">
            You have the right to: access your personal data; correct inaccurate data; request deletion of your data; withdraw consent at any time; and lodge a complaint with a data protection authority.
          </Section>

          <Section title="9. Ads & Third-Party Services">
            The Service does not currently display third-party advertisements. We may use analytics services to understand usage patterns. These services may collect anonymized usage data.
          </Section>

          <Section title="10. Changes to This Policy">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy within the app and updating the "Last updated" date.
          </Section>

          <Section title="11. Contact Us">
            If you have questions about this Privacy Policy, contact us at:
            <br />Email: support@remotask-ai.app
            <br />Subject: Privacy Policy Inquiry
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

export default PrivacyPolicy;
