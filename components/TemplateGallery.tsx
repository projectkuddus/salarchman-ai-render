import React, { useState } from 'react';
import { Layout, Home, Building2, Trees, Sofa, ArrowRight, Star, Copy } from 'lucide-react';

interface Template {
    id: string;
    title: string;
    description: string;
    category: 'Residential' | 'Commercial' | 'Interior' | 'Landscape' | 'Urban';
    image: string;
    tags: string[];
}

const TEMPLATES: Template[] = [
    {
        id: 'res-1',
        title: 'Modern Minimalist Villa',
        description: 'A clean, geometric villa design with large glass facades and concrete finishes.',
        category: 'Residential',
        image: 'https://images.unsplash.com/photo-1600596542815-2495db969cf7?q=80&w=800&auto=format&fit=crop',
        tags: ['Modern', 'Concrete', 'Villa']
    },
    {
        id: 'res-2',
        title: 'Sustainable Eco-Cabin',
        description: 'Compact wooden cabin designed for nature integration and sustainability.',
        category: 'Residential',
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
        tags: ['Wood', 'Eco', 'Cabin']
    },
    {
        id: 'com-1',
        title: 'Tech Office HQ',
        description: 'Glass and steel office complex with open atriums and green roofs.',
        category: 'Commercial',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        tags: ['Office', 'Glass', 'High-rise']
    },
    {
        id: 'com-2',
        title: 'Boutique Retail Store',
        description: 'High-end retail facade with parametric design elements.',
        category: 'Commercial',
        image: 'https://images.unsplash.com/photo-1565514020176-dbf2277f18f3?q=80&w=800&auto=format&fit=crop',
        tags: ['Retail', 'Parametric', 'Storefront']
    },
    {
        id: 'int-1',
        title: 'Scandi-Japandi Living',
        description: 'Warm, minimal interior blending Scandinavian and Japanese aesthetics.',
        category: 'Interior',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=800&auto=format&fit=crop',
        tags: ['Interior', 'Minimal', 'Wood']
    },
    {
        id: 'int-2',
        title: 'Industrial Loft',
        description: 'Raw concrete and brick textures with exposed ductwork and large windows.',
        category: 'Interior',
        image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop',
        tags: ['Loft', 'Industrial', 'Brick']
    },
    {
        id: 'land-1',
        title: 'Urban Pocket Park',
        description: 'Small scale urban intervention with seating, planting, and water features.',
        category: 'Landscape',
        image: 'https://images.unsplash.com/photo-1584875519910-310609db1a66?q=80&w=800&auto=format&fit=crop',
        tags: ['Park', 'Urban', 'Green']
    },
    {
        id: 'urb-1',
        title: 'Mixed-Use Masterplan',
        description: 'Large scale development combining residential, commercial, and public spaces.',
        category: 'Urban',
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop',
        tags: ['Masterplan', 'City', 'Mixed-Use']
    }
];

const CATEGORIES = ['All', 'Residential', 'Commercial', 'Interior', 'Landscape', 'Urban'];

export const TemplateGallery: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredTemplates = selectedCategory === 'All'
        ? TEMPLATES
        : TEMPLATES.filter(t => t.category === selectedCategory);

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Design Templates</h1>
                    <p className="text-slate-500">Explore curated examples and starting points for your next project.</p>

                    {/* Category Filter */}
                    <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                        <div key={template.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={template.image}
                                    alt={template.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-700">
                                    {template.category}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{template.title}</h3>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{template.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {template.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <button className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group-active:scale-95">
                                    <Copy size={16} />
                                    Use Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
