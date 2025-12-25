import React from 'react';
import { X, BookOpen, CreditCard, Lightbulb, MessageCircle } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-medium text-slate-900">Help & Documentation</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Section 1: Getting Started */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-blue-600">
                            <BookOpen size={20} />
                            <h3 className="font-semibold text-sm uppercase tracking-wider">Getting Started</h3>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">Upload Base Geometry</h4>
                                    <p className="text-xs text-slate-500 mt-1">Upload a screenshot of your 3D model (SketchUp, Rhino, Revit) or a hand sketch. Ensure the view is clear.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">Select Style & Settings</h4>
                                    <p className="text-xs text-slate-500 mt-1">Choose a render style (e.g., Photorealistic, Sketchy) and adjust projection settings. You can also upload a reference image to guide the mood.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">Generate</h4>
                                    <p className="text-xs text-slate-500 mt-1">Click "Generate" to create your visualization. Each generation costs credits based on resolution.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Credits System */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-emerald-600">
                            <CreditCard size={20} />
                            <h3 className="font-semibold text-sm uppercase tracking-wider">Credits & Pricing</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <h4 className="text-sm font-medium text-slate-900 mb-2">Cost per Render</h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between text-xs">
                                        <span className="text-slate-500">Standard (1K)</span>
                                        <span className="font-medium text-slate-900">5 Credits</span>
                                    </li>
                                    <li className="flex justify-between text-xs">
                                        <span className="text-slate-500">High Res (2K)</span>
                                        <span className="font-medium text-slate-900">10 Credits</span>
                                    </li>
                                    <li className="flex justify-between text-xs">
                                        <span className="text-slate-500">Ultra Res (4K)</span>
                                        <span className="font-medium text-slate-900">20 Credits</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <h4 className="text-sm font-medium text-slate-900 mb-2">Refills</h4>
                                <p className="text-xs text-slate-500">
                                    You can purchase additional credits at any time. Credits never expire.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Tips */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-amber-600">
                            <Lightbulb size={20} />
                            <h3 className="font-semibold text-sm uppercase tracking-wider">Pro Tips</h3>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-2 text-xs text-slate-600">
                            <li><strong>Context Matters:</strong> For exterior renders, uploading a "Context / Satellite" image helps the AI understand the surroundings.</li>
                            <li><strong>Reference Images:</strong> Use the "Style Reference" upload to copy the lighting and mood of a specific photograph you like.</li>
                            <li><strong>Refine Prompt:</strong> Use the text box to specify materials (e.g., "red brick facade", "rainy evening") if the style selection isn't enough.</li>
                        </ul>
                    </section>

                    {/* Section 4: Support */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-purple-600">
                            <MessageCircle size={20} />
                            <h3 className="font-semibold text-sm uppercase tracking-wider">Support</h3>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                            <p className="text-sm text-slate-600 text-center">
                                Need help or have feedback? Contact us at <a href="mailto:renderman.arch@gmail.com" className="text-blue-600 hover:underline font-medium">renderman.arch@gmail.com</a>
                            </p>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-xs text-amber-800">
                                    <strong>Facing an issue?</strong> Please take a screenshot of the problem and email it to us.
                                    Don't forget to mention your <strong>username/email</strong> so we can assist you faster!
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};
