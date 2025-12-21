import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, Layers, Box, Settings, Download, X, History, CreditCard, Video, Key, MapPin, Monitor, Plus, Trash2, Edit2, Save, Palette, Cuboid, LogOut, User as UserIcon, AlertCircle, RefreshCw, Lightbulb, Shapes, Camera, Shield, Mail, Sliders, Sun, Compass, Filter, Calendar, ChevronDown, SortDesc, Grid, Spline, ArrowUpRight, Wind, Users, GitBranch, Ruler, Map, Leaf, BrickWall, Square, Package, TreeDeciduous, Grid3x3, Droplets, LayoutGrid, Waves, Gem, Scissors, ArrowUpSquare, Merge, BoxSelect, Expand, MinusSquare, Target, Split, Eraser, Puzzle, RotateCw, Scroll, MoveDiagonal, ArrowRightFromLine, ArrowUpFromLine, Signal, CornerUpRight, Sunrise, Sunset, Home, Sofa, Armchair, Hexagon, Component, Archive, Warehouse, Crown, CloudRain, Zap, Cloud, Moon, Check, Cpu, Eye, Minimize2, Copy, TrendingUp, ArrowDownToLine, Shovel, WrapText, Network, DoorOpen, Disc, MoveHorizontal, Shrink, Maximize, FoldVertical, ScissorsLineDashed, Scaling, GitMerge, PlusSquare, Activity } from 'lucide-react';
import { generateArchitecturalRender } from './services/geminiService';
import { RenderStyle, ViewType, GenerationResult, UserCredits, AspectRatio, ImageSize, CustomStyle, User, IdeationConfig, ElevationSide, DiagramType, CreateMode, InteriorStyle, Atmosphere } from './types';
import { INITIAL_CREDITS, CREDIT_COSTS, STYLE_PROMPTS, SPATIAL_VERBS, IDEATION_MATERIALS, IDEATION_FORMS, IDEATION_ALLOWED_VIEWS, DIAGRAM_PROMPTS, INTERIOR_STYLE_PROMPTS, EXTERIOR_STYLE_THUMBNAILS, INTERIOR_STYLE_THUMBNAILS, EXTERIOR_STYLE_CATEGORIES, ATMOSPHERE_OPTIONS } from './constants';
import { Button } from './components/Button';
import { LoginScreen } from './components/LoginScreen';
import { LandingPage } from './components/LandingPage';
import { ProfileView } from './components/ProfileView';
import { storageService } from './services/storageService';
import { supabase } from './services/supabaseClient';
import { HelpModal } from './components/HelpModal';
import { indexedDBService } from './services/indexedDBService';
import { historyService } from './services/historyService';
import { IdeationButton } from './components/IdeationButton';
import { LiveIdeationPreview } from './components/LiveIdeationPreview';
import {
  ConcreteGraphic, WhiteCardGraphic, BlueFoamGraphic, WoodBlockGraphic, CardboardGraphic, TranslucentGraphic,
  OrthogonalGraphic, OrganicGraphic, CurvilinearGraphic, FacetedGraphic, CrystallineGraphic, ParametricGraphic, DeconstructivistGraphic,
  MorningGraphic, NoonGraphic, SunsetGraphic,
  ExtrudeGraphic, BranchGraphic, MergeGraphic, NestGraphic, InflateGraphic, StackGraphic, SubtractGraphic, PunchGraphic, SplitGraphic, CarveGraphic, NotchGraphic, TwistGraphic, FoldGraphic, ShearGraphic, CantileverGraphic, LiftGraphic, TerraceGraphic, BendGraphic, ShiftGraphic, RotateGraphic, OffsetGraphic, TaperGraphic, InterlockGraphic, DefaultGraphic
} from './components/IdeationGraphics';


