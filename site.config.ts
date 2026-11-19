export const siteConfig = {
  name: "Alan | Atom_star",
  title: "Nurievka",
  description: "Рассказы из жизни",
  url: "https://example.com", 
  
  profile: {
    avatar: "/images/avatar.jpg",
    bio: "17 лет, поступаю в КФУ",
    location: "Уфа | Казань",
    email: "", 
    github: "https://github.com/Atomstarz",
    social: {
      twitter: "",
      youtube: "",
      telegram: "",
      instagram: "",
    },
    rss: { enabled: true, title: "RSS-подписка" },
    oldSite: { enabled: false, url: "https://old.example.com", title: "Старая версия" },
  },

  hero: {
    quickLinks: [
      { name: "Блог", href: "/blog", icon: "BookOpen" },
      { name: "Заметки", href: "/thoughts", icon: "PenTool" },
      { name: "Обо мне", href: "/about", icon: "User" },
    ],
  },

  blog: {
    pagination: { postsPerPage: 10, maxVisiblePages: 5 },
    homepage: { recentPostsCount: 5 },
    display: { showExcerpt: true, excerptLength: 150, showReadTime: true, showTags: true, maxTagsToShow: 3 },
  },

  navigation: {
    main: [
      { name: "Главная", href: "/" },
      { name: "Блог", href: "/blog" },
      { name: "Заметки", href: "/thoughts" },
      { name: "Хотелки", href: "/books" }, 
      { name: "Обо мне", href: "/about" },
    ],
  },

  about: {
    intro: {
      title: "Обо мне",
      paragraphs: [
        "Мне 17 лет, сейчас поступаю в КФУ. Увлекаюсь программированием и всем, что связано с технологиями.",
        "Здесь я делюсь своими мыслями, рассказываю о жизни и веду список желаний. Добро пожаловать!"
      ]
    },
    education: {
      title: "Образование",
      items: [{ year: "2027-2031", degree: "Школьник", school: "11 класс", description: "Буду учиться на IT-направлении.", gpa: "" }]
    },
    experience: {
      title: "Опыт",
      items: [{ year: "2026 – сейчас", title: "Начинающий разработчик", company: "Личные проекты", description: "Изучаю веб-разработку, собираю свой первый сайт.", highlights: ["Сделал этот сайт на Next.js", "Разбираюсь с Git и GitHub"] }]
    },
    skills: {
      title: "Навыки",
      categories: [{ name: "Life", skills: [{ name: "Swimming", level: 75 }, { name: "Python", level: 30 }, { name: "Gamer", level: 50 }] }]
    },
  },

  projects: {
    enabled: false, // Отключил, чтобы не было ошибок
    title: "Проекты",
    description: "",
    items: [],
  },

  books: {
    enabled: true,
    title: "Хотелки",
    description: "Все то, что я хочу",
    items: [], // Оставил пустым, ошибок не будет
  },

  friends: {
    enabled: false, // Отключил
    title: "Друзья",
    description: "",
    items: [],
  },

  // ВОТ ТОТ САМЫЙ БЛОК SEO, ИЗ-ЗА КОТОРОГО БЫЛА ОШИБКА
  seo: {
    keywords: ["личный сайт", "блог", "заметки", "Next.js", "Alan"],
    openGraph: { type: "website", locale: "ru_RU", siteName: "Nurievka" },
  },

  analytics: { googleAnalyticsId: "" },

  comments: {
    enabled: false,
    provider: "giscus",
    giscus: { repo: "", repoId: "", category: "", categoryId: "", mapping: "pathname", theme: "noborder_dark", lang: "ru", loading: "lazy", reactionsEnabled: true, emitMetadata: false, inputPosition: "bottom" },
    gitalk: { clientID: "", clientSecret: "", repo: "", owner: "", admin: [], language: "ru", perPage: 10, distractionFreeMode: false, pagerDirection: "last", createIssueManually: false, enableHotKey: true },
    valine: { appId: "", appKey: "", placeholder: "", avatar: "mp", meta: [], pageSize: 10, lang: "ru", visitor: true, highlight: true, recordIP: false, enableQQ: false, requiredFields: [] },
    waline: { serverURL: "", placeholder: "", avatar: "mp", meta: [], pageSize: 10, lang: "ru", visitor: true, highlight: true, recordIP: false, enableQQ: false, requiredFields: [] },
  },

  footer: {
    copyright: { owner: "Alan", startYear: "2026", showCurrentYear: true },
    beian: { police: "", icp: "" }, // Убрал китайские номера
  },
};