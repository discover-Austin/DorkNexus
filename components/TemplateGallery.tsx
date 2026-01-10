import React, { useState } from 'react';
import { DorkTemplate } from '../types';
import { File, Lock, Globe, Database, Server, Camera, ShieldAlert, Key, Terminal, Cloud } from 'lucide-react';

interface TemplateGalleryProps {
  onSelect: (dork: string) => void;
}

const templates: DorkTemplate[] = [
  // ========== NETWORK / IOT (30+ templates) ==========
  {
    name: "Public Webcams",
    description: "Finds exposed webcam interfaces.",
    query: 'intitle:"webcam 7" inurl:"/gallery.html"',
    category: 'network'
  },
  {
    name: "Axis Cameras",
    description: "Locates exposed Axis IP cameras.",
    query: 'inurl:"/view/view.shtml"',
    category: 'network'
  },
  {
    name: "Panasonic Network Cameras",
    description: "Panasonic security camera web interfaces.",
    query: 'inurl:"/ViewerFrame?Mode="',
    category: 'network'
  },
  {
    name: "Sony Network Cameras",
    description: "Sony surveillance camera interfaces.",
    query: 'intitle:"snc-rz30 home"',
    category: 'network'
  },
  {
    name: "Linksys Cameras",
    description: "Linksys wireless camera interfaces.",
    query: 'inurl:"ViewerFrame?Mode=Motion"',
    category: 'network'
  },
  {
    name: "Toshiba Network Cameras",
    description: "Toshiba IP camera web interfaces.",
    query: 'intitle:"network camera" inurl:mainFrame',
    category: 'network'
  },
  {
    name: "HP Printers",
    description: "Finds accessible HP printer control panels.",
    query: 'intitle:"HP LaserJet" inurl:"/hp/device/this.LCDispatcher"',
    category: 'network'
  },
  {
    name: "Canon Printer Web Interface",
    description: "Canon network printer interfaces.",
    query: 'inurl:"/web/guest/en/websys/webArch/mainFrame.cgi"',
    category: 'network'
  },
  {
    name: "Xerox Printers",
    description: "Xerox printer web interfaces.",
    query: 'inurl:"/status/statdisp.htm"',
    category: 'network'
  },
  {
    name: "Apache Status",
    description: "Exposed Apache server status pages.",
    query: 'inurl:server-status "Apache Status"',
    category: 'network'
  },
  {
    name: "Nginx Status Pages",
    description: "Nginx server status and statistics.",
    query: 'inurl:nginx_status',
    category: 'network'
  },
  {
    name: "Kibana Dashboard",
    description: "Exposed Elastic Search / Kibana dashboards.",
    query: 'intitle:"Kibana" inurl:app/kibana',
    category: 'network'
  },
  {
    name: "Grafana Dashboards",
    description: "Publicly accessible Grafana monitoring instances.",
    query: 'intitle:"Grafana" inurl:d/',
    category: 'network'
  },
  {
    name: "Prometheus Metrics",
    description: "Exposed Prometheus monitoring endpoints.",
    query: 'inurl:/metrics "# TYPE"',
    category: 'network'
  },
  {
    name: "Jenkins Instances",
    description: "Unsecured Jenkins build servers.",
    query: 'intitle:"Dashboard [Jenkins]"',
    category: 'network'
  },
  {
    name: "TeamCity CI",
    description: "TeamCity build server instances.",
    query: 'inurl:"/overview.html" intitle:"teamcity"',
    category: 'network'
  },
  {
    name: "GitLab Instances",
    description: "Publicly accessible GitLab servers.",
    query: 'inurl:"/explore" intitle:"GitLab"',
    category: 'network'
  },
  {
    name: "Public S3 Buckets",
    description: "Finds publicly accessible Amazon S3 buckets.",
    query: 'site:s3.amazonaws.com',
    category: 'network'
  },
  {
    name: "Azure Blob Storage",
    description: "Exposed Azure Storage containers.",
    query: 'site:blob.core.windows.net',
    category: 'network'
  },
  {
    name: "Google Cloud Storage",
    description: "Public Google Cloud Storage buckets.",
    query: 'site:storage.googleapis.com',
    category: 'network'
  },
  {
    name: "Traefik Dashboard",
    description: "Exposed Traefik reverse proxy dashboards.",
    query: 'intitle:"Traefik Dashboard"',
    category: 'network'
  },
  {
    name: "Kubernetes Dashboard",
    description: "Exposed K8s management interfaces.",
    query: 'inurl:/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/',
    category: 'network'
  },
  {
    name: "Docker Registry",
    description: "Publicly accessible Docker registries.",
    query: 'inurl:"/v2/_catalog"',
    category: 'network'
  },
  {
    name: "RabbitMQ Management",
    description: "RabbitMQ message broker interfaces.",
    query: 'intitle:"RabbitMQ Management"',
    category: 'network'
  },
  {
    name: "MongoDB Web Admin",
    description: "Exposed MongoDB admin interfaces.",
    query: 'intitle:"mongoDB" "db version"',
    category: 'network'
  },
  {
    name: "Redis Commander",
    description: "Redis database web interfaces.",
    query: 'intitle:"Redis Commander"',
    category: 'network'
  },
  {
    name: "phpMyAdmin",
    description: "MySQL database administration panels.",
    query: 'inurl:"/phpmyadmin/" intitle:"phpMyAdmin"',
    category: 'network'
  },
  {
    name: "Adminer",
    description: "Database management tool interfaces.",
    query: 'inurl:"adminer" intitle:"Login - Adminer"',
    category: 'network'
  },
  {
    name: "Splunk Instances",
    description: "Splunk log analysis platforms.",
    query: 'intitle:"splunk" inurl:"/en-US/account/login"',
    category: 'network'
  },
  {
    name: "ELK Stack",
    description: "ElasticSearch Logstash Kibana stack.",
    query: 'inurl:":9200/_cat/indices"',
    category: 'network'
  },

  // ========== FILES (40+ templates) ==========
  {
    name: "Open Directories",
    description: "Finds servers with directory listing enabled.",
    query: 'intitle:"index of" "parent directory"',
    category: 'files'
  },
  {
    name: "Log Files",
    description: "Searches for exposed log files containing errors or warnings.",
    query: 'filetype:log intext:"error" OR intext:"warning"',
    category: 'files'
  },
  {
    name: "Access Logs",
    description: "Web server access log files.",
    query: 'filetype:log "access.log"',
    category: 'files'
  },
  {
    name: "Error Logs",
    description: "Application error log files.",
    query: 'filetype:log "error.log" -git',
    category: 'files'
  },
  {
    name: "Exposed SQL Dumps",
    description: "Locates SQL database export files.",
    query: 'filetype:sql "insert into" "values"',
    category: 'files'
  },
  {
    name: "MySQL Dumps",
    description: "MySQL database backup files.",
    query: 'ext:sql "-- MySQL dump"',
    category: 'files'
  },
  {
    name: "PostgreSQL Dumps",
    description: "PostgreSQL database backups.",
    query: 'ext:sql "PostgreSQL database dump"',
    category: 'files'
  },
  {
    name: "Private Keys (RSA)",
    description: "Finds exposed private RSA keys.",
    query: 'ext:pem "BEGIN RSA PRIVATE KEY"',
    category: 'files'
  },
  {
    name: "SSH Keys",
    description: "Finds exposed SSH private keys (Putty).",
    query: 'ext:ppk "private"',
    category: 'files'
  },
  {
    name: "OpenSSH Private Keys",
    description: "OpenSSH format private keys.",
    query: 'ext:key "BEGIN OPENSSH PRIVATE KEY"',
    category: 'files'
  },
  {
    name: "PGP Private Keys",
    description: "PGP/GPG private key files.",
    query: 'ext:asc "BEGIN PGP PRIVATE KEY"',
    category: 'files'
  },
  {
    name: "Excel Passwords",
    description: "Spreadsheets potentially containing credential lists.",
    query: 'ext:xlsx "username" "password" -example',
    category: 'files'
  },
  {
    name: "CSV Credentials",
    description: "CSV files with username and password columns.",
    query: 'ext:csv "username,password"',
    category: 'files'
  },
  {
    name: "PDF Confidential",
    description: "Internal or confidential PDF documents.",
    query: 'ext:pdf "confidential" "internal use only"',
    category: 'files'
  },
  {
    name: "Shell History",
    description: "Exposed bash history files.",
    query: 'ext:bash_history',
    category: 'files'
  },
  {
    name: "ZSH History",
    description: "Z shell history files.",
    query: 'ext:zsh_history',
    category: 'files'
  },
  {
    name: "Backup Files",
    description: "Generic backup files often left in webroots.",
    query: 'ext:bkp "backup" "sql"',
    category: 'files'
  },
  {
    name: "ZIP Backups",
    description: "Compressed backup archives.",
    query: 'ext:zip "backup" intitle:"index of"',
    category: 'files'
  },
  {
    name: "TAR Archives",
    description: "TAR compressed backup files.",
    query: 'ext:tar.gz "backup" OR "db"',
    category: 'files'
  },
  {
    name: "NPM Debug Logs",
    description: "Node package manager debug logs.",
    query: 'inurl:npm-debug.log',
    category: 'files'
  },
  {
    name: "Yarn Error Logs",
    description: "Yarn package manager error logs.",
    query: 'inurl:yarn-error.log',
    category: 'files'
  },
  {
    name: "Composer Logs",
    description: "PHP Composer installation logs.",
    query: 'inurl:composer.log',
    category: 'files'
  },
  {
    name: "Maven POM Files",
    description: "Maven project configuration files.",
    query: 'ext:xml "pom.xml" "dependencies"',
    category: 'files'
  },
  {
    name: "Package.json",
    description: "Node.js package configuration files.",
    query: 'inurl:package.json "dependencies"',
    category: 'files'
  },
  {
    name: "Requirements.txt",
    description: "Python dependency files.",
    query: 'inurl:requirements.txt',
    category: 'files'
  },
  {
    name: "Gemfile",
    description: "Ruby gem dependency files.",
    query: 'inurl:Gemfile "source"',
    category: 'files'
  },
  {
    name: "Build.gradle",
    description: "Gradle build configuration files.",
    query: 'inurl:build.gradle "dependencies"',
    category: 'files'
  },
  {
    name: "Dockerfile",
    description: "Docker container build files.",
    query: 'inurl:Dockerfile "FROM"',
    category: 'files'
  },
  {
    name: "Core Dumps",
    description: "Application crash dump files.",
    query: 'ext:dmp "core dump"',
    category: 'files'
  },
  {
    name: "Memory Dumps",
    description: "Process memory dump files.",
    query: 'ext:mdmp',
    category: 'files'
  },
  {
    name: "Configuration INI",
    description: "INI configuration files.",
    query: 'ext:ini "password" OR "api_key"',
    category: 'files'
  },
  {
    name: "YAML Config",
    description: "YAML configuration files.",
    query: 'ext:yml "password" OR "secret"',
    category: 'files'
  },
  {
    name: "TOML Config",
    description: "TOML configuration files.",
    query: 'ext:toml "password" OR "token"',
    category: 'files'
  },
  {
    name: "Properties Files",
    description: "Java properties configuration.",
    query: 'ext:properties "password" OR "key"',
    category: 'files'
  },
  {
    name: "JSON Config",
    description: "JSON configuration files with secrets.",
    query: 'ext:json "apiKey" OR "password"',
    category: 'files'
  },
  {
    name: "Certificate Files",
    description: "SSL/TLS certificate files.",
    query: 'ext:crt "BEGIN CERTIFICATE"',
    category: 'files'
  },
  {
    name: "Keystore Files",
    description: "Java keystore files.",
    query: 'ext:jks "keystore"',
    category: 'files'
  },
  {
    name: "P12 Certificates",
    description: "PKCS12 certificate bundles.",
    query: 'ext:p12 OR ext:pfx',
    category: 'files'
  },
  {
    name: "WordPress Backups",
    description: "WordPress site backup archives.",
    query: 'inurl:wp-content/backup',
    category: 'files'
  },
  {
    name: "Database Backups",
    description: "Database backup files in common locations.",
    query: 'inurl:/backup/ ext:sql',
    category: 'files'
  },

  // ========== VULNERABILITIES (35+ templates) ==========
  {
    name: "Config Files",
    description: "Searches for web server configuration files.",
    query: 'filetype:xml inurl:web.config -git',
    category: 'vulnerabilities'
  },
  {
    name: "Env Files",
    description: "Finds exposed .env files which often contain keys.",
    query: 'filetype:env "DB_PASSWORD"',
    category: 'vulnerabilities'
  },
  {
    name: "Laravel .env",
    description: "Laravel framework environment files.",
    query: 'inurl:.env "APP_KEY"',
    category: 'vulnerabilities'
  },
  {
    name: "Symfony .env",
    description: "Symfony framework environment files.",
    query: 'inurl:.env "APP_SECRET"',
    category: 'vulnerabilities'
  },
  {
    name: "Exposed .git",
    description: "Publicly accessible .git repositories.",
    query: 'inurl:/.git/HEAD -github.com',
    category: 'vulnerabilities'
  },
  {
    name: ".git/config",
    description: "Git configuration files.",
    query: 'inurl:/.git/config',
    category: 'vulnerabilities'
  },
  {
    name: ".svn Directories",
    description: "Exposed Subversion repositories.",
    query: 'inurl:/.svn/entries',
    category: 'vulnerabilities'
  },
  {
    name: ".DS_Store Files",
    description: "macOS folder metadata files.",
    query: 'inurl:.DS_Store',
    category: 'vulnerabilities'
  },
  {
    name: "PHP Errors",
    description: "Sites displaying verbose PHP error messages.",
    query: 'intext:"Warning: mysql_connect()"',
    category: 'vulnerabilities'
  },
  {
    name: "MySQL Errors",
    description: "MySQL database connection errors.",
    query: 'intext:"SQL syntax" "mysql" "error"',
    category: 'vulnerabilities'
  },
  {
    name: "PostgreSQL Errors",
    description: "PostgreSQL database errors.",
    query: 'intext:"PostgreSQL query failed"',
    category: 'vulnerabilities'
  },
  {
    name: "ASP.NET Errors",
    description: "ASP.NET detailed error messages.",
    query: 'intext:"Server Error in" "Application"',
    category: 'vulnerabilities'
  },
  {
    name: "Python Tracebacks",
    description: "Python error stack traces.",
    query: 'intext:"Traceback (most recent call last)"',
    category: 'vulnerabilities'
  },
  {
    name: "Ruby on Rails Errors",
    description: "Rails application errors.",
    query: 'intext:"ActionController::RoutingError"',
    category: 'vulnerabilities'
  },
  {
    name: "WordPress Config",
    description: "Backup files of WordPress configuration.",
    query: 'inurl:wp-config.php.bak',
    category: 'vulnerabilities'
  },
  {
    name: "WordPress Debug",
    description: "WordPress sites with debug mode enabled.",
    query: 'inurl:wp-content/debug.log',
    category: 'vulnerabilities'
  },
  {
    name: "Drupal Database",
    description: "Exposed Drupal SQL backup files.",
    query: 'ext:sql inurl:backup',
    category: 'vulnerabilities'
  },
  {
    name: "Joomla Config",
    description: "Joomla configuration backups.",
    query: 'inurl:configuration.php-dist',
    category: 'vulnerabilities'
  },
  {
    name: "Magento Config",
    description: "Magento e-commerce configuration files.",
    query: 'inurl:app/etc/local.xml',
    category: 'vulnerabilities'
  },
  {
    name: "AWS Keys",
    description: "Text files containing AWS access keys.",
    query: 'intext:"AWS_ACCESS_KEY_ID" ext:txt',
    category: 'vulnerabilities'
  },
  {
    name: "AWS S3 Credentials",
    description: "AWS S3 credentials in configuration files.",
    query: 'intext:"aws_access_key_id" ext:json',
    category: 'vulnerabilities'
  },
  {
    name: "Google API Keys",
    description: "Google Cloud API keys.",
    query: 'intext:"AIza" "google" ext:json',
    category: 'vulnerabilities'
  },
  {
    name: "Slack Tokens",
    description: "Slack API tokens and webhooks.",
    query: 'intext:"xox" "slack"',
    category: 'vulnerabilities'
  },
  {
    name: "GitHub Tokens",
    description: "GitHub personal access tokens.",
    query: 'intext:"ghp_" OR "gho_"',
    category: 'vulnerabilities'
  },
  {
    name: "Docker Compose",
    description: "Exposed Docker orchestration files.",
    query: 'inurl:docker-compose.yml',
    category: 'vulnerabilities'
  },
  {
    name: "Kubernetes Secrets",
    description: "Kubernetes secret configurations.",
    query: 'inurl:secrets.yml "apiVersion"',
    category: 'vulnerabilities'
  },
  {
    name: "Ansible Vault",
    description: "Ansible vault encrypted files.",
    query: 'inurl:vault.yml "ANSIBLE_VAULT"',
    category: 'vulnerabilities'
  },
  {
    name: "PHP Info",
    description: "Servers exposing the phpinfo() debug page.",
    query: 'ext:php intitle:phpinfo "PHP Version"',
    category: 'vulnerabilities'
  },
  {
    name: "Server-Status Apache",
    description: "Apache server status with full details.",
    query: 'inurl:/server-status "Apache Server Status"',
    category: 'vulnerabilities'
  },
  {
    name: "Nginx Server Status",
    description: "Nginx status page showing connections.",
    query: 'inurl:/nginx_status "Active connections"',
    category: 'vulnerabilities'
  },
  {
    name: "Tomcat Manager",
    description: "Apache Tomcat web application manager.",
    query: 'inurl:/manager/html intitle:"Tomcat"',
    category: 'vulnerabilities'
  },
  {
    name: "JBoss Console",
    description: "JBoss application server admin console.",
    query: 'inurl:"/jmx-console/HtmlAdaptor"',
    category: 'vulnerabilities'
  },
  {
    name: "WebLogic Console",
    description: "Oracle WebLogic admin console.",
    query: 'inurl:"/console/login/LoginForm.jsp"',
    category: 'vulnerabilities'
  },
  {
    name: "CouchDB Admin",
    description: "CouchDB database admin interface.",
    query: 'inurl:"/_utils/" intitle:"Overview - Futon"',
    category: 'vulnerabilities'
  },
  {
    name: "Elasticsearch Query",
    description: "Elasticsearch database search interface.",
    query: 'inurl:":9200/_search?pretty=true"',
    category: 'vulnerabilities'
  },

  // ========== MISC / OSINT (25+ templates) ==========
  {
    name: "Login Portals",
    description: "Finds administrative login pages.",
    query: 'inurl:admin intitle:login',
    category: 'misc'
  },
  {
    name: "Admin Panels",
    description: "Various admin panel login pages.",
    query: 'intitle:"admin panel" OR intitle:"control panel"',
    category: 'misc'
  },
  {
    name: "CPanel Login",
    description: "CPanel hosting control panel logins.",
    query: 'inurl:":2082/login" OR inurl:":2083/login"',
    category: 'misc'
  },
  {
    name: "Plesk Login",
    description: "Plesk hosting panel login pages.",
    query: 'inurl:":8443/login_up.php" intitle:"Plesk"',
    category: 'misc'
  },
  {
    name: "Webmin Login",
    description: "Webmin server administration tool.",
    query: 'inurl:":10000" intitle:"Webmin"',
    category: 'misc'
  },
  {
    name: "VNC Web Access",
    description: "VNC remote desktop web interfaces.",
    query: 'inurl:":5900" OR inurl:":5800"',
    category: 'misc'
  },
  {
    name: "RDP Web Access",
    description: "Remote Desktop web access pages.",
    query: 'intitle:"Remote Desktop Web Access"',
    category: 'misc'
  },
  {
    name: "Jira Instances",
    description: "Atlassian Jira dashboards.",
    query: 'inurl:/Dashboard.jspa intitle:"Atlassian Jira"',
    category: 'misc'
  },
  {
    name: "Confluence Wiki",
    description: "Atlassian Confluence instances.",
    query: 'inurl:/dashboard.action intitle:"Dashboard - Confluence"',
    category: 'misc'
  },
  {
    name: "Bitbucket Repos",
    description: "Bitbucket repository hosting.",
    query: 'inurl:/projects intitle:"Bitbucket"',
    category: 'misc'
  },
  {
    name: "Trello Boards",
    description: "Public Trello boards containing credentials.",
    query: 'site:trello.com inurl:boards "password"',
    category: 'misc'
  },
  {
    name: "Notion Pages",
    description: "Public Notion workspace pages.",
    query: 'site:notion.site "password" OR "credentials"',
    category: 'misc'
  },
  {
    name: "Google Docs",
    description: "Public Google Docs with sensitive keywords.",
    query: 'site:docs.google.com "password" "login"',
    category: 'misc'
  },
  {
    name: "Google Sheets",
    description: "Public Google Sheets with credentials.",
    query: 'site:docs.google.com/spreadsheets "username"',
    category: 'misc'
  },
  {
    name: "OneDrive Shared",
    description: "Publicly shared OneDrive files.",
    query: 'site:onedrive.live.com "password"',
    category: 'misc'
  },
  {
    name: "Dropbox Shared",
    description: "Publicly shared Dropbox links.",
    query: 'site:dropbox.com/s/ ext:pdf',
    category: 'misc'
  },
  {
    name: "Pastebin Leaks",
    description: "Sensitive data pasted on Pastebin.",
    query: 'site:pastebin.com "password" "gmail.com"',
    category: 'misc'
  },
  {
    name: "GitHub Gists",
    description: "GitHub gists with credentials.",
    query: 'site:gist.github.com "password" OR "api_key"',
    category: 'misc'
  },
  {
    name: "GitLab Snippets",
    description: "GitLab code snippets with secrets.",
    query: 'site:gitlab.com/snippets "password"',
    category: 'misc'
  },
  {
    name: "Zoom Recordings",
    description: "Publicly accessible Zoom cloud recordings.",
    query: 'inurl:zoom.us/recording',
    category: 'misc'
  },
  {
    name: "Microsoft Teams",
    description: "Public Microsoft Teams channels.",
    query: 'site:teams.microsoft.com "password"',
    category: 'misc'
  },
  {
    name: "Slack Archives",
    description: "Public Slack workspace archives.",
    query: 'site:slack.com "password" OR "credentials"',
    category: 'misc'
  },
  {
    name: "Discord Invites",
    description: "Public Discord server invite links.",
    query: 'inurl:"invite" site:discord.com',
    category: 'misc'
  },
  {
    name: "StackOverflow Keys",
    description: "Accidentally posted secrets on StackOverflow.",
    query: 'site:stackoverflow.com "password" "db_password"',
    category: 'misc'
  },
  {
    name: "Reddit Posts",
    description: "Reddit posts with sensitive information.",
    query: 'site:reddit.com "password" intext:"leaked"',
    category: 'misc'
  }
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect }) => {
  const [filter, setFilter] = useState<'all' | 'files' | 'vulnerabilities' | 'network' | 'misc'>('all');

  const getIcon = (category: string) => {
    switch (category) {
      case 'files': return File;
      case 'vulnerabilities': return ShieldAlert;
      case 'network': return Server;
      case 'misc': return Globe;
      default: return Globe;
    }
  };

  const filteredTemplates = templates.filter(t => filter === 'all' || t.category === filter);

  const filters: { id: typeof filter, label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'files', label: 'Files' },
    { id: 'vulnerabilities', label: 'Vulnerabilities' },
    { id: 'network', label: 'Network' },
    { id: 'misc', label: 'Misc/OSINT' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === f.id
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 self-center hidden sm:block">
          {filteredTemplates.length} templates available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template, idx) => {
          const Icon = getIcon(template.category);
          return (
            <button
              key={idx}
              onClick={() => onSelect(template.query)}
              className="group flex flex-col items-start p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50 rounded-xl transition-all text-left h-full card-hover"
            >
              <div className="flex items-center gap-3 mb-2 w-full">
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-cyan-950/50 text-slate-400 group-hover:text-cyan-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-200 group-hover:text-cyan-200 truncate">{template.name}</span>
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2 min-h-[2.5em]">{template.description}</p>
              <div className="w-full mt-auto pt-3 border-t border-slate-800">
                 <code className="text-[10px] text-cyan-600 font-mono block truncate group-hover:text-cyan-500">
                   {template.query}
                 </code>
              </div>
            </button>
          );
        })}
        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
            <p>No templates found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;
