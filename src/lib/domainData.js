// Expanded domain list for Indian career market
export const domains = [
  {
    id: "tech",
    name: "Technology & Programming",
    description: "Build software, AI systems, and digital products",
    icon: "Code",
    color: "from-blue-500 to-cyan-500",
    careers: ["Software Developer", "AI Engineer", "Data Scientist", "Web Developer", "Cloud Engineer", "Cybersecurity Analyst"]
  },
  {
    id: "healthcare",
    name: "Healthcare & Medicine",
    description: "Provide medical care, research, and health solutions",
    icon: "Heart",
    color: "from-rose-500 to-pink-500",
    careers: ["Doctor", "Nurse", "Pharmacist", "Medical Researcher", "Physiotherapist"]
  },
  {
    id: "business",
    name: "Business & Finance",
    description: "Manage operations, investments, and financial strategies",
    icon: "TrendingUp",
    color: "from-emerald-500 to-teal-500",
    careers: ["Business Analyst", "Product Manager", "Investment Banker", "Financial Analyst", "Operations Manager"]
  },
  {
    id: "arts",
    name: "Arts & Design",
    description: "Create visual experiences, graphics, and creative solutions",
    icon: "Palette",
    color: "from-purple-500 to-violet-500",
    careers: ["UI/UX Designer", "Graphic Designer", "Art Director", "Illustrator", "Animator"]
  },
  {
    id: "science",
    name: "Science & Research",
    description: "Conduct research, experiments, and scientific analysis",
    icon: "Microscope",
    color: "from-indigo-500 to-blue-500",
    careers: ["Research Scientist", "Lab Technician", "Biotechnologist", "Environmental Scientist"]
  },
  {
    id: "education",
    name: "Education & Teaching",
    description: "Educate students, develop curricula, and mentor learners",
    icon: "GraduationCap",
    color: "from-orange-500 to-amber-500",
    careers: ["Teacher", "Professor", "Corporate Trainer", "Curriculum Developer", "Education Consultant"]
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Coach athletes, manage fitness programs, and sports events",
    icon: "Dumbbell",
    color: "from-green-500 to-emerald-500",
    careers: ["Sports Coach", "Fitness Trainer", "Physiotherapist", "Sports Manager", "Nutritionist"]
  },
  {
    id: "entertainment",
    name: "Music & Entertainment",
    description: "Create content, perform, and manage media productions",
    icon: "Music",
    color: "from-fuchsia-500 to-purple-500",
    careers: ["Musician", "Video Editor", "Content Creator", "Event Manager", "Sound Engineer"]
  },
  {
    id: "social",
    name: "Social Work & NGO",
    description: "Support communities, manage social programs, and advocacy",
    icon: "Users",
    color: "from-sky-500 to-cyan-500",
    careers: ["Social Worker", "NGO Manager", "Community Organizer", "Counselor", "Policy Advocate"]
  },
  {
    id: "engineering",
    name: "Engineering & Manufacturing",
    description: "Design systems, build products, and optimize processes",
    icon: "Cog",
    color: "from-slate-500 to-gray-500",
    careers: ["Mechanical Engineer", "Civil Engineer", "Production Manager", "Quality Engineer"]
  },
  {
    id: "law",
    name: "Law & Legal Services",
    description: "Provide legal counsel, represent clients, and ensure compliance",
    icon: "Scale",
    color: "from-yellow-600 to-amber-600",
    careers: ["Lawyer", "Legal Consultant", "Compliance Officer", "Paralegal", "Judge"]
  },
  {
    id: "agriculture",
    name: "Agriculture & Environment",
    description: "Manage farms, protect ecosystems, and ensure sustainability",
    icon: "Leaf",
    color: "from-green-600 to-lime-600",
    careers: ["Agricultural Officer", "Environmental Consultant", "Farm Manager", "AgriTech Specialist"]
  },
  {
    id: "travel",
    name: "Travel & Hospitality",
    description: "Manage hotels, plan trips, and deliver guest experiences",
    icon: "Plane",
    color: "from-cyan-500 to-blue-500",
    careers: ["Hotel Manager", "Travel Consultant", "Chef", "Event Planner", "Tour Guide"]
  },
  {
    id: "marketing",
    name: "Sales, Marketing & Advertising",
    description: "Drive sales, create campaigns, and build brand awareness",
    icon: "Megaphone",
    color: "from-red-500 to-rose-500",
    careers: ["Marketing Manager", "Sales Executive", "Brand Manager", "Digital Marketer", "PR Specialist"]
  },
  {
    id: "psychology",
    name: "Psychology & Human Behavior",
    description: "Study behavior, counsel individuals, and improve mental health",
    icon: "Brain",
    color: "from-violet-500 to-purple-500",
    careers: ["Psychologist", "HR Specialist", "Behavioral Analyst", "Career Counselor", "Therapist"]
  }
];

// Helper function to get domain by ID
export function getDomainById(id) {
  return domains.find(d => d.id === id);
}

// Helper function to get all domain IDs
export function getDomainIds() {
  return domains.map(d => d.id);
}

// Map old domain names to new domain IDs for backward compatibility
export const domainMapping = {
  "Tech": "tech",
  "Business": "business",
  "Creative": "arts",
  "All": null
};

// Salary tiers in INR (Indian Rupees)
export const salaryTiers = {
  entry: { min: 300000, max: 600000, label: "Entry Level" },
  mid: { min: 600000, max: 1500000, label: "Mid Level" },
  senior: { min: 1500000, max: 3000000, label: "Senior Level" },
  premium: { min: 3000000, max: 10000000, label: "Premium Level" }
};

// Format salary in Indian format (₹3,00,000)
export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format full salary range
export function formatSalaryRange(min, max) {
  return `${formatINR(min)} - ${formatINR(max)}`;
}

