#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// 进度显示相关函数
function showProgress(current, total, message) {
  const percentage = Math.round((current / total) * 100);
  const filled = Math.floor(percentage / 5);
  const empty = 20 - filled;
  const progressBar = '█'.repeat(filled) + '░'.repeat(empty);
  
  // 使用不同颜色显示进度
  const coloredBar = `\x1b[32m${'█'.repeat(filled)}\x1b[37m${'░'.repeat(empty)}\x1b[0m`;
  const coloredPercentage = percentage === 100 ? `\x1b[32m${percentage}%\x1b[0m` : `\x1b[33m${percentage}%\x1b[0m`;
  
  process.stdout.write(`\r[${coloredBar}] ${coloredPercentage} ${message}`);
}

function clearProgress() {
  process.stdout.write('\r' + ' '.repeat(100) + '\r');
}

function logStep(step, total, message) {
  console.log(`\n📋 步骤 ${step}/${total}: \x1b[36m${message}\x1b[0m`);
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
Homepage

:
  npm create homepage <>
  npx create-homepage <>

:
  npm create homepage my-blog
  npm create homepage my-website

:
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
    console.error('❌ : 请提供项目名称');
    console.log(': npm create homepage <project-name>');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);
  
  if (fs.existsSync(targetDir)) {
    console.error(`❌ :  "${projectName}" 已存在`);
    process.exit(1);
  }

  console.log(`🚀 正在创建项目 "${projectName}"...\n`);

  const totalSteps = 5;
  let currentStep = 0;

  try {
    // 步骤 1: 创建项目目录
    currentStep++;
    logStep(currentStep, totalSteps, '创建项目目录');
    showProgress(0, 100, '创建目录中...');
    fs.mkdirSync(targetDir, { recursive: true });
    showProgress(100, 100, '目录创建完成');
    clearProgress();
    console.log('✅ 项目目录创建完成');

    // 步骤 2: 复制模板文件
    currentStep++;
    logStep(currentStep, totalSteps, '复制模板文件');
    const templateDir = path.join(__dirname, '..');
    copyTemplateWithProgress(templateDir, targetDir);
    console.log('✅ 模板文件复制完成');

    // 步骤 3: 进入项目目录并更新配置
    currentStep++;
    logStep(currentStep, totalSteps, '配置项目文件');
    showProgress(0, 100, '更新配置中...');
    process.chdir(targetDir);
    updatePackageJson(projectName);
    showProgress(100, 100, '配置更新完成');
    clearProgress();
    console.log('✅ 项目配置完成');

    // 步骤 4: 安装依赖
    currentStep++;
    logStep(currentStep, totalSteps, '安装项目依赖');
    await installDependenciesWithProgress();

    // 步骤 5: 完成设置
    currentStep++;
    logStep(currentStep, totalSteps, '完成项目设置');
    showProgress(100, 100, '项目设置完成');
    clearProgress();

    console.log(`\n🎉 项目创建成功！

接下来的步骤:
  1. cd ${projectName}
  2. 复制 site.config.example.ts 为 site.config.ts
  3. 编辑 site.config.ts 配置你的网站信息
  4. 在 content/blog/ 目录添加你的博客文章
  5. 在 content/thoughts/ 目录添加你的随笔
  6. npm run dev 启动开发服务器 (http://localhost:4000)
  7. npm run build 构建生产版本

更多信息请查看 README.md 文件

开发命令:
  npm run dev      # 启动开发服务器
  npm run build    # 构建生产版本
  npm run start    # 启动生产服务器
  npm run lint     # 代码检查
    `);

  } catch (error) {
    clearProgress();
    console.error('\n❌ 创建项目时出错:', error.message);
    process.exit(1);
  }
}

