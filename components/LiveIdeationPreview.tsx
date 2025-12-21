import React from 'react';

interface LiveIdeationPreviewProps {
    imageSrc: string;
    verbs: string[];
    material: string;
    form: string;
    timeOfDay: string;
}

export const LiveIdeationPreview: React.FC<LiveIdeationPreviewProps> = ({
    imageSrc
}) => {
    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-900 flex items-center justify-center">
            <img
                src={imageSrc}
                alt="Live Preview"
                className="w-full h-full object-contain"
            />
        </div>
    );
};
