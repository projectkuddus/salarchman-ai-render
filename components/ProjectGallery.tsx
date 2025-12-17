import React, { useState } from 'react';
import { GenerationResult } from '../types';
import { HistoryCard } from './HistoryCard';
import { LayoutGrid, Filter, Layers, Calendar, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface ProjectGalleryProps {
    history: GenerationResult[];
    onRestore: (item: GenerationResult) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ history, onRestore }) => {
    const [filterStyle, setFilterStyle] = useState<string>('All Styles');
    const [filterView, setFilterView] = useState<string>('All Views');
    const [showStyleDropdown, setShowStyleDropdown] = useState(false);
    const [showViewDropdown, setShowViewDropdown] = useState(false);

    // Get unique styles and views from history
    const uniqueStyles = ['All Styles', ...Array.from(new Set(history.map(item => item.style)))];
    const uniqueViews = ['All Views', ...Array.from(new Set(history.map(item => item.viewType)))];

    const filteredHistory = history.filter(item => {
        if (filterStyle !== 'All Styles' && item.style !== filterStyle) return false;
        if (filterView !== 'All Views' && item.viewType !== filterView) return false;
        return true;
    });

    return (
        <div className="pt-8 border-t border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <LayoutGrid size={20} /> <span>Project Gallery</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 relative z-30">
                    {/* Style Filter */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowStyleDropdown(!showStyleDropdown); setShowViewDropdown(false); }}
                            className={`flex items-center gap-2 px-3 py-2 bg-white border ${filterStyle !== 'All Styles' ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-slate-200 text-slate-600'} rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap`}
                        >
                            <Filter size={14} />
                            <span>{filterStyle}</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>
                        {showStyleDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowStyleDropdown(false)}></div>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 max-h-60 overflow-y-auto">
                                    {uniqueStyles.map(style => (
                                        <button
                                            key={style}
                                            onClick={() => { setFilterStyle(style); setShowStyleDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${filterStyle === style ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* View Filter */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowViewDropdown(!showViewDropdown); setShowStyleDropdown(false); }}
                            className={`flex items-center gap-2 px-3 py-2 bg-white border ${filterView !== 'All Views' ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-slate-200 text-slate-600'} rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap`}
                        >
                            <Layers size={14} />
                            <span>{filterView}</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>
                        {showViewDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowViewDropdown(false)}></div>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 max-h-60 overflow-y-auto">
                                    {uniqueViews.map(view => (
                                        <button
                                            key={view}
                                            onClick={() => { setFilterView(view); setShowViewDropdown(false); }}
                                            className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${filterView === view ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600'}`}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap opacity-50 cursor-not-allowed">
                        <Calendar size={14} />
                        <span>All Time</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <SlidersHorizontal size={14} />
                    </button>
                </div>
            </div>

            {filteredHistory.length === 0 ? (
                <div className="text-center text-slate-400 py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                        <LayoutGrid size={32} className="opacity-20" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No projects found matching filters.</p>
                    <button
                        onClick={() => { setFilterStyle('All Styles'); setFilterView('All Views'); }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHistory.map(item => (
                        <HistoryCard key={item.id} item={item} onRestore={onRestore} />
                    ))}
                </div>
            )}
        </div>
    );
};
