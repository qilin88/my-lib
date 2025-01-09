const fs = require('fs');
const path = require('path');

// 遍历所有包
const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);

packages.forEach(pkg => {
  const pkgPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // 处理 dependencies
    if (pkgJson.dependencies) {
      Object.keys(pkgJson.dependencies).forEach(dep => {
        if (pkgJson.dependencies[dep].startsWith('workspace:')) {
          // 获取实际版本号
          const depPkgPath = path.join(packagesDir, dep.split('/').pop(), 'package.json');
          const depVersion = JSON.parse(fs.readFileSync(depPkgPath, 'utf8')).version;
          pkgJson.dependencies[dep] = `^${depVersion}`;
        }
      });
    }
    
    // 写回文件
    fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));
  }
});