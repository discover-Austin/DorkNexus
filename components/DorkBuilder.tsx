import React, { useEffect, useState } from 'react';
import { DorkParams } from '../types';
import { Info, X, Search, Copy, Globe, FileText, Type, Hash, MinusCircle, Check } from 'lucide-react';

interface DorkBuilderProps {
  onDorkChange: (dork: string) => void;
}

const DorkBuilder: React.FC<DorkBuilderProps> = ({ onDorkChange }) => {
  const [params, setParams] = useState<DorkParams>({
    site: '',
    inurl: '',
    intitle: '',
    intext: '',
    filetype: '',
    exclude: '',
    exact: ''
  });

  useEffect(() => {
    const parts = [];
    if (params.site) parts.push(`site:${params.site}`);
    if (params.filetype) parts.push(`filetype:${params.filetype}`);
    if (params.inurl) parts.push(`inurl:"${params.inurl}"`);
    if (params.intitle) parts.push(`intitle:"${params.intitle}"`);
    if (params.intext) parts.push(`intext:"${params.intext}"`);
    if (params.exact) parts.push(`"${params.exact}"`);
    if (params.exclude) parts.push(`-${params.exclude}`);

    onDorkChange(parts.join(' '));
  }, [params, onDorkChange]);

  const handleChange = (field: keyof DorkParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const clearField = (field: keyof DorkParams) => {
    setParams(prev => ({ ...prev, [field]: '' }));
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    field, 
    placeholder,
    tooltip 
  }: { 
    icon: React.ElementType, 
    label: string, 
    field: keyof DorkParams, 
    placeholder: string,
    tooltip: string 
  }) => (
    <div className="relative group">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Icon className="w-3 h-3" />
          {label}
        </label>
        <div className="relative group/tooltip">
          <Info className="w-3 h-3 text-slate-500 cursor-help" />
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 text-xs text-slate-200 p-2 rounded border border-slate-700 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
            {tooltip}
          </div>
        </div>
      </div>
      <div className="relative">
        <input
          type="text"
          value={params[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono placeholder:text-slate-600"
        />
        {params[field] && (
          <button
            onClick={() => clearField(field)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      <InputField
        icon={Globe}
        label="Target Site"
        field="site"
        placeholder="e.g. nasa.gov or .edu"
        tooltip="Restricts results to a specific domain or TLD (Top Level Domain)."
      />
      <InputField
        icon={FileText}
        label="File Type"
        field="filetype"
        placeholder="e.g. pdf, xlsx, docx, log"
        tooltip="Finds specific file extensions."
      />
      <InputField
        icon={Type}
        label="In Title"
        field="intitle"
        placeholder="e.g. index of, login"
        tooltip="Searches for keywords specifically within the page title."
      />
      <InputField
        icon={Search}
        label="In URL"
        field="inurl"
        placeholder="e.g. admin, config"
        tooltip="Searches for keywords present in the URL itself."
      />
      <InputField
        icon={Hash}
        label="In Text"
        field="intext"
        placeholder="e.g. password, confidential"
        tooltip="Searches for keywords in the body text of the page."
      />
      <InputField
        icon={Check}
        label="Exact Match"
        field="exact"
        placeholder="e.g. Top Secret"
        tooltip="Encloses phrase in quotes to find exact matches only."
      />
      <InputField
        icon={MinusCircle}
        label="Exclude"
        field="exclude"
        placeholder="e.g. stackoverflow.com"
        tooltip="Removes results containing this term or from this site."
      />
    </div>
  );
};

export default DorkBuilder;