function installDependenciesWithProgress() {
  return new Promise((resolve, reject) => {
    console.log('📦 正在安装依赖包...');
    
    let startTime = Date.now();
    let currentStep = '初始化';
    let progress = 0;
    
    // 显示初始进度
    showProgress(0, 100, '正在初始化安装...');
    
    // 使用 spawn 来实时显示安装进度
    const npmProcess = spawn('npm', ['install', '--legacy-peer-deps'], {
      stdio: ['inherit', 'pipe', 'inherit'], // 让stderr直接输出到终端
      env: { ...process.env }
    });

    let output = '';
    let hasOutput = false;
    
    // 定时更新进度（模拟进度）
    const progressTimer = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 10;
        progress = Math.min(progress, 90);
        
        let message = currentStep;
        if (progress < 20) {
          message = '正在解析依赖关系...';
          currentStep = '解析依赖';
        } else if (progress < 40) {
          message = '正在下载依赖包...';
          currentStep = '下载包';
        } else if (progress < 70) {
          message = '正在安装依赖包...';
          currentStep = '安装包';
        } else {
          message = '正在构建项目...';
          currentStep = '构建项目';
        }
        
        showProgress(Math.round(progress), 100, message);
      }
    }, 800);

    npmProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      hasOutput = true;
      
      // 根据npm输出更新进度
      if (text.includes('added') && text.includes('packages')) {
        clearInterval(progressTimer);
        progress = 95;
        showProgress(95, 100, '正在完成安装...');
        
        // 提取安装的包数量
        const match = text.match(/added (\d+) packages/);
        if (match) {
          const count = match[1];
          showProgress(98, 100, `已安装 ${count} 个包`);
        }
      }
      
      if (text.includes('audited') && text.includes('packages')) {
        clearInterval(progressTimer);
        progress = 99;
        const match = text.match(/audited (\d+) packages/);
        if (match) {
          const count = match[1];
          showProgress(99, 100, `正在审计 ${count} 个包...`);
        }
      }
    });

    npmProcess.on('close', (code) => {
      clearInterval(progressTimer);
      clearProgress();
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      
      if (code === 0) {
        console.log(`\x1b[32m✅ 依赖安装完成\x1b[0m \x1b[90m(耗时 ${duration}s)\x1b[0m`);
        resolve();
      } else {
        console.error('\n❌ 依赖安装失败');
        console.error(`退出码: ${code}`);
        if (output) {
          console.error('输出信息:', output);
        }
        reject(new Error(`npm install 失败，退出码: ${code}`));
      }
    });

    npmProcess.on('error', (error) => {
      clearInterval(progressTimer);
      clearProgress();
      console.error('\n❌ 启动 npm install 失败:', error.message);
      reject(error);
    });

    // 超时保护（如果npm没有输出，显示通用进度）
    setTimeout(() => {
      if (!hasOutput) {
        clearInterval(progressTimer);
        showProgress(50, 100, '安装进行中，请稍候...');
        
        // 继续显示通用进度
        const fallbackTimer = setInterval(() => {
          if (progress < 85) {
            progress += 2;
            showProgress(Math.round(progress), 100, '安装进行中，请稍候...');
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
    
    // 跳过不需要的文件
    if (shouldSkipFile(file)) {
      return;
    }

    // 确保目标目录存在
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // 复制文件
    if (path.basename(file) === 'site.config.example.ts') {
      const newDestPath = path.join(path.dirname(destPath), 'site.config.ts');
      fs.copyFileSync(file, newDestPath);
    } else {
      fs.copyFileSync(file, destPath);
    }

    copiedFiles++;
    const progress = Math.round((copiedFiles / totalFiles) * 100);
    showProgress(progress, 100, `复制文件中... (${copiedFiles}/${totalFiles})`);
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
        // 跳过不需要的目录
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
  
  // 更新项目信息
  pkg.name = projectName;
  pkg.version = "0.1.0";
  pkg.description = "基于 @penjc/homepage 模板创建的个人主页";
  
  // 移除bin配置和files配置，这些是模板包特有的
  delete pkg.bin;
  delete pkg.files;
  delete pkg.publishConfig;
  
  // 移除create脚本
  delete pkg.scripts.create;
  delete pkg.scripts.prepublishOnly;
  
  // 更新repository信息
  delete pkg.repository;
  delete pkg.bugs;
  delete pkg.homepage;
  
  // 更新关键词
  pkg.keywords = [
    "personal-website",
    "blog",
    "next.js",
    "react",
    "tailwindcss"
  ];
  
  // 更新作者信息
  pkg.author = "Your Name";
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
}

function copyTemplate(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // 跳过不需要的目录
    const basename = path.basename(src);
    if (['.git', 'node_modules', '.next', '.DS_Store', '.idea', 'bin'].includes(basename) || basename.startsWith('backup-')) {
      return;
    }

    // 防止复制目标目录本身造成递归
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
    // 跳过不需要的文件
    const basename = path.basename(src);
    if (['.DS_Store', 'package-lock.json', '.gitignore', 'tsconfig.tsbuildinfo', '.npmignore'].includes(basename)) {
      return;
    }

    // 复制文件，但重命名示例配置文件
    if (basename === 'site.config.example.ts') {
      const newDest = path.join(path.dirname(dest), 'site.config.ts');
      fs.copyFileSync(src, newDest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// 处理命令行参数
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
