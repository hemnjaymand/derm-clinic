export type ServicesBanner = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  icon: string | null;
  ctaLabel?: string;
  ctaHref?: string;
};

 export type ServicesBannerProps = {
  banner: ServicesBanner;
};


export type ServiceShowcaseCardProps = {
  icon: string | null;
  eyebrow?: string;
  title: string;
  description: string;
  moreHref: string;
  consultHref: string;
}; 