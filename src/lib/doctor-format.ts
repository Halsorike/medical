import type { Doctor } from "@/types/doctor";

type DoctorSource = {
  id?: string;
  name: string;
  nameAr?: string | null;
  title?: string | null;
  titleAr?: string | null;
  bio?: string | null;
  bioAr?: string | null;
  specialization?: string | null;
  experience?: number | null;
  qualification?: string | null;
  image?: string | null;
  slug: string;
  tags?: string[] | string | null;
  tagsAr?: string[] | string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
};

const fallbackImage = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=360&h=450&fit=crop";

function readTags(value: DoctorSource["tags"], fallback: string) {
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
      }
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  return [fallback].filter(Boolean);
}

export function toStorefrontDoctor(doctor: DoctorSource): Doctor {
  const specialization = doctor.specialization || doctor.title || "Therapy";
  const title = doctor.title || specialization;
  const titleAr = doctor.titleAr || title;

  return {
    id: doctor.id,
    name: doctor.name,
    nameAr: doctor.nameAr || doctor.name,
    title,
    titleAr,
    slug: doctor.slug,
    image: doctor.image || fallbackImage,
    bio: doctor.bio || doctor.qualification || `${doctor.name} supports families with ${specialization.toLowerCase()} care.`,
    bioAr: doctor.bioAr || doctor.bio || doctor.qualification || `${doctor.name} supports families with ${specialization.toLowerCase()} care.`,
    tags: readTags(doctor.tags, specialization),
    tagsAr: readTags(doctor.tagsAr, titleAr),
    socials: {
      facebook: doctor.facebook || "https://www.facebook.com/echowellness.me",
      instagram: doctor.instagram || "https://www.instagram.com/echowellness.om/",
      twitter: doctor.twitter || "#",
    },
    experience: doctor.experience ?? undefined,
  };
}
