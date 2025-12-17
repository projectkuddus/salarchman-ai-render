import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Layers, Box, Settings, Download, X, History, CreditCard, Video, Key, MapPin, Monitor, Plus, Trash2, Edit2, Save, Palette, Cuboid, LogOut, User as UserIcon, AlertCircle, RefreshCw, Lightbulb, Shapes, Camera, Shield, Mail, Sliders, Sun, Compass, Filter, Calendar, ChevronDown, SortDesc, Grid, Spline, ArrowUpRight, Wind, Users, GitBranch, Ruler, Map, Leaf, BrickWall, Square, Package, TreeDeciduous, Grid3x3, Droplets, LayoutGrid, Waves, Gem, Scissors, ArrowUpSquare, Merge, BoxSelect, Expand, MinusSquare, Target, Split, Eraser, Puzzle, RotateCw, Scroll, MoveDiagonal, ArrowRightFromLine, ArrowUpFromLine, Signal, CornerUpRight, Sunrise, Sunset, Home, Sofa, Armchair, Hexagon, Component, Archive, Warehouse, Crown, CloudRain, Zap, Cloud, Moon, Check, Cpu } from 'lucide-react';
import { generateArchitecturalRender } from './services/geminiService';
import { RenderStyle, ViewType, GenerationResult, UserCredits, AspectRatio, ImageSize, CustomStyle, User, IdeationConfig, ElevationSide, DiagramType, CreateMode, InteriorStyle, Atmosphere } from './types';
import { INITIAL_CREDITS, CREDIT_COSTS, STYLE_PROMPTS, SPATIAL_VERBS, IDEATION_MATERIALS, IDEATION_FORMS, IDEATION_ALLOWED_VIEWS, DIAGRAM_PROMPTS, INTERIOR_STYLE_PROMPTS, EXTERIOR_STYLE_THUMBNAILS, INTERIOR_STYLE_THUMBNAILS, EXTERIOR_STYLE_CATEGORIES, ATMOSPHERE_OPTIONS } from './constants';
import { Button } from './components/Button';
import { HistoryCard } from './components/HistoryCard';
import { LoginScreen } from './components/LoginScreen';
import { LandingPage } from './components/LandingPage';
import { ProfileView } from './components/ProfileView';
import { storageService } from './services/storageService';
import { supabase } from './services/supabaseClient';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [credits, setCredits] = useState<UserCredits>({ available: INITIAL_CREDITS, totalUsed: 0 });
  const [activeTab, setActiveTab] = useState<'render' | 'ideation' | 'diagram' | 'profile'>('render');
  const [createMode, setCreateMode] = useState<CreateMode>('Exterior');

  const [selectedStyle, setSelectedStyle] = useState<string>(RenderStyle.PHOTOREALISTIC);
  const [selectedAtmospheres, setSelectedAtmospheres] = useState<Atmosphere[]>([]);
  const [customStyles, setCustomStyles] = useState<CustomStyle[]>([]);
  const [showStyleCreator, setShowStyleCreator] = useState(false);

  const [selectedVerbs, setSelectedVerbs] = useState<string[]>([]);
  const [ideationMaterial, setIdeationMaterial] = useState<string>('Concrete');
  const [ideationForm, setIdeationForm] = useState<string>('Orthogonal');
  const [innovationLevel, setInnovationLevel] = useState<number>(30);
  const [elevationSide, setElevationSide] = useState<ElevationSide>('Front');
  const [timeOfDay, setTimeOfDay] = useState<string>('Noon');

  const [selectedDiagramType, setSelectedDiagramType] = useState<DiagramType>(DiagramType.CONCEPT);

  const [newStyleName, setNewStyleName] = useState('');
  const [newStylePrompt, setNewStylePrompt] = useState('');

  const [galleryStyleFilter, setGalleryStyleFilter] = useState<string>('All');
  const [galleryViewFilter, setGalleryViewFilter] = useState<string>('All');
  const [galleryDateFilter, setGalleryDateFilter] = useState<string>('All');
  const [gallerySortOrder, setGallerySortOrder] = useState<'newest' | 'oldest'>('newest');

  const [selectedView, setSelectedView] = useState<ViewType>(ViewType.PERSPECTIVE);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>("16:9");
  const [selectedImageSize, setSelectedImageSize] = useState<ImageSize>("1K");
  const [prompt, setPrompt] = useState<string>('');

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [siteImage, setSiteImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [history, setHistory] = useState<GenerationResult[]>([]);

  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const siteInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);

  const currentCost = CREDIT_COSTS[selectedImageSize];

  const availableViews = activeTab === 'ideation' ? IDEATION_ALLOWED_VIEWS : Object.values(ViewType);

  useEffect(() => {
    if (createMode === 'Interior') {
      setSelectedStyle(InteriorStyle.PHOTOREALISTIC);
      setSelectedView(ViewType.PERSPECTIVE);
      setSelectedAtmospheres([]);
    } else {
      setSelectedStyle(RenderStyle.PHOTOREALISTIC);
    }
  }, [createMode]);

  useEffect(() => {
    if (activeTab === 'ideation' && !IDEATION_ALLOWED_VIEWS.includes(selectedView)) {
      setSelectedView(ViewType.AXONOMETRIC);
    }
  }, [activeTab, selectedView]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Architect',
          avatar: session.user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        };
        setCurrentUser(user);
        setShowLogin(false);
      }
      setLoadingAuth(false);
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Architect',
          avatar: session.user.user_metadata.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        };
        setCurrentUser(user);
        setShowLogin(false);
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const userData = storageService.loadUserData(currentUser.email);
      setHistory(userData.history || []);
      setCustomStyles(userData.customStyles || []);
      setCredits(prev => ({ ...prev, available: INITIAL_CREDITS }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      storageService.saveUserData(currentUser.email, {
        history,
        customStyles,
        userProfile: { name: currentUser.name, avatar: currentUser.avatar }
      });
    }
  }, [history, customStyles, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowLogin(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setShowLogin(false);
    setHistory([]);
    setCustomStyles([]);
    setGeneratedImage(null);
    setUploadedImage(null);
    setSiteImage(null);
    setReferenceImage(null);
    setApiKeyError(null);
    setActiveTab('render');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setGeneratedImage(null);
        setApiKeyError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSiteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
        if (createMode === 'Exterior') {
          setSelectedStyle(RenderStyle.PHOTOREALISTIC);
        } else {
          setSelectedStyle(InteriorStyle.PHOTOREALISTIC);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomStyle = () => {
    if (!newStyleName.trim() || !newStylePrompt.trim()) return;
    const newStyle: CustomStyle = {
      id: crypto.randomUUID(),
      name: newStyleName.trim(),
      prompt: newStylePrompt.trim()
    };
    setCustomStyles([...customStyles, newStyle]);
    setNewStyleName('');
    setNewStylePrompt('');
    setShowStyleCreator(false);
  };

  const handleDeleteCustomStyle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const styleToDelete = customStyles.find(s => s.id === id);
    if (styleToDelete && selectedStyle === styleToDelete.name) {
      setSelectedStyle(RenderStyle.PHOTOREALISTIC);
    }
    setCustomStyles(customStyles.filter(s => s.id !== id));
  };

  const handleRestoreHistory = (item: GenerationResult) => {
    setUploadedImage(item.originalImage);
    setSiteImage(item.siteImage || null);
    setReferenceImage(item.referenceImage || null);
    setGeneratedImage(item.generatedImage);
    setSelectedStyle(item.style);
    setSelectedView(item.viewType);
    if (item.aspectRatio) setSelectedAspectRatio(item.aspectRatio);
    if (item.imageSize) setSelectedImageSize(item.imageSize);
    if (item.selectedVerbs) setSelectedVerbs(item.selectedVerbs);
    if (item.atmospheres) setSelectedAtmospheres(item.atmospheres);
    if (item.elevationSide) setElevationSide(item.elevationSide);

    if (item.createMode) {
      setCreateMode(item.createMode);
    } else {
      const isInteriorStyle = Object.values(InteriorStyle).includes(item.style as any);
      setCreateMode(isInteriorStyle ? 'Interior' : 'Exterior');
    }

    if (item.ideationConfig) {
      setIdeationMaterial(item.ideationConfig.material);
      setIdeationForm(item.ideationConfig.formLanguage);
      setInnovationLevel(item.ideationConfig.innovationLevel);
      if (item.ideationConfig.elevationSide) setElevationSide(item.ideationConfig.elevationSide);
      if (item.ideationConfig.timeOfDay) setTimeOfDay(item.ideationConfig.timeOfDay);
    }

    if (item.diagramType) {
      setSelectedDiagramType(item.diagramType);
      setActiveTab('diagram');
    } else if (item.selectedVerbs && item.selectedVerbs.length > 0) {
      setActiveTab('ideation');
    } else {
      setActiveTab('render');
    }

    setPrompt(item.prompt);
    setApiKeyError(null);
  };

  const handlePurchase = (amount: number) => {
    setIsGenerating(true);
    setTimeout(() => {
      setCredits(prev => ({
        available: prev.available + amount,
        totalUsed: prev.totalUsed
      }));
      setIsGenerating(false);
    }, 800);
  };

  const toggleVerb = (verb: string) => {
    setSelectedVerbs(prev =>
      prev.includes(verb) ? prev.filter(v => v !== verb) : [...prev, verb]
    );
  };

  const toggleAtmosphere = (atmosphere: Atmosphere) => {
    setSelectedAtmospheres(prev =>
      prev.includes(atmosphere) ? prev.filter(a => a !== atmosphere) : [...prev, atmosphere]
    );
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;
    setApiKeyError(null);

    if (credits.available < currentCost) {
      setApiKeyError(`Insufficient credits. You need ${currentCost} but have ${credits.available}.`);
      return;
    }

    setIsGenerating(true);
    try {
      let styleInstruction = "";
      if (createMode === 'Interior' && activeTab === 'render') {
        styleInstruction = INTERIOR_STYLE_PROMPTS[selectedStyle] || "Interior design render.";
      } else {
        styleInstruction = STYLE_PROMPTS[selectedStyle];
      }
      if (!styleInstruction) {
        const custom = customStyles.find(s => s.name === selectedStyle);
        if (custom) styleInstruction = custom.prompt;
        else styleInstruction = "architectural render";
      }

      const verbsToUse = activeTab === 'ideation' ? selectedVerbs : [];
      const ideationConfig: IdeationConfig | undefined = activeTab === 'ideation' ? {
        innovationLevel,
        material: ideationMaterial,
        formLanguage: ideationForm,
        elevationSide: selectedView === ViewType.ELEVATION ? elevationSide : undefined,
        timeOfDay: timeOfDay
      } : undefined;

      const diagramTypeToUse = activeTab === 'diagram' ? selectedDiagramType : undefined;
      const viewToUse = (createMode === 'Interior' && activeTab === 'render') ? ViewType.PERSPECTIVE : selectedView;

      const resultImage = await generateArchitecturalRender(
        uploadedImage, selectedStyle, styleInstruction, viewToUse, prompt,
        createMode === 'Exterior' ? siteImage : null, referenceImage, selectedAspectRatio, selectedImageSize,
        verbsToUse, ideationConfig, diagramTypeToUse, createMode,
        activeTab === 'render' && createMode === 'Exterior' ? selectedAtmospheres : [],
        (activeTab === 'render' && createMode === 'Exterior' && selectedView === ViewType.ELEVATION) ? elevationSide : undefined
      );

      const newResult: GenerationResult = {
        id: crypto.randomUUID(),
        originalImage: uploadedImage,
        siteImage: createMode === 'Exterior' ? siteImage : null,
        referenceImage: referenceImage,
        generatedImage: resultImage,
        style: activeTab === 'ideation' ? 'Operative Massing' : (activeTab === 'diagram' ? 'Diagram' : selectedStyle),
        viewType: viewToUse,
        diagramType: diagramTypeToUse,
        aspectRatio: selectedAspectRatio,
        imageSize: selectedImageSize,
        prompt: prompt,
        timestamp: Date.now(),
        selectedVerbs: verbsToUse,
        ideationConfig: ideationConfig,
        createMode: activeTab === 'render' ? createMode : 'Exterior',
        atmospheres: selectedAtmospheres,
        elevationSide: (activeTab === 'render' && createMode === 'Exterior' && selectedView === ViewType.ELEVATION) ? elevationSide : undefined
      };

      setGeneratedImage(resultImage);
      setHistory(prev => [newResult, ...prev]);
      setCredits(prev => ({ available: prev.available - currentCost, totalUsed: prev.totalUsed + currentCost }));
    } catch (error: any) {
      console.error("Generation Error:", error);
      let errorMessage = String(error).toLowerCase();
      if (errorMessage.includes("403") || errorMessage.includes("permission")) {
        setApiKeyError("Authorization failed. Please check server configuration.");
      } else {
        setApiKeyError(`Generation failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `salARCHman-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClear = () => {
    setUploadedImage(null);
    setSiteImage(null);
    setReferenceImage(null);
    setGeneratedImage(null);
    setPrompt('');
    setApiKeyError(null);
    setSelectedVerbs([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (siteInputRef.current) siteInputRef.current.value = '';
    if (referenceInputRef.current) referenceInputRef.current.value = '';
  };

  if (loadingAuth) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div></div>;
  if (!currentUser) {
    if (showLogin) return <LoginScreen onLogin={handleLogin} onBack={() => setShowLogin(false)} />;
    return <LandingPage onGetStarted={() => setShowLogin(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-80 border-r border-slate-200 bg-white flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto z-20">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-light tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white"><Box size={16} /></div>
            <span>sal<span className="font-bold">ARCH</span>man</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest pl-10">Render Engine v2.0</p>
        </div>
        <div className="p-6 flex-1 space-y-8">
          {/* Navigation */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab('render')} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'render' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Render</button>
            <button onClick={() => setActiveTab('ideation')} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'ideation' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Ideation</button>
            <button onClick={() => setActiveTab('diagram')} className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${activeTab === 'diagram' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Diagram</button>
          </div>

          {/* RENDER TAB CONTROLS */}
          {activeTab === 'render' && (
            <div className="space-y-6">
              {/* Create Mode */}
              <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl gap-1">
                <button onClick={() => setCreateMode('Exterior')} className={`text-xs py-2 rounded-lg ${createMode === 'Exterior' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Exterior</button>
                <button onClick={() => setCreateMode('Interior')} className={`text-xs py-2 rounded-lg ${createMode === 'Interior' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Interior</button>
              </div>

              {/* Styles */}
              <div className="space-y-6">
                {createMode === 'Exterior' ? (
                  EXTERIOR_STYLE_CATEGORIES.map((category) => (
                    <div key={category.title}>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{category.title}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.styles.map(style => (
                          <button
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`group relative overflow-hidden rounded-lg aspect-video border transition-all ${selectedStyle === style ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <img src={EXTERIOR_STYLE_THUMBNAILS[style]} alt={style} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                            <div className={`absolute inset-0 flex items-end p-2 ${selectedStyle === style ? 'bg-black/40' : 'bg-black/20 group-hover:bg-black/30'}`}>
                              <span className="text-[10px] font-medium text-white leading-tight shadow-sm">{style}</span>
                            </div>
                            {selectedStyle === style && (
                              <div className="absolute top-1 right-1 bg-white text-slate-900 rounded-full p-0.5"><Check size={8} /></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Interior Styles</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(InteriorStyle).map(style => (
                        <button
                          key={style}
                          onClick={() => setSelectedStyle(style)}
                          className={`group relative overflow-hidden rounded-lg aspect-video border transition-all ${selectedStyle === style ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <img src={INTERIOR_STYLE_THUMBNAILS[style]} alt={style} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className={`absolute inset-0 flex items-end p-2 ${selectedStyle === style ? 'bg-black/40' : 'bg-black/20 group-hover:bg-black/30'}`}>
                            <span className="text-[10px] font-medium text-white leading-tight shadow-sm">{style}</span>
                          </div>
                          {selectedStyle === style && (
                            <div className="absolute top-1 right-1 bg-white text-slate-900 rounded-full p-0.5"><Check size={8} /></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Projection / View */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Box size={10} /> Projection</label>
                <select
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value as ViewType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                >
                  {availableViews.map(view => (
                    <option key={view} value={view}>{view}</option>
                  ))}
                </select>
              </div>

              {/* Output Config */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Monitor size={10} /> Output Config</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedAspectRatio}
                    onChange={(e) => setSelectedAspectRatio(e.target.value as AspectRatio)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="16:9">Landscape (16:9)</option>
                    <option value="4:3">Standard (4:3)</option>
                    <option value="1:1">Square (1:1)</option>
                    <option value="9:16">Portrait (9:16)</option>
                  </select>
                  <select
                    value={selectedImageSize}
                    onChange={(e) => setSelectedImageSize(e.target.value as ImageSize)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="1K">1K (5c)</option>
                    <option value="2K">2K (10c)</option>
                    <option value="4K">4K (20c)</option>
                  </select>
                </div>
              </div>

              {/* Refine / Prompt */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Sliders size={10} /> Refine</label>
                <textarea
                  placeholder="Additional context: e.g. North-facing light, brutalist concrete texture..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
                />
              </div>
            </div>
          )}

          {/* IDEATION TAB CONTROLS */}
          {activeTab === 'ideation' && (
            <div className="space-y-6">
              {/* Spatial Verbs */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Spatial Verbs</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(SPATIAL_VERBS).map(verb => (
                    <button
                      key={verb}
                      onClick={() => toggleVerb(verb)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-medium border transition-all ${selectedVerbs.includes(verb) ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                      {verb}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material & Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Materiality</label>
                  <select
                    value={ideationMaterial}
                    onChange={(e) => setIdeationMaterial(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    {Object.keys(IDEATION_MATERIALS).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Form Language</label>
                  <select
                    value={ideationForm}
                    onChange={(e) => setIdeationForm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    {Object.keys(IDEATION_FORMS).map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Innovation Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Innovation Level</span>
                  <span>{innovationLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={innovationLevel}
                  onChange={(e) => setInnovationLevel(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
              </div>

              {/* Output Config (Shared) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Monitor size={10} /> Output Config</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedImageSize}
                    onChange={(e) => setSelectedImageSize(e.target.value as ImageSize)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="1K">1K (5c)</option>
                    <option value="2K">2K (10c)</option>
                    <option value="4K">4K (20c)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* DIAGRAM TAB CONTROLS */}
          {activeTab === 'diagram' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Diagram Type</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(DIAGRAM_PROMPTS).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedDiagramType(type as DiagramType)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all ${selectedDiagramType === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              {/* Output Config (Shared) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Monitor size={10} /> Output Config</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedImageSize}
                    onChange={(e) => setSelectedImageSize(e.target.value as ImageSize)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="1K">1K (5c)</option>
                    <option value="2K">2K (10c)</option>
                    <option value="4K">4K (20c)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors" onClick={() => setActiveTab('profile')}>
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate">{credits.available} credits</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="p-2 text-slate-400 hover:text-slate-900"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <h2 className="text-sm font-medium text-slate-900">Workspace / {activeTab === 'render' ? 'Architectural Render' : (activeTab === 'profile' ? 'User Profile' : activeTab)}</h2>
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('profile')} className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1"><CreditCard size={14} /> Buy Credits</button>
            <div className="h-4 w-px bg-slate-200"></div>
            <button className="text-xs font-medium text-slate-500 hover:text-slate-900">Help</button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex items-center justify-center">
          {activeTab === 'profile' ? (
            <ProfileView user={currentUser} credits={credits} onUpdateProfile={(name) => setCurrentUser({ ...currentUser, name })} onPurchase={handlePurchase} />
          ) : (
            <div className="w-full max-w-6xl h-full flex gap-6">
              {/* Left Column: Inputs */}
              <div className="w-1/2 flex flex-col gap-6">
                {/* Main Image Upload */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group min-h-[300px]">
                  <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-slate-600 border border-slate-200">Base Image</div>
                  {!uploadedImage ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                      <Upload size={48} className="mb-4 opacity-50" />
                      <p className="text-sm font-medium">Upload Sketch / Model</p>
                      <p className="text-xs opacity-70 mt-1">PNG, JPG (MAX 10MB)</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      <img src={uploadedImage} alt="Original" className="w-full h-full object-cover" />
                      <button onClick={handleClear} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"><X size={16} /></button>
                    </div>
                  )}
                </div>

                {/* Secondary Inputs Row (Only for Render Tab) */}
                {activeTab === 'render' && (
                  <div className="h-48 flex gap-6">
                    {/* Context / Satellite */}
                    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group border-dashed">
                      <div className="absolute top-3 left-3 z-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><MapPin size={10} /> Context / Satellite</div>
                      {!siteImage ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 hover:text-slate-400 transition-colors">
                          <Plus size={24} className="mb-2 opacity-50" />
                          <p className="text-xs font-medium">Add Site</p>
                          <input type="file" ref={siteInputRef} onChange={handleSiteUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img src={siteImage} alt="Site" className="w-full h-full object-cover" />
                          <button onClick={() => setSiteImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12} /></button>
                        </div>
                      )}
                    </div>

                    {/* Style Reference */}
                    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group border-dashed">
                      <div className="absolute top-3 left-3 z-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Sparkles size={10} /> Style Reference</div>
                      {!referenceImage ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 hover:text-slate-400 transition-colors">
                          <Plus size={24} className="mb-2 opacity-50" />
                          <p className="text-xs font-medium">Add Style</p>
                          <input type="file" ref={referenceInputRef} onChange={handleReferenceUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                          <button onClick={() => setReferenceImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Generate Button Area (Simplified as controls are in sidebar) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-mono text-xs">CR</span>
                    <span className="text-sm font-medium text-slate-900">Est. Cost {currentCost} Credits</span>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={!uploadedImage || isGenerating}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-slate-900/20"
                  >
                    {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {isGenerating ? 'Rendering...' : 'Generate'}
                  </Button>
                </div>
                {apiKeyError && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} /> {apiKeyError}
                  </div>
                )}
              </div>

              {/* Right Column: Output */}
              <div className="w-1/2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex items-center justify-center">
                {!generatedImage ? (
                  <div className="text-center text-slate-300">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ImageIcon size={32} className="opacity-50" />
                    </div>
                    <p className="text-sm font-medium">Ready to Render</p>
                  </div>
                ) : (
                  <div className="relative w-full h-full group">
                    <img src={generatedImage} alt="Generated" className="w-full h-full object-contain bg-slate-900" />
                    <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={handleDownload} className="bg-white text-slate-900 px-4 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 hover:bg-slate-50"><Download size={16} /> Download</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Right Panel (History) - Only show in Render/Ideation/Diagram modes */}
      {activeTab !== 'profile' && (
        <aside className="w-80 border-l border-slate-200 bg-white hidden xl:flex flex-col h-screen sticky top-0">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-medium">History</h3>
            <button className="text-slate-400 hover:text-slate-900"><Filter size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.length === 0 ? (
              <div className="text-center text-slate-400 mt-10">
                <History size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs">No renders yet</p>
              </div>
            ) : (
              history.map(item => (
                <HistoryCard key={item.id} item={item} onRestore={handleRestoreHistory} />
              ))
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;