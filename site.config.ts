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
      { name: "Хотелки", href: "/books" }, // можно переименовать в «Вишлист»
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
          year: "2027-2031",
          degree: "Школьник",
          school: "11 класс",
          description: "Буду учиться на IT-направлении.",
          gpa: ""
        }
      ]
    },
    
    experience: {
      title: "Опыт",
      items: [
        {
          year: "2026 – сейчас",
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
          name: "Life",
          skills: [
            { name: "Swimming", level: 75 },
            { name: "Python", level: 30 },
            { name: "Gamer", level: 50 },
            
          ]
        },
        
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
        creating: "Создаем))"
      }
    ]
  },

  // Книги (можно использовать как вишлист)
  books: {  books: {
    enabled: true,
    title: "Хотелки",
    description: "Все то что я хочу",
    items: [
      {
        id: "",
        title: "",
        author: "", // можно оставить пустым
        rating: 5,
        status: "", 
        cover: "", // пока оставьте картинку от книги
        description: ".",
        tags: [""],
        purchaseLinks: {}
      }
    ]
  },




  // Подвал
  footer: {
    copyright: {
      owner: "Alan",
      startYear: "2026",
      showCurrentYear: true,
    },
  },
};