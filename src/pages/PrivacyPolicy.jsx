import React from 'react';
import './LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last Updated: February 15, 2026</p>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Basera Infra Home ("we," "our," or "us"). We are committed to protecting your personal 
              information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us, including:</p>
            <ul>
              <li>Name and contact information (email address, phone number, mailing address)</li>
              <li>Account credentials (username, password)</li>
              <li>Property preferences and search criteria</li>
              <li>Financial information for property transactions</li>
              <li>Communication preferences</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect certain information, including:</p>
            <ul>
              <li>Browser type and version</li>
              <li>IP address and location data</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Device information and operating system</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
              <li>Providing and maintaining our services</li>
              <li>Processing property inquiries and transactions</li>
              <li>Sending you property listings that match your preferences</li>
              <li>Communicating with you about our services, updates, and promotions</li>
              <li>Improving our website and user experience</li>
              <li>Analyzing usage patterns and trends</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> With third-party vendors who assist us in operating our website and providing services</li>
              <li><strong>Property Owners/Developers:</strong> When you express interest in a specific property</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of our business</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </section>

          <section className="legal-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal 
              information. However, no method of transmission over the internet is 100% secure, and we cannot 
              guarantee absolute security of your data.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Your Privacy Rights</h2>
            <p>You have certain rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p>To exercise these rights, please contact us at harshsingh08.hs@gmail.com</p>
          </section>

          <section className="legal-section">
            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain 
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is 
              being sent. However, some features of our website may not function properly without cookies.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to 
              review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="contact-info">
              <li><strong>Email:</strong> harshsingh08.hs@gmail.com</li>
              <li><strong>Phone:</strong> 9720444418</li>
              <li><strong>Address:</strong> 2A,54/13 Awas Vikas 1st DM Road</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
