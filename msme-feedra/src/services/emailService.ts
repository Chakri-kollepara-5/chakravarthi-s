import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_vohavhh',
  templateId: 'template_ika8wzo',
  publicKey: 'jiM9CZ-dCLtb6rTlf'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

export interface EmailTemplate {
  to_name: string;
  to_email: string;
  from_name: string;
  message: string;
  user_type?: string;
  donation_details?: string;
}

export const sendWelcomeEmail = async (userData: {
  name: string;
  email: string;
  userType: string;
}): Promise<boolean> => {
  try {
    // Comprehensive validation
    if (!userData || typeof userData !== 'object') {
      console.error('❌ Invalid userData object provided');
      return false;
    }

    const email = userData.email?.trim();
    const name = userData.name?.trim();
    const userType = userData.userType?.trim();

    if (!email || email === '') {
      console.error('❌ Cannot send welcome email: recipient email address is empty or invalid');
      console.error('Received userData:', userData);
      return false;
    }

    if (!name || name === '') {
      console.error('❌ Cannot send welcome email: recipient name is empty or invalid');
      console.error('Received userData:', userData);
      return false;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return false;
    }

    console.log('🚀 Sending welcome email to:', userData.email);
    
    const templateParams = {
      to_name: name,
      to_email: email,
      user_type: userType || 'volunteer',
      from_name: "Feedra Team",
      message: `Welcome to Feedra! We're thrilled to have you join our AI-powered Food Saver Network. As a ${userType || 'volunteer'}, your contribution helps reduce food waste and nourish communities in need. Together, we're making a difference in India!`
    };

    console.log('📧 Template params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log('✅ Welcome email sent successfully:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Log the specific error details for EmailJS
    if (typeof error === 'object' && error !== null) {
      console.error('Error details:', JSON.stringify(error, null, 2));
    }
    
    return false;
  }
};

export const sendDonationNotification = async (donationData: {
  donorName: string;
  donorEmail: string;
  foodType: string;
  quantity: number;
  location: string;
}): Promise<boolean> => {
  try {
    console.log('🚀 Sending donation notification to:', donationData.donorEmail);
    
    const templateParams = {
      to_name: donationData.donorName,
      to_email: donationData.donorEmail,
      from_name: "Feedra Team",
      donation_details: `${donationData.quantity}kg of ${donationData.foodType} at ${donationData.location}`,
      message: `Your food donation has been successfully posted! Thank you for helping reduce food waste and supporting your community. Your ${donationData.quantity}kg of ${donationData.foodType} will help feed families in need.`
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log('✅ Donation notification sent successfully:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Failed to send donation notification:', error);
    return false;
  }
};

export const sendClaimNotification = async (claimData: {
  donorName: string;
  donorEmail: string;
  claimerName: string;
  foodType: string;
  quantity: number;
}): Promise<boolean> => {
  try {
    console.log('🚀 Sending claim notification to:', claimData.donorEmail);
    
    const templateParams = {
      to_name: claimData.donorName,
      to_email: claimData.donorEmail,
      from_name: "Feedra Team",
      message: `Great news! ${claimData.claimerName} has claimed your donation of ${claimData.quantity}kg of ${claimData.foodType}. They will contact you soon for pickup arrangements. Thank you for making a difference!`
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log('✅ Claim notification sent successfully:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Failed to send claim notification:', error);
    return false;
  }
};

export const testEmailConfiguration = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing EmailJS configuration...');
    console.log('Service ID:', EMAILJS_CONFIG.serviceId);
    console.log('Template ID:', EMAILJS_CONFIG.templateId);
    console.log('Public Key:', EMAILJS_CONFIG.publicKey);
    
    const testParams = {
      to_name: 'Test User',
      to_email: 'test@feedra.com',
      from_name: 'Feedra Team',
      user_type: 'volunteer',
      message: 'This is a test email to verify EmailJS configuration is working properly. If you receive this, everything is set up correctly!'
    };

    console.log('📧 Test template params:', testParams);

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      testParams,
      EMAILJS_CONFIG.publicKey
    );

    console.log('✅ Test email sent successfully:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    
    // Provide detailed debugging information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    
    // Check if it's a specific EmailJS error
    if (typeof error === 'object' && error !== null) {
      console.error('Error object:', error);
    }
    
    return false;
  }
};

// Utility function to validate email configuration
export const validateEmailConfig = (): boolean => {
  const isValid = !!(
    EMAILJS_CONFIG.serviceId && 
    EMAILJS_CONFIG.templateId && 
    EMAILJS_CONFIG.publicKey
  );
  
  console.log('📋 Email configuration validation:', {
    serviceId: !!EMAILJS_CONFIG.serviceId,
    templateId: !!EMAILJS_CONFIG.templateId,
    publicKey: !!EMAILJS_CONFIG.publicKey,
    isValid
  });
  
  return isValid;
};