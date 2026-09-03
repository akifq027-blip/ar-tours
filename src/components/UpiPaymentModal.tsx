import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Loader2,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { Car, CarBooking } from '../types';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
  slotFee: number;
  bookingDetails: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    driverRequired: boolean;
    specialInstructions: string;
  };
  upiConfig: {
    upi_id: string;
    payee_name: string;
    upi_qr_image?: string;
  };
  onSuccess: (booking: CarBooking) => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  car,
  slotFee,
  bookingDetails,
  upiConfig,
  onSuccess,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotData, setScreenshotData] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const upiId = upiConfig.upi_id || '8121434741@upi';
  const payeeName = upiConfig.payee_name || 'AR Tours & Travel';
  const transactionNote = `Slot Booking ${car.name.slice(0, 15)}`;

  // Construct UPI URL for Deep Links & Dynamic QR
  const upiPayUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${slotFee.toFixed(2)}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

  // Dynamic QR Code generation URL or custom uploaded image
  const qrCodeUrl =
    upiConfig.upi_qr_image && upiConfig.upi_qr_image.trim().length > 10
      ? upiConfig.upi_qr_image
      : `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiPayUri)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Screenshot file size must be less than 5MB.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotData(reader.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      setErrorMsg('Please enter a valid 12-digit UPI Transaction / UTR Number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await api.submitUpiBooking({
        carId: car.id,
        customerName: bookingDetails.customerName,
        customerEmail: bookingDetails.customerEmail,
        customerPhone: bookingDetails.customerPhone,
        pickupLocation: bookingDetails.pickupLocation,
        dropLocation: bookingDetails.dropLocation,
        pickupDate: bookingDetails.pickupDate,
        pickupTime: bookingDetails.pickupTime,
        returnDate: bookingDetails.returnDate,
        returnTime: bookingDetails.returnTime,
        driverRequired: bookingDetails.driverRequired,
        specialInstructions: bookingDetails.specialInstructions,
        utrNumber: cleanUtr,
        paymentScreenshot: screenshotData || undefined,
      });

      if (response.success && response.booking) {
        onSuccess(response.booking);
      } else {
        setErrorMsg(response.message || 'Failed to submit booking. Please try again.');
      }
    } catch (err: any) {
      console.error('Submit booking error:', err);
      setErrorMsg(err.message || 'Payment submission failed. Please verify your UTR and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200 my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Gateway Surcharge · Direct UPI</span>
              </div>
              <h3 className="text-lg font-black text-white">₹{slotFee} Slot Pre-Booking</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmitBooking} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div>
                <strong className="block font-semibold text-rose-200 mb-0.5">Submission Notice</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* STEP 1: SCAN QR CODE & PAY */}
          <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 sm:p-5 text-center">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Step 1: Scan &amp; Pay Exact Amount
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold">
                Amount: <strong className="text-white text-sm">₹{slotFee}</strong>
              </span>
            </div>

            {/* QR Image Box */}
            <div className="bg-white p-3.5 rounded-2xl inline-block shadow-xl border border-slate-200/50 mx-auto transition-transform hover:scale-105 duration-200">
              <img
                src={qrCodeUrl}
                alt="AR Tours UPI QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto block"
                onError={(e) => {
                  // Fallback to QR server if custom image fails
                  (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiPayUri)}`;
                }}
              />
              <div className="text-[10px] text-slate-700 font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center gap-1">
                <span>Scan with any UPI App</span>
              </div>
            </div>

            {/* UPI Details & 1-Click Copy */}
            <div className="mt-4 bg-slate-900/80 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 text-left">
              <div className="overflow-hidden">
                <div className="text-[10px] uppercase font-semibold text-slate-400">Business UPI VPA / ID</div>
                <div className="font-mono text-xs sm:text-sm font-bold text-amber-300 truncate">
                  {upiId}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Beneficiary: <strong className="text-slate-200">{payeeName}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy UPI</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile App Deep-Links */}
            <div className="mt-3">
              <div className="text-[11px] text-slate-400 mb-2 font-medium">Or pay directly using your mobile app:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={`gpay://upi/pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${slotFee}&cu=INR&tn=${encodeURIComponent(transactionNote)}`}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center text-xs font-semibold text-slate-200 hover:text-white transition flex flex-col items-center justify-center gap-1"
                >
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span>Google Pay</span>
                </a>
                <a
                  href={`phonepe://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${slotFee}&cu=INR&tn=${encodeURIComponent(transactionNote)}`}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center text-xs font-semibold text-slate-200 hover:text-white transition flex flex-col items-center justify-center gap-1"
                >
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>PhonePe</span>
                </a>
                <a
                  href={`paytmmp://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${slotFee}&cu=INR&tn=${encodeURIComponent(transactionNote)}`}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center text-xs font-semibold text-slate-200 hover:text-white transition flex flex-col items-center justify-center gap-1"
                >
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span>Paytm</span>
                </a>
                <a
                  href={upiPayUri}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center text-xs font-semibold text-slate-200 hover:text-white transition flex flex-col items-center justify-center gap-1"
                >
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span>Any UPI App</span>
                </a>
              </div>
            </div>
          </div>

          {/* STEP 2: ENTER MANDATORY UTR / TRANSACTION ID */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Step 2: Enter Transaction Details
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                UPI Reference Number / UTR / Txn ID <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={30}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 425983719024 or UPI/4259..."
                className="w-full bg-slate-950/80 border border-white/15 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Found in your payment app under completed transaction details (12 digits).</span>
              </p>
            </div>

            {/* Optional Screenshot Upload */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Payment Screenshot (Optional, speeds up verification)
              </label>
              
              {screenshotData ? (
                <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img
                      src={screenshotData}
                      alt="Payment Receipt Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-white/10 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Screenshot Attached</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{fileName || 'receipt.jpg'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshotData('');
                      setFileName('');
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 bg-rose-500/10 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/15 hover:border-amber-500/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/40 hover:bg-slate-950/60 transition group">
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-400 transition" />
                  <div className="text-xs text-slate-300 text-center">
                    <span className="font-semibold text-amber-400">Click to upload</span> or drag &amp; drop receipt
                  </div>
                  <div className="text-[10px] text-slate-500">PNG, JPG, JPEG up to 5MB</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Vehicle summary snippet */}
          <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <span className="text-slate-400">Selected Vehicle:</span>{' '}
              <strong className="text-white">{car.brand} {car.name}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Slot Fee:</span>{' '}
              <strong className="text-amber-400 font-mono">₹{slotFee}</strong>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !utrNumber.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-3.5 px-6 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99] text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting &amp; Holding Slot...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Submit UTR &amp; Reserve Slot (₹{slotFee})</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2.5">
              Your vehicle slot will be held immediately upon submitting your UTR.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
