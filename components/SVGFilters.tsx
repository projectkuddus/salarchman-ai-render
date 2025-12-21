import React from 'react';

export const SVGFilters: React.FC = () => {
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
            <defs>
                {/* Erode: Simulates carving or subtraction */}
                <filter id="erode">
                    <feMorphology operator="erode" radius="2" />
                </filter>

                {/* Dilate: Simulates inflation or expansion */}
                <filter id="dilate">
                    <feMorphology operator="dilate" radius="2" />
                </filter>

                {/* Displacement: Simulates organic or fractured forms */}
                <filter id="displacement">
                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
                    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G" />
                </filter>

                {/* Noise: Simulates concrete or rough texture */}
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                    <feColorMatrix type="saturate" values="0" />
                    <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
                </filter>

                {/* Sketchy: Simulates a hand-drawn look */}
                <filter id="sketchy">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                </filter>

                {/* Fracture: Sharp, jagged displacement */}
                <filter id="fracture">
                    <feTurbulence type="turbulence" baseFrequency="0.1" numOctaves="1" result="turbulence" />
                    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G" />
                </filter>

                {/* Soften: Blurs slightly for organic forms */}
                <filter id="soften">
                    <feGaussianBlur stdDeviation="2" />
                </filter>

            </defs>
        </svg>
    );
};
