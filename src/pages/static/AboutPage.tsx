import React, { useState } from 'react';
import { Sparkles, Users, Heart, Target, Code2 } from 'lucide-react';

interface TeamMember {
  name: string;
  nim: string;
  role: string;
  description: string;
  photoUrl: string;
}

const CORE_TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Metanoia Dwi Farida Sitorus',
    nim: 'I1021241069',
    role: 'The Manager',
    description:
      'Menyusun jadwal dan target; memantau progres; memimpin rapat; mencatat risiko dan keputusan; menghubungkan tim dengan pengembang website.',
    photoUrl:
      'https://res.cloudinary.com/atrogcxj/image/upload/v1792311329/WhatsApp_Image_2026-10-18_at_15.14.02.jpg',
  },
  {
    name: 'Naisya Andini',
    nim: 'I1021241048',
    role: 'The Scientist',
    description:
      'Menelusuri literatur tipe kulit dan bahan aktif; menyusun dasar penilaian kecocokan produk; menjaga kewajaran klaim kesehatan.',
    photoUrl:
      'https://res.cloudinary.com/atrogcxj/image/upload/v1792311239/WhatsApp_Image_2026-10-18_at_15.11.46.jpg',
  },
  {
    name: 'Triana Apriani',
    nim: 'I1021241084',
    role: 'The Scientist',
    description:
      'Memeriksa komposisi, fungsi bahan aktif, sumber resmi, dan status BPOM; mencatat sumber serta tanggal pembaruan.',
    photoUrl:
      'https://res.cloudinary.com/atrogcxj/image/upload/v1792312481/WhatsApp_Image_2026-10-18_at_15.31.55.jpg',
  },
  {
    name: 'Naura Mukhbita Salsabila',
    nim: 'I1021241087',
    role: 'The Scientist',
    description:
      'Mengelompokkan produk menurut jenis, bahan aktif, dan kesesuaian kulit; menyiapkan data terstruktur untuk website.',
    photoUrl:
      'https://res.cloudinary.com/atrogcxj/image/upload/v1792312042/WhatsApp_Image_2026-10-18_at_15.25.43.jpg',
  },
  {
    name: 'Dhea Safitriningsih',
    nim: 'I1021241072',
    role: 'The Designer',
    description:
      'Merancang identitas visual, alur pengguna, dan tampilan antarmuka; menguji keterbacaan di desktop dan ponsel.',
    photoUrl:
      'https://res.cloudinary.com/atrogcxj/image/upload/v1792312481/WhatsApp_Image_2026-10-18_at_15.31.47.jpg',
  },
  {
    name: 'Putri Alisha Huwaida',
    nim: 'I1021241081',
    role: 'The Marketer',
    description:
      'Mengkaji target pengguna dan pesaing; menyusun konten Instagram; mengelola tautan afiliasi dan memantau hasil promosi.',
    photoUrl:
      'https://res.cloudinary.com/atrogcxj/image/upload/v1792311788/WhatsApp_Image_2026-10-18_at_15.21.48.jpg',
  },
];

const DEVELOPER_MEMBER: TeamMember = {
  name: 'Syarif Fahridho',
  nim: 'D1041241019',
  role: 'The Developer',
  description:
    'Merancang arsitektur web full-stack Dervora, mengelola basis data produk serta bahan aktif, dan membangun sistem analisis serta rekomendasi kecocokan kulit.',
  photoUrl:
    'https://res.cloudinary.com/atrogcxj/image/upload/v1795360161/WhatsApp_Image_2026-11-17_at_18.04.34.jpg',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0]?.slice(0, 2).toUpperCase() || 'DV';
}

