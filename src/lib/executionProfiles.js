const resource = (title, url, category, platform) => ({ title, url, category, platform });

export const executionProfiles = {
  tech: {
    aiInsight: {
      title: "Technology Execution Engine",
      insight:
        "Your fastest path here comes from combining fundamentals, shipped projects, and public proof of execution.",
    },
    phases: [
      {
        title: "Programming Foundations",
        description: "Build logic, syntax, and problem-solving muscle with daily coding.",
        resources: [
          resource("CS50x", "https://cs50.harvard.edu/x/", "course", "Harvard / edX"),
          resource("freeCodeCamp", "https://www.freecodecamp.org/learn/", "course", "freeCodeCamp"),
          resource("MDN Learn", "https://developer.mozilla.org/en-US/docs/Learn", "article", "MDN"),
        ],
      },
      {
        title: "Core Development Skills",
        description: "Learn Git, APIs, debugging, and one primary stack deeply.",
        resources: [
          resource("Node.js Learn", "https://nodejs.org/en/learn", "article", "Node.js"),
          resource("GitHub Docs", "https://docs.github.com/en/get-started", "article", "GitHub"),
          resource("REST API Tutorial", "https://restfulapi.net/", "article", "REST API"),
        ],
      },
      {
        title: "Applied Technical Practice",
        description: "Build small apps and deploy working end-to-end flows.",
        resources: [
          resource("Vercel Docs", "https://vercel.com/docs", "article", "Vercel"),
          resource("roadmap.sh Projects", "https://roadmap.sh/projects", "practice platform", "roadmap.sh"),
          resource("Build Projects Search", "https://www.youtube.com/results?search_query=full+stack+project+tutorial", "video", "YouTube"),
        ],
      },
      {
        title: "Portfolio and Proof",
        description: "Package strong projects with README, demos, and architecture notes.",
        resources: [
          resource("Frontend Mentor", "https://www.frontendmentor.io/challenges", "practice platform", "Frontend Mentor"),
          resource("GitHub Portfolio Tips", "https://docs.github.com/en/get-started/start-your-journey/about-your-profile", "article", "GitHub"),
          resource("Canva Portfolio Templates", "https://www.canva.com/portfolios/templates/", "article", "Canva"),
        ],
      },
      {
        title: "Job Readiness",
        description: "Prepare for interviews, coding rounds, and technical storytelling.",
        resources: [
          resource("NeetCode Roadmap", "https://neetcode.io/roadmap", "practice platform", "NeetCode"),
          resource("InterviewBit", "https://www.interviewbit.com/", "practice platform", "InterviewBit"),
          resource("LinkedIn Jobs", "https://www.linkedin.com/jobs/", "article", "LinkedIn"),
        ],
      },
    ],
    jobs: [
      { title: "Software Developer", source: "LinkedIn Jobs", description: "Ship features and services for product teams.", relevance: "High fit for project-driven technical paths", location: "Bengaluru / Hybrid", url: "https://www.linkedin.com/jobs/" },
      { title: "Web Developer", source: "Indeed", description: "Build responsive products and user-facing systems.", relevance: "Best after frontend and deployment modules", location: "Hyderabad / Remote", url: "https://in.indeed.com/" },
      { title: "Cloud Engineer", source: "Naukri", description: "Support deployment, infrastructure, and platform reliability.", relevance: "Strong for systems-minded builders", location: "Pune / Hybrid", url: "https://www.naukri.com/" },
    ],
  },
  healthcare: {
    aiInsight: { title: "Healthcare Execution Engine", insight: "Progress here compounds through credibility, clinical understanding, and proof of structured learning." },
    phases: [
      { title: "Healthcare Foundations", description: "Cover anatomy, health systems, and ethical care fundamentals.", resources: [resource("WHO Health Topics", "https://www.who.int/health-topics", "article", "WHO"), resource("Khan Academy Health & Medicine", "https://www.khanacademy.org/science/health-and-medicine", "course", "Khan Academy"), resource("NPTEL Course Search", "https://nptel.ac.in/courses", "course", "NPTEL")] },
      { title: "Clinical and Diagnostic Basics", description: "Learn records, diagnostics, and safety-focused workflows.", resources: [resource("MedlinePlus", "https://medlineplus.gov/", "article", "MedlinePlus"), resource("Coursera Healthcare Search", "https://www.coursera.org/search?query=healthcare", "course", "Coursera"), resource("Healthcare Basics Search", "https://www.youtube.com/results?search_query=healthcare+fundamentals", "video", "YouTube")] },
      { title: "Applied Health Practice", description: "Work through case notes, reporting, and evidence-based interpretation.", resources: [resource("PubMed", "https://pubmed.ncbi.nlm.nih.gov/", "article", "PubMed"), resource("Kaggle Healthcare Datasets", "https://www.kaggle.com/datasets?search=healthcare", "practice platform", "Kaggle"), resource("ResearchGate", "https://www.researchgate.net/", "article", "ResearchGate")] },
      { title: "Profile and Proof", description: "Package certifications, internships, and healthcare project work.", resources: [resource("LinkedIn Learning Healthcare", "https://www.linkedin.com/learning/search?keywords=healthcare", "course", "LinkedIn Learning"), resource("Canva Resume Templates", "https://www.canva.com/resumes/templates/", "article", "Canva"), resource("Google Docs", "https://workspace.google.com/products/docs/", "article", "Google Docs")] },
      { title: "Healthcare Opportunity Readiness", description: "Target allied health, operations, and research support roles.", resources: [resource("Indeed Healthcare Jobs", "https://in.indeed.com/q-healthcare-jobs.html", "practice platform", "Indeed"), resource("LinkedIn Healthcare Jobs", "https://www.linkedin.com/jobs/search/?keywords=healthcare", "practice platform", "LinkedIn Jobs"), resource("Careers360 Healthcare Careers", "https://www.careers360.com/careers/articles/healthcare-jobs-in-india-counar", "article", "Careers360")] },
    ],
    jobs: [
      { title: "Clinical Research Assistant", source: "Indeed", description: "Support case data, records, and trial workflows.", relevance: "Strong for research and documentation modules", location: "Delhi NCR / On-site", url: "https://in.indeed.com/" },
      { title: "Healthcare Operations Associate", source: "Naukri", description: "Coordinate service, records, and hospital workflows.", relevance: "Best for structured healthcare learners", location: "Mumbai / On-site", url: "https://www.naukri.com/" },
      { title: "Medical Content Analyst", source: "LinkedIn Jobs", description: "Translate healthcare knowledge into usable content.", relevance: "High fit for research + communication proof", location: "Remote / Hybrid", url: "https://www.linkedin.com/jobs/" },
    ],
  },
  business: {
    aiInsight: { title: "Business Execution Engine", insight: "This path scales when analytical rigor, stakeholder clarity, and business communication improve together." },
    phases: [
      { title: "Business Foundations", description: "Build fluency in business models, Excel, and commercial thinking.", resources: [resource("CFI Resources", "https://corporatefinanceinstitute.com/resources/", "article", "CFI"), resource("NPTEL Management", "https://nptel.ac.in/courses", "course", "NPTEL"), resource("Excel for Beginners", "https://www.youtube.com/watch?v=rwbho0CgEAE", "video", "YouTube")] },
      { title: "Analytics and Decision Skills", description: "Learn SQL, dashboards, and financial analysis workflows.", resources: [resource("Mode SQL Tutorial", "https://mode.com/sql-tutorial/", "practice platform", "Mode"), resource("Google Data Analytics", "https://www.coursera.org/professional-certificates/google-data-analytics", "course", "Coursera"), resource("Power BI Learning Path", "https://learn.microsoft.com/en-us/training/powerplatform/power-bi/", "course", "Microsoft Learn")] },
      { title: "Applied Business Practice", description: "Run case studies, market analysis, and recommendation memos.", resources: [resource("Harvard Business Review", "https://hbr.org/", "article", "HBR"), resource("Case Interview Prep", "https://www.careercup.com/page?pid=case-interview-questions", "article", "CareerCup"), resource("Tableau Public", "https://public.tableau.com/", "practice platform", "Tableau Public")] },
      { title: "Proof of Impact", description: "Package dashboards, strategy decks, and business recommendations.", resources: [resource("Canva Presentation Templates", "https://www.canva.com/presentations/templates/", "article", "Canva"), resource("Notion Portfolio Templates", "https://www.notion.so/templates/category/portfolio", "article", "Notion"), resource("Looker Studio", "https://lookerstudio.google.com/", "practice platform", "Looker Studio")] },
      { title: "Analyst and PM Readiness", description: "Prepare for analyst, PM, and finance-adjacent opportunities.", resources: [resource("LinkedIn Business Analyst Jobs", "https://www.linkedin.com/jobs/search/?keywords=business%20analyst", "practice platform", "LinkedIn Jobs"), resource("Naukri Product Manager Jobs", "https://www.naukri.com/product-manager-jobs", "practice platform", "Naukri"), resource("Indeed Financial Analyst Jobs", "https://in.indeed.com/q-financial-analyst-jobs.html", "practice platform", "Indeed")] },
    ],
    jobs: [
      { title: "Business Analyst", source: "LinkedIn Jobs", description: "Translate business needs into structured analysis and execution.", relevance: "High fit for analyst-ready portfolios", location: "Bengaluru / Hybrid", url: "https://www.linkedin.com/jobs/" },
      { title: "Product Analyst", source: "Naukri", description: "Support product teams with insights, metrics, and recommendations.", relevance: "Best after case-study and dashboard proof", location: "Gurugram / Hybrid", url: "https://www.naukri.com/" },
      { title: "Finance Associate", source: "Indeed", description: "Work on reporting, budgeting, and operational finance.", relevance: "Strong match for spreadsheet and analysis modules", location: "Mumbai / On-site", url: "https://in.indeed.com/" },
    ],
  },
  arts: {
    aiInsight: { title: "Creative Execution Engine", insight: "The strongest creative trajectories come from visible taste, structured process, and proof of user or business impact." },
    phases: [
      { title: "Creative Foundations", description: "Learn layout, hierarchy, typography, and user-centered thinking.", resources: [resource("Google UX Design", "https://www.coursera.org/professional-certificates/google-ux-design", "course", "Coursera"), resource("Refactoring UI", "https://www.refactoringui.com/", "article", "Refactoring UI"), resource("Figma Basics", "https://www.youtube.com/watch?v=FTFaQWZBqQ8", "video", "YouTube")] },
      { title: "Tool and System Fluency", description: "Build confidence in Figma, design systems, and interaction design.", resources: [resource("Figma Learn", "https://help.figma.com/hc/en-us/categories/360002051613", "article", "Figma"), resource("Material Design", "https://m3.material.io/", "article", "Google"), resource("UX Planet", "https://uxplanet.org/", "article", "UX Planet")] },
      { title: "Applied Creative Practice", description: "Run research, feedback loops, and design iterations.", resources: [resource("NNGroup Articles", "https://www.nngroup.com/articles/", "article", "NNGroup"), resource("Maze Guides", "https://maze.co/guides/", "article", "Maze"), resource("Interaction Design Foundation", "https://www.interaction-design.org/literature", "course", "IDF")] },
      { title: "Portfolio and Case Studies", description: "Publish polished work with process, rationale, and measurable outcomes.", resources: [resource("Behance", "https://www.behance.net/", "practice platform", "Behance"), resource("Dribbble", "https://dribbble.com/", "practice platform", "Dribbble"), resource("UXfolio Tips", "https://www.uxfolio.com/blog/ux-portfolio-tips", "article", "UXfolio")] },
      { title: "Creative Hiring Readiness", description: "Prepare your portfolio, stories, and role positioning for design jobs.", resources: [resource("LinkedIn UI UX Jobs", "https://www.linkedin.com/jobs/search/?keywords=ui%20ux%20designer", "practice platform", "LinkedIn Jobs"), resource("Indeed Design Jobs", "https://in.indeed.com/q-graphic-designer-jobs.html", "practice platform", "Indeed"), resource("Naukri UI UX Jobs", "https://www.naukri.com/ui-ux-designer-jobs", "practice platform", "Naukri")] },
    ],
    jobs: [
      { title: "UI/UX Designer", source: "LinkedIn Jobs", description: "Design flows, screens, and product experiences.", relevance: "Strong fit for case-study-driven portfolios", location: "Bengaluru / Hybrid", url: "https://www.linkedin.com/jobs/" },
      { title: "Product Designer", source: "Indeed", description: "Balance research, interface craft, and systems thinking.", relevance: "Best for deeper portfolio proof", location: "Remote / Hybrid", url: "https://in.indeed.com/" },
      { title: "Content Strategist", source: "Naukri", description: "Shape structure, messaging, and content systems.", relevance: "High match for storytelling-led creatives", location: "Mumbai / Hybrid", url: "https://www.naukri.com/" },
    ],
  },
};

