export type Doctor = {
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  slug: string;
  image: string;
  bio: string;
  bioAr: string;
  tags: string[];
  tagsAr: string[];
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
};

export const doctors: Doctor[] = [
  {
    name: "Dr. Ahmad Al-Rashidi",
    nameAr: "د. أحمد الرشيدي",
    title: "Hearing Specialist",
    titleAr: "أخصائي سمعيات",
    slug: "ahmad-al-rashidi",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=360&h=450&fit=crop",
    bio: "Senior audiologist specializing in diagnostic hearing evaluations and personalized hearing care plans.",
    bioAr: "أخصائي سمعيات بارز متخصص في التقييمات التشخيصية للسمع وخطط الرعاية السمعية الشخصية.",
    tags: ["Audiology", "Diagnostics", "Hearing Care"],
    tagsAr: ["سمعيات", "تشخيص", "رعاية السمع"],
    socials: {
      facebook: "https://facebook.com/dr.ahmad.alrashidi",
      instagram: "https://instagram.com/dr.ahmad.alrashidi",
      twitter: "https://twitter.com/a_alrashidi_aud",
    },
  },
  {
    name: "Dr. Sara Mahmoud",
    nameAr: "د. سارة محمود",
    title: "Speech Therapist",
    titleAr: "أخصائية نطق ولغة",
    slug: "sara-mahmoud",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=360&h=450&fit=crop",
    bio: "Speech therapist focused on pediatric language development, articulation, and family-centered therapy.",
    bioAr: "أخصائية نطق ولغة متخصصة في تطوير لغة الأطفال والنطق والعلاج الموجّه للأسرة.",
    tags: ["Speech Therapy", "Pediatrics", "Language"],
    tagsAr: ["علاج النطق", "طب الأطفال", "اللغة"],
    socials: {
      facebook: "https://facebook.com/dr.sara.mahmoud",
      instagram: "https://instagram.com/dr.sara.mahmoud",
      twitter: "https://twitter.com/smahmoud_speech",
    },
  },
  {
    name: "Dr. Khalid Nasser",
    nameAr: "د. خالد ناصر",
    title: "Occupational Therapist",
    titleAr: "معالج وظيفي",
    slug: "khalid-nasser",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=360&h=450&fit=crop",
    bio: "Occupational therapist helping children and adults build independence through practical daily-life skills.",
    bioAr: "معالج وظيفي يساعد الأطفال والبالغين على بناء الاستقلالية من خلال مهارات الحياة اليومية العملية.",
    tags: ["Occupational Therapy", "Rehabilitation", "Daily Living"],
    tagsAr: ["العلاج الوظيفي", "إعادة التأهيل", "الحياة اليومية"],
    socials: {
      facebook: "https://facebook.com/dr.khalid.nasser",
      instagram: "https://instagram.com/dr.khalid.nasser",
      twitter: "https://twitter.com/k_nasser_ot",
    },
  },
  {
    name: "Dr. Lina Haddad",
    nameAr: "د. لينا حداد",
    title: "Pediatric Audiologist",
    titleAr: "أخصائية سمعيات أطفال",
    slug: "lina-haddad",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=360&h=450&fit=crop",
    bio: "Pediatric audiologist specializing in early hearing screening, cochlear implant follow-up, and infant audiology.",
    bioAr: "أخصائية سمعيات أطفال متخصصة في الكشف المبكر للسمع ومتابعة زراعة القوقعة وسمعيات الرضّع.",
    tags: ["Pediatric Audiology", "Cochlear Implant", "Infant"],
    tagsAr: ["سمعيات الأطفال", "زراعة القوقعة", "الرضّع"],
    socials: {
      facebook: "https://facebook.com/dr.lina.haddad",
      instagram: "https://instagram.com/dr.lina.haddad",
      twitter: "https://twitter.com/lhaddad_aud",
    },
  },
  {
    name: "Dr. Omar Yousef",
    nameAr: "د. عمر يوسف",
    title: "Speech & Language Pathologist",
    titleAr: "أخصائي أمراض النطق واللغة",
    slug: "omar-yousef",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=360&h=450&fit=crop",
    bio: "Specialist in fluency disorders, voice therapy, and adult communication rehabilitation.",
    bioAr: "متخصص في اضطرابات الطلاقة وعلاج الصوت وإعادة تأهيل التواصل لدى البالغين.",
    tags: ["Fluency", "Voice Therapy", "Adult Rehab"],
    tagsAr: ["الطلاقة", "علاج الصوت", "إعادة التأهيل"],
    socials: {
      facebook: "https://facebook.com/dr.omar.yousef",
      instagram: "https://instagram.com/dr.omar.yousef",
      twitter: "https://twitter.com/oyousef_slp",
    },
  },
  {
    name: "Dr. Nadia Saleh",
    nameAr: "د. نادية صالح",
    title: "Occupational Therapist",
    titleAr: "معالجة وظيفية",
    slug: "nadia-saleh",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=360&h=450&fit=crop",
    bio: "Occupational therapist with expertise in sensory processing, school readiness, and fine motor skills.",
    bioAr: "معالجة وظيفية متخصصة في المعالجة الحسية والاستعداد المدرسي والمهارات الحركية الدقيقة.",
    tags: ["Sensory Processing", "School Readiness", "Fine Motor"],
    tagsAr: ["المعالجة الحسية", "الاستعداد المدرسي", "المهارات الحركية الدقيقة"],
    socials: {
      facebook: "https://facebook.com/dr.nadia.saleh",
      instagram: "https://instagram.com/dr.nadia.saleh",
      twitter: "https://twitter.com/nsaleh_ot",
    },
  },
];

/** Returns locale-resolved fields for display. Does not mutate original. */
export function getDoctorLocale(doctor: Doctor, locale: string) {
  return {
    ...doctor,
    name: locale === "ar" ? doctor.nameAr : doctor.name,
    title: locale === "ar" ? doctor.titleAr : doctor.title,
    bio: locale === "ar" ? doctor.bioAr : doctor.bio,
    tags: locale === "ar" ? doctor.tagsAr : doctor.tags,
  };
}
