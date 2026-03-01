import React, { useState, useMemo, useEffect } from 'react';
import { Search, Phone, MapPin, Clock, Stethoscope, Menu, X, ChevronRight, Heart, User, Info, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doctors } from './data/doctors';
import { Doctor, Specialty } from './types';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
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
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.chamber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [searchTerm, selectedSpecialty]);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a helpful medical assistant for Brahmanbaria, Bangladesh. 
        The user is asking: "${chatInput}". 
        Based on our database: ${JSON.stringify(doctors)}. 
        Please recommend suitable doctors or provide health advice. Speak in Bengali.`,
      });
      setAiResponse(response.text || "দুঃখিত, আমি কোনো তথ্য খুঁজে পাইনি।");
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("দুঃখিত, এআই সার্ভারে সমস্যা হচ্ছে। অনুগ্রহ করে পরে চেষ্টা করুন।");
    } finally {
      setIsAiLoading(false);
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

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button className="bg-emerald-600 text-white px-5 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200">
              জরুরী কল
            </button>
          </nav>
        </div>
      </header>

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

      {/* AI Assistant */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-emerald-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">AI হেলথ অ্যাসিস্ট্যান্ট</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">আপনার কি কোনো স্বাস্থ্য জিজ্ঞাসা আছে?</h3>
              <p className="text-emerald-100/80 mb-8">আমাদের এআই অ্যাসিস্ট্যান্ট আপনাকে সঠিক ডাক্তার খুঁজে পেতে বা প্রাথমিক পরামর্শ দিতে সাহায্য করবে।</p>
              
              <form onSubmit={handleAiSearch} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="যেমন: আমার পেটে ব্যথা করছে, কোন ডাক্তার দেখাব?"
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  disabled={isAiLoading}
                  className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors disabled:opacity-50"
                >
                  {isAiLoading ? 'খুঁজছি...' : 'জিজ্ঞাসা করুন'}
                </button>
              </form>

              <AnimatePresence>
                {aiResponse && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 bg-white/5 border border-white/10 rounded-2xl prose prose-invert max-w-none"
                  >
                    <Markdown>{aiResponse}</Markdown>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                      setExpandedDoctorId(expandedDoctorId === doc.id ? null : doc.id);
                    }}
                    className={cn(
                      "p-3 border border-slate-200 rounded-xl transition-colors",
                      expandedDoctorId === doc.id ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "hover:bg-slate-50 text-slate-400"
                    )}
                  >
                    <Info className="w-5 h-5" />
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
                  +৮৮০ ১৭০০-০০০০০০
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
