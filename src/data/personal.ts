export const PERSONAL = {
  /** Set to true to show the Mahi AI chat widget on personal pages. */
  chatWidgetEnabled: false,
  name: "Maya",
  title: "Maya",
  metaDescription: "Personal website of Maya, Developer.",
  typingText: "Hi, this is Mahdieh",
  roleLines: [
    '"FULL-STACK DEVELOPER" | AI DATA ENGINEER |',
    "DATA ANALYST",
  ],
  intro:
    "I enjoy turning ideas into simple, meaningful digital experiences that solve real problems.",
  profileImage: "/images/profile.png",
  email: "mnajmi@mun.ca",
  github: "https://github.com/MahdiehNajmi",
  about: {
    heading: "About Me",
    paragraphs: [
      {
        text: "In 2023, I began a new chapter of my life in Canada — a journey filled with challenges, growth, and new opportunities.",
        keywords: ["Canada"],
      },
      {
        text: "Before immigrating to Canada, I built a successful career as a Full-Stack Developer, working on large-scale Enterprise Resource Planning (ERP) solutions across multiple industries, with a strong focus on the automotive sector. Over the years, I collaborated closely with clients and stakeholders, leading requirements-gathering sessions, facilitating business and technical meetings, designing software solutions, and delivering projects from concept to launch. This experience gave me valuable insight into complex business operations, industry workflows, and the critical role technology plays in driving organizational success.",
        keywords: ["Full-Stack Developer"],
      },
      {
        text: "As a Computer Engineering student at Memorial University, every experience has helped shape the person I am today. Through both successes and challenges, I learned to adapt, stay resilient, and continuously push beyond my comfort zone.",
        keywords: ["Memorial University"],
      },
      {
        text: "Since arriving in Canada, I have remained committed to growing not only as a developer but also as an individual. I have strengthened my English communication skills, built meaningful technical projects, expanded my expertise in cloud technologies and AWS, and developed a strong passion for continuous learning and professional growth.",
        keywords: ["AWS"],
      },
      {
        text: "Beyond technology, I have explored entrepreneurship, leadership, and community impact. I have had the opportunity to contribute to initiatives focused on improving digital literacy, empowering communities through technology, and helping others build confidence in navigating the digital world.",
        keywords: ["digital literacy"],
      },
      {
        text: "Today, I continue to build, learn, and create — driven by curiosity, ambition, and a desire to make a meaningful impact through technology. Whether developing innovative solutions, exploring emerging technologies, or supporting others on their learning journey, I am always looking for new opportunities to grow and contribute.",
        keywords: [] as string[],
      },
    ],
  },
  contact: {
    heading: "Contact Me",
    lead: "Want to collaborate or ask a question? Send an email and I will get back to you.",
    buttonLabel: "Send an email",
  },
  comments: {
    linkLabel: "Leave a comment",
    pageTitle: "Comments",
    pageLead:
      "Share a comment, idea, or reaction about this site. Your message is saved here so others can read it too.",
    backLabel: "Back to home",
    formHeading: "Write a comment",
    nameLabel: "Your name",
    namePlaceholder: "How should we show your name?",
    messageLabel: "Your comment or idea",
    messagePlaceholder:
      "What did you like, what would you improve, or any idea you want to share…",
    submitLabel: "Post comment",
    submittingLabel: "Posting…",
    submitError: "Could not post your comment. Please try again.",
    successMessage: "Thank you — your comment was posted.",
    listHeading: "Comments",
    emptyMessage: "No comments yet. Be the first to leave one.",
    emojiToggleLabel: "Open emoji picker",
    emojiQuickLabel: "Quick emojis",
    emojiPanelLabel: "Choose an emoji",
  },
} as const;
