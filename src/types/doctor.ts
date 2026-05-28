export type Doctor = {
  id?: string;
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
  experience?: number;
};