function App() {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'dev-user',
    email: 'dev@example.com',
    name: 'Dev Architect',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [credits, setCredits] = useState<UserCredits>({ available: INITIAL_CREDITS, totalUsed: 0 });
  const [activeTab, setActiveTab] = useState<'render' | 'ideation' | 'diagram' | 'profile'>('render');
  const [showHelp, setShowHelp] = useState(false);
  const [showIdeationExample, setShowIdeationExample] = useState(false);
  const [createMode, setCreateMode] = useState<CreateMode>('Exterior');


  const [selectedStyle, setSelectedStyle] = useState<string>(RenderStyle.SIMILAR_TO_REF);
  const [selectedAtmospheres, setSelectedAtmospheres] = useState<Atmosphere[]>([]);
  const [customStyles, setCustomStyles] = useState<CustomStyle[]>([]);
  const [showStyleCreator, setShowStyleCreator] = useState(false);

  const [selectedVerbs, setSelectedVerbs] = useState<string[]>([]);
  const [ideationMaterial, setIdeationMaterial] = useState<string>('Concrete');
  const [ideationForm, setIdeationForm] = useState<string>('Orthogonal');
  const [innovationLevel, setInnovationLevel] = useState<number>(30);
  const [elevationSide, setElevationSide] = useState<ElevationSide>('Front');
  const [timeOfDay, setTimeOfDay] = useState<string>('Noon');
  const [material1Image, setMaterial1Image] = useState<string | null>(null);
  const [material2Image, setMaterial2Image] = useState<string | null>(null);

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

  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);

  const toggleCategory = (title: string) => {
    setCollapsedCategories(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const siteInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const material1InputRef = useRef<HTMLInputElement>(null);
  const material2InputRef = useRef<HTMLInputElement>(null);



  const currentCost = CREDIT_COSTS[selectedImageSize];

  const availableViews = activeTab === 'ideation' ? IDEATION_ALLOWED_VIEWS : [
    ViewType.SIMILAR_TO_INPUT,
    ViewType.SIMILAR_TO_REF,
    ...Object.values(ViewType).filter(v => v !== ViewType.SIMILAR_TO_INPUT && v !== ViewType.SIMILAR_TO_REF)
  ];

  useEffect(() => {
    if (createMode === 'Interior') {
      setSelectedStyle(InteriorStyle.PHOTOREALISTIC);
      setSelectedView(ViewType.PERSPECTIVE);
      setSelectedAtmospheres([]);
    } else {
      setSelectedStyle(RenderStyle.SIMILAR_TO_REF);
      setSelectedView(ViewType.SIMILAR_TO_INPUT);
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
      setCustomStyles(userData.customStyles || []);

      // Load initial credits from local storage
      if (userData.credits) {
        setCredits(userData.credits);
      } else {
        setCredits(prev => ({ ...prev, available: INITIAL_CREDITS }));
      }

      // 1. Fetch History (Local for all users currently)
      const fetchHistory = async () => {
        // We use local storage for everyone since Supabase Auth is not fully integrated yet
        // This ensures data persistence for mock users like 'salARCHman Studio'
        await storageService.recoverLostHistory(currentUser.email);
        const localHistory = await storageService.loadHistoryWithImages(currentUser.email);
        setHistory(localHistory);
      };
      fetchHistory();

      // 2. Sync credits from Supabase
      const fetchCredits = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', currentUser.id)
            .single();

          if (data) {
            setCredits(prev => ({ ...prev, available: data.credits }));
            // Update local storage with synced credits
            storageService.saveUserData(currentUser.email, {
              history: [], // We don't save cloud history to local to avoid duplication
              customStyles: userData.customStyles || [],
              user: { name: currentUser.name, avatar: currentUser.avatar },
              credits: { ...credits, available: data.credits }
            });
          }
        } catch (error) {
          console.error('Error fetching credits:', error);
        }
      };

      fetchCredits();
    }
  }, [currentUser]);

  // Real-time subscription for credit updates
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('realtime-credits')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentUser.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new.credits === 'number') {
            setCredits(prev => ({ ...prev, available: payload.new.credits }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      storageService.saveUserData(currentUser.email, {
        history,
        customStyles,
        user: { name: currentUser.name, avatar: currentUser.avatar },
        credits
      });
    }
  }, [history, customStyles, currentUser, credits]);

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

  const [baseImageKey, setBaseImageKey] = useState(0);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a Blob URL for immediate preview
      const objectUrl = URL.createObjectURL(file);
      setUploadedImagePreview(objectUrl);
      setGeneratedImage(null);
      setApiKeyError(null);

      // Also read as Data URL for the API
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setUploadedImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBaseImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedImage(null);
    setUploadedImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };




  const handleSiteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setSiteImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMaterial1Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMaterial1Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMaterial2Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMaterial2Image(reader.result as string);
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
    setActiveTab('render'); // Switch back to workspace to see restored state
  };

  const handlePurchase = (amount: number) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newAvailable = credits.available + amount;
      setCredits(prev => ({
        available: newAvailable,
        totalUsed: prev.totalUsed
      }));

      if (currentUser) {
        supabase
          .from('profiles')
          .update({ credits: newAvailable })
          .eq('id', currentUser.id)
          .then(({ error }) => {
            if (error) console.error('Error updating credits in Supabase:', error);
          });
      }

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
        (activeTab === 'render' && createMode === 'Exterior' && selectedView === ViewType.ELEVATION) ? elevationSide : undefined,
        createMode === 'Exterior' ? material1Image : null,
        createMode === 'Exterior' ? material2Image : null
      );

      // Create history item
      const newHistoryItem: GenerationResult = {
        id: crypto.randomUUID(), // Use crypto.randomUUID for unique IDs
        originalImage: uploadedImage, // Use uploadedImage directly
        siteImage: createMode === 'Exterior' ? siteImage : null,
        referenceImage: referenceImage,
        generatedImage: resultImage, // Use resultImage directly
        style: activeTab === 'ideation' ? 'Operative Massing' : (activeTab === 'diagram' ? 'Diagram' : selectedStyle),
        viewType: viewToUse,
        diagramType: diagramTypeToUse,
        aspectRatio: selectedAspectRatio,
        imageSize: selectedImageSize,
        prompt: prompt,
        timestamp: Date.now(),
        selectedVerbs: activeTab === 'ideation' ? selectedVerbs : undefined,
        ideationConfig: activeTab === 'ideation' ? {
          innovationLevel,
          material: ideationMaterial,
          formLanguage: ideationForm,
          elevationSide: selectedView === ViewType.ELEVATION ? elevationSide : undefined, // Use selectedView for elevationSide
          timeOfDay: timeOfDay
        } : undefined,
        createMode: activeTab === 'render' ? createMode : 'Exterior', // Ensure createMode is set correctly
        atmospheres: activeTab === 'render' && createMode === 'Exterior' ? selectedAtmospheres : undefined,
        elevationSide: (activeTab === 'render' && createMode === 'Exterior' && selectedView === ViewType.ELEVATION) ? elevationSide : undefined
      };

      // Optimistic update for UI
      setHistory(prev => [newHistoryItem, ...prev]);
      setGeneratedImage(resultImage); // Use resultImage directly

      const newAvailable = credits.available - currentCost;
      const newTotalUsed = credits.totalUsed + currentCost;
      const newCredits = { available: newAvailable, totalUsed: newTotalUsed };
      setCredits(newCredits);

      // Save to Cloud History (Supabase)
      // Save History
      // Always save to local storage for now to ensure persistence
      const currentData = storageService.loadUserData(currentUser?.email || 'guest');
      const updatedHistory = [newHistoryItem, ...(currentData.history || [])];

      storageService.saveUserData(currentUser?.email || 'guest', {
        ...currentData,
        history: updatedHistory,
        credits: newCredits
      });

      // Optionally try to sync to cloud if it's a real user, but don't rely on it
      if (currentUser && currentUser.id !== 'dev-user') {
        // Save to Cloud History (Supabase) for real users
        historyService.saveGeneration(currentUser.id, newHistoryItem)
          .then((publicUrl) => {
            console.log('Saved to cloud history:', publicUrl);
          })
          .catch(err => console.error('Failed to save to cloud history:', err));
      }
      if (false) {
        // Save to Local Storage for dev-user or guest
        // We need to reload the latest data first to avoid overwriting
        const currentData = storageService.loadUserData(currentUser?.email || 'guest');
        const updatedHistory = [newHistoryItem, ...(currentData.history || [])];

        storageService.saveUserData(currentUser?.email || 'guest', {
          ...currentData,
          history: updatedHistory,
          credits: newCredits
        });
      }

      // Update credits in Supabase
      if (currentUser) {
        const { error } = await supabase
          .from('profiles')
          .update({ credits: newCredits.available })
          .eq('id', currentUser.id);

        if (error) {
          console.error('Error updating credits:', error);
        }
      }
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
      link.download = `renderman-ai-${Date.now()}.png`;
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

  // Helper for icons
  const getMaterialIcon = (name: string) => {
    switch (name) {
      case 'Concrete': return <BrickWall size={14} />;
      case 'White Card': return <Square size={14} />;
      case 'Blue Foam': return <Box size={14} />;
      case 'Wood Block': return <TreeDeciduous size={14} />;
      case 'Cardboard': return <Package size={14} />;
      case 'Translucent': return <Droplets size={14} />;
      default: return <Box size={14} />;
    }
  };

  const getFormIcon = (name: string) => {
    switch (name) {
      case 'Orthogonal': return <LayoutGrid size={14} />;
      case 'Organic': return <Leaf size={14} />;
      case 'Curvilinear': return <Waves size={14} />;
      case 'Faceted': return <Gem size={14} />;
      case 'Crystalline': return <Hexagon size={14} />;
      case 'Parametric': return <Cpu size={14} />;
      case 'Deconstructivist': return <Scissors size={14} />;
      default: return <Shapes size={14} />;
    }
  };

  const getVerbIcon = (name: string) => {
    switch (name) {
      case 'Extrude': return <ArrowUpSquare size={12} />;
      case 'Branch': return <GitBranch size={12} />;
      case 'Merge': return <Merge size={12} />;
      case 'Nest': return <BoxSelect size={12} />;
      case 'Inflate': return <Expand size={12} />;
      case 'Stack': return <Layers size={12} />;
      case 'Subtract': return <MinusSquare size={12} />;
      case 'Punch': return <Target size={12} />;
      case 'Split': return <Split size={12} />;
      case 'Carve': return <Eraser size={12} />;
      case 'Notch': return <Puzzle size={12} />;
      case 'Twist': return <RotateCw size={12} />;
      case 'Fold': return <Scroll size={12} />;
      case 'Shear': return <MoveDiagonal size={12} />;
      case 'Cantilever': return <ArrowRightFromLine size={12} />;
      case 'Lift': return <ArrowUpFromLine size={12} />;
      case 'Terrace': return <Signal size={12} />;
      case 'Bend': return <CornerUpRight size={12} />;
      case 'Shift': return <MoveDiagonal size={12} />;
      case 'Rotate': return <RotateCw size={12} />;
      case 'Offset': return <Expand size={12} />;
      case 'Taper': return <Minimize2 size={12} />;
      case 'Interlock': return <Puzzle size={12} />;
      case 'Laminate': return <Copy size={12} />;
      case 'Grade': return <TrendingUp size={12} />;
      case 'Embed': return <ArrowDownToLine size={12} />;
      case 'Fracture': return <Zap size={12} />;
      case 'Excavate': return <Shovel size={12} />;
      case 'Wrap': return <WrapText size={12} />;
      case 'Weave': return <Network size={12} />;
      case 'Hinge': return <DoorOpen size={12} />;
      case 'Pivot': return <Disc size={12} />;
      case 'Slide': return <MoveHorizontal size={12} />;
      case 'Compress': return <Shrink size={12} />;
      case 'Expand': return <Maximize size={12} />;
      case 'Pleat': return <FoldVertical size={12} />;
      case 'Seam': return <ScissorsLineDashed size={12} />;
      case 'Stretch': return <Scaling size={12} />;
      case 'Infiltrate': return <GitMerge size={12} />;
      case 'Augment': return <PlusSquare size={12} />;
      case 'React': return <Activity size={12} />;
      default: return <Sparkles size={12} />;
    }
  };

  const getMaterialGraphic = (name: string) => {
    switch (name) {
      case 'Concrete': return <ConcreteGraphic />;
      case 'White Card': return <WhiteCardGraphic />;
      case 'Blue Foam': return <BlueFoamGraphic />;
      case 'Wood Block': return <WoodBlockGraphic />;
      case 'Cardboard': return <CardboardGraphic />;
      case 'Translucent': return <TranslucentGraphic />;
      default: return <DefaultGraphic />;
    }
  };

  const getFormGraphic = (name: string) => {
    switch (name) {
      case 'Orthogonal': return <OrthogonalGraphic />;
      case 'Organic': return <OrganicGraphic />;
      case 'Curvilinear': return <CurvilinearGraphic />;
      case 'Faceted': return <FacetedGraphic />;
      case 'Crystalline': return <CrystallineGraphic />;
      case 'Parametric': return <ParametricGraphic />;
      case 'Deconstructivist': return <DeconstructivistGraphic />;
      default: return <DefaultGraphic />;
    }
  };

  const getSunGraphic = (name: string) => {
    switch (name) {
      case 'Morning': return <MorningGraphic />;
      case 'Noon': return <NoonGraphic />;
      case 'Sunset': return <SunsetGraphic />;
      default: return <DefaultGraphic />;
    }
  };

  const getVerbGraphic = (name: string) => {
    switch (name) {
      case 'Extrude': return <ExtrudeGraphic />;
      case 'Branch': return <BranchGraphic />;
      case 'Merge': return <MergeGraphic />;
      case 'Nest': return <NestGraphic />;
      case 'Inflate': return <InflateGraphic />;
      case 'Stack': return <StackGraphic />;
      case 'Subtract': return <SubtractGraphic />;
      case 'Punch': return <PunchGraphic />;
      case 'Split': return <SplitGraphic />;
      case 'Carve': return <CarveGraphic />;
      case 'Notch': return <NotchGraphic />;
      case 'Twist': return <TwistGraphic />;
      case 'Fold': return <FoldGraphic />;
      case 'Shear': return <ShearGraphic />;
      case 'Cantilever': return <CantileverGraphic />;
      case 'Lift': return <LiftGraphic />;
      case 'Terrace': return <TerraceGraphic />;
      case 'Bend': return <BendGraphic />;
      case 'Shift': return <ShiftGraphic />;
      case 'Rotate': return <RotateGraphic />;
      case 'Offset': return <OffsetGraphic />;
      case 'Taper': return <TaperGraphic />;
      case 'Interlock': return <InterlockGraphic />;
      case 'Laminate': return <DefaultGraphic />;
      case 'Grade': return <DefaultGraphic />;
      case 'Embed': return <DefaultGraphic />;
      case 'Fracture': return <DefaultGraphic />;
      case 'Excavate': return <DefaultGraphic />;
      case 'Wrap': return <DefaultGraphic />;
      case 'Weave': return <DefaultGraphic />;
      case 'Hinge': return <DefaultGraphic />;
      case 'Pivot': return <DefaultGraphic />;
      case 'Slide': return <DefaultGraphic />;
      case 'Compress': return <DefaultGraphic />;
      case 'Expand': return <DefaultGraphic />;
      case 'Pleat': return <DefaultGraphic />;
      case 'Seam': return <DefaultGraphic />;
      case 'Stretch': return <DefaultGraphic />;
      case 'Infiltrate': return <DefaultGraphic />;
      case 'Augment': return <DefaultGraphic />;
      case 'React': return <DefaultGraphic />;
      default: return <DefaultGraphic />;
    }
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
          <h1 className="text-xl font-light tracking-tight text-slate-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex-shrink-0 flex items-center justify-center text-white"><Box size={16} /></div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-medium">renderman.ai</span>
              <span className="text-[10px] font-normal text-slate-500 mt-0.5">by salARCHman studio</span>
              <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest">V1.0 (beta)</p>
            </div>
          </h1>
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
                      <button
                        onClick={() => toggleCategory(category.title)}
                        className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 hover:text-slate-600 transition-colors group"
                      >
                        {category.title}
                        <ChevronDown size={12} className={`transition-transform duration-200 ${collapsedCategories.includes(category.title) ? '-rotate-90' : ''}`} />
                      </button>
                      <div className={`grid grid-cols-2 gap-2 transition-all duration-300 ${collapsedCategories.includes(category.title) ? 'hidden' : 'block'}`}>
                        {category.styles.map(style => (
                          <button
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`group relative overflow-hidden rounded-lg aspect-video border transition-all ${selectedStyle === style ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <img
                              src={EXTERIOR_STYLE_THUMBNAILS[style]}
                              alt={style}
                              loading="lazy"
                              decoding="async"
                              width="160"
                              height="90"
                              className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
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
                          <img
                            src={INTERIOR_STYLE_THUMBNAILS[style]}
                            alt={style}
                            loading="lazy"
                            decoding="async"
                            width="160"
                            height="90"
                            className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                          />
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
                {selectedView === 'Elevation' && (
                  <div className="grid grid-cols-4 gap-2">
                    {['Front', 'Back', 'Left', 'Right'].map((side) => (
                      <button
                        key={side}
                        onClick={() => setElevationSide(side as ElevationSide)}
                        className={`py-2 text-[10px] font-medium rounded-lg border transition-all ${elevationSide === side
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        {side}
                      </button>
                    ))}
                  </div>
                )}
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
                    <option value="Similar to Input">Similar to Input</option>
                    <option value="Similar to Reference">Similar to Reference</option>
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
              {/* Operative Design Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <Shapes size={14} className="text-slate-900" />
                    <h4 className="text-sm font-bold text-slate-900">Operative Design</h4>
                  </div>
                  <button
                    onClick={() => setShowIdeationExample(true)}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full transition-colors"
                  >
                    <Eye size={10} /> See Example
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed relative z-10">
                  Select spatial verbs to apply volumetric operations to your base massing. Combined verbs create complex geometries.
                </p>
              </div>

              {/* Example Modal */}
              {showIdeationExample && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowIdeationExample(false)}>
                  <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Ideation Power: Operative Design</h3>
                      <button onClick={() => setShowIdeationExample(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                            <img
                              src="/ideation_examples/input.png"
                              alt="Input Sketch"
                              loading="lazy"
                              className="w-full h-full object-contain p-4"
                            />
                          </div>
                          <p className="text-center text-xs font-bold text-slate-500 uppercase">Input: Simple SketchUp Model</p>
                        </div>
                        <div className="space-y-2">
                          <div className="aspect-square bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden shadow-xl">
                            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                              <img src="/ideation_examples/output_1.png" loading="lazy" className="w-full h-full object-cover border-r border-b border-slate-800/50" alt="Variation 1" />
                              <img src="/ideation_examples/output_2.png" loading="lazy" className="w-full h-full object-cover border-b border-slate-800/50" alt="Variation 2" />
                              <img src="/ideation_examples/output_3.png" loading="lazy" className="w-full h-full object-cover border-r border-slate-800/50" alt="Variation 3" />
                              <img src="/ideation_examples/output_4.png" loading="lazy" className="w-full h-full object-cover" alt="Variation 4" />
                            </div>
                          </div>
                          <p className="text-center text-xs font-bold text-blue-600 uppercase">Output: AI-Generated Massing Variations</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm leading-relaxed">
                        <p>
                          <strong>Why use Ideation?</strong><br />
                          Transform a simple block model into a bundle of architectural variations. Use <strong>Spatial Verbs</strong> to explore form, massing, and geometry instantly.
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => setShowIdeationExample(false)}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Innovation Level */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Sliders size={10} /> Innovation Level
                </div>
                <div className="px-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={innovationLevel}
                    onChange={(e) => setInnovationLevel(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-500">
                    <span>Strict</span>
                    <span>Balanced</span>
                    <span>Radical</span>
                  </div>
                </div>
              </div>

              {/* Materiality */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Cuboid size={10} /> Materiality
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(IDEATION_MATERIALS).map(m => (
                    <IdeationButton
                      key={m}
                      label={m}
                      active={ideationMaterial === m}
                      onClick={() => setIdeationMaterial(m)}
                      graphic={getMaterialGraphic(m)}
                      imageSrc={uploadedImage}
                    />
                  ))}
                </div>
              </div>

              {/* Sun & Shadows */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Sun size={10} /> Sun & Shadows
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Morning', 'Noon', 'Sunset'].map(t => (
                    <IdeationButton
                      key={t}
                      label={t}
                      active={timeOfDay === t}
                      onClick={() => setTimeOfDay(t)}
                      graphic={getSunGraphic(t)}
                      imageSrc={uploadedImage}
                    />
                  ))}
                </div>
              </div>

              {/* Form Language */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Component size={10} /> Form Language
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(IDEATION_FORMS).map(f => (
                    <IdeationButton
                      key={f}
                      label={f}
                      active={ideationForm === f}
                      onClick={() => setIdeationForm(f)}
                      graphic={getFormGraphic(f)}
                      imageSrc={uploadedImage}
                    />
                  ))}
                </div>
              </div>

              {/* Spatial Verbs */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                {['Additive', 'Subtractive', 'Displacement', 'Hybrid'].map(category => (
                  <div key={category} className="space-y-2">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{category} Operations</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(SPATIAL_VERBS)
                        .filter(([_, data]) => data.category === category)
                        .map(([verb, _]) => (
                          <IdeationButton
                            key={verb}
                            label={verb}
                            active={selectedVerbs.includes(verb)}
                            onClick={() => toggleVerb(verb)}
                            graphic={getVerbGraphic(verb)}
                            imageSrc={uploadedImage}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Projection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
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
                {selectedView === 'Elevation' && (
                  <div className="grid grid-cols-4 gap-2">
                    {['Front', 'Back', 'Left', 'Right'].map((side) => (
                      <button
                        key={side}
                        onClick={() => setElevationSide(side as ElevationSide)}
                        className={`py-2 text-[10px] font-medium rounded-lg border transition-all ${elevationSide === side
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        {side}
                      </button>
                    ))}
                  </div>
                )}
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

              {/* Refine */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Sliders size={10} /> Refine</label>
                <textarea
                  placeholder="Describe the specific volumetric outcome..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
                />
              </div>
            </div>
          )}

          {/* DIAGRAM TAB CONTROLS */}
          {activeTab === 'diagram' && (
            <div className="space-y-6">
              {/* Analytical Diagrams Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                  <Spline size={14} className="text-slate-900" />
                  <h4 className="text-sm font-bold text-slate-900">Analytical Diagrams</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a diagram type below to visualize analysis, flow, or assembly.
                </p>
              </div>

              {/* Style Gallery */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Grid size={10} /> Style Gallery</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(DIAGRAM_PROMPTS).map((type) => {
                    const isSelected = selectedDiagramType === type;

                    // Helper to get icon and description for each type
                    const getDiagramDetails = (t: string) => {
                      switch (t) {
                        case 'Concept / Schematic': return { icon: <Lightbulb size={24} />, desc: "Simplified massing with arrows showing core design idea", color: "text-amber-400" };
                        case 'Exploded Axonometric': return { icon: <Layers size={24} />, desc: "Vertical deconstruction of layers and assembly", color: "text-blue-500" };
                        case 'Programmatic & Zoning': return { icon: <Cuboid size={24} />, desc: "Color-coded functional zoning and volumes", color: "text-rose-500" };
                        case 'Circulation & Flow': return { icon: <ArrowUpRight size={24} />, desc: "Flow paths, movement vectors, and access", color: "text-orange-500" };
                        case 'Climate & Environmental': return { icon: <Wind size={24} />, desc: "Sun path, wind flow, and thermal analysis", color: "text-emerald-500" };
                        case 'Sectional Perspective': return { icon: <BoxSelect size={24} />, desc: "3D cut revealing interior life and depth", color: "text-purple-500" };
                        case 'Activity & Usage': return { icon: <Users size={24} />, desc: "Ghosted view with activity mapping and usage", color: "text-pink-500" };
                        case 'Geometric Analysis': return { icon: <Ruler size={24} />, desc: "Regulating lines, symmetry, and proportions", color: "text-slate-500" };
                        case 'Structural Tectonics': return { icon: <Grid3x3 size={24} />, desc: "X-ray view of load-bearing skeletal system", color: "text-indigo-500" };
                        case 'Urban Context & Mapping': return { icon: <Map size={24} />, desc: "Relationship to city fabric and mapping", color: "text-teal-600" };
                        case 'Form Evolution': return { icon: <GitBranch size={24} />, desc: "Step-by-step generative design process", color: "text-cyan-500" };
                        case 'Living Collage Cutaway': return { icon: <Leaf size={24} />, desc: "Whimsical cutaway with lush plants and life", color: "text-lime-600" };
                        default: return { icon: <Shapes size={24} />, desc: "Architectural diagram style", color: "text-slate-500" };
                      }
                    };

                    const details = getDiagramDetails(type);

                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedDiagramType(type as DiagramType)}
                        className={`relative overflow-hidden text-left p-4 rounded-2xl border transition-all h-full flex flex-col gap-3 group ${isSelected ? 'bg-slate-900 border-slate-900 shadow-lg scale-[1.02]' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
                      >
                        {/* Decorative Background Shape */}
                        {!isSelected && (
                          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[60px] -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                        )}
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                        )}

                        <div className={`relative z-10 ${details.color}`}>
                          {details.icon}
                        </div>
                        <div className="relative z-10">
                          <h5 className={`text-[11px] font-bold uppercase leading-tight mb-1.5 ${isSelected ? 'text-white' : 'text-slate-700'}`}>{type}</h5>
                          <p className={`text-[10px] leading-relaxed ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>{details.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Output Config (Shared) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Monitor size={10} /> Output Config</label>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={selectedAspectRatio}
                    onChange={(e) => setSelectedAspectRatio(e.target.value as AspectRatio)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="16:9">Landscape (16:9)</option>
                    <option value="4:3">Standard (4:3)</option>
                    <option value="1:1">Square (1:1)</option>
                    <option value="9:16">Portrait (9:16)</option>
                    <option value="Similar to Input">Similar to Input</option>
                    <option value="Similar to Reference">Similar to Reference</option>
                  </select>
                  <div className="grid grid-cols-3 gap-2">
                    {['1K', '2K', '4K'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedImageSize(size as ImageSize)}
                        className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all ${selectedImageSize === size ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                      >
                        <span className="text-xs font-bold">{size}</span>
                        <span className={`text-[9px] ${selectedImageSize === size ? 'text-slate-300' : 'text-slate-400'}`}>{CREDIT_COSTS[size as ImageSize]} Cr</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Refine */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Sliders size={10} /> Refine</label>
                <textarea
                  placeholder="Specific details for the diagram..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none"
                />
                <p className="text-[10px] text-slate-400">
                  Use this box for further details and specific adjustments.
                </p>
              </div>
            </div>
          )}

        </div>
        <div className="px-4 pb-2">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-[10px] text-slate-400 font-medium text-center leading-tight">(image to video animation is coming soon)</p>
            <p className="text-[10px] text-slate-400 font-medium text-center leading-tight mt-1">(image to 3D model is coming soon)</p>
          </div>
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
            <button onClick={() => setShowHelp(true)} className="text-xs font-medium text-slate-500 hover:text-slate-900">Help</button>
          </div>
        </header>

        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

        {/* Canvas Area */}
        <div className={`flex-1 overflow-y-auto p-6 bg-slate-50 ${activeTab !== 'profile' ? 'flex items-center justify-center' : ''} ${(activeTab === 'diagram' || activeTab === 'render') ? 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]' : ''}`}>
          {activeTab === 'profile' ? (
            <ProfileView
              user={currentUser}
              credits={credits}
              history={history}
              onUpdateProfile={(name) => {
                const updatedUser = { ...currentUser, name };
                setCurrentUser(updatedUser);
                // Persist to local storage
                const currentData = storageService.loadUserData(currentUser.email);
                storageService.saveUserData(currentUser.email, {
                  ...currentData,
                  user: updatedUser
                });
              }}
              onPurchase={handlePurchase}
              onRestore={handleRestoreHistory}
              onRecoverHistory={async () => {
                const recovered = await storageService.recoverLostHistory(currentUser.email);
                setHistory(recovered);
                alert(`Recovery complete. Found ${recovered.length} items.`);
              }}
            />
          ) : activeTab === 'diagram' ? (
            <div className="w-full max-w-6xl h-full flex flex-col relative z-10">
              {/* Diagram Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <Spline size={24} className="text-slate-900" />
                  <h2 className="text-xl font-light text-slate-900">Analytical Diagrams</h2>
                </div>
                <p className="text-xs text-slate-500 ml-9">Convert sketches into clear, stylized architectural diagrams.</p>
              </div>

              {/* Diagram Workspace */}
              <div className="flex-1 flex gap-6 min-h-0 mb-6">
                {/* Left Column */}
                <div className="w-1/3 flex flex-col gap-4">
                  {/* Base Geometry */}
                  <div className="flex-1 bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[200px]">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Box size={12} /> Base Geometry
                    </div>
                    {!uploadedImage ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Upload size={32} className="mb-3 opacity-50" />
                        <p className="text-sm font-medium text-slate-900">Upload Sketch</p>
                        <p className="text-[10px] opacity-60 mt-1">PNG, JPG (MAX 10MB)</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <img src={uploadedImage} alt="Base Geometry" className="w-full h-full object-cover" />
                        <button onClick={handleClear} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"><X size={16} /></button>
                      </div>
                    )}
                  </div>

                  {/* Diagram Style Ref */}
                  <div className="h-48 bg-white rounded-2xl border border-dashed border-slate-300 relative group">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Sparkles size={12} /> Diagram Style Ref
                    </div>
                    {!referenceImage ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Plus size={24} className="mb-2 opacity-50" />
                        <p className="text-xs font-medium">Add Style</p>
                        <input type="file" ref={referenceInputRef} onChange={handleReferenceUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <img src={referenceImage} alt="Style Ref" className="w-full h-full object-cover" />
                        <button onClick={() => setReferenceImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (Output) */}
                <div className="w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm relative flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Diagram &bull; {selectedImageSize} &bull; {selectedAspectRatio}
                  </div>
                  {!generatedImage ? (
                    <div className="text-center text-slate-300">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon size={32} className="opacity-50" />
                      </div>
                      <p className="text-sm font-medium">Ready to Render</p>
                    </div>
                  ) : (
                    <div className="relative w-full h-full group">
                      <img src={generatedImage} alt="Generated Diagram" className="w-full h-full object-contain bg-slate-50" />
                      <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleDownload} className="bg-white text-slate-900 px-4 py-2 rounded-lg shadow-lg font-medium text-sm flex items-center gap-2 hover:bg-slate-50"><Download size={16} /> Download</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Bar */}
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
                <div className="mt-2 bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} /> {apiKeyError}
                </div>
              )}
            </div>
          ) : activeTab === 'ideation' ? (
            <div className="w-full max-w-6xl h-full flex flex-col relative z-10">
              {/* Ideation Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Shapes size={24} className="text-slate-900" />
                    <h2 className="text-xl font-light text-slate-900">Volumetric Ideation</h2>
                  </div>
                  <p className="text-xs text-slate-500 ml-9">Explore operative massing variations using spatial verbs.</p>
                </div>


              </div>

              {/* Ideation Workspace */}
              <div className="flex-1 flex gap-6 min-h-0 mb-6">



                {/* Left Column */}
                <div className="w-1/3 flex flex-col gap-4">
                  {/* Base Geometry */}
                  <div className="flex-1 bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[200px]">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Box size={12} /> Base Geometry
                    </div>
                    {!uploadedImage ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Upload size={32} className="mb-3 opacity-50" />
                        <p className="text-sm font-medium text-slate-900">Upload Sketch</p>
                        <p className="text-[10px] opacity-60 mt-1">PNG, JPG (MAX 10MB)</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <img src={uploadedImage} alt="Base Geometry" className="w-full h-full object-cover" />
                        <button onClick={handleClear} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"><X size={16} /></button>
                      </div>
                    )}
                  </div>

                  {/* Massing Reference */}
                  <div className="h-48 bg-white rounded-2xl border border-dashed border-slate-300 relative group">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Sparkles size={12} /> Massing Reference
                    </div>
                    {!referenceImage ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <Sparkles size={24} className="mb-2 opacity-50" />
                        <p className="text-xs font-medium">Add Style</p>
                        <input type="file" ref={referenceInputRef} onChange={handleReferenceUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <img src={referenceImage} alt="Style Ref" className="w-full h-full object-cover" />
                        <button onClick={() => setReferenceImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column (Output) */}
                <div className="w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm relative flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Operative Massing
                  </div>
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-medium px-2 py-1 rounded">{selectedImageSize}</span>
                    <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-medium px-2 py-1 rounded">{selectedAspectRatio}</span>
                  </div>
                  {!generatedImage ? (
                    uploadedImage ? (
                      <LiveIdeationPreview
                        imageSrc={uploadedImage}
                        verbs={selectedVerbs}
                        material={ideationMaterial}
                        form={ideationForm}
                        timeOfDay={timeOfDay}
                      />
                    ) : (
                      <div className="text-center text-slate-300">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ImageIcon size={32} className="opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Ready to Render</p>
                      </div>
                    )
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

              {/* Bottom Bar */}


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
                <div className="mt-2 bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={14} /> {apiKeyError}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-6xl h-full flex flex-col relative z-10">
              {/* Render Tab Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  {createMode === 'Exterior' ? <Home size={24} className="text-slate-900" /> : <Sofa size={24} className="text-slate-900" />}
                  <h2 className="text-xl font-light text-slate-900">{createMode} Design Studio</h2>
                </div>
                <p className="text-xs text-slate-500 ml-9">Convert rough concepts into client-ready {createMode.toLowerCase()} visualizations.</p>
              </div>

              <div className="flex-1 flex gap-6 min-h-0 mb-6">
                {/* Left Column: Inputs */}
                <div className="w-1/2 flex flex-col gap-6">
                  {/* Main Image Upload */}
                  <div className="flex-1 bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[400px] flex flex-col">
                    <div className="absolute top-6 left-6 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Box size={12} /> Base Geometry
                    </div>
                    {!uploadedImagePreview && !uploadedImage ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                          <Upload size={24} className="text-slate-900 opacity-80" />
                        </div>
                        <p className="text-sm font-medium text-slate-900 text-center px-8">Upload basic form or modeling screenshot from your 3D software like sketchup or just hand sketch</p>
                        <p className="text-[10px] opacity-50 mt-1">PNG, JPG (MAX 10MB)</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                      </div>
                    ) : (
                      <div className="relative w-full h-full p-2">
                        <div className="w-full h-full rounded-xl overflow-hidden relative bg-slate-100 border border-slate-100">
                          <img
                            src={uploadedImagePreview || uploadedImage || ''}
                            alt="Original"
                            className="w-full h-full object-contain"
                          />
                          <button onClick={handleRemoveBaseImage} className="absolute top-4 right-4 bg-white text-slate-900 p-2 rounded-lg shadow-lg hover:bg-slate-50 transition-colors z-20"><X size={16} /></button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Secondary Inputs Grid (Only for Render Tab) */}
                  {activeTab === 'render' && (
                    <div className="grid grid-cols-2 gap-4">
                      {/* Box 1: Context / Satellite */}
                      <div className="h-48 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group border-dashed">
                        <div className="absolute top-3 left-3 z-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><MapPin size={10} /> Context / Satellite</div>
                        {!siteImage ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 hover:text-slate-400 transition-colors p-4 text-center">
                            <Plus size={24} className="mb-2 opacity-50" />
                            <p className="text-xs font-medium">Upload site image or satellite screenshot (e.g. Google Maps)</p>
                            <input type="file" ref={siteInputRef} onChange={handleSiteUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img src={siteImage} alt="Site" className="w-full h-full object-cover" />
                            <button onClick={() => setSiteImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12} /></button>
                          </div>
                        )}
                      </div>

                      {/* Box 2: Style Reference */}
                      <div className="h-48 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group border-dashed">
                        <div className="absolute top-3 left-3 z-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Sparkles size={10} /> Style Reference</div>
                        {!referenceImage ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 hover:text-slate-400 transition-colors p-4 text-center">
                            <Plus size={24} className="mb-2 opacity-50" />
                            <p className="text-xs font-medium">Upload reference image for materials, lighting, and mood</p>
                            <input type="file" ref={referenceInputRef} onChange={handleReferenceUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                            <button onClick={() => setReferenceImage(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12} /></button>
                          </div>
                        )}
                      </div>

                      {/* Box 3: Material 1 */}
                      <div className="h-48 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group border-dashed">
                        <div className="absolute top-3 left-3 z-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Layers size={10} /> Material 1</div>
                        {!material1Image ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 hover:text-slate-400 transition-colors p-4 text-center">
                            <Plus size={24} className="mb-2 opacity-50" />
                            <p className="text-xs font-medium">Upload primary material texture (e.g. brick, wood)</p>
                            <input type="file" ref={material1InputRef} onChange={handleMaterial1Upload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img src={material1Image} alt="Material 1" className="w-full h-full object-cover" />
                            <button onClick={() => setMaterial1Image(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12} /></button>
                          </div>
                        )}
                      </div>

                      {/* Box 4: Material 2 */}
                      <div className="h-48 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group border-dashed">
                        <div className="absolute top-3 left-3 z-10 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Layers size={10} /> Material 2</div>
                        {!material2Image ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 hover:text-slate-400 transition-colors p-4 text-center">
                            <Plus size={24} className="mb-2 opacity-50" />
                            <p className="text-xs font-medium">Upload secondary material texture</p>
                            <input type="file" ref={material2InputRef} onChange={handleMaterial2Upload} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img src={material2Image} alt="Material 2" className="w-full h-full object-cover" />
                            <button onClick={() => setMaterial2Image(null)} className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"><X size={12} /></button>
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
                <div className="w-1/2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative flex flex-col h-full">
                  {/* Output Header Tags */}
                  <div className="h-14 border-b border-slate-100 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{selectedStyle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-medium px-2 py-1 rounded uppercase tracking-wider">{selectedImageSize} &bull; {selectedAspectRatio}</span>
                      {generatedImage && (
                        <button onClick={handleDownload} className="bg-slate-900 text-white px-3 py-1 rounded-lg shadow-sm font-medium text-xs flex items-center gap-1 hover:bg-slate-800 transition-colors">
                          <Download size={12} /> Download
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Output Canvas */}
                  <div className="flex-1 relative flex items-center justify-center bg-slate-50/50">
                    {!generatedImage ? (
                      <div className="text-center text-slate-300">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                          <ImageIcon size={32} className="opacity-30" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">Ready to Render</p>
                      </div>
                    ) : (
                      <div className="relative w-full h-full group p-4 flex items-center justify-center">
                        <img src={generatedImage} alt="Generated" className="max-w-full max-h-full object-contain rounded-lg shadow-sm bg-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main >
    </div >
  );
}

export default App;