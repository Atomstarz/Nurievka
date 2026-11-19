#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Функции для отображения прогресса
function showProgress(current, total, message) {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.floor(percentage / 5);
  const empty = 20 - filled;
  const progressBar = '█'.repeat(filled) + '░'.repeat(empty);

  // Использование разных цветов для прогресса
  const coloredBar = `\x1b[32m${'█'.repeat(filled)}\x1b[37m${'░'.repeat(empty)}\x1b[0m`;
  const coloredPercentage = percentage === 100 ? `\x1b[32m${percentage}%\x1b[0m` : `\x1b[33m${percentage}%\x1b[0m`;

  process.stdout.write(`\r[${coloredBar}] ${coloredPercentage} ${message}`);
}

function clearProgress() {
  process.stdout.write('\r' + ' '.repeat(100) + '\r');
}

function logStep(step, total, message) {
  console.log(`\n📋 Шаг ${step}/${total}: \x1b[36m${message}\x1b[0m`);
}

function showSpinner(message) {
  const spinners = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  return setInterval(() => {
    process.stdout.write(`\r${spinners[i]} ${message}`);
    i = (i + 1) % spinners.length;
  }, 100);
}

function showHelp() {
  console.log(`
  Создание персонального сайта

  Использование:
  npm create homepage <имя-проекта>
  npx create-homepage <имя-проекта>

  Примеры:
  npm create homepage my-blog
  npm create homepage my-website

  Опции:
  -h, --help
  -v, --version
  `);
}

