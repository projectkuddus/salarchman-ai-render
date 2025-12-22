import React, { useState, useEffect } from 'react';
import { Lightbulb, Quote, Info } from 'lucide-react';

interface TriviaItem {
    text: string;
    author?: string;
    type: 'quote' | 'fact';
}

const TRIVIA_DATA: TriviaItem[] = [
    {
        text: "Architecture is the learned game, correct and magnificent, of forms assembled in the light.",
        author: "Le Corbusier",
        type: "quote"
    },
    {
        text: "There are 360 degrees, so why stick to one?",
        author: "Zaha Hadid",
        type: "quote"
    },
    {
        text: "Less is more.",
        author: "Mies van der Rohe",
        type: "quote"
    },
    {
        text: "The Igloo is a perfect example of engineering: the spiral construction adds strength and stability against arctic winds.",
        type: "fact"
    },
    {
        text: "Mud brick architecture in Shibam, Yemen, has survived for centuries, earning it the nickname 'Manhattan of the Desert'.",
        type: "fact"
    },
    {
        text: "The Great Wall of China is held together by sticky rice mortar, which is stronger and more water-resistant than pure lime mortar.",
        type: "fact"
    },
    {
        text: "Form follows function - that has been misunderstood. Form and function should be one, joined in a spiritual union.",
        author: "Frank Lloyd Wright",
        type: "quote"
    },
    {
        text: "Architecture should speak of its time and place, but yearn for timelessness.",
        author: "Frank Gehry",
        type: "quote"
    },
    {
        text: "The ancient Romans used volcanic ash in their concrete (pozzolana), which is why the Pantheon's dome is still standing today.",
        type: "fact"
    },
    {
        text: "Traditional Japanese joinery (Kigumi) builds complex structures without a single nail or screw.",
        type: "fact"
    },
    {
        text: "Simplicity is the ultimate sophistication.",
        author: "Leonardo da Vinci",
        type: "quote"
    },
    {
        text: "We shape our buildings; thereafter they shape us.",
        author: "Winston Churchill",
        type: "quote"
    }
];

export const TriviaStrip: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % TRIVIA_DATA.length);
                setIsAnimating(false);
            }, 500); // Wait for fade out
        }, 8000); // Change every 8 seconds

        return () => clearInterval(interval);
    }, []);

    const currentItem = TRIVIA_DATA[currentIndex];

    return (
        <div className="w-full bg-slate-50 border-y border-slate-200 py-3 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-center relative z-10 min-h-[40px]">
                <div
                    className={`flex items-center gap-3 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                >
                    {currentItem.type === 'quote' ? (
                        <Quote size={16} className="text-blue-500 flex-shrink-0" />
                    ) : (
                        <Lightbulb size={16} className="text-amber-500 flex-shrink-0" />
                    )}

                    <div className="text-center">
                        <span className="text-slate-700 font-medium text-sm md:text-base">
                            "{currentItem.text}"
                        </span>
                        {currentItem.author && (
                            <span className="text-slate-500 text-xs md:text-sm ml-2 font-medium">
                                — {currentItem.author}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
