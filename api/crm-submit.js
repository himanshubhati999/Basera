// Complete CRM Backend API - Handles form submissions with local storage

import fs from 'fs';
import path from 'path';

// Local storage path for submissions
const STORAGE_DIR = '/tmp/crm-submissions';
const STORAGE_FILE = path.join(STORAGE_DIR, 'submissions.json');

// Ensure storage directory exists
function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

// Read all submissions from local storage
function readSubmissions() {
  try {
    ensureStorageDir();
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

// Save submission to local storage
function saveSubmission(submission) {
  try {
    ensureStorageDir();
    const submissions = readSubmissions();
    submissions.push(submission);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(submissions, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving submission:', error);
    return false;
  }
}

// Send email notification (placeholder - can integrate with SendGrid, etc.)
async function sendEmailNotification(submission) {
  // TODO: Integrate with email service (SendGrid, Resend, etc.)
  console.log('Email notification:', {
    to: 'BHATIH981@GMAIL.COM',
    subject: `New Property Inquiry: ${submission.name}`,
    body: `
      New submission received:
      Name: ${submission.name}
      Email: ${submission.email}
      Phone: ${submission.phone}
      Property: ${submission.property}
      Message: ${submission.message}
      Time: ${submission.timestamp}
    `
  });
  return { success: true };
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - Retrieve all submissions (for admin dashboard)
  if (req.method === 'GET') {
    try {
      const submissions = readSubmissions();
      return res.status(200).json({
        success: true,
        count: submissions.length,
        submissions: submissions.reverse() // Most recent first
      });
    } catch (error) {
      console.error('Error retrieving submissions:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve submissions'
      });
    }
  }

  // POST - Submit new form
  if (req.method === 'POST') {
    try {
      const { name, email, phone, property, message } = req.body;

      // Validate required fields
      if (!name || !email || !phone) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, email, phone'
        });
      }

      // Create submission object
      const submission = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        property: property || 'General Inquiry',
        message: message || '',
        timestamp: new Date().toISOString(),
        status: 'pending',
        source: 'website'
      };

      // Save to local storage
      const localSaved = saveSubmission(submission);

      // Send email notification (async)
      sendEmailNotification(submission).catch(console.error);

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Form submitted successfully',
        submission: {
          id: submission.id,
          timestamp: submission.timestamp
        },
        storage: {
          local: localSaved
        }
      });

    } catch (error) {
      console.error('Form submission error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process submission',
        details: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
