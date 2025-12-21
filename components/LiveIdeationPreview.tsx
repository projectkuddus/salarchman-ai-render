import React, { useMemo } from 'react';
import { getFilterForStyle } from './StylePreview';

interface LiveIdeationPreviewProps {
    imageSrc: string;
    verbs: string[];
    material: string;
    form: string;
    timeOfDay: string;
}

export const LiveIdeationPreview: React.FC<LiveIdeationPreviewProps> = ({
    imageSrc,
    verbs,
    material,
    form,
    timeOfDay
}) => {
    const compositeFilter = useMemo(() => {
        const filters: string[] = [];

        // Base filters from Material
        if (material) {
            const matFilter = getFilterForStyle(material);
            if (matFilter) filters.push(matFilter);
        }

        // Filters from Form (subtle adjustments)
        if (form) {
            const formFilter = getFilterForStyle(form);
            if (formFilter) filters.push(formFilter);
        }

        // Filters from Time of Day
        if (timeOfDay) {
            const timeFilter = getFilterForStyle(timeOfDay);
            if (timeFilter) filters.push(timeFilter);
        }

        // Filters from Verbs (accumulate effects)
        verbs.forEach(verb => {
            const verbFilter = getFilterForStyle(verb);
            if (verbFilter) filters.push(verbFilter);
        });

        // If no filters, return none
        if (filters.length === 0) return 'none';

        // Combine filters. Note: CSS filters apply in order.
        // We can't just concatenate strings like "sepia(20%) sepia(30%)" blindly because some replace others.
        // However, for this simulation, simple concatenation is a reasonable approximation for "layering" effects.
        // A more sophisticated approach would parse and blend, but that's complex.
        // Let's try simply joining them. The browser will apply them sequentially.
        return filters.join(' ');
    }, [verbs, material, form, timeOfDay]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-900">
            {/* Base Image */}
            <img
                src={imageSrc}
                alt="Live Preview"
                className="w-full h-full object-contain transition-all duration-500 ease-in-out"
                style={{ filter: compositeFilter }}
            />

            {/* Overlay for "Simulation Mode" indication */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Simulation
            </div>
        </div>
    );
};
