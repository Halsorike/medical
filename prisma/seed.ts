import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Departments
  const audiology = await db.department.upsert({
    where: { name: "Audiology" },
    update: {},
    create: {
      name: "Audiology",
      nameAr: "قسم السمعيات",
      description: "Hearing evaluation and treatment",
    },
  });
  const speechDept = await db.department.upsert({
    where: { name: "Speech Therapy" },
    update: {},
    create: {
      name: "Speech Therapy",
      nameAr: "علاج النطق",
      description: "Speech and language therapy",
    },
  });
  const otDept = await db.department.upsert({
    where: { name: "Occupational Therapy" },
    update: {},
    create: {
      name: "Occupational Therapy",
      nameAr: "العلاج الوظيفي",
      description: "Daily living skills therapy",
    },
  });

  // Services
  await db.service.createMany({
    skipDuplicates: true,
    data: [
      { name: "Hearing Evaluation", nameAr: "تقييم السمع", price: 80, duration: 60, departmentId: audiology.id },
      { name: "Hearing Aid Fitting", nameAr: "تركيب جهاز السمع", price: 150, duration: 90, departmentId: audiology.id },
      { name: "Speech Assessment", nameAr: "تقييم النطق", price: 70, duration: 60, departmentId: speechDept.id },
      { name: "Speech Therapy Session", nameAr: "جلسة علاج نطق", price: 60, duration: 45, departmentId: speechDept.id },
      { name: "OT Assessment", nameAr: "تقييم وظيفي", price: 70, duration: 60, departmentId: otDept.id },
      { name: "OT Session", nameAr: "جلسة علاج وظيفي", price: 55, duration: 45, departmentId: otDept.id },
    ],
  });

  // Doctors
  await db.doctor.upsert({
    where: { slug: "ahmad-al-rashidi" },
    update: {},
    create: {
      name: "Dr. Ahmad Al-Rashidi",
      nameAr: "د. أحمد الرشيدي",
      title: "Hearing Specialist",
      titleAr: "أخصائي سمعيات",
      email: "ahmad@echowellness.me",
      phone: "+968791000001",
      slug: "ahmad-al-rashidi",
      specialization: "Audiology",
      experience: 12,
      departmentId: audiology.id,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=360&h=450&fit=crop",
    },
  });

  await db.doctor.upsert({
    where: { slug: "sara-al-khalidi" },
    update: {},
    create: {
      name: "Dr. Sara Al-Khalidi",
      nameAr: "د. سارة الخالدي",
      title: "Speech-Language Pathologist",
      titleAr: "أخصائية أمراض اللغة والكلام",
      email: "sara@echowellness.me",
      phone: "+968791000002",
      slug: "sara-al-khalidi",
      specialization: "Speech Therapy",
      experience: 8,
      departmentId: speechDept.id,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=360&h=450&fit=crop",
    },
  });

  // Patients (sample)
  await db.patient.upsert({
    where: { email: "ahmad.khalil@example.com" },
    update: {},
    create: {
      name: "Ahmad Khalil",
      nameAr: "أحمد خليل",
      email: "ahmad.khalil@example.com",
      phone: "+968791111111",
      gender: "male",
    },
  });

  await db.patient.upsert({
    where: { email: "layla.hussein@example.com" },
    update: {},
    create: {
      name: "Layla Hussein",
      nameAr: "ليلى حسين",
      email: "layla.hussein@example.com",
      phone: "+968791222222",
      gender: "female",
    },
  });

  // Roles
  await db.role.createMany({
    skipDuplicates: true,
    data: [
      { name: "admin", nameAr: "مدير", permissions: JSON.stringify(["*"]) },
      {
        name: "doctor",
        nameAr: "طبيب",
        permissions: JSON.stringify(["appointments:read", "patients:read", "schedule:read"]),
      },
      {
        name: "staff",
        nameAr: "موظف",
        permissions: JSON.stringify(["appointments:read", "appointments:write"]),
      },
    ],
  });

  // Blog Categories
  await db.blogCategory.createMany({
    skipDuplicates: true,
    data: [
      { name: "Hearing Health", nameAr: "صحة السمع", slug: "hearing-health" },
      { name: "Speech Tips", nameAr: "نصائح النطق", slug: "speech-tips" },
      { name: "Occupational Therapy", nameAr: "العلاج الوظيفي", slug: "occupational-therapy" },
      { name: "Child Development", nameAr: "تطور الطفل", slug: "child-development" },
    ],
  });

  // Holidays
  await db.holiday.createMany({
    skipDuplicates: true,
    data: [
      { name: "Eid Al-Fitr", nameAr: "عيد الفطر", date: new Date("2025-03-30") },
      { name: "Eid Al-Adha", nameAr: "عيد الأضحى", date: new Date("2025-06-06") },
      { name: "Independence Day", nameAr: "يوم الاستقلال", date: new Date("2025-05-25") },
      { name: "Christmas", nameAr: "الكريسماس", date: new Date("2025-12-25") },
    ],
  });

  // Site Settings (defaults)
  const settings = [
    { key: "clinic.name.en", value: "Echo Wellness Center" },
    { key: "clinic.name.ar", value: "المركز الأردني للسمع والنطق والعلاج الوظيفي" },
    { key: "clinic.phone", value: "+968 XXXX XXXX" },
    { key: "clinic.email", value: "info@echowellness.me" },
    { key: "clinic.address.en", value: "Sarooj, Muscat, Sultanate of Oman" },
    { key: "clinic.address.ar", value: "شارع مكة المكرمة ١٢٣، عمان، الأردن" },
    { key: "hero.title.en", value: "Hear Better, Speak Clearly, Live Fully" },
    { key: "hero.title.ar", value: "اسمع أفضل، تكلم بوضوح، عش بامتلاء" },
    { key: "hero.subtitle.en", value: "Specialist audiology, speech, occupational, psychology, and behavioral support in Muscat" },
    { key: "hero.subtitle.ar", value: "رعاية سمعية ونطقية ووظيفية متخصصة في عمان" },
    { key: "social.facebook", value: "https://www.facebook.com/echowellness.me" },
    { key: "social.instagram", value: "https://www.instagram.com/echowellness.om/" },
    { key: "social.twitter", value: "https://x.com/echowellness" },
    { key: "working_hours", value: "Sun-Thu 8AM-6PM" },
  ];

  for (const s of settings) {
    await db.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("✅ Seed complete");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
