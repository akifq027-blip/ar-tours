import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'floating' | 'inline' | 'button';
  label?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message = 'Hello AR Tours & Travel, I would like to enquire about your travel services.',
  className = '',
  variant = 'floating',
  label = 'Chat with us on WhatsApp',
}) => {
  const { settings } = useSettings();
  const phone = (settings.whatsapp || '918121434741').replace(/[^0-9]/g, '');
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  if (variant === 'floating') {
    return (
      <a
        id="btn-whatsapp-floating"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AR Tours & Travel on WhatsApp"
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 group ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-5 h-5 fill-white text-emerald-600 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
        </div>
        <span className="text-sm font-semibold tracking-wide hidden sm:inline">WhatsApp Help</span>
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <a
        id="btn-whatsapp-inline"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium hover:underline text-sm ${className}`}
      >
        <MessageSquare className="w-4 h-4 fill-emerald-600 text-white" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <a
      id="btn-whatsapp-cta"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 text-sm ${className}`}
    >
      <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
      <span>{label}</span>
    </a>
  );
};
