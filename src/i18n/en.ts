export const en = {
  name: "Simon Lee",
  title: "Senior Product Manager",
  tagline: "I blend strategy, system design, and LLM craft to turn complex enterprise work into AI-native products—shipping HITL agents that feel natural, scale safely, and grow revenue.",

  "nav.about": "About",
  "nav.experience": "Experience",
  "nav.projects": "Projects",

  "about.p1":
    "Product Manager and Product Owner focused on modernizing regulated enterprise software with AI-native capabilities — where reliability, governance, and real-world usability matter more than hype.",
  "about.p2":
    "At <a href='https://www.gss.com.tw' target='_blank' class='font-medium text-slate-800 dark:text-slate-200 hover:text-teal-500 dark:hover:text-teal-300'>Galaxy Software Services (GSS)</a>, I’ve spent nearly a decade helping build and evolve Taiwan’s leading <a href='https://www.gss.com.tw/speed' target='_blank' class='font-medium text-slate-800 dark:text-slate-200 hover:text-teal-500 dark:hover:text-teal-300'>official document system </a>. Today, I own the product strategy and roadmap for a system serving 300+ government and enterprise organizations, transforming a 30-year legacy platform into an agentic product with cloud/on-prem LLMs, RAG, and human–AI workflows.",
  "about.p3":
    "With a decade in engineering before product leadership, I bridge model performance, system scalability, and ISO 27001/27701 compliance into measurable outcomes.",
  "about.p4":
    "Outside work, I stay hands-on by turning ideas into quick POCs—spec’ing with OpenSpec/Speckit and building demos with Claude Code and Cursor.",

  "experience.resume": "View Full Résumé",

  "projects.archive": "View Full Project Archive",

  "footer.built": "Built with Astro & Tailwind CSS.",

  "theme.light": "Switch to light mode",
  "theme.dark": "Switch to dark mode",

  "lang.switch": "中文",
  "lang.switchLabel": "切換至中文版",

  "meta.title": "Simon Lee — Product Manager",
  "meta.description":
    "Portfolio of Simon Lee, Senior Product Manager specializing in AI-native enterprise products, human-in-the-loop agents, and LLM-driven workflows.",
} as const;

export type TranslationKey = keyof typeof en;
