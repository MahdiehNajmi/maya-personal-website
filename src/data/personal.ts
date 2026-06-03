export const PERSONAL = {
  /** Set to true to show the Mahi AI chat widget on personal pages. */
  chatWidgetEnabled: false,
  name: "Maya",
  title: "Maya",
  metaDescription: "Personal website of Maya, Developer.",
  typingText: "Hi, this is Maya",
  roleLine: "DATA ANALYST | AI DATA ENGINEER | FULL-STACK DEVELOPER",
  intro:
    "I enjoy turning ideas into simple, meaningful digital experiences that solve real problems.",
  profileImage: "/images/profile.png",
  email: "mnajmi@mun.ca",
  github: "https://github.com/MahdiehNajmi",
  about: {
    heading: "About Me",
    paragraphs: [
      {
        text: "In 2023, I started a new chapter of my life in Canada — a journey filled with challenges, growth, and new opportunities.",
        keywords: ["Canada"],
      },
      {
        text: "As a Computer Engineering student at Memorial University, every experience shaped the person I am today. Through both ups and downs, I learned to adapt, stay resilient, and continuously push myself beyond my comfort zone.",
        keywords: ["Computer Engineering"],
      },
      {
        text: "Since then, I have been focused on growing not only as a developer, but also as an individual. I've strengthened my English communication skills, built meaningful technical projects, expanded my experience in cloud technologies and AWS, and developed a strong passion for continuous learning.",
        keywords: ["AWS"],
      },
      {
        text: "Beyond technology, I've explored entrepreneurship, leadership, and Community Impact. I've had the opportunity to contribute to initiatives focused on empowering communities through Digital Literacy and helping others become more confident with technology.",
        keywords: ["Community Impact", "Digital Literacy"],
      },
      {
        text: "Today, I continue building, learning, and creating — driven by curiosity, ambition, and the desire to make a meaningful impact through technology.",
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
