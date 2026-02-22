import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './LegalPages.css';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms of Service - Basera Infra Home</title>
        <meta 
          name="description" 
          content="Terms of Service for Basera Infra Home. Read our terms and conditions for using our real estate platform and services." 
        />
        <meta property="og:title" content="Terms of Service - Basera Infra Home" />
        <link rel="canonical" href="https://baserainfrahome.com/terms" />
      </Helmet>
      
      <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last Updated: February 15, 2026</p>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using the Basera Infra Home website and services, you agree to be bound by these 
              Terms of Service and all applicable laws and regulations. If you do not agree with any of these 
              terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on Basera Infra Home's website for 
              personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer 
              of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to decompile or reverse engineer any software on the website</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. User Account Responsibilities</h2>
            <p>When you create an account with us, you are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Promptly updating your account information when necessary</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Property Listings</h2>
            <h3>4.1 Accuracy of Information</h3>
            <p>
              While we strive to provide accurate and up-to-date property information, we do not warrant the 
              accuracy, completeness, or reliability of any property listings. Property details, prices, and 
              availability are subject to change without notice.
            </p>
            <h3>4.2 Third-Party Listings</h3>
            <p>
              Some property listings may be provided by third parties. We are not responsible for the accuracy 
              of third-party listings or any transactions conducted with third parties.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Prohibited Activities</h2>
            <p>You agree not to engage in any of the following activities:</p>
            <ul>
              <li>Violating any applicable laws or regulations</li>
              <li>Posting false, misleading, or fraudulent information</li>
              <li>Harassing, threatening, or defaming other users</li>
              <li>Distributing spam or unsolicited communications</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with the proper functioning of the website</li>
              <li>Using automated systems to access or scrape the website</li>
              <li>Impersonating another person or entity</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to text, graphics, logos, images, and 
              software, is the property of Basera Infra Home or its content suppliers and is protected by 
              copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Property Transactions</h2>
            <p>
              Basera Infra Home acts as a facilitator for property transactions. We are not a party to any 
              agreements between buyers, sellers, landlords, or tenants. You are responsible for:
            </p>
            <ul>
              <li>Conducting your own due diligence on properties</li>
              <li>Verifying property information independently</li>
              <li>Obtaining legal and financial advice</li>
              <li>Complying with all applicable real estate laws and regulations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Payment Terms</h2>
            <p>
              For services requiring payment, you agree to pay all applicable fees. All fees are non-refundable 
              unless otherwise stated. We reserve the right to change our pricing at any time with notice.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              The materials on Basera Infra Home's website are provided "as is". We make no warranties, expressed 
              or implied, and hereby disclaim all other warranties, including without limitation, implied 
              warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
              of intellectual property.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Limitation of Liability</h2>
            <p>
              In no event shall Basera Infra Home or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising out of 
              the use or inability to use our services, even if we have been notified of the possibility of 
              such damage.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Basera Infra Home, its affiliates, officers, directors, 
              employees, and agents from any claims, damages, losses, liabilities, and expenses (including 
              attorney's fees) arising from your use of our services or violation of these terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites or services. We are not responsible for the 
              content, accuracy, or practices of third-party sites. Your use of third-party websites is at your 
              own risk.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to our services immediately, 
              without prior notice or liability, for any reason, including breach of these Terms. Upon 
              termination, your right to use the service will immediately cease.
            </p>
          </section>

          <section className="legal-section">
            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without 
              regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject 
              to the exclusive jurisdiction of the courts in the applicable jurisdiction.
            </p>
          </section>

          <section className="legal-section">
            <h2>15. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any 
              significant changes by posting the new Terms on this page and updating the "Last Updated" date. 
              Your continued use of the service after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>16. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
            <ul className="contact-info">
              <li><strong>Email:</strong> baserainfrahome@gmail.com</li>
              <li><strong>Phone:</strong> +91 98118 02157</li>
              <li><strong>Address:</strong> 201, IInd Floor, Krishna Apra Royal Plaza, Above ICICI Bank, Alpha Comm. Belt Near Alpha-1, Metro Station, Greater Noida</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsOfService;
