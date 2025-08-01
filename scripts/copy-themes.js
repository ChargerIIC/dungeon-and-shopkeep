const fs = require('fs-extra');
const path = require('path');

const themesToCopy = [
  'lara-light-indigo',
  'lara-dark-indigo'
];

const copyThemes = async () => {
  try {
    // Create themes directory in public
    const publicThemesDir = path.join(__dirname, '../public/themes');
    await fs.ensureDir(publicThemesDir);

    // Copy PrimeReact base CSS
    await fs.copy(
      path.join(__dirname, '../node_modules/primereact/resources/primereact.min.css'),
      path.join(publicThemesDir, 'primereact.min.css')
    );

    // Copy PrimeFlex CSS
    await fs.copy(
      path.join(__dirname, '../node_modules/primeflex/primeflex.css'),
      path.join(publicThemesDir, 'primeflex.css')
    );

    // Copy theme files
    for (const theme of themesToCopy) {
      const source = path.join(
        __dirname,
        `../node_modules/primereact/resources/themes/${theme}/theme.css`
      );
      const dest = path.join(publicThemesDir, `${theme}.css`);
      await fs.copy(source, dest);
    }

    console.log('✅ Theme files copied successfully');
  } catch (err) {
    console.error('❌ Error copying theme files:', err);
    process.exit(1);
  }
};

copyThemes();
