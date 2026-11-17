export const siteConfig = {
  // Основная информация
  name: "Alan | Atom_star",
  title: "Nurievka",
  description: "Рассказы из жизни",
  url: "https://example.com", // позже замените на свой адрес Vercel
  
  // Профиль
  profile: {
    avatar: "/images/avatar.jpg",
    bio: "17 лет, поступаю в КФУ",
    location: "Уфа | Казань",
    email: "", // вставьте свою почту
    github: "https://github.com/Atomstarz", // вставьте свой GitHub
    social: {
      twitter: "",
      youtube: "",
      telegram: "",
      instagram: "",
    },
    rss: {
      enabled: true,
      title: "RSS-подписка",
    },
    oldSite: {
      enabled: false,
      url: "https://old.example.com",
      title: "Старая версия сайта",
    },
  },

  // Главная страница
  hero: {
    quickLinks: [
      { name: "Блог", href: "/blog", icon: "BookOpen" },
      { name: "Заметки", href: "/thoughts", icon: "PenTool" },
      { name: "Проекты", href: "/projects", icon: "Code" },
      { name: "Обо мне", href: "/about", icon: "User" },
    ],
  },

  // Блог
  blog: {
    pagination: {
      postsPerPage: 10,
      maxVisiblePages: 5,
    },
    homepage: {
      recentPostsCount: 5,
    },
    display: {
      showExcerpt: true,
      excerptLength: 150,
      showReadTime: true,
      showTags: true,
      maxTagsToShow: 3,
    },
  },

  // Навигация
  navigation: {
    main: [
      { name: "Главная", href: "/" },
      { name: "Блог", href: "/blog" },
      { name: "Заметки", href: "/thoughts" },
      { name: "Проекты", href: "/projects" },
      { name: "Книги", href: "/books" }, // можно переименовать в «Вишлист»
      { name: "Друзья", href: "/friends" },
      { name: "Обо мне", href: "/about" },
    ],
  },

  // Страница «Обо мне»
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
      items: [
        {
          year: "2024 – 2028",
          degree: "Студент",
          school: "КФУ",
          description: "Буду учиться на IT-направлении. Пока только поступил, но уже в предвкушении.",
          gpa: ""
        }
      ]
    },
    
    experience: {
      title: "Опыт",
      items: [
        {
          year: "2024 – сейчас",
          title: "Начинающий разработчик",
          company: "Личные проекты",
          description: "Изучаю веб-разработку, собираю свой первый сайт.",
          highlights: [
            "Сделал этот сайт на Next.js",
            "Разбираюсь с Git и GitHub",
            "Учусь деплоить проекты на Vercel"
          ]
        }
      ]
    },
    
    skills: {
      title: "Навыки",
      categories: [
        {
          name: "Бэкенд",
          skills: [
            { name: "Java/Spring Boot", level: 40 },
            { name: "Python/Django", level: 30 },
            { name: "Node.js/Express", level: 50 },
            { name: "Go", level: 20 }
          ]
        },
        {
          name: "Базы данных",
          skills: [
            { name: "MySQL", level: 40 },
            { name: "Redis", level: 30 },
            { name: "MongoDB", level: 30 },
            { name: "PostgreSQL", level: 30 }
          ]
        },
        {
          name: "Облака и DevOps",
          skills: [
            { name: "Docker/Kubernetes", level: 30 },
            { name: "AWS/阿里云", level: 20 },
            { name: "Linux", level: 50 },
            { name: "CI/CD", level: 20 }
          ]
        },
        {
          name: "Фронтенд",
          skills: [
            { name: "JavaScript/TypeScript", level: 60 },
            { name: "React/Next.js", level: 50 },
            { name: "Vue.js", level: 30 }
          ]
        }
      ]
    },
  },

  // Проекты
  projects: {
    enabled: true,
    title: "Проекты",
    description: "То, что я делаю руками",
    items: [
      {
        id: "homepage",
        title: "Мой сайт",
        description: "Личный сайт на Next.js с блогом, заметками и вишлистом",
        image: "/images/projects/homepage.jpg",
        tags: ["Next.js", "TypeScript", "Tailwind CSS"],
        github: "https://github.com/your-username/my-wishlist-site",
        demo: "https://example.com",
        status: "active",
        featured: true
      },
      {
        id: "api-gateway",
        title: "Spring",
        description: "Фреймворк для enterprise-разработки на Java",
        image: "/images/projects/spring.jpg",
        tags: ["Java", "Framework", "Spring"],
        github: "https://github.com/spring-projects/spring-framework",
        status: "archived",
        featured: true
      },
      {
        id: "apache-nifi",
        title: "Apache NiFi",
        description: "Платформа для обработки потоков данных",
        image: "/images/projects/apache-nifi.jpg",
        tags: ["Java", "Apache NiFi", "Kafka"],
        github: "https://github.com/apache/nifi",
        status: "completed",
        featured: false
      },
      {
        id: "redis",
        title: "Redis",
        description: "Быстрое хранилище данных в памяти",
        tags: ["Redis", "Cache", "Pub/Sub"],
        github: "https://github.com/redis/redis",
        status: "completed",
        featured: false
      }
    ]
  },

  // Книги (можно использовать как вишлист)
  books: {
    enabled: true,
    title: "Книги",
    description: "Что я читаю и что хочу прочитать",
    items: [
      {
        id: "clean-code",
        title: "Чистый код",
        author: "Роберт Мартин",
        rating: 5,
        status: "reading",
        cover: "/images/books/clean-code.jpg",
        description: "Код должен быть чистым. Эта книга объясняет, как писать поддерживаемый код.",
        review: "Полностью изменила моё отношение к программированию.",
        tags: ["Программирование", "Инженерия", "Практики"],
        readDate: "2024-01-15",
        featured: true,
        purchaseLinks: {
          jd: "",
          douban: ""
        }
      },
      {
        id: "thinking-fast-slow",
        title: "Думай медленно… решай быстро",
        author: "Даниэль Канеман",
        rating: 5,
        status: "read",
        cover: "/images/books/thinking-fast-slow.jpg",
        description: "Классика о двух системах мышления.",
        review: "Заставляет пересмотреть свои решения.",
        tags: ["Психология", "Когнитивистика"],
        readDate: "2023-12-20",
        featured: true,
        purchaseLinks: {}
      },
      {
        id: "sapiens",
        title: "Sapiens. Краткая история человечества",
        author: "Юваль Ной Харари",
        rating: 5,
        status: "read",
        cover: "/images/books/sapiens.jpg",
        description: "История человечества от когнитивной революции до наших дней.",
        review: "Очень широкий взгляд на историю.",
        tags: ["История", "Антропология"],
        readDate: "2023-11-10",
        featured: true,
        purchaseLinks: {}
      },
      {
        id: "design-patterns",
        title: "Паттерны проектирования",
        author: "Gang of Four",
        rating: 4,
        status: "reading",
        cover: "/images/books/design-patterns.jpg",
        description: "23 классических паттерна проектирования.",
        review: "Читаю, помогает понимать архитектуру.",
        tags: ["Паттерны", "Архитектура", "ООП"],
        featured: false,
        purchaseLinks: {}
      },
      {
        id: "the-pragmatic-programmer",
        title: "Программист-прагматик",
        author: "Дэвид Томас, Эндрю Хант",
        rating: 5,
        status: "want_to_read",
        cover: "/images/books/pragmatic-programmer.jpg",
        description: "Настольная книга разработчика.",
        tags: ["Философия программирования", "Карьера"],
        featured: false,
        purchaseLinks: {}
      },
    ]
  },

  // Друзья
  friends: {
    enabled: true,
    title: "Друзья",
    description: "Интересные люди",
    items: [
      {
        id: "example-friend-1",
        name: "Пример друга",
        description: "Описание друга",
        avatar: "https://avatars.githubusercontent.com/u/1?v=4",
        url: "https://example.com",
        featured: true,
        status: "active",
        tags: ["Технологии", "Блог", "Фронтенд"]
      },
      {
        id: "example-friend-2", 
        name: "Второй друг",
        description: "Пишет про бэкенд",
        avatar: "https://avatars.githubusercontent.com/u/2?v=4",
        url: "https://example2.com",
        featured: false,
        status: "active",
        tags: ["Бэкенд", "Java", "Spring"]
      },
      {
        id: "example-friend-3",
        name: "Друг-дизайнер",
        description: "UI/UX дизайнер",
        avatar: "https://avatars.githubusercontent.com/u/3?v=4",
        url: "https://example3.com",
        featured: true,
        status: "active",
        tags: ["Дизайн", "UI/UX", "Креатив"]
      }
    ]
  },

  // SEO
  seo: {
    keywords: [
        "личный сайт",
        "блог",
        "заметки",
        "вишлист",
        "Next.js",
        "TypeScript",
    ],
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: "Личный сайт",
    },
  },

  // Аналитика
  analytics: {
    googleAnalyticsId: "G-XXXXXXX",
  },

  // Комментарии
  comments: {
    enabled: false,
    provider: "giscus",
    giscus: {
      repo: "",
      repoId: "",
      category: "",
      categoryId: "",
      mapping: "pathname",
      theme: "noborder_light",
      lang: "ru",
      loading: "eager",
      reactionsEnabled: true,
      emitMetadata: false,
      inputPosition: "bottom",
    },
    gitalk: {
      clientID: "",
      clientSecret: "",
      repo: "",
      owner: "",
      admin: [],
      language: "ru",
      perPage: 10,
      distractionFreeMode: false,
      pagerDirection: "last",
      createIssueManually: false,
      enableHotKey: true,
    },
    valine: {
      appId: "",
      appKey: "",
      placeholder: "Введите комментарий...",
      avatar: "mp",
      meta: ["nick", "mail", "link"],
      pageSize: 10,
      lang: "ru",
      visitor: true,
      highlight: true,
      recordIP: false,
      enableQQ: false,
      requiredFields: ["nick", "mail"],
    },
    waline: {
      serverURL: "",
      placeholder: "Введите комментарий...",
      avatar: "mp",
      meta: ["nick", "mail", "link"],
      pageSize: 10,
      lang: "ru",
      visitor: true,
      highlight: true,
      recordIP: false,
      enableQQ: false,
      requiredFields: ["nick", "mail"],
    },
  },

  // Подвал
  footer: {
    copyright: {
      owner: "Alan",
      startYear: "2025",
      showCurrentYear: true,
    },
    beian: {
      police: "",
      icp: "",
    },
  },
};