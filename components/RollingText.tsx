import React, { useEffect, useState } from 'react';

interface RollingTextProps {
    words: string[];
    interval?: number;
}

export const RollingText: React.FC<RollingTextProps> = ({ words, interval = 2500 }) => {
    const [index, setIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setAnimating(true);
            setTimeout(() => {
                setIndex((prev) => (prev + 1));
                setAnimating(false);
            }, 800); // Wait for exit animation to finish before swapping state
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    const currentWord = words[index % words.length];
    const nextWord = words[(index + 1) % words.length];

    // Calculate max length for fixed width to prevent layout shifts
    const maxWordLength = Math.max(...words.map(w => w.length));

    return (
        <div className="relative inline-flex h-[1.1em] items-baseline mx-2 font-semibold text-slate-900 overflow-hidden align-bottom">
            <style>{`
                @keyframes rollOut {
                    0% { transform: translateY(0); opacity: 1; filter: blur(0); }
                    100% { transform: translateY(-120%); opacity: 0; filter: blur(2px); }
                }
                @keyframes rollIn {
                    0% { transform: translateY(120%); opacity: 0; filter: blur(2px); }
                    100% { transform: translateY(0); opacity: 1; filter: blur(0); }
                }
                .char-roll-out {
                    animation: rollOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                .char-roll-in {
                    animation: rollIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>

            {/* Container with fixed width based on max word length */}
            <div
                className="relative transition-all duration-500 ease-in-out flex justify-center"
                style={{ width: `${maxWordLength * 0.6}em` }}
            >

                {/* Exiting Word */}
                {animating && (
                    <div className="absolute top-0 left-0 w-full whitespace-nowrap flex justify-center">
                        {currentWord.split('').map((char, i) => (
                            <span
                                key={`out-${i}`}
                                className="inline-block char-roll-out"
                                style={{ animationDelay: `${i * 0.03}s` }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </div>
                )}

                {/* Entering/Current Word */}
                <div className="absolute top-0 left-0 w-full whitespace-nowrap flex justify-center">
                    {animating ? (
                        // If animating, show Next Word entering
                        nextWord.split('').map((char, i) => (
                            <span
                                key={`in-${i}`}
                                className="inline-block char-roll-in"
                                style={{ animationDelay: `${i * 0.03 + 0.1}s` }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))
                    ) : (
                        // If not animating, show Current Word static
                        currentWord.split('').map((char, i) => (
                            <span key={`static-${i}`} className="inline-block">
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
