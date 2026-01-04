import React, { useState, useEffect } from 'react';
import { VaultItem } from '../types';
import { Save, Trash2, Copy, Tag, Clock, ArrowUpRight, Search } from 'lucide-react';

interface NexusVaultProps {
  currentDork: string;
  onLoadDork: (dork: string) => void;
}

const NexusVault: React.FC<NexusVaultProps> = ({ currentDork, onLoadDork }) => {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nexus_vault');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load vault", e);
      }
    }
  }, []);

  const saveItem = () => {
    if (!currentDork) return;
    const newItem: VaultItem = {
      id: crypto.randomUUID(),
      query: currentDork,
      note: note,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      timestamp: Date.now()
    };
    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem('nexus_vault', JSON.stringify(updated));
    setNote('');
    setTags('');
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('nexus_vault', JSON.stringify(updated));
  };

  const filteredItems = items.filter(i => 
    i.query.toLowerCase().includes(filter.toLowerCase()) ||
    i.note.toLowerCase().includes(filter.toLowerCase()) ||
    i.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="animate-fadeIn space-y-8">
       {/* Save Section */}
       <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700 border-l-4 border-l-amber-500">
         <div className="flex items-center gap-2 mb-4 text-amber-400">
           <Save className="w-5 h-5" />
           <h2 className="text-lg font-semibold text-white">Save to Vault</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <label className="text-xs text-slate-500 uppercase">Current Query</label>
             <div className="bg-black/40 p-3 rounded border border-slate-700 font-mono text-sm text-cyan-300 truncate">
               {currentDork || "No query selected..."}
             </div>
           </div>
           <div className="space-y-2">
             <label className="text-xs text-slate-500 uppercase">Tags (comma separated)</label>
             <input 
               type="text" 
               value={tags}
               onChange={e => setTags(e.target.value)}
               placeholder="e.g. iot, cameras, investigation-1"
               className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none"
             />
           </div>
           <div className="md:col-span-2 space-y-2">
             <label className="text-xs text-slate-500 uppercase">Mission Notes</label>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Context about this query..."
                  className="flex-1 bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <button 
                  onClick={saveItem}
                  disabled={!currentDork}
                  className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white px-6 rounded font-medium transition-colors"
                >
                  Save
                </button>
             </div>
           </div>
         </div>
       </div>

       {/* List Section */}
       <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-bold text-white flex items-center gap-2">
               <Clock className="w-5 h-5 text-slate-400" /> Stored Intelligence
             </h3>
             <div className="relative">
               <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 value={filter}
                 onChange={e => setFilter(e.target.value)}
                 placeholder="Filter vault..."
                 className="bg-slate-900 border border-slate-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-amber-500 w-64"
               />
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {filteredItems.map(item => (
               <div key={item.id} className="bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded-lg p-4 transition-all group">
                 <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                       <code className="block text-sm text-cyan-300 font-mono bg-black/30 p-2 rounded border border-slate-800/50 break-all">
                         {item.query}
                       </code>
                       {item.note && <p className="text-slate-400 text-sm">{item.note}</p>}
                       <div className="flex flex-wrap gap-2">
                         {item.tags.map((tag, i) => (
                           <span key={i} className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                             <Tag className="w-3 h-3" /> {tag}
                           </span>
                         ))}
                         <span className="text-[10px] text-slate-600 ml-auto pt-1">
                           {new Date(item.timestamp).toLocaleDateString()}
                         </span>
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <button 
                         onClick={() => onLoadDork(item.query)}
                         title="Load into Builder"
                         className="p-2 bg-slate-800 hover:bg-cyan-900/50 text-slate-400 hover:text-cyan-400 rounded transition-colors"
                       >
                         <ArrowUpRight className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => navigator.clipboard.writeText(item.query)}
                         title="Copy to Clipboard"
                         className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
                       >
                         <Copy className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => deleteItem(item.id)}
                         title="Delete"
                         className="p-2 bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded transition-colors"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               </div>
             ))}
             {items.length === 0 && (
               <div className="text-center py-12 text-slate-600 border border-dashed border-slate-800 rounded-lg">
                 Vault is empty. Save query configurations here.
               </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default NexusVault;