const genericDomainLabels = {
  science: "Science & Research",
  education: "Education & Teaching",
  sports: "Sports & Fitness",
  entertainment: "Music & Entertainment",
  social: "Social Work & NGO",
  engineering: "Engineering & Manufacturing",
  law: "Law & Legal Services",
  agriculture: "Agriculture & Environment",
  travel: "Travel & Hospitality",
  marketing: "Sales, Marketing & Advertising",
  psychology: "Psychology & Human Behavior",
};

function buildGenericProfile(domainId) {
  const label = genericDomainLabels[domainId] || "Career Path";
  return {
    aiInsight: {
      title: `${label} Execution Engine`,
      insight:
        `This path rewards structured learning, practical proof, and consistent progression. Build visible evidence that shows you can move from interest to execution inside ${label.toLowerCase()}.`,
    },
    phases: [
      {
        title: `${label} Foundations`,
        description: `Learn the core concepts, terminology, and market context behind ${label.toLowerCase()}.`,
        resources: [
          resource("Coursera Search", `https://www.coursera.org/search?query=${encodeURIComponent(label)}`, "course", "Coursera"),
          resource("YouTube Search", `https://www.youtube.com/results?search_query=${encodeURIComponent(label + " basics")}`, "video", "YouTube"),
          resource("LinkedIn Learning Search", `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(label)}`, "course", "LinkedIn Learning"),
        ],
      },
      {
        title: `Core ${label} Skills`,
        description: `Build the tools, workflows, and practical skills most valued in ${label.toLowerCase()}.`,
        resources: [
          resource("NPTEL Search", "https://nptel.ac.in/courses", "course", "NPTEL"),
          resource("Google Search Guide", `https://www.google.com/search?q=${encodeURIComponent(label + " beginner guide")}`, "article", "Web"),
          resource("GitHub Repositories", `https://github.com/search?q=${encodeURIComponent(label)}`, "practice platform", "GitHub"),
        ],
      },
      {
        title: `Applied ${label} Practice`,
        description: `Turn theory into project work, practice artifacts, and structured execution.`,
        resources: [
          resource("Kaggle / Datasets Search", `https://www.kaggle.com/search?q=${encodeURIComponent(label)}`, "practice platform", "Kaggle"),
          resource("GeeksforGeeks Search", `https://www.geeksforgeeks.org/?s=${encodeURIComponent(label)}`, "article", "GeeksforGeeks"),
          resource("freeCodeCamp Search", `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(label)}`, "article", "freeCodeCamp"),
        ],
      },
      {
        title: `${label} Portfolio Proof`,
        description: `Package your best work, certifications, and execution proof into a compelling profile.`,
        resources: [
          resource("Canva Portfolio Templates", "https://www.canva.com/portfolios/templates/", "article", "Canva"),
          resource("Notion Templates", "https://www.notion.so/templates", "article", "Notion"),
          resource("Google Docs", "https://workspace.google.com/products/docs/", "article", "Google Docs"),
        ],
      },
      {
        title: `${label} Job Readiness`,
        description: `Prepare applications, role targeting, and interview proof aligned with ${label.toLowerCase()}.`,
        resources: [
          resource("LinkedIn Jobs", "https://www.linkedin.com/jobs/", "practice platform", "LinkedIn Jobs"),
          resource("Indeed India", "https://in.indeed.com/", "practice platform", "Indeed"),
          resource("Naukri", "https://www.naukri.com/", "practice platform", "Naukri"),
        ],
      },
    ],
    jobs: [
      { title: `${label} Associate`, source: "LinkedIn Jobs", description: `Entry opportunity aligned with ${label.toLowerCase()} foundations and applied work.`, relevance: "Strong fit after first milestone completions", location: "India / Hybrid", url: "https://www.linkedin.com/jobs/" },
      { title: `${label} Coordinator`, source: "Indeed", description: `Execution-focused role for learners who can show structured proof and consistency.`, relevance: "Best after practical proof and portfolio modules", location: "India / On-site", url: "https://in.indeed.com/" },
      { title: `${label} Analyst`, source: "Naukri", description: `Early-career pathway that rewards documentation, workflow strength, and domain awareness.`, relevance: "Useful after roadmap completion momentum", location: "India / Hybrid", url: "https://www.naukri.com/" },
    ],
  };
}

export function getExecutionProfile(domainId) {
  return executionProfiles[domainId] || buildGenericProfile(domainId);
}
