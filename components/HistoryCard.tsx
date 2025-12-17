import React from 'react';
import { GenerationResult } from '../types';
import { Maximize2 } from 'lucide-react';

interface HistoryCardProps {
  item: GenerationResult;
  onRestore: (item: GenerationResult) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ item, onRestore }) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-400 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
      <div className="aspect-square relative overflow-hidden bg-slate-100">
        <img
          src={item.generatedImage}
          alt={item.style}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <button
            onClick={(e) => { e.stopPropagation(); onRestore(item); }}
            className="w-full bg-slate-900/90 text-white text-xs py-2 rounded-lg shadow-lg flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <Maximize2 size={14} /> Restore
          </button>
        </div>
      </div>
      <div className="p-3 border-t border-slate-100">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.viewType}</span>
          <span className="text-[10px] text-slate-400 font-mono">{new Date(item.timestamp).toLocaleDateString()}</span>
        </div>
        <h4 className="text-sm text-slate-800 font-medium truncate">{item.style}</h4>
      </div>
    </div>
  );
};