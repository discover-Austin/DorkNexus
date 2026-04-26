const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    name: 'DorkNexus',
    executableName: 'dorknexus',
    appBundleId: 'com.discoveraustin.dorknexus',
    appCategoryType: 'public.app-category.developer-tools',
    appCopyright: 'Copyright © 2026 DorkNexus',
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
      CompanyName: 'DorkNexus',
      FileDescription: 'DorkNexus - Advanced Google Dorking Toolkit',
      ProductName: 'DorkNexus',
      InternalName: 'DorkNexus',
      OriginalFilename: 'dorknexus.exe'
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux', 'win32']
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      resetAdHocDarwinSignature: true,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
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
