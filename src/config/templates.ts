import type { Template } from "@/types";

export const TEMPLATES: Template[] = [
  {
    id: "tech-founder",
    name: "Tech Entrepreneur",
    description: "Visionary builder launching a product or startup",
    icon: "Rocket",
    formValues: {
      type: "personal",
      tone: "passionate",
      platform: "linkedin",
      emojis: false,
      content:
        "Building a SaaS product for developer productivity. Previously led engineering at Series B startup. MIT CS grad. Love open source and shipping fast.",
    },
  },
  {
    id: "creative-pro",
    name: "Creative Professional",
    description: "Designer, artist, or creative who wants to stand out",
    icon: "Palette",
    formValues: {
      type: "personal",
      tone: "casual",
      platform: "instagram",
      emojis: true,
      content:
        "Brand designer with 7 years of experience crafting visual identities for startups and Fortune 500 companies. Passionate about minimalist design and typography.",
    },
  },
  {
    id: "job-seeker",
    name: "Job Seeker",
    description: "Professional actively looking for new opportunities",
    icon: "Briefcase",
    formValues: {
      type: "personal",
      tone: "professional",
      platform: "linkedin",
      emojis: false,
      content:
        "Senior software engineer with 5 years in full-stack development. Expertise in React, Node.js, and cloud infrastructure. Open to new opportunities in fintech or SaaS.",
    },
  },
  {
    id: "academic",
    name: "Academic / Researcher",
    description: "PhD, professor, or research scientist",
    icon: "GraduationCap",
    formValues: {
      type: "personal",
      tone: "professional",
      platform: "twitter",
      emojis: false,
      content:
        "Machine learning researcher at Stanford. PhD in Computer Science. Focus on NLP and large language models. Published in NeurIPS and ICML. Advisor to AI startups.",
    },
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "YouTuber, streamer, blogger, or influencer",
    icon: "Video",
    formValues: {
      type: "personal",
      tone: "funny",
      platform: "instagram",
      emojis: true,
      content:
        "Tech YouTube creator with 200k subscribers. I review gadgets, build keyboards, and share dev tips. Weekly videos every Tuesday. Partnered with major tech brands.",
    },
  },
  {
    id: "freelancer",
    name: "Freelancer",
    description: "Independent consultant or contractor",
    icon: "Laptop",
    formValues: {
      type: "personal",
      tone: "casual",
      platform: "twitter",
      emojis: false,
      content:
        "Freelance web developer specializing in Next.js and TypeScript. 8 years experience. Helped 50+ clients launch products. Available for contracts.",
    },
  },
  {
    id: "nonprofit",
    name: "Nonprofit / Social Impact",
    description: "Mission-driven leader or activist",
    icon: "Heart",
    formValues: {
      type: "brand",
      tone: "passionate",
      platform: "linkedin",
      emojis: false,
      content:
        "Executive director at a nonprofit focused on climate education for underserved youth. 12 years in environmental advocacy. Speaker. Author. Change-maker.",
    },
  },
  {
    id: "student",
    name: "Student",
    description: "Undergrad or graduate building their brand early",
    icon: "BookOpen",
    formValues: {
      type: "personal",
      tone: "thoughtful",
      platform: "linkedin",
      emojis: false,
      content:
        "Computer Science junior at UCLA. Interning at Google this summer. Building side projects in AI and mobile apps. Looking to connect with mentors and founders.",
    },
  },
];
