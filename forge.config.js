module.exports = {
  packagerConfig: {
    name: 'Parallax',
    executableName: 'parallax',
    appBundleId: 'com.parallax.app',
    appCategoryType: 'public.app-category.developer-tools',
    appCopyright: 'Copyright © 2026 Parallax',
    icon: './build/icon', // Will look for icon.icns, icon.ico, icon.png based on platform
    asar: true,
    prune: true,
    ignore: [
      /^\/\.git/,
      /^\/\.vscode/,
      /^\/node_modules\/\.cache/,
      /^\/src/,
      /^\/components/,
      /^\/services/,
      /^\/utils/,
      /^\/scripts/,
      /\.tsx?$/,
      /\.md$/,
      /^\/\.env/,
      /^\/\.npmrc/,
      /^\/tsconfig\.json/,
      /^\/vite\.config\.ts/,
      /^\/setup\.js/,
      /^\/CHANGELOG\.md/,
      /^\/INSTALLATION\.md/,
      /^\/PROMOTIONAL\.md/,
      /^\/SELLER_GUIDE\.md/,
      /^\/SUPPORT\.md/,
      /^\/SECURITY\.md/,
      /^\/PRIVACY\.md/,
      /^\/metadata\.json/
    ],
    extraResource: [
      './dist'
    ],
    win32metadata: {
      CompanyName: 'Parallax',
      FileDescription: 'Parallax - Advanced Google Dorking Toolkit',
      ProductName: 'Parallax',
      InternalName: 'Parallax',
      OriginalFilename: 'parallax.exe'
    }
  },
  rebuildConfig: {},
  makers: [
    // Windows - Squirrel (creates .exe installer)
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Parallax',
        authors: 'Parallax Team',
        description: 'Advanced Google Dorking Toolkit - AI-powered OSINT and security research platform',
        exe: 'parallax.exe',
        iconUrl: 'https://raw.githubusercontent.com/discover-Austin/DorkNexus/main/build/icon.ico',
        loadingGif: './build/loading.gif',
        noMsi: true,
        setupExe: 'ParallaxSetup.exe',
        setupIcon: './build/icon.ico',
        skipUpdateIcon: false
      },
      platforms: ['win32']
    },
    // Windows - MSI installer (alternative)
    {
      name: '@electron-forge/maker-wix',
      config: {
        name: 'Parallax',
        description: 'Advanced Google Dorking Toolkit',
        manufacturer: 'Parallax Team',
        exe: 'parallax',
        icon: './build/icon.ico',
        ui: {
          enabled: false
        },
        language: 1033, // English
        features: {
          autoUpdate: true,
          autoLaunch: false
        }
      },
      platforms: ['win32']
    },
    // Windows - Portable ZIP
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32']
    },
    // macOS - DMG installer
    {
      name: '@electron-forge/maker-dmg',
      config: {
        name: 'Parallax',
        title: 'Parallax Installer',
        icon: './build/icon.icns',
        background: './build/dmg-background.png',
        format: 'ULFO',
        overwrite: true,
        contents: [
          {
            x: 130,
            y: 220,
            type: 'file',
            path: './out/Parallax-darwin-x64/Parallax.app'
          },
          {
            x: 410,
            y: 220,
            type: 'link',
            path: '/Applications'
          }
        ]
      },
      platforms: ['darwin']
    },
    // macOS - ZIP (for direct distribution)
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    // Linux - DEB package (Debian/Ubuntu)
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: 'parallax',
          productName: 'Parallax',
          genericName: 'Google Dorking Toolkit',
          description: 'Advanced Google Dorking Toolkit - AI-powered OSINT and security research platform with Gemini AI integration',
          productDescription: 'Parallax is a powerful desktop application for security researchers and OSINT investigators. Features AI-powered dork generation, template library, multi-pivot search, and secure data storage.',
          maintainer: 'Parallax Team',
          homepage: 'https://github.com/discover-Austin/DorkNexus',
          icon: './build/icon.png',
          categories: ['Development', 'Security', 'Network'],
          section: 'devel',
          priority: 'optional',
          depends: [],
          bin: 'parallax',
          mimeType: ['x-scheme-handler/parallax']
        }
      },
      platforms: ['linux']
    },
    // Linux - RPM package (RedHat/Fedora/CentOS)
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          name: 'parallax',
          productName: 'Parallax',
          genericName: 'Google Dorking Toolkit',
          description: 'Advanced Google Dorking Toolkit - AI-powered OSINT and security research platform',
          homepage: 'https://github.com/discover-Austin/DorkNexus',
          icon: './build/icon.png',
          categories: ['Development', 'Security', 'Network'],
          license: 'SEE LICENSE FILE',
          bin: 'parallax'
        }
      },
      platforms: ['linux']
    },
    // Linux - ZIP (portable)
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux']
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    {
      name: '@electron-forge/plugin-fuses',
      config: {
        version: '1.10.0',
        resetAdHocDarwinSignature: true,
        runAsNode: false,
        enableCookieEncryption: true,
        enableNodeOptionsEnvironmentVariable: false,
        enableNodeCliInspectArguments: false,
        enableEmbeddedAsarIntegrityValidation: true,
        onlyLoadAppFromAsar: true
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'discover-Austin',
          name: 'DorkNexus'
        },
        prerelease: false,
        draft: true
      }
    }
  ],
  hooks: {
    // Pre-package hook - build the React app first
    prePackage: async (config, platform, arch) => {
      console.log('Building React app with Vite...');
      const { execSync } = require('child_process');
      execSync('npm run build', { stdio: 'inherit' });
      console.log('React app built successfully!');
    },
    // Post-make hook - log completion
    postMake: async (config, makeResults) => {
      console.log('Packaging completed successfully!');
      console.log('Artifacts:', makeResults);
      return makeResults;
    }
  }
};
