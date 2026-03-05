import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Icon } from '@iconify/react';

const WHATSAPP_TEMPLATES = {
  'courseDetails': 'Hi! 👋 We would like to share details about our courses. Please let us know if you\'re interested!',
  'followUp': 'Hi! Just checking in to see if you have any queries about our programs. We\'re here to help!',
  'admissionConfirm': '🎉 Welcome! Your admission has been confirmed. Please check your email for further details.',
  'feesInfo': 'Hi! Here\'s the fee structure for our programs. Let us know if you have any questions!',
};

export function WhatsAppButton({ phone, studentName, template = 'courseDetails', showText = true }) {
  const handleWhatsApp = () => {
    let message = WHATSAPP_TEMPLATES[template] || WHATSAPP_TEMPLATES.courseDetails;
    
    // Add student name if available
    if (studentName) {
      message = `Hi ${studentName}! ${message}`;
    }

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  if (!showText) {
    return (
      <Icon
        icon="tabler-brand-whatsapp"
        onClick={handleWhatsApp}
        style={{ cursor: 'pointer', color: '#25d366', width: '18px', height: '18px', marginTop: '7px' }}
      />
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleWhatsApp}
      className="whatsapp-btn"
    >
      <Icon icon="tabler-brand-whatsapp" />
      WhatsApp
    </Button>
  );
}
