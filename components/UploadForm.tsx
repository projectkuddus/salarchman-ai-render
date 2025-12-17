import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface UploadFormProps {
    onUpload?: (file: File) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleSubmit = () => {
        if (!file) return;
        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            setIsUploading(false);
            if (onUpload) onUpload(file);
            // Reset after upload (optional, depending on flow)
            // removeFile(); 
        }, 2000);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload your sketch</h2>
                        <p className="text-slate-500">Drag and drop or select an image to start rendering</p>
                    </div>

                    {!preview ? (
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ease-in-out ${dragActive
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleChange}
                            />
                            <div className="flex flex-col items-center gap-4 cursor-pointer">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <Upload size={32} />
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-slate-900">Click to upload or drag and drop</p>
                                    <p className="text-sm text-slate-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                            <img src={preview} alt="Preview" className="w-full h-64 object-contain" />
                            <button
                                onClick={removeFile}
                                className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-slate-600 rounded-full shadow-sm backdrop-blur-sm transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="mt-8">
                        <Button
                            onClick={handleSubmit}
                            disabled={!file || isUploading}
                            className={`w-full py-4 text-lg font-semibold flex items-center justify-center gap-2 ${!file ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Generate Render
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Footer / Info area */}
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <ImageIcon size={14} />
                        <span>Supported formats: JPG, PNG</span>
                    </div>
                    <div>
                        Secure upload & processing
                    </div>
                </div>
            </div>
        </div>
    );
};
