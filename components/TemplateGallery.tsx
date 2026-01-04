import React, { useState } from 'react';
import { DorkTemplate } from '../types';
import { File, Lock, Globe, Database, Server, Camera, ShieldAlert, Key, Terminal, Cloud } from 'lucide-react';

interface TemplateGalleryProps {
  onSelect: (dork: string) => void;
}

const templates: DorkTemplate[] = [
  // Network / IoT
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
    name: "HP Printers",
    description: "Finds accessible HP printer control panels.",
    query: 'intitle:"HP LaserJet" inurl:"/hp/device/this.LCDispatcher"',
    category: 'network'
  },
  {
    name: "Apache Status",
    description: "Exposed Apache server status pages.",
    query: 'inurl:server-status "Apache Status"',
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
    name: "Jenkins Instances",
    description: "Unsecured Jenkins build servers.",
    query: 'intitle:"Dashboard [Jenkins]"',
    category: 'network'
  },
  {
    name: "Public S3 Buckets",
    description: "Finds publicly accessible Amazon S3 buckets.",
    query: 'site:s3.amazonaws.com',
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

  // Files
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
    name: "Exposed SQL Dumps",
    description: "Locates SQL database export files.",
    query: 'filetype:sql "insert into" "values"',
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
    name: "Excel Passwords",
    description: "Spreadsheets potentially containing credential lists.",
    query: 'ext:xlsx "username" "password" -example',
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
    name: "Backup Files",
    description: "Generic backup files often left in webroots.",
    query: 'ext:bkp "backup" "sql"',
    category: 'files'
  },
  {
    name: "NPM Debug Logs",
    description: "Node package manager debug logs.",
    query: 'inurl:npm-debug.log',
    category: 'files'
  },

  // Vulnerabilities
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
    name: "Exposed .git",
    description: "Publicly accessible .git repositories.",
    query: 'inurl:/.git/HEAD -github.com',
    category: 'vulnerabilities'
  },
  {
    name: "PHP Errors",
    description: "Sites displaying verbose PHP error messages.",
    query: 'intext:"Warning: mysql_connect()"',
    category: 'vulnerabilities'
  },
  {
    name: "WordPress Config",
    description: "Backup files of WordPress configuration.",
    query: 'inurl:wp-config.php.bak',
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
    name: "AWS Keys",
    description: "Text files containing AWS access keys.",
    query: 'intext:"AWS_ACCESS_KEY_ID" ext:txt',
    category: 'vulnerabilities'
  },
  {
    name: "Docker Compose",
    description: "Exposed Docker orchestration files.",
    query: 'inurl:docker-compose.yml',
    category: 'vulnerabilities'
  },
  {
    name: "PHP Info",
    description: "Servers exposing the phpinfo() debug page.",
    query: 'ext:php intitle:phpinfo "PHP Version"',
    category: 'vulnerabilities'
  },

  // Misc / OSINT
  {
    name: "Login Portals",
    description: "Finds administrative login pages.",
    query: 'inurl:admin intitle:login',
    category: 'misc'
  },
  {
    name: "Jira Instances",
    description: "Atlassian Jira dashboards.",
    query: 'inurl:/Dashboard.jspa intitle:"Atlassian Jira"',
    category: 'misc'
  },
  {
    name: "Trello Boards",
    description: "Public Trello boards containing credentials.",
    query: 'site:trello.com inurl:boards "password"',
    category: 'misc'
  },
  {
    name: "Google Docs",
    description: "Public Google Docs with sensitive keywords.",
    query: 'site:docs.google.com "password" "login"',
    category: 'misc'
  },
  {
    name: "Pastebin Leaks",
    description: "Sensitive data pasted on Pastebin.",
    query: 'site:pastebin.com "password" "gmail.com"',
    category: 'misc'
  },
  {
    name: "Zoom Recordings",
    description: "Publicly accessible Zoom cloud recordings.",
    query: 'inurl:zoom.us/recording',
    category: 'misc'
  },
  {
    name: "StackOverflow Keys",
    description: "Accidentally posted secrets on StackOverflow.",
    query: 'site:stackoverflow.com "password" "db_password"',
    category: 'misc'
  },
  {
    name: "Discord Invites",
    description: "Public Discord server invite links.",
    query: 'inurl:"invite" site:discord.com',
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
              className="group flex flex-col items-start p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50 rounded-xl transition-all text-left h-full"
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