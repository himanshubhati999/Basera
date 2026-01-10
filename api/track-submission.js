// Backend API to track HubSpot form submissions locally
// This runs alongside HubSpot and creates a local backup of all submissions

import fs from 'fs';
import path from 'path';

// Storage configuration
const STORAGE_DIR = '/tmp/hubspot-submissions';
const STORAGE_FILE = path.join(STORAGE_DIR, 'submissions.json');

// Ensure storage directory exists
function ensureStorageDir() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating storage directory:', error);
  }
}

// Read all submissions
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

// Save submission
function saveSubmission(submission) {
  try {
    ensureStorageDir();
    const submissions = readSubmissions();
    
    // Add metadata
    const enrichedSubmission = {
      ...submission,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
      status: 'synced-from-hubspot'
    };
    
    submissions.push(enrichedSubmission);
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(submissions, null, 2));
    return { success: true, submission: enrichedSubmission };
  } catch (error) {
    console.error('Error saving submission:', error);
    return { success: false, error: error.message };
  }
}

// Send email notification (placeholder)
async function sendNotification(submission) {
  console.log('📧 Email notification (configure email service):');
  console.log({
    to: 'harshsingh08.hs@gmail.com',
    subject: `New Property Inquiry - ${submission.firstname || 'Unknown'}`,
    from: submission.email,
    body: `
      New inquiry received:
      
      Name: ${submission.firstname} ${submission.lastname || ''}
      Email: ${submission.email}
      Phone: ${submission.phone || 'Not provided'}
      Property: ${submission.property || 'General inquiry'}
      Message: ${submission.message || 'No message'}
      
      Timestamp: ${submission.timestamp}
      Source: ${submission.source}
    `
  });
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

  // GET - Retrieve all tracked submissions
  if (req.method === 'GET') {
    try {
      const submissions = readSubmissions();
      return res.status(200).json({
        success: true,
        count: submissions.length,
        submissions: submissions.reverse() // Most recent first
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve submissions',
        details: error.message
      });
    }
  }

  // POST - Track new submission from HubSpot
  if (req.method === 'POST') {
    try {
      const submissionData = req.body;

      // Validate data
      if (!submissionData || typeof submissionData !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Invalid submission data'
        });
      }

      // Save to local storage
      const result = saveSubmission(submissionData);

      if (result.success) {
        // Send notification (async, don't wait)
        sendNotification(submissionData).catch(console.error);

        return res.status(200).json({
          success: true,
          message: 'Submission tracked successfully',
          submission: {
            id: result.submission.id,
            savedAt: result.submission.savedAt
          }
        });
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Tracking error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to track submission',
        details: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