function showVersion() {
  const packagePath = path.join(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(pkg.version);
}

async function createProject(projectName) {
  if (!projectName) {
    console.error('❌ Ошибка: Пожалуйста, укажите имя проекта');
    console.log('Использование: npm create homepage <project-name>');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Ошибка: Папка "${projectName}" уже существует`);
    process.exit(1);
  }

  console.log(`🚀 Создание проекта "${projectName}"...\n`);

  const totalSteps = 5;
  let currentStep = 0;

  try {
    // Шаг 1: Создание директории проекта
    currentStep++;
    logStep(currentStep, totalSteps, 'Создание папки проекта');
    showProgress(0, 100, 'Создание папки...');
    fs.mkdirSync(targetDir, { recursive: true });
    showProgress(100, 100, 'Папка создана');
    clearProgress();
    console.log('✅ Папка проекта создана');

    // Шаг 2: Копирование файлов шаблона
    currentStep++;
    logStep(currentStep, totalSteps, 'Копирование файлов шаблона');
    const templateDir = path.join(__dirname, '..');
    copyTemplateWithProgress(templateDir, targetDir);
    console.log('✅ Файлы шаблона скопированы');

    // Шаг 3: Настройка файлов проекта
    currentStep++;
    logStep(currentStep, totalSteps, 'Настройка файлов проекта');
    showProgress(0, 100, 'Обновление конфигурации...');
    process.chdir(targetDir);
    updatePackageJson(projectName);
    showProgress(100, 100, 'Конфигурация обновлена');
    clearProgress();
    console.log('✅ Настройка проекта завершена');

    // Шаг 4: Установка зависимостей
    currentStep++;
    logStep(currentStep, totalSteps, 'Установка зависимостей');
    await installDependenciesWithProgress();

    // Шаг 5: Завершение
    currentStep++;
    logStep(currentStep, totalSteps, 'Завершение настройки');
    showProgress(100, 100, 'Настройка завершена');
    clearProgress();

    console.log(`\n🎉 Проект успешно создан!

    Следующие шаги:
    1. cd ${projectName}
    2. Скопируйте site.config.example.ts в site.config.ts
    3. Отредактируйте site.config.ts (настройте информацию о сайте)
    4. Добавьте статьи в папку content/blog/
    5. Добавьте заметки в папку content/thoughts/
    6. npm run dev - запуск сервера разработки (http://localhost:4000)
    7. npm run build - сборка production-версии

    Больше информации в файле README.md

    Команды разработки:
    npm run dev      # Запуск сервера разработки
    npm run build    # Сборка production-версии
    npm run start    # Запуск production-сервера
    npm run lint     # Проверка кода
    `);

  } catch (error) {
    clearProgress();
    console.error('\n❌ Ошибка при создании проекта:', error.message);
    process.exit(1);
  }
}

function installDependenciesWithProgress() {
  return new Promise((resolve, reject) => {
    console.log('📦 Установка пакетов зависимостей...');

    let startTime = Date.now();
    let currentStep = 'Инициализация';
    let progress = 0;

    // Показ начального прогресса
    showProgress(0, 100, 'Инициализация установки...');

    // Использование spawn для отображения прогресса в реальном времени
    const npmProcess = spawn('npm', ['install', '--legacy-peer-deps'], {
      stdio: ['inherit', 'pipe', 'inherit'], // stderr выводится прямо в терминал
      env: { ...process.env }
    });

    let output = '';
    let hasOutput = false;

    // Таймер для имитации прогресса
    const progressTimer = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 10;
        progress = Math.min(progress, 90);

        let message = currentStep;
        if (progress < 20) {
          message = 'Анализ зависимостей...';
          currentStep = 'Анализ';
        } else if (progress < 40) {
          message = 'Скачивание пакетов...';
          currentStep = 'Скачивание';
        } else if (progress < 70) {
          message = 'Установка пакетов...';
          currentStep = 'Установка';
        } else {
          message = 'Сборка проекта...';
          currentStep = 'Сборка';
        }

        showProgress(Math.round(progress), 100, message);
      }
    }, 800);

    npmProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      hasOutput = true;

      // Обновление прогресса на основе вывода npm
      if (text.includes('added') && text.includes('packages')) {
        clearInterval(progressTimer);
        progress = 95;
        showProgress(95, 100, 'Завершение установки...');

        // Извлечение количества установленных пакетов
        const match = text.match(/added (\d+) packages/);
        if (match) {
          const count = match[1];
          showProgress(98, 100, `Установлено ${count} пакетов`);
        }
      }

      if (text.includes('audited') && text.includes('packages')) {
        clearInterval(progressTimer);
        progress = 99;
        const match = text.match(/audited (\d+) packages/);
        if (match) {
          const count = match[1];
          showProgress(99, 100, `Проверка ${count} пакетов...`);
        }
      }
    });

    npmProcess.on('close', (code) => {
      clearInterval(progressTimer);
      clearProgress();

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      if (code === 0) {
        console.log(`\x1b[32m✅ Установка зависимостей завершена\x1b[0m \x1b[90m(затрачено ${duration}s)\x1b[0m`);
        resolve();
      } else {
        console.error('\n❌ Ошибка установки зависимостей');
        console.error(`Код выхода: ${code}`);
        if (output) {
          console.error('Вывод:', output);
        }
        reject(new Error(`npm install завершился с ошибкой, код выхода: ${code}`));
      }
    });

    npmProcess.on('error', (error) => {
      clearInterval(progressTimer);
      clearProgress();
      console.error('\n❌ Ошибка запуска npm install:', error.message);
      reject(error);
    });

    // Защита от зависания (если нет вывода, показать общий прогресс)
    setTimeout(() => {
      if (!hasOutput) {
        clearInterval(progressTimer);
        showProgress(50, 100, 'Идет установка, пожалуйста, подождите...');

        // Продолжение показа общего прогресса
        const fallbackTimer = setInterval(() => {
          if (progress < 85) {
            progress += 2;
            showProgress(Math.round(progress), 100, 'Идет установка, пожалуйста, подождите...');
          }
        }, 1000);

        npmProcess.on('close', () => {
          clearInterval(fallbackTimer);
        });
      }
    }, 5000);
  });
}

function copyTemplateWithProgress(src, dest) {
  const files = getAllFiles(src);
  const totalFiles = files.length;
  let copiedFiles = 0;

  files.forEach(file => {
    const relativePath = path.relative(src, file);
    const destPath = path.join(dest, relativePath);

    // Пропуск ненужных файлов
    if (shouldSkipFile(file)) {
      return;
    }

    // Создание целевой директории, если ее нет
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Копирование файла
    if (path.basename(file) === 'site.config.example.ts') {
      const newDestPath = path.join(path.dirname(destPath), 'site.config.ts');
      fs.copyFileSync(file, newDestPath);
    } else {
      fs.copyFileSync(file, destPath);
    }

    copiedFiles++;
    const progress = Math.round((copiedFiles / totalFiles) * 100);
    showProgress(progress, 100, `Копирование файлов... (${copiedFiles}/${totalFiles})`);
  });

  clearProgress();
}

function getAllFiles(dir) {
  let files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // Пропуск ненужных директорий
        if (shouldSkipDirectory(item)) {
          return;
        }
        traverse(fullPath);
      } else {
        files.push(fullPath);
      }
    });
  }

  traverse(dir);
  return files;
}

function shouldSkipDirectory(dirname) {
  return ['.git', 'node_modules', '.next', '.DS_Store', '.idea', 'bin'].includes(dirname) ||
  dirname.startsWith('backup-');
}

function shouldSkipFile(filepath) {
  const basename = path.basename(filepath);
  return ['.DS_Store', 'package-lock.json', '.gitignore', 'tsconfig.tsbuildinfo', '.npmignore'].includes(basename);
}

function updatePackageJson(projectName) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Обновление информации о проекте
  pkg.name = projectName;
  pkg.version = "0.1.0";
  pkg.description = "Персональный сайт на основе шаблона @penjc/homepage";

  // Удаление конфигураций bin и files (специфичны для пакета шаблона)
  delete pkg.bin;
  delete pkg.files;
  delete pkg.publishConfig;

  // Удаление скриптов create
  delete pkg.scripts.create;
  delete pkg.scripts.prepublishOnly;

  // Обновление информации о репозитории
  delete pkg.repository;
  delete pkg.bugs;
  delete pkg.homepage;

  // Обновление ключевых слов
  pkg.keywords = [
    "personal-website",
    "blog",
    "next.js",
    "react",
    "tailwindcss"
  ];

  // Обновление автора
  pkg.author = "Your Name";

  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
}

function copyTemplate(src, dest) {
  const stats = fs.statSync(src);

  if (stats.isDirectory()) {
    const basename = path.basename(src);
    if (['.git', 'node_modules', '.next', '.DS_Store', '.idea', 'bin'].includes(basename) || basename.startsWith('backup-')) {
      return;
    }

    const srcAbs = path.resolve(src);
    const destAbs = path.resolve(dest);
    if (srcAbs.startsWith(destAbs) || destAbs.startsWith(srcAbs)) {
      return;
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      copyTemplate(srcPath, destPath);
    });
  } else {
    const basename = path.basename(src);
    if (['.DS_Store', 'package-lock.json', '.gitignore', 'tsconfig.tsbuildinfo', '.npmignore'].includes(basename)) {
      return;
    }

    if (basename === 'site.config.example.ts') {
      const newDest = path.join(path.dirname(dest), 'site.config.ts');
      fs.copyFileSync(src, newDest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// Обработка аргументов командной строки
const args = process.argv.slice(2);

if (args.length === 0) {
  showHelp();
  process.exit(1);
}

const command = args[0];

switch (command) {
  case '-h':
  case '--help':
    showHelp();
    break;
  case '-v':
  case '--version':
    showVersion();
    break;
  default:
    createProject(command);
    break;
}
