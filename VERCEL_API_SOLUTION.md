// Alternative implementation using serverless function
// If HubSpot embedded form doesn't work, use this approach

const handleSubmitViaAPI = async (e) => {
  e.preventDefault();
  
  const submissionData = {
    fields: [
      { name: 'firstname', value: formData.name },
      { name: 'phone', value: formData.phone },
      { name: 'email', value: formData.email },
      { name: 'property_inquiry', value: project.name },
      { name: 'message', value: `Property: ${project.name}\nLocation: ${project.location}\nPrice: ${project.price}\nTour Date: ${formData.tourDate || 'Not specified'}\n\nMessage:\n${formData.message}` }
    ],
    context: {
      pageUri: window.location.href,
      pageName: `Property Detail - ${project.name}`
    }
  };
  
  try {
    // Use Vercel serverless function instead of direct HubSpot API
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(`Thank you for your interest in ${project.name}! We will contact you soon.`);
      setFormData({
        name: '',
        phone: '',
        email: '',
        tourDate: '',
        message: ''
      });
    } else {
      console.error('Form submission failed:', result.details);
      alert('There was an error submitting your request. Please try again.');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    alert('There was an error submitting your request. Please try again.');
  }
};

// Instructions:
// If the embedded form approach doesn't work on Vercel, replace the handleSubmit
// function in PropertyDetail.jsx with handleSubmitViaAPI above.
