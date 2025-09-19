import emailjs from 'emailjs-com';

// EmailJS Configuration
export const EMAILJS_CONFIG = {
  serviceId: 'service_cnstyga',
  templateIds: {
    welcome: 'template_amvadir',
    notification: 'template_yv9xrxa'
  },
  publicKey: 'MAQAwYE2K5GnzIXxF'
};

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// Send welcome email
export const sendWelcomeEmail = async (userEmail, userName, userRole) => {
  try {
    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      user_role: userRole,
      app_name: 'ResQConnect',
      from_name: 'ResQConnect Team'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.welcome,
      templateParams
    );

    console.log('Welcome email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send SOS notification email
export const sendSOSEmail = async (userEmail, userName, location, message) => {
  try {
    const templateParams = {
      to_email: 'kolleparavenkatasrichakravarthi.23.it@anits.edu.in',
      user_email: userEmail,
      user_name: userName,
      location: location,
      emergency_message: message,
      timestamp: new Date().toLocaleString(),
      maps_link: `https://www.google.com/maps?q=${location.lat},${location.lng}`
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateIds.notification,
      templateParams
    );

    console.log('SOS email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending SOS email:', error);
    throw error;
  }
};