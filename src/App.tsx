import React, { useState, useMemo, useEffect } from 'react';
import { Search, Phone, MapPin, Clock, Stethoscope, Menu, X, ChevronRight, Heart, User, Info, MoreVertical, MessageCircle, Send, ExternalLink, Award, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doctors } from './data/doctors';
import { Doctor, Specialty } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const specialties: { label: string; value: Specialty; icon: React.ReactNode }[] = [
  { label: "মেডিসিন", value: "Medicine", icon: <Stethoscope className="w-5 h-5" /> },
  { label: "স্ত্রী রোগ", value: "Gynecology", icon: <User className="w-5 h-5" /> },
  { label: "হৃদরোগ", value: "Cardiology", icon: <Heart className="w-5 h-5" /> },
  { label: "শিশু রোগ", value: "Pediatrics", icon: <User className="w-5 h-5" /> },
  { label: "দন্ত রোগ", value: "Dental", icon: <Stethoscope className="w-5 h-5" /> },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'All'>('All');
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Doctor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Medicine',
    degree: '',
    hospital: '',
    chamber: '',
    phone: '',
    visitingHours: '',
    bookingFee: ''
  });

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.chamber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [searchTerm, selectedSpecialty]);

  const handleAddDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || "8522798147:AAFzU3qvB8KcE1ssdnP9V2WFkILfMhJhTnA";
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || "5780660740";

    if (!botToken || !chatId) {
      console.error("Telegram credentials missing");
      alert("টেলিগ্রাম কনফিগারেশন পাওয়া যায়নি। অনুগ্রহ করে ডেভেলপারকে জানান।");
      setIsSubmitting(false);
      return;
    }

    const message = `
🆕 নতুন ডাক্তার যোগ করার আবেদন:
👤 নাম: ${formData.name}
🩺 বিশেষজ্ঞ: ${formData.specialty}
🎓 ডিগ্রি: ${formData.degree}
🏥 হাসপাতাল: ${formData.hospital}
🏢 চেম্বার: ${formData.chamber}
📞 ফোন: ${formData.phone}
⏰ সময়: ${formData.visitingHours}
💰 ফি: ${formData.bookingFee}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          specialty: 'Medicine',
          degree: '',
          hospital: '',
          chamber: '',
          phone: '',
          visitingHours: '',
          bookingFee: ''
        });
        setTimeout(() => {
          setIsAddDoctorModalOpen(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error("Error sending to Telegram:", error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">ব্রাহ্মণবাড়িয়া ডাক্তার</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => window.location.href = 'tel:01761757330'}
                className="bg-emerald-600 text-white px-5 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200 flex items-center gap-2 text-sm font-bold"
              >
                <Phone className="w-4 h-4" />
                জরুরী কল
              </button>
              <button 
                onClick={() => window.open('https://wa.me/8801761757330', '_blank')}
                className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-all shadow-md shadow-green-200 flex items-center gap-2 text-sm font-bold"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </nav>

            {/* Three Dot Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <MoreVertical className="w-6 h-6" />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        <button 
                          onClick={() => {
                            setIsAddDoctorModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors flex items-center gap-3"
                        >
                          <User className="w-4 h-4" />
                          ডাক্তার যোগ করুন
                        </button>
                        <button 
                          onClick={() => window.open('https://nishat.bro.bd', '_blank')}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors flex items-center gap-3"
                        >
                          <ExternalLink className="w-4 h-4" />
                          ডেভেলপার তথ্য
                        </button>
                        <div className="md:hidden border-t border-slate-100 mt-1 pt-1">
                          <button 
                            onClick={() => window.location.href = 'tel:01761757330'}
                            className="w-full text-left px-4 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center gap-3"
                          >
                            <Phone className="w-4 h-4" />
                            জরুরী কল
                          </button>
                          <button 
                            onClick={() => window.open('https://wa.me/8801761757330', '_blank')}
                            className="w-full text-left px-4 py-3 text-sm font-medium text-green-600 hover:bg-green-50 rounded-xl transition-colors flex items-center gap-3"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Doctor Details Modal */}
      <AnimatePresence>
        {selectedDoctorDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedDoctorDetails(null)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedDoctorDetails.name}</h3>
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold w-fit mt-1">
                      {specialties.find(s => s.value === selectedDoctorDetails.specialty)?.label || selectedDoctorDetails.specialty}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDoctorDetails(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 self-start"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    ডিগ্রি ও যোগ্যতা
                  </h4>
                  <p className="text-slate-800 font-medium leading-relaxed">{selectedDoctorDetails.degree}</p>
                </div>

                {selectedDoctorDetails.experience && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      অভিজ্ঞতা
                    </h4>
                    <p className="text-slate-800 font-medium">{selectedDoctorDetails.experience}</p>
                  </div>
                )}

                {selectedDoctorDetails.about && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      বিস্তারিত পরিচিতি
                    </h4>
                    <p className="text-slate-600 leading-relaxed">{selectedDoctorDetails.about}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Stethoscope className="w-3 h-3" />
                      বর্তমান কর্মস্থল
                    </h4>
                    <p className="text-slate-800 font-medium">{selectedDoctorDetails.hospital}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      চেম্বার
                    </h4>
                    <p className="text-slate-800 font-medium">{selectedDoctorDetails.chamber}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      রোগী দেখার সময়
                    </h4>
                    <p className="text-slate-800 font-medium">{selectedDoctorDetails.visitingHours}</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      বুকিং ফি
                    </h4>
                    <p className="text-emerald-800 font-bold text-lg">৳{selectedDoctorDetails.bookingFee}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white">
                <button 
                  onClick={() => window.location.href = `tel:${selectedDoctorDetails.phone}`}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  <Phone className="w-5 h-5" />
                  সিরিয়াল দিন ({selectedDoctorDetails.phone})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Doctor Modal */}
      <AnimatePresence>
        {isAddDoctorModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsAddDoctorModalOpen(false)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-600 text-white">
                <h3 className="text-xl font-bold">নতুন ডাক্তার যোগ করুন</h3>
                <button 
                  onClick={() => setIsAddDoctorModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddDoctorSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                {submitStatus === 'success' ? (
                  <div className="py-12 text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">সফলভাবে পাঠানো হয়েছে!</h4>
                    <p className="text-slate-500">আপনার তথ্যটি রিভিউ করার পর যুক্ত করা হবে।</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">ডাক্তারের নাম *</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="যেমন: ডাঃ মোঃ রহিম"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">বিশেষজ্ঞ বিভাগ *</label>
                        <select 
                          value={formData.specialty}
                          onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        >
                          {specialties.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">বুকিং ফি (৳) *</label>
                        <input 
                          required
                          type="number" 
                          value={formData.bookingFee}
                          onChange={(e) => setFormData({...formData, bookingFee: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          placeholder="যেমন: ৫০০"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">ডিগ্রি সমূহ *</label>
                      <input 
                        required
                        type="text" 
                        value={formData.degree}
                        onChange={(e) => setFormData({...formData, degree: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="যেমন: MBBS, FCPS"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">বর্তমান কর্মস্থল</label>
                      <input 
                        type="text" 
                        value={formData.hospital}
                        onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="হাসপাতালের নাম"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">চেম্বারের ঠিকানা *</label>
                      <input 
                        required
                        type="text" 
                        value={formData.chamber}
                        onChange={(e) => setFormData({...formData, chamber: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                        placeholder="চেম্বারের নাম ও এলাকা"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">ফোন নম্বর *</label>
                        <input 
                          required
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          placeholder="সিরিয়াল দেওয়ার নম্বর"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">রোগী দেখার সময় *</label>
                        <input 
                          required
                          type="text" 
                          value={formData.visitingHours}
                          onChange={(e) => setFormData({...formData, visitingHours: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                          placeholder="যেমন: বিকাল ৪টা - রাত ৮টা"
                        />
                      </div>
                    </div>

                    {submitStatus === 'error' && (
                      <p className="text-red-500 text-sm font-medium">দুঃখিত, তথ্য পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।</p>
                    )}

                    <div className="pt-4">
                      <button 
                        disabled={isSubmitting}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? 'পাঠানো হচ্ছে...' : 'আবেদন সাবমিট করুন'}
                        {!isSubmitting && <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-slate-900 leading-[1.1] mb-6"
            >
              ব্রাহ্মণবাড়িয়ার সেরা ডাক্তারদের <span className="text-emerald-600">খুঁজে বের করুন</span> সহজে
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 mb-8 leading-relaxed"
            >
              আপনার স্বাস্থ্য আমাদের অগ্রাধিকার। ব্রাহ্মণবাড়িয়ার অভিজ্ঞ ডাক্তারদের তালিকা, চেম্বার এবং সিরিয়াল দেওয়ার তথ্য এখন এক জায়গায়।
            </motion.p>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="ডাক্তারের নাম বা রোগ লিখে খুঁজুন..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900">বিশেষজ্ঞ বিভাগ</h3>
            <button 
              onClick={() => setSelectedSpecialty('All')}
              className="text-emerald-600 font-semibold text-sm hover:underline"
            >
              সবগুলো দেখুন
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {specialties.map((spec) => (
              <button
                key={spec.value}
                onClick={() => setSelectedSpecialty(spec.value)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-2xl transition-all border",
                  selectedSpecialty === spec.value 
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
                )}
              >
                <div className={cn("mb-3 p-3 rounded-xl", selectedSpecialty === spec.value ? "bg-white/20" : "bg-slate-100")}>
                  {spec.icon}
                </div>
                <span className="font-bold text-sm">{spec.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor List */}
      <section className="py-12 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900">
              {selectedSpecialty === 'All' ? 'সকল ডাক্তার' : `${specialties.find(s => s.value === selectedSpecialty)?.label} বিশেষজ্ঞ`}
            </h3>
            <span className="text-slate-500 text-sm">{filteredDoctors.length} জন পাওয়া গেছে</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <motion.div 
                layout
                key={doc.id}
                onClick={() => setExpandedDoctorId(expandedDoctorId === doc.id ? null : doc.id)}
                className={cn(
                  "bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer",
                  expandedDoctorId === doc.id && "ring-2 ring-emerald-500 border-transparent shadow-xl"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                    {specialties.find(s => s.value === doc.specialty)?.label || doc.specialty}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-1">{doc.name}</h4>
                <p className={cn("text-sm text-slate-500 mb-4", expandedDoctorId !== doc.id && "line-clamp-1")}>
                  {doc.degree}
                </p>
                
                <AnimatePresence>
                  {expandedDoctorId === doc.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          <Stethoscope className="w-3 h-3" />
                          বর্তমান কর্মস্থল
                        </div>
                        <p className="text-sm text-slate-700 font-medium">{doc.hospital}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{doc.chamber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{doc.visitingHours}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-emerald-700 bg-emerald-50 w-fit px-3 py-1 rounded-lg">
                    <span>বুকিং ফি: ৳{doc.bookingFee}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${doc.phone}`;
                    }}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    সিরিয়াল দিন
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDoctorDetails(doc);
                    }}
                    className="p-3 border border-slate-200 rounded-xl transition-colors hover:bg-slate-50 text-slate-600 flex items-center justify-center gap-2"
                  >
                    <Info className="w-5 h-5" />
                    <span className="text-sm font-bold hidden sm:inline">বিস্তারিত</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300 w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">কোনো ডাক্তার খুঁজে পাওয়া যায়নি</h4>
              <p className="text-slate-500">অনুগ্রহ করে অন্য কোনো নাম বা বিভাগ দিয়ে চেষ্টা করুন।</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Stethoscope className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">ব্রাহ্মণবাড়িয়া ডাক্তার</h1>
              </div>
              <p className="text-slate-400 leading-relaxed max-w-md">
                ব্রাহ্মণবাড়িয়ার সাধারণ মানুষের স্বাস্থ্যসেবা সহজতর করার লক্ষ্যে আমাদের এই ক্ষুদ্র প্রয়াস। সঠিক সময়ে সঠিক ডাক্তারের পরামর্শ নিন।
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6">যোগাযোগ</h5>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  +৮৮০ ১৭৬১৭৫৭৩৩০
                </li>
                <li className="flex items-center gap-3 cursor-pointer hover:text-green-400 transition-colors" onClick={() => window.open('https://wa.me/8801761757330', '_blank')}>
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp (01761757330)
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  ব্রাহ্মণবাড়িয়া, বাংলাদেশ
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 text-center text-slate-500 text-sm">
            &copy; ২০২৬ ব্রাহ্মণবাড়িয়া ডাক্তার খুঁজুন। সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </footer>
    </div>
  );
}