const MemberAvatar: React.FC<{
  name: string;
  photoUrl: string;
  featured?: boolean;
}> = ({ name, photoUrl, featured = false }) => {
  const [hasError, setHasError] = useState(false);

  const sizeClass = featured
    ? 'w-28 h-28 sm:w-32 sm:h-32'
    : 'w-24 h-24 sm:w-28 sm:h-28';

  if (hasError || !photoUrl) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-dervora-primary text-dervora-cream flex items-center justify-center font-heading text-2xl font-bold ring-4 ring-dervora-blush flex-shrink-0 select-none`}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full overflow-hidden ring-4 ${
        featured ? 'ring-dervora-primary/20' : 'ring-dervora-blush'
      } flex-shrink-0 bg-dervora-cream`}
    >
      <img
        src={photoUrl}
        alt={name}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
};

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dervora-cream px-5 sm:px-6 pt-14 pb-28 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Editorial Hero Header */}
        <header className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <p className="font-body text-xs uppercase tracking-[0.22em] text-dervora-primary/75 font-semibold mb-4">
            Est. 2026 &middot; Science-Backed Skincare
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-dervora-primary tracking-tight mb-4">
            About Dervora
          </h1>
          <p className="font-heading italic text-lg sm:text-xl text-dervora-dark/70">
            We&apos;re here to make skincare easier.
          </p>
          <div className="w-16 h-[2px] bg-dervora-primary/40 mx-auto mt-7" />
        </header>

        {/* Our Story Section */}
        <section className="bg-white p-7 sm:p-10 md:p-14 rounded-3xl shadow-sm border border-dervora-beige mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-11 h-11 rounded-2xl bg-dervora-primary/10 text-dervora-primary flex items-center justify-center flex-shrink-0">
              <Sparkles size={22} />
            </span>
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.18em] text-dervora-dark/45 font-semibold">
                How It Began
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-dervora-primary leading-tight">
                Our Story
              </h2>
            </div>
          </div>

          <div className="font-body text-sm sm:text-base text-dervora-dark/80 leading-relaxed space-y-5">
            <p>
              Dervora was founded in 2026. It all started during a discussion about how difficult
              it is to find the right skincare products, especially for students and beginners.
            </p>
            <p className="pl-5 border-l-2 border-dervora-primary/35 italic text-dervora-dark/70">
              &ldquo;Every product makes my skin break out, my skin is super sensitive to
              everything.&rdquo; &ldquo;Have you tried X brand? But I found X ingredient
              doesn&apos;t work with my skin.&rdquo; &ldquo;How do you keep track of all
              this?&rdquo;
            </p>
            <p>
              After that, Dervora was born with one simple mission:{' '}
              <strong className="text-dervora-dark font-semibold">
                make skincare science as easy and transparent as possible.
              </strong>{' '}
              We help our users by providing science-backed data for cosmetic products. We believe
              consumers have the right to know what is going into their products.
            </p>
          </div>
        </section>

        {/* Values & Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 md:mb-24">
          <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-dervora-beige hover:border-dervora-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-5">
              <span className="w-11 h-11 rounded-2xl bg-dervora-blush text-dervora-primary flex items-center justify-center">
                <Heart size={20} />
              </span>
              <span className="font-heading text-sm font-semibold text-dervora-dark/30 tracking-widest">
                01
              </span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-dervora-primary mb-3">
              Our Values
            </h3>
            <p className="font-body text-sm sm:text-base text-dervora-dark/75 leading-relaxed">
              At Dervora, we&apos;re committed to providing science-backed info to help our
              community make more informed decisions when it comes to their skin. We focus on
              sharing research-based evidence.
            </p>
          </div>

          <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-dervora-beige hover:border-dervora-primary/40 transition-colors">
            <div className="flex items-center justify-between mb-5">
              <span className="w-11 h-11 rounded-2xl bg-dervora-blush text-dervora-primary flex items-center justify-center">
                <Target size={20} />
              </span>
              <span className="font-heading text-sm font-semibold text-dervora-dark/30 tracking-widest">
                02
              </span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-dervora-primary mb-3">
              Our Mission
            </h3>
            <p className="font-body text-sm sm:text-base text-dervora-dark/75 leading-relaxed">
              To empower skincare consumers with transparent, data-driven insights so they can
              build routines that truly work for their unique skin barrier.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-dervora-beige text-dervora-primary font-body text-xs font-semibold uppercase tracking-[0.16em] mb-4">
              <Users size={14} />
              Meet The Team
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-dervora-primary mb-3">
              Who We Are
            </h2>
            <p className="font-body text-sm sm:text-base text-dervora-dark/70 leading-relaxed">
              Dervora was built through a collaboration between passionate pharmacy students and
              software engineering to bridge skincare science with everyday consumers.
            </p>
          </div>

          {/* 6 Anggota Tim Inti (2 Kolom Simetris) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CORE_TEAM_MEMBERS.map((member) => (
              <article
                key={member.nim}
                className="group bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-dervora-beige hover:border-dervora-primary/40 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6"
              >
                <MemberAvatar name={member.name} photoUrl={member.photoUrl} />

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-dervora-primary/10 text-dervora-primary font-body text-xs font-semibold">
                      {member.role}
                    </span>
                    <span className="font-body text-[11px] text-dervora-dark/45 tracking-wide">
                      NIM {member.nim}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl font-bold text-dervora-dark leading-snug mb-2">
                    {member.name}
                  </h3>

                  <p className="font-body text-sm text-dervora-dark/75 leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Pembatas Halus untuk Web Developer */}
          <div className="flex items-center gap-4 my-10 max-w-md mx-auto">
            <div className="h-px flex-1 bg-dervora-beige" />
            <span className="font-body text-[11px] uppercase tracking-[0.2em] text-dervora-dark/45 font-semibold flex items-center gap-1.5">
              <Code2 size={13} className="text-dervora-primary" />
              Platform Engineering
            </span>
            <div className="h-px flex-1 bg-dervora-beige" />
          </div>

          {/* Kartu Developer (Terpusat di Paling Bawah) */}
          <article className="group max-w-2xl mx-auto bg-white rounded-3xl p-7 sm:p-9 shadow-sm border border-dervora-primary/25 hover:border-dervora-primary/50 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-8">
            <MemberAvatar
              name={DEVELOPER_MEMBER.name}
              photoUrl={DEVELOPER_MEMBER.photoUrl}
              featured
            />

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-dervora-primary text-dervora-cream font-body text-xs font-semibold">
                  <Code2 size={12} />
                  {DEVELOPER_MEMBER.role}
                </span>
                <span className="font-body text-[11px] text-dervora-dark/50 tracking-wide">
                  NIM {DEVELOPER_MEMBER.nim}
                </span>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold text-dervora-dark leading-snug mb-2">
                {DEVELOPER_MEMBER.name}
              </h3>

              <p className="font-body text-sm text-dervora-dark/75 leading-relaxed">
                {DEVELOPER_MEMBER.description}
              </p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};