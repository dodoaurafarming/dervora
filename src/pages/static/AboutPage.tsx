import React from 'react';
import { Sparkles, Users, Heart, Target } from 'lucide-react';

// ==========================================
// DATA ANGGOTA TIM
// (Ganti 'photoUrl' dengan link foto asli jika sudah ada)
// ==========================================
const TEAM_MEMBERS = [
  {
    name: 'Metanoia Dwi Farida Sitorus',
    nim: 'I1021241069',
    role: 'The Manager',
    description: 'Menyusun jadwal dan target; memantau progres; memimpin rapat; mencatat risiko dan keputusan; menghubungkan tim dengan pengembang website.',
    // Ganti dengan link foto dari Cloudinary atau folder public
    photoUrl: 'https://res.cloudinary.com/atrogcxj/image/upload/v1792311329/WhatsApp_Image_2026-10-18_at_15.14.02.jpg',
  },
  {
    name: 'Naisya Andini',
    nim: ' I1021241048',
    role: 'The Scientist',
    description: 'Menelusuri literatur tipe kulit dan bahan aktif; menyusun dasar penilaian kecocokan produk; menjaga kewajaran klaim kesehatan.',
    photoUrl: 'https://res.cloudinary.com/atrogcxj/image/upload/v1792311239/WhatsApp_Image_2026-10-18_at_15.11.46.jpg'
  },
  {
    name: 'Triana Apriani',
    nim: 'I1021241084',
    role: 'The Scientist',
    description: 'Memeriksa komposisi, fungsi bahan aktif, sumber resmi, dan status BPOM; mencatat sumber serta tanggal pembaruan.',
    photoUrl: 'https://res.cloudinary.com/atrogcxj/image/upload/v1792312481/WhatsApp_Image_2026-10-18_at_15.31.55.jpg',
  },
  {
    name: 'Naura Mukhbita Salsabila',
    nim: ' I1021241087',
    role: 'The Scientist',
    description: 'Mengelompokkan produk menurut jenis, bahan aktif, dan kesesuaian kulit; menyiapkan data terstruktur untuk website.',
    photoUrl: 'https://res.cloudinary.com/atrogcxj/image/upload/v1792312042/WhatsApp_Image_2026-10-18_at_15.25.43.jpg'
  },
  {
    name: 'Dhea Safitriningsih',
    nim: 'I1021241072',
    role: 'The Designer',
    description: 'Merancang identitas visual, alur pengguna, dan tampilan antarmuka; menguji keterbacaan di desktop dan ponsel.',
    photoUrl: 'https://res.cloudinary.com/atrogcxj/image/upload/v1792312481/WhatsApp_Image_2026-10-18_at_15.31.47.jpg'
  },
  {
    name: 'Putri Alisha Huwaida',
    nim: 'I1021241081',
    role: 'The Marketer',
    description: 'Mengkaji target pengguna dan pesaing; menyusun konten Instagram; mengelola tautan afiliasi dan memantau hasil promosi.',
    photoUrl: 'https://res.cloudinary.com/atrogcxj/image/upload/v1792311788/WhatsApp_Image_2026-10-18_at_15.21.48.jpg'
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dervora-cream px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-[2px] bg-dervora-primary mx-auto mb-6" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-dervora-primary mb-4">
            About Dervora
          </h1>
          <p className="font-heading italic text-xl text-dervora-dark/70">
            We're here to make skincare easier.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-dervora-beige mb-16">
          <h2 className="font-heading text-2xl font-bold text-dervora-primary mb-6 flex items-center gap-3">
            <Sparkles size={28} /> Our Story
          </h2>
          <div className="font-body text-base text-dervora-dark/80 leading-relaxed space-y-4">
            <p>
              Dervora was founded in 2026. It all started during a discussion about how difficult it is to find the right skincare products, especially for students and beginners.
            </p>
            <p>
              The conversation went something like this: "Every product makes my skin break out, my skin is super sensitive to everything." "Have you tried X brand? But I found X ingredient doesn't work with my skin." "How do you keep track of all this?"
            </p>
            <p>
              After that, Dervora was born with one simple mission: <strong>make skincare science as easy and transparent as possible.</strong> We help our users by providing science-backed data for cosmetic products. We believe consumers have the right to know what is going into their products.
            </p>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-dervora-beige">
            <h3 className="font-heading text-xl font-bold text-dervora-primary mb-3 flex items-center gap-2">
              <Heart size={24} /> Our Values
            </h3>
            <p className="font-body text-sm text-dervora-dark/80 leading-relaxed">
              At Dervora, we're committed to providing science-backed info to help our community make more informed decisions when it comes to their skin. We focus on sharing research-based evidence.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-dervora-beige">
            <h3 className="font-heading text-xl font-bold text-dervora-primary mb-3 flex items-center gap-2">
              <Target size={24} /> Our Mission
            </h3>
            <p className="font-body text-sm text-dervora-dark/80 leading-relaxed">
              To empower skincare consumers with transparent, data-driven insights so they can build routines that truly work for their unique skin barrier.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dervora-primary mb-3 flex items-center justify-center gap-3">
              <Users size={32} /> Who We Are
            </h2>
            <p className="font-body text-base text-dervora-dark/70 max-w-2xl mx-auto">
              Dervora was built by a passionate team of pharmacy students who wanted to bridge the gap between skincare science and everyday consumers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-dervora-beige flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-md transition-shadow"
              >
                {/* Foto Anggota */}
                <img 
                  src={member.photoUrl} 
                  alt={member.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-dervora-blush flex-shrink-0"
                />
                
                {/* Info Anggota */}
                <div className="text-center sm:text-left">
                  <h3 className="font-heading text-xl font-bold text-dervora-dark mb-1">
                    {member.name}
                  </h3>
                  <p className="font-body text-sm text-dervora-primary font-semibold mb-1">
                    {member.role}
                  </p>
                  <p className="font-body text-xs text-dervora-dark/50 mb-3">
                    NIM: {member.nim}
                  </p>
                  <p className="font-body text-sm text-dervora-dark/80 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};