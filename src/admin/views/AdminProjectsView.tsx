import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  X,
  Save,
  Image as ImageIcon,
  CheckCircle,
  MapPin,
  Layers,
  Sparkles,
  Compass,
  FileCheck,
  Building,
  Upload,
  ArrowUp,
  ArrowDown,
  Download,
  Phone,
  MessageCircle,
  Eye,
  Check,
  RotateCcw,
  Loader2,
  Camera,
  FileText,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Clock,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { StoreService } from '../../services/store';
import { ASSETS, INITIAL_PROJECTS } from '../../data/initialData';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import { BrochureService } from '../../utils/brochureService';
import { ImageDimensionBadge } from '../../components/common/ImageDimensionBadge';
import {
  Project,
  LifestyleSpace,
  FacilityGroup,
  InfrastructureItem,
  ProjectPhoto,
  HeroSlide,
  HeroBannerMode,
} from '../../types';

// Preset photo library from Velora's high-res assets
const PRESET_LIBRARY = [
  { name: 'Amrutvan Grand Entrance (Dusk)', url: ASSETS.heroEntrance },
  { name: 'Scenic Hillside Highway', url: ASSETS.scenicRoad },
  { name: 'Master Layout Schematic Aerial', url: ASSETS.masterPlan },
  { name: 'Luxury 2-Story Clubhouse', url: ASSETS.clubhouse },
  { name: 'Lush Botanical Gazebo Garden', url: ASSETS.gazeboGarden },
  { name: 'Children Sensory Play Park', url: ASSETS.kidsPlay },
  { name: 'Indoor Sports & Billiards Lounge', url: ASSETS.indoorGames },
  { name: 'Outdoor Badminton & Chess Turf', url: ASSETS.outdoorSports },
  { name: 'Green Rolling Hills & Plots', url: ASSETS.aerialGreenEstate },
  { name: 'Family Sunset Valley View', url: ASSETS.familySunset },
];

export const AdminProjectsView: React.FC = () => {
  const { projects } = useStore();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | 'basic'
    | 'specs'
    | 'photos'
    | 'highlights'
    | 'masterplan'
    | 'location'
    | 'lifestyle'
    | 'facilities'
    | 'infra'
  >('basic');

  // Async compression state
  const [compressingTarget, setCompressingTarget] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Input states for quick additions
  const [newHighlight, setNewHighlight] = useState('');
  const [newLocationBenefit, setNewLocationBenefit] = useState('');
  const [newMasterPlanFeature, setNewMasterPlanFeature] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoAlt, setNewPhotoAlt] = useState('');
  const [newInfraTitle, setNewInfraTitle] = useState('');
  const [newInfraIcon, setNewInfraIcon] = useState('check');

  // Preset library picker state
  const [presetTargetField, setPresetTargetField] = useState<string | null>(null);
  const [presetTargetIndex, setPresetTargetIndex] = useState<number | null>(null);

  // Brochure upload and generation state
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [generatingBrochure, setGeneratingBrochure] = useState(false);

  // Project Hero Slideshow admin preview state
  const [projectPreviewSlide, setProjectPreviewSlide] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleAddProjectSlide = () => {
    if (!editingProject) return;
    const current = editingProject.heroSlides || [];
    const newSlide: HeroSlide = {
      id: `ps-${Date.now()}`,
      image: editingProject.heroImage || ASSETS.heroEntrance,
      alt: `${editingProject.name || 'Project'} Slide ${current.length + 1}`,
      caption: `${editingProject.name || 'Project'} — Feature Highlight`,
    };
    setEditingProject({
      ...editingProject,
      heroSlides: [...current, newSlide],
    });
    showToast('✓ New slide added to project slideshow!');
  };

  const handleRemoveProjectSlide = (idx: number) => {
    if (!editingProject) return;
    const current = [...(editingProject.heroSlides || [])];
    if (current.length <= 1) {
      showToast('Slideshow must have at least 1 slide.');
      return;
    }
    current.splice(idx, 1);
    setEditingProject({ ...editingProject, heroSlides: current });
    showToast('Slide removed.');
  };

  const handleMoveProjectSlide = (idx: number, direction: 'up' | 'down') => {
    if (!editingProject) return;
    const current = [...(editingProject.heroSlides || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[idx];
    current[idx] = current[targetIdx];
    current[targetIdx] = temp;
    setEditingProject({ ...editingProject, heroSlides: current });
  };

  const handleProjectSlideUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slideIdx: number
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;
    setCompressingTarget(`project-slide-${slideIdx}`);
    try {
      const optimizedUrl = await optimizeImageFile(file, 1920, 1080, 0.85);
      const updated = [...(editingProject.heroSlides || [])];
      if (updated[slideIdx]) {
        updated[slideIdx] = { ...updated[slideIdx], image: optimizedUrl };
        setEditingProject({ ...editingProject, heroSlides: updated });
        showToast(`✓ Slide #${slideIdx + 1} photo uploaded successfully!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to optimize slide photo.');
    } finally {
      setCompressingTarget(null);
      e.target.value = '';
    }
  };

  const handleOpenNew = () => {
    setIsNew(true);
    setActiveTab('basic');
    setEditingProject({
      id: `proj-${Date.now()}`,
      slug: `new-project-${Date.now()}`,
      name: '',
      marathiName: '',
      tagline: 'Your Space. Your Nature. Your Future.',
      shortDescription: '',
      longDescription: '',
      category: 'Nature-inspired plotted development',
      location: 'Mandangad, Ratnagiri, Maharashtra',
      status: 'Ready Possession',
      startingPrice: 'Contact for Price',
      priceUnit: 'Customizable Plots',
      plotSizes: '3 to 6 Guntha (3,267 - 6,534 sq.ft)',
      totalPlots: 50,
      availablePlots: 20,
      heroMode: 'text-and-image',
      heroSingleImage: ASSETS.heroEntrance,
      heroSingleImageAlt: '',
      heroSlideshowInterval: 5,
      heroOverlayDarkness: 75,
      heroSlides: [
        {
          id: `ps-1`,
          image: ASSETS.heroEntrance,
          caption: 'Grand Entrance & Welcome Gateway',
        },
        {
          id: `ps-2`,
          image: ASSETS.clubhouse,
          caption: 'Two-Story Clubhouse & Leisure Enclave',
        },
      ],
      heroImage: ASSETS.heroEntrance,
      thumbnail: ASSETS.heroEntrance,
      primaryCtaText: 'Schedule Private Site Visit',
      secondaryCtaText: 'Instant WhatsApp Inquiry',
      possessionStatus: 'Ready Possession with Clear NA Title',
      sanctionApproval: 'Collector Approved NA Layout',
      titleRegistration: 'Separate 7/12 Extract for Each Plot',
      reraNumber: 'Collector Approved NA Plotted Development',
      highlightsEyebrow: 'WHY INVEST',
      highlightsTitle: 'Project Highlights',
      keyHighlights: [
        'Collector Approved NA Plotted Layout',
        'Clear Title Property with Separate 7/12 for each plot',
        'Ready Possession with Gated Boundary',
        'Bank Loan Support from Leading Institutions',
      ],
      masterPlanEyebrow: 'PLANNED INFRASTRUCTURE',
      masterPlanTitle: 'Master Layout Plan',
      masterPlanSubtitle: 'Well Connected. Well Positioned.',
      masterPlanDescription:
        'Each plot has been master-planned to maximize natural ventilation, scenic hill vistas, and direct frontage on wide asphalt internal roads with street lights, underground cabling, and landscaped borders.',
      masterPlanImage: ASSETS.masterPlan,
      masterPlanFeatures: [
        '30ft Wide Main Internal Roads & Arterials',
        'Individual Water Supply & Power Points to Each Plot',
        'Central Clubhouse with Swimming Pool & Indoor Lounge',
        '5 Themed Landscaped Gardens & Stargazing Gazebos',
      ],
      masterPlanPdfUrl: '',
      masterPlanDownloadText: 'Download Master Plan Brochure',
      galleryEyebrow: 'GALLERY SHOWCASE',
      galleryTitle: 'Project Photos & Architecture',
      gallerySubtitle: 'Real glimpses of development progress, landscape and lifestyle.',
      galleryPhotos: [
        { id: `p-1`, title: 'Grand Entrance Gate at Twilight', image: ASSETS.heroEntrance, alt: 'Grand Entrance' },
        { id: `p-2`, title: 'Two-Story Clubhouse', image: ASSETS.clubhouse, alt: 'Clubhouse' },
        { id: `p-3`, title: 'Lush Botanical Gazebo Garden', image: ASSETS.gazeboGarden, alt: 'Gazebo Garden' },
        { id: `p-4`, title: 'Children Play & Activity Enclave', image: ASSETS.kidsPlay, alt: 'Kids Play' },
        { id: `p-5`, title: 'Indoor Sports & Billiards Lounge', image: ASSETS.indoorGames, alt: 'Indoor Lounge' },
        { id: `p-6`, title: 'Outdoor Badminton & Chess Arena', image: ASSETS.outdoorSports, alt: 'Outdoor Sports' },
      ],
      locationEyebrow: 'STRATEGIC LOCATION',
      locationTitle: 'Location Advantages',
      mapUrl:
        'https://maps.google.com/maps?q=Mandangad,Ratnagiri,Maharashtra&t=&z=11&ie=UTF8&iwloc=&output=embed',
      locationBenefits: [
        'Just 2 km from Mandangad Town center',
        'Direct touch to Pandharpur Highway (0 km)',
        'Close to Upcoming PAT MIDC (2 km)',
        '170 km scenic drive from Pune',
        '190 km smooth connectivity from Mumbai',
      ],
      lifestyleEyebrow: 'GREEN RETREAT',
      lifestyleTitle: 'Lifestyle Spaces',
      lifestyleSubtitle: 'Green Spaces for a Healthy, Happy & Harmonious Life.',
      lifestyleSpaces: [
        { id: `ls-1`, number: 1, title: 'Main Entrance & Gate', subtitle: 'Grand Welcome', image: ASSETS.heroEntrance },
        { id: `ls-2`, number: 2, title: 'Central Garden & Gazebos', subtitle: 'Lush Botanical Walkways', image: ASSETS.gazeboGarden },
      ],
      facilitiesEyebrow: 'RECREATION & WELLNESS',
      facilitiesTitle: 'Games & Club Facilities',
      facilitiesSubtitle: 'For Recreation. For Community. For You.',
      gamesFacilities: [
        {
          id: `gf-1`,
          categoryName: 'Club House',
          items: ['Lounge Area', 'Multipurpose Hall', 'Community Events'],
          image: ASSETS.clubhouse,
        },
      ],
      infraEyebrow: 'INFRASTRUCTURE',
      infraTitle: 'Quality Infrastructure',
      infraSubtitle: 'Hassle Free Living. Built for a Better Tomorrow.',
      infrastructure: [
        { id: 'i1', title: 'Wide Internal Roads', icon: 'road' },
        { id: 'i2', title: 'Electricity', icon: 'zap' },
        { id: 'i3', title: 'Water Supply', icon: 'droplet' },
        { id: 'i4', title: 'Street Lights', icon: 'lamp' },
      ],
      ctaBannerTag: 'LIMITED PLOTS AVAILABLE',
      ctaBannerTitle: 'Build Your Dream Home',
      ctaBannerText: 'Plots with Collector NA approval and Ready Possession.',
      ctaBannerButtonText: 'Book a Site Visit →',
      amenities: [],
      featured: false,
      displayOrder: projects.length + 1,
    });
  };

  const handleEdit = (project: Project) => {
    setIsNew(false);
    setActiveTab('basic');
    setEditingProject(JSON.parse(JSON.stringify(project)));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingProject || !editingProject.name) return;
    const published = await StoreService.saveProject(editingProject);
    showToast(
      published
        ? `✓ "${editingProject.name}" is live for every visitor.`
        : `Could not publish "${editingProject.name}". Other devices still show the previous version.`
    );
    if (published) {
      setEditingProject(null);
      setIsNew(false);
    }
  };

  const handleQuickSave = () => {
    if (!editingProject || !editingProject.name) return;
    StoreService.saveProject(editingProject);
    showToast(`✓ Photos saved live for "${editingProject.name}"!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      StoreService.deleteProject(id);
      showToast(`Project "${name}" deleted.`);
    }
  };

  const handleToggleFeatured = (project: Project) => {
    StoreService.saveProject({
      ...project,
      featured: !project.featured,
    });
    showToast(`"${project.name}" ${!project.featured ? 'is now featured on Homepage' : 'unfeatured'}.`);
  };

  const handleResetAmrutvan = () => {
    const amrutvanDefault = INITIAL_PROJECTS.find((p) => p.slug === 'amrutvan');
    if (amrutvanDefault && window.confirm('Reset Amrutvan project data to official brochure defaults?')) {
      StoreService.saveProject(JSON.parse(JSON.stringify(amrutvanDefault)));
      if (editingProject && editingProject.slug === 'amrutvan') {
        setEditingProject(JSON.parse(JSON.stringify(amrutvanDefault)));
      }
      showToast('Amrutvan restored to official brochure default photos & details.');
    }
  };

  // Brochure upload from computer & management handlers
  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;

    setUploadingBrochure(true);
    try {
      const res = await BrochureService.saveBrochureFile(editingProject.id, file);
      setEditingProject({
        ...editingProject,
        brochureFileName: res.fileName,
        brochureFileSize: res.fileSizeFormatted,
        brochureUploadDate: res.uploadDate,
        brochurePdfUrl: res.dataUrl || editingProject.brochurePdfUrl || res.fileName,
        masterPlanPdfFileName: res.fileName,
        masterPlanPdfFileSize: res.fileSizeFormatted,
        masterPlanPdfUploadDate: res.uploadDate,
        masterPlanPdfUrl: res.dataUrl || editingProject.masterPlanPdfUrl || res.fileName,
        masterPlanDownloadText:
          editingProject.masterPlanDownloadText || `Download ${editingProject.name} Brochure`,
        brochureDownloadText:
          editingProject.brochureDownloadText || `Download ${editingProject.name} Brochure`,
      });
      showToast(`✓ Official brochure "${res.fileName}" (${res.fileSizeFormatted}) uploaded successfully from your computer!`);
    } catch (err: any) {
      console.error('Failed to upload brochure:', err);
      showToast('Failed to save brochure file. Please try again.');
    } finally {
      setUploadingBrochure(false);
      e.target.value = '';
    }
  };

  const handleGenerateOfficialBrochure = async () => {
    if (!editingProject) return;
    setGeneratingBrochure(true);
    try {
      const res = await BrochureService.generateOfficialBrochurePdf(editingProject);
      setEditingProject({
        ...editingProject,
        brochureFileName: res.fileName,
        brochureFileSize: res.fileSizeFormatted,
        brochureUploadDate: res.uploadDate,
        brochurePdfUrl: res.dataUrl,
        masterPlanPdfFileName: res.fileName,
        masterPlanPdfFileSize: res.fileSizeFormatted,
        masterPlanPdfUploadDate: res.uploadDate,
        masterPlanPdfUrl: res.dataUrl,
        masterPlanDownloadText:
          editingProject.masterPlanDownloadText || `Download ${editingProject.name} Brochure`,
        brochureDownloadText:
          editingProject.brochureDownloadText || `Download ${editingProject.name} Brochure`,
      });
      showToast(`✓ Generated official Velora PDF brochure for "${editingProject.name}" (${res.fileSizeFormatted})!`);
    } catch (err: any) {
      console.error('Failed to generate brochure:', err);
      showToast('Error generating brochure PDF.');
    } finally {
      setGeneratingBrochure(false);
    }
  };

  const handleTestDownloadBrochure = async () => {
    if (!editingProject) return;
    try {
      showToast('Starting test download of brochure...');
      const res = await BrochureService.downloadProjectBrochure(editingProject);
      showToast(res.message);
    } catch (err: any) {
      showToast('Could not download brochure.');
    }
  };

  const handleRemoveBrochure = async () => {
    if (!editingProject) return;
    if (
      window.confirm(
        'Are you sure you want to remove the uploaded brochure? Customers will no longer be able to download this file.'
      )
    ) {
      await BrochureService.deleteBrochureFile(editingProject.id);
      setEditingProject({
        ...editingProject,
        brochureFileName: undefined,
        brochureFileSize: undefined,
        brochureUploadDate: undefined,
        brochurePdfUrl: undefined,
        masterPlanPdfFileName: undefined,
        masterPlanPdfFileSize: undefined,
        masterPlanPdfUploadDate: undefined,
        masterPlanPdfUrl: undefined,
      });
      showToast('Brochure file removed from project.');
    }
  };

  // High performance async image compressor & uploader
  const handleOptimizedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetIdentifier: string,
    maxWidth = 1600,
    maxHeight = 1000,
    onComplete: (optimizedDataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressingTarget(targetIdentifier);
    try {
      const optimized = await optimizeImageFile(file, maxWidth, maxHeight, 0.84);
      onComplete(optimized);
      const sizeKb = Math.round(optimized.length / 1024);
      showToast(`✓ Image optimized & uploaded (${sizeKb} KB)`);
    } catch (err: any) {
      console.warn('Image optimization fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) onComplete(result);
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressingTarget(null);
      e.target.value = '';
    }
  };

  // Apply chosen preset image
  const handleSelectPreset = (url: string) => {
    if (!presetTargetField) return;

    setEditingProject((prev) => {
      if (!prev) return null;
      if (presetTargetField === 'heroImage') {
        return { ...prev, heroImage: url };
      } else if (presetTargetField === 'heroSingleImage') {
        return { ...prev, heroSingleImage: url, heroImage: url };
      } else if (presetTargetField === 'projectSlide' && presetTargetIndex !== null) {
        const updated = [...(prev.heroSlides || [])];
        if (updated[presetTargetIndex]) {
          updated[presetTargetIndex] = { ...updated[presetTargetIndex], image: url };
        }
        return { ...prev, heroSlides: updated };
      } else if (presetTargetField === 'thumbnail') {
        return { ...prev, thumbnail: url };
      } else if (presetTargetField === 'masterPlanImage') {
        return { ...prev, masterPlanImage: url };
      } else if (presetTargetField === 'galleryPhoto' && presetTargetIndex !== null) {
        const updated = [...(prev.galleryPhotos || [])];
        if (updated[presetTargetIndex]) {
          updated[presetTargetIndex] = { ...updated[presetTargetIndex], image: url };
        }
        return { ...prev, galleryPhotos: updated };
      } else if (presetTargetField === 'lifestyleSpace' && presetTargetIndex !== null) {
        const updated = [...(prev.lifestyleSpaces || [])];
        if (updated[presetTargetIndex]) {
          updated[presetTargetIndex] = { ...updated[presetTargetIndex], image: url };
        }
        return { ...prev, lifestyleSpaces: updated };
      } else if (presetTargetField === 'facilityGroup' && presetTargetIndex !== null) {
        const updated = [...(prev.gamesFacilities || [])];
        if (updated[presetTargetIndex]) {
          updated[presetTargetIndex] = { ...updated[presetTargetIndex], image: url };
        }
        return { ...prev, gamesFacilities: updated };
      }
      return prev;
    });

    if (presetTargetField === 'newPhotoUrl') {
      setNewPhotoUrl(url);
    }

    showToast('✓ Photo updated from library preset.');
    setPresetTargetField(null);
    setPresetTargetIndex(null);
  };

  // Highlights handlers
  const handleAddHighlight = (text?: string) => {
    const value = (text || newHighlight).trim();
    if (!value || !editingProject) return;
    setEditingProject({
      ...editingProject,
      keyHighlights: [...(editingProject.keyHighlights || []), value],
    });
    if (!text) setNewHighlight('');
  };

  const handleUpdateHighlight = (index: number, value: string) => {
    if (!editingProject) return;
    const updated = [...(editingProject.keyHighlights || [])];
    updated[index] = value;
    setEditingProject({ ...editingProject, keyHighlights: updated });
  };

  const handleMoveHighlight = (index: number, direction: 'up' | 'down') => {
    if (!editingProject) return;
    const list = [...(editingProject.keyHighlights || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setEditingProject({ ...editingProject, keyHighlights: list });
  };

  const handleRemoveHighlight = (index: number) => {
    if (!editingProject) return;
    const updated = [...editingProject.keyHighlights];
    updated.splice(index, 1);
    setEditingProject({ ...editingProject, keyHighlights: updated });
  };

  // Location Benefits handlers
  const handleAddLocationBenefit = (text?: string) => {
    const value = (text || newLocationBenefit).trim();
    if (!value || !editingProject) return;
    setEditingProject({
      ...editingProject,
      locationBenefits: [...(editingProject.locationBenefits || []), value],
    });
    if (!text) setNewLocationBenefit('');
  };

  const handleUpdateLocationBenefit = (index: number, value: string) => {
    if (!editingProject) return;
    const updated = [...(editingProject.locationBenefits || [])];
    updated[index] = value;
    setEditingProject({ ...editingProject, locationBenefits: updated });
  };

  const handleMoveLocationBenefit = (index: number, direction: 'up' | 'down') => {
    if (!editingProject) return;
    const list = [...(editingProject.locationBenefits || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setEditingProject({ ...editingProject, locationBenefits: list });
  };

  const handleRemoveLocationBenefit = (index: number) => {
    if (!editingProject) return;
    const updated = [...(editingProject.locationBenefits || [])];
    updated.splice(index, 1);
    setEditingProject({ ...editingProject, locationBenefits: updated });
  };

  // Master Plan Features handlers
  const handleAddMasterPlanFeature = (text?: string) => {
    const value = (text || newMasterPlanFeature).trim();
    if (!value || !editingProject) return;
    setEditingProject({
      ...editingProject,
      masterPlanFeatures: [...(editingProject.masterPlanFeatures || []), value],
    });
    if (!text) setNewMasterPlanFeature('');
  };

  const handleUpdateMasterPlanFeature = (index: number, value: string) => {
    if (!editingProject) return;
    const updated = [...(editingProject.masterPlanFeatures || [])];
    updated[index] = value;
    setEditingProject({ ...editingProject, masterPlanFeatures: updated });
  };

  const handleMoveMasterPlanFeature = (index: number, direction: 'up' | 'down') => {
    if (!editingProject) return;
    const list = [...(editingProject.masterPlanFeatures || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setEditingProject({ ...editingProject, masterPlanFeatures: list });
  };

  const handleRemoveMasterPlanFeature = (index: number) => {
    if (!editingProject) return;
    const updated = [...(editingProject.masterPlanFeatures || [])];
    updated.splice(index, 1);
    setEditingProject({ ...editingProject, masterPlanFeatures: updated });
  };

  // Project Photos handlers
  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim() || !editingProject) return;
    const newPhoto: ProjectPhoto = {
      id: `p-${Date.now()}`,
      title: newPhotoTitle.trim() || 'Project Architecture Photo',
      image: newPhotoUrl.trim(),
      alt: newPhotoAlt.trim() || newPhotoTitle.trim() || 'Project Architecture Photo',
    };
    setEditingProject({
      ...editingProject,
      galleryPhotos: [...(editingProject.galleryPhotos || []), newPhoto],
    });
    setNewPhotoTitle('');
    setNewPhotoUrl('');
    setNewPhotoAlt('');
    showToast('New showcase photo added to gallery.');
  };

  const handleUpdatePhoto = (index: number, field: keyof ProjectPhoto, value: string) => {
    setEditingProject((prev) => {
      if (!prev) return null;
      const updated = [...(prev.galleryPhotos || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, galleryPhotos: updated };
    });
  };

  const handleMovePhoto = (index: number, direction: 'up' | 'down') => {
    setEditingProject((prev) => {
      if (!prev) return null;
      const list = [...(prev.galleryPhotos || [])];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, galleryPhotos: list };
    });
  };

  const handleRemovePhoto = (id: string) => {
    setEditingProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        galleryPhotos: (prev.galleryPhotos || []).filter((p) => p.id !== id),
      };
    });
    showToast('Photo removed from showcase gallery.');
  };

  // Infrastructure item handlers
  const handleAddInfra = () => {
    if (!newInfraTitle.trim() || !editingProject) return;
    setEditingProject({
      ...editingProject,
      infrastructure: [
        ...(editingProject.infrastructure || []),
        { id: `inf-${Date.now()}`, title: newInfraTitle.trim(), icon: newInfraIcon },
      ],
    });
    setNewInfraTitle('');
  };

  const handleRemoveInfra = (index: number) => {
    if (!editingProject) return;
    const updated = [...(editingProject.infrastructure || [])];
    updated.splice(index, 1);
    setEditingProject({ ...editingProject, infrastructure: updated });
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-70 bg-[#00291E] border border-[#C9A24A] text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-7 h-7 rounded-full bg-[#C9A24A] text-[#00291E] flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <p className="text-xs font-medium text-[#F8F0D8]">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-2xl text-[#00291E]">Project Management</h2>
            <span className="bg-[#C9A24A]/20 text-[#00291E] font-semibold text-[11px] px-2.5 py-0.5 rounded-full border border-[#C9A24A]/40">
              {projects.length} Active Developments
            </span>
          </div>
          <p className="text-xs text-[#26342D]/70 font-light mt-0.5">
            Complete real-time control over each and every section, photo, highlight, master plan, and location detail on individual project pages like{' '}
            <code className="bg-white/60 px-1.5 py-0.5 rounded text-[#00291E] font-mono">/projects/amrutvan</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetAmrutvan}
            className="bg-white/80 hover:bg-white text-[#00291E] border border-[#C9A24A]/40 font-semibold text-xs tracking-wider px-3.5 py-2.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
            title="Reset Amrutvan to official brochure default data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C9A24A]" />
            <span>Reset Amrutvan</span>
          </button>

          <button
            onClick={handleOpenNew}
            className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-semibold text-xs tracking-wider uppercase px-4 py-2.5 rounded shadow flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-[#FFF8E7] rounded-xl overflow-hidden border border-[#C9A24A]/30 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-[#00291E]">
                <img
                  src={proj.thumbnail || proj.heroImage}
                  alt={proj.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#00291E]/90 text-[#C9A24A] text-xs font-semibold px-2.5 py-1 rounded">
                  {proj.status}
                </div>
                {proj.featured && (
                  <div className="absolute top-3 right-3 bg-[#C9A24A] text-[#00291E] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured on Home</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl text-[#00291E] font-medium">{proj.name}</h3>
                      {proj.marathiName && (
                        <span className="text-sm text-[#C9A24A] font-serif font-normal">
                          ({proj.marathiName})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#0B4A36] font-medium">{proj.category}</p>
                  </div>
                  <span className="text-xs text-[#26342D]/60 font-mono">
                    {proj.availablePlots} / {proj.totalPlots} Plots Left
                  </span>
                </div>

                <p className="text-xs text-[#26342D]/80 mt-3 line-clamp-2 font-light">
                  {proj.longDescription || proj.shortDescription}
                </p>

                <div className="mt-4 pt-3 border-t border-[#C9A24A]/15 grid grid-cols-2 gap-2 text-xs text-[#26342D]/70">
                  <div>
                    <span className="text-[10px] uppercase text-[#0B4A36] block font-semibold">Location</span>
                    <span className="truncate block font-medium text-[#00291E]">{proj.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#0B4A36] block font-semibold">Plot Sizes</span>
                    <span className="truncate block font-medium text-[#00291E]">{proj.plotSizes}</span>
                  </div>
                </div>

                {/* Badges Overview */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                  <span className="bg-[#F8F0D8] px-2 py-0.5 rounded text-[#00291E] border border-[#C9A24A]/20">
                    📷 {proj.galleryPhotos?.length || 0} Photos
                  </span>
                  <span className="bg-[#F8F0D8] px-2 py-0.5 rounded text-[#00291E] border border-[#C9A24A]/20">
                    ✓ {proj.keyHighlights?.length || 0} Highlights
                  </span>
                  <span className="bg-[#F8F0D8] px-2 py-0.5 rounded text-[#00291E] border border-[#C9A24A]/20">
                    📐 Master Plan: {proj.masterPlanFeatures?.length || 0} Features
                  </span>
                  <span className="bg-[#F8F0D8] px-2 py-0.5 rounded text-[#00291E] border border-[#C9A24A]/20">
                    📍 {proj.locationBenefits?.length || 0} Location Benefits
                  </span>
                  <span className="bg-[#F8F0D8] px-2 py-0.5 rounded text-[#00291E] border border-[#C9A24A]/20">
                    🌿 {proj.lifestyleSpaces?.length || 0} Lifestyle Spaces
                  </span>
                  <span className="bg-[#F8F0D8] px-2 py-0.5 rounded text-[#00291E] border border-[#C9A24A]/20">
                    🎳 {proj.gamesFacilities?.length || 0} Facilities
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded border text-[10px] flex items-center gap-1 ${
                      proj.brochureFileName || proj.masterPlanPdfFileName || proj.masterPlanPdfUrl
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-semibold'
                        : 'bg-[#F8F0D8] text-[#00291E]/60 border-[#C9A24A]/20'
                    }`}
                  >
                    📄 Brochure: {proj.brochureFileName || proj.masterPlanPdfFileName || (proj.masterPlanPdfUrl ? 'PDF Active' : 'Not Uploaded')}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#F8F0D8] border-t border-[#C9A24A]/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleFeatured(proj)}
                className={`text-xs flex items-center gap-1 font-medium transition-colors ${
                  proj.featured ? 'text-[#C9A24A] font-semibold' : 'text-[#26342D]/60 hover:text-[#00291E]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${proj.featured ? 'fill-current' : ''}`} />
                <span>{proj.featured ? 'Featured on Home' : 'Set as Featured'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`/projects/${proj.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 text-xs text-[#00291E] hover:text-[#C9A24A] bg-[#FFF8E7] rounded border border-[#C9A24A]/30 transition-colors flex items-center gap-1 font-medium"
                  title="View Public Page"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Page</span>
                </a>
                <button
                  onClick={() => handleEdit(proj)}
                  className="px-3 py-1.5 text-xs text-[#00291E] hover:bg-[#C9A24A] bg-[#C9A24A]/20 rounded border border-[#C9A24A]/50 transition-colors flex items-center gap-1 font-semibold"
                  title="Edit All Details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </button>
                <button
                  onClick={() => handleDelete(proj.id, proj.name)}
                  className="p-1.5 text-red-600 hover:text-red-800 bg-[#FFF8E7] rounded border border-red-200 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comprehensive Multi-Tab Project Editor Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#00291E] text-white rounded-2xl border border-[#C9A24A]/50 max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#001D15] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C9A24A]/20 border border-[#C9A24A]/40 flex items-center justify-center text-[#C9A24A]">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A24A]">
                      {isNew ? 'New Project Setup' : 'Full Project Page Editor'}
                    </span>
                    <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded font-mono">
                      /projects/{editingProject.slug}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#F8F0D8] font-normal flex items-center gap-2">
                    <span>{editingProject.name || 'Untitled Project'}</span>
                    {editingProject.marathiName && (
                      <span className="text-base text-[#C9A24A] font-serif">
                        ({editingProject.marathiName})
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/projects/${editingProject.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#C9A24A] text-xs rounded transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Live Page</span>
                </a>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center overflow-x-auto bg-[#00241A] px-4 border-b border-white/10 text-xs shrink-0 scrollbar-none">
              {[
                { id: 'basic', label: '1. Hero & Basic' },
                { id: 'specs', label: '2. Key Specs Bar' },
                { id: 'photos', label: `3. Photos (${editingProject.galleryPhotos?.length || 0})` },
                { id: 'highlights', label: `4. Highlights (${editingProject.keyHighlights?.length || 0})` },
                {
                  id: 'masterplan',
                  label: `5. Master Plan & Brochure${
                    editingProject.brochureFileName || editingProject.masterPlanPdfFileName ? ' (PDF ✓)' : ''
                  }`,
                },
                { id: 'location', label: `6. Location (${editingProject.locationBenefits?.length || 0})` },
                { id: 'lifestyle', label: `7. Lifestyle Spaces (${editingProject.lifestyleSpaces?.length || 0})` },
                { id: 'facilities', label: `8. Facilities (${editingProject.gamesFacilities?.length || 0})` },
                { id: 'infra', label: '9. Infra & CTA' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-3 whitespace-nowrap font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-[#C9A24A] text-[#C9A24A] bg-white/5 font-semibold'
                      : 'border-transparent text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tabbed Content Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: HERO & BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20">
                    <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 1: Hero Banner Information</span>
                    <p className="text-white/60 text-[11px]">
                      Configure the project name, marathi translation, hero banner description, tagline, and call-to-action buttons.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Project Name *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.name}
                        onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Marathi / Regional Name (displayed under title)</label>
                      <input
                        type="text"
                        placeholder="e.g. अमृतवन"
                        value={editingProject.marathiName || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, marathiName: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">URL Route / Slug *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.slug}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none font-mono"
                      />
                      <span className="text-[10px] text-white/40 mt-0.5 block">
                        Will be live at <code className="text-[#C9A24A]">/projects/{editingProject.slug}</code>
                      </span>
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Category Badge</label>
                      <input
                        type="text"
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-semibold">Tagline / Slogan (rendered in italics on Hero)</label>
                    <input
                      type="text"
                      value={editingProject.tagline}
                      onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                      className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-semibold">
                      Long Description (Main introductory paragraph on the Hero Banner)
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.longDescription}
                      onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                      className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2.5 text-white outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-semibold">
                      Short Description (For cards on Homepage & Catalog)
                    </label>
                    <textarea
                      rows={2}
                      value={editingProject.shortDescription}
                      onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                      className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2.5 text-white outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Primary CTA Button Label (Hero)</label>
                      <input
                        type="text"
                        placeholder="Schedule Private Site Visit"
                        value={editingProject.primaryCtaText || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, primaryCtaText: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Secondary WhatsApp Button Label (Hero)</label>
                      <input
                        type="text"
                        placeholder="Instant WhatsApp Inquiry"
                        value={editingProject.secondaryCtaText || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, secondaryCtaText: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    <input
                      type="checkbox"
                      id="featToggle"
                      checked={editingProject.featured}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#C9A24A]"
                    />
                    <label htmlFor="featToggle" className="text-white/90 cursor-pointer font-medium">
                      Display as Featured Project on Velora Homepage Marquee
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: KEY SPECS BAR (4 Cards) */}
              {activeTab === 'specs' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20">
                    <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 2: Key Specifications Bar (4 Gold Columns)</span>
                    <p className="text-white/60 text-[11px]">
                      These 4 metrics appear directly below the Hero Banner in the horizontal green band.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">1. Plot Sizes *</label>
                      <input
                        type="text"
                        value={editingProject.plotSizes}
                        onChange={(e) => setEditingProject({ ...editingProject, plotSizes: e.target.value })}
                        placeholder="e.g. 3 to 6 Guntha (3,267 - 6,534 sq.ft)"
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">2. Sanction & Government Approval</label>
                      <input
                        type="text"
                        placeholder="e.g. Collector Approved NA Layout"
                        value={editingProject.sanctionApproval || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, sanctionApproval: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">3. Possession Status</label>
                      <input
                        type="text"
                        placeholder="e.g. Ready Possession with Clear NA Title"
                        value={editingProject.possessionStatus}
                        onChange={(e) => setEditingProject({ ...editingProject, possessionStatus: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">4. Title & Registration</label>
                      <input
                        type="text"
                        placeholder="e.g. Separate 7/12 Extract for Each Plot"
                        value={editingProject.titleRegistration || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, titleRegistration: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Total Plots</label>
                      <input
                        type="number"
                        value={editingProject.totalPlots}
                        onChange={(e) => setEditingProject({ ...editingProject, totalPlots: Number(e.target.value) })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Available Plots</label>
                      <input
                        type="number"
                        value={editingProject.availablePlots}
                        onChange={(e) => setEditingProject({ ...editingProject, availablePlots: Number(e.target.value) })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Development Status</label>
                      <select
                        value={editingProject.status}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      >
                        <option value="Ready Possession">Ready Possession</option>
                        <option value="Under Development">Under Development</option>
                        <option value="Pre-Launch">Pre-Launch</option>
                        <option value="Sold Out">Sold Out</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">RERA / Sanction Number</label>
                      <input
                        type="text"
                        placeholder="e.g. P52800051234 (Collector Approved NA)"
                        value={editingProject.reraNumber || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, reraNumber: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Starting Price / Unit</label>
                      <input
                        type="text"
                        placeholder="e.g. Contact for Price / Customizable Plots"
                        value={editingProject.startingPrice || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, startingPrice: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECT PHOTOS & IMAGERY */}
              {activeTab === 'photos' && (
                <div className="space-y-6 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 3 & 5: Project Photos, Hero Image & Architecture Gallery</span>
                      <p className="text-white/60 text-[11px]">
                        Upload or change any photo instantly from your computer or select from Velora's high-res asset library.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={handleQuickSave}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#C9A24A] border border-[#C9A24A]/40 font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 transition-all"
                        title="Save photos and keep editing"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Photos</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave()}
                        className="px-4 py-2 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs uppercase tracking-wider rounded shadow flex items-center gap-1.5 transition-all active:scale-[0.98]"
                        title="Save all changes and close modal"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save & Close</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. PROJECT HERO BANNER & DISPLAY FORMATS */}
                  <div className="bg-[#001D15] p-5 rounded-xl border border-white/15 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                          PROJECT PAGE TOP BANNER
                        </span>
                        <h4 className="font-serif text-base text-[#F8F0D8] font-medium flex items-center gap-2">
                          <span>1. Project Hero Display Mode & Imagery</span>
                        </h4>
                        <p className="text-xs text-white/60 font-light mt-0.5">
                          Choose whether this project page displays a full text & image banner, a single image-only banner, or an auto-rotating slideshow carousel.
                        </p>
                      </div>
                    </div>

                    {/* HERO DISPLAY FORMAT SELECTOR (3 OPTIONS) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                        Select Project Hero Display Format
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Option 1: Text & Image Banner (Default) */}
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, heroMode: 'text-and-image' })}
                          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all ${
                            (editingProject.heroMode || 'text-and-image') === 'text-and-image'
                              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                              : 'bg-black/30 text-white/80 border-white/20 hover:border-[#C9A24A]/60'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C9A24A]/20 text-[#C9A24A]">
                              Option 1
                            </span>
                            {(editingProject.heroMode || 'text-and-image') === 'text-and-image' && (
                              <Check className="w-4 h-4 text-[#C9A24A]" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-serif text-sm font-semibold text-white">Text & Image Banner</h5>
                            <p className="text-[10px] mt-0.5 text-white/70 leading-relaxed">
                              Current style: Grand title, status, tagline quote, narrative description, and dual CTA buttons over photo.
                            </p>
                            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#C9A24A]">
                              <span className="font-mono font-semibold">1920 × 1080 px</span>
                              <span className="opacity-75">16:9 • Max 2.5 MB</span>
                            </div>
                          </div>
                        </button>

                        {/* Option 2: Single Hero Banner (Image Only) */}
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, heroMode: 'single-image' })}
                          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all ${
                            editingProject.heroMode === 'single-image'
                              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                              : 'bg-black/30 text-white/80 border-white/20 hover:border-[#C9A24A]/60'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C9A24A]/20 text-[#C9A24A]">
                              Option 2
                            </span>
                            {editingProject.heroMode === 'single-image' && (
                              <Check className="w-4 h-4 text-[#C9A24A]" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-serif text-sm font-semibold text-white">Single Banner (Image Only)</h5>
                            <p className="text-[10px] mt-0.5 text-white/70 leading-relaxed">
                              Clean, edge-to-edge full-bleed promotional poster banner with floating back navigation and action badges.
                            </p>
                            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#C9A24A]">
                              <span className="font-mono font-semibold">1920 × 1080 px</span>
                              <span className="opacity-75">16:9 • Max 2.5 MB</span>
                            </div>
                          </div>
                        </button>

                        {/* Option 3: Slide Show Banner (Image Only Carousel) */}
                        <button
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, heroMode: 'slideshow-image' })}
                          className={`p-3.5 rounded-xl border text-left flex flex-col justify-between gap-2.5 transition-all ${
                            editingProject.heroMode === 'slideshow-image'
                              ? 'bg-[#00291E] text-white border-[#C9A24A] shadow-md ring-2 ring-[#C9A24A]/30'
                              : 'bg-black/30 text-white/80 border-white/20 hover:border-[#C9A24A]/60'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#C9A24A]/20 text-[#C9A24A]">
                              Option 3
                            </span>
                            {editingProject.heroMode === 'slideshow-image' && (
                              <Check className="w-4 h-4 text-[#C9A24A]" />
                            )}
                          </div>
                          <div>
                            <h5 className="font-serif text-sm font-semibold text-white">Slide Show Banner (Multi-Image)</h5>
                            <p className="text-[10px] mt-0.5 text-white/70 leading-relaxed">
                              Auto-rotating multi-slide showcase of estate photos with smooth transitions, arrows, and dot indicators.
                            </p>
                            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#C9A24A]">
                              <span className="font-mono font-semibold">1920 × 1080 px / slide</span>
                              <span className="opacity-75">16:9 • Max 2.5 MB</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* DIMENSION SPECIFICATION BANNER FOR PROJECT HERO */}
                    <ImageDimensionBadge
                      variant="dark"
                      context={
                        editingProject.heroMode === 'single-image'
                          ? `${editingProject.name} Single Banner`
                          : editingProject.heroMode === 'slideshow-image'
                          ? `${editingProject.name} Slideshow Slides`
                          : `${editingProject.name} Hero Background`
                      }
                      dimensions="1920 × 1080 px"
                      aspectRatio="16:9 (Widescreen Landscape)"
                      maxSize="2.5 MB"
                      formats="JPG, PNG, WebP"
                    />

                    {/* ========================================================
                        SUB-SECTION A: TEXT & IMAGE MODE CONTROLS
                        ======================================================== */}
                    {(editingProject.heroMode || 'text-and-image') === 'text-and-image' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#C9A24A]">
                            Hero Background Photo & Text Contrast
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
                              {compressingTarget === 'heroImage' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={compressingTarget === 'heroImage'}
                                onChange={(e) =>
                                  handleOptimizedImageUpload(e, 'heroImage', 1920, 1080, (url) =>
                                    setEditingProject((prev) => (prev ? { ...prev, heroImage: url } : null))
                                  )
                                }
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setPresetTargetField('heroImage');
                                setPresetTargetIndex(null);
                              }}
                              className="text-xs bg-white/10 hover:bg-white/20 text-[#C9A24A] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                              <span>Presets</span>
                            </button>
                          </div>
                        </div>

                        {/* Live Preview Box with Headline Overlay simulation */}
                        <div className="relative rounded-xl overflow-hidden aspect-[21/9] sm:aspect-[16/7] bg-[#001D15] border border-[#C9A24A]/40 shadow-inner">
                          <img
                            src={editingProject.heroImage || ASSETS.heroEntrance}
                            alt="Project Hero Live Preview"
                            className="w-full h-full object-cover"
                          />
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-[#00291E] via-[#00291E]/90 to-transparent"
                            style={{
                              opacity: (editingProject.heroOverlayDarkness !== undefined ? editingProject.heroOverlayDarkness : 75) / 100,
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#00291E] via-transparent to-black/30" />

                          <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 max-w-lg text-white pointer-events-none pr-4">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A24A] block mb-1">
                              {editingProject.category || 'Nature-inspired plotted development'}
                            </span>
                            <h4 className="font-serif text-xl sm:text-3xl font-normal leading-tight">
                              {editingProject.name || 'Project Name'}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-white/80 mt-1 line-clamp-2 font-light italic">
                              "{editingProject.tagline || 'Your Space. Your Nature. Your Future.'}"
                            </p>
                          </div>

                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                            1920 × 1080 px (16:9)
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1 text-xs">
                          <div className="sm:col-span-7">
                            <label className="block text-white/80 font-semibold mb-1">
                              Hero Photo URL or Base64 Data
                            </label>
                            <input
                              type="text"
                              value={editingProject.heroImage || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, heroImage: e.target.value })}
                              className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white font-mono text-[11px] outline-none"
                            />
                          </div>

                          <div className="sm:col-span-5 bg-[#00291E]/80 p-3 rounded-lg border border-[#C9A24A]/25">
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-white font-semibold flex items-center gap-1.5 text-xs">
                                <Sliders className="w-3.5 h-3.5 text-[#C9A24A]" />
                                <span>Text Contrast Overlay</span>
                              </label>
                              <span className="font-mono text-xs font-bold text-[#C9A24A]">
                                {editingProject.heroOverlayDarkness !== undefined ? editingProject.heroOverlayDarkness : 75}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="40"
                              max="95"
                              step="5"
                              value={editingProject.heroOverlayDarkness !== undefined ? editingProject.heroOverlayDarkness : 75}
                              onChange={(e) => setEditingProject({ ...editingProject, heroOverlayDarkness: parseInt(e.target.value, 10) })}
                              className="w-full accent-[#C9A24A] cursor-pointer"
                            />
                            <span className="text-[10px] text-white/60 block mt-0.5">
                              Keep headline text readable over lighter photos.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================
                        SUB-SECTION B: SINGLE HERO BANNER (IMAGE ONLY)
                        ======================================================== */}
                    {editingProject.heroMode === 'single-image' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-[#C9A24A] block">
                              Single Hero Banner Image (Image Only)
                            </span>
                            <span className="text-[11px] text-white/60 font-light">
                              Displays full-width on the project page with floating navigation & badges.
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
                              {compressingTarget === 'heroSingleImage' ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload Banner</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={compressingTarget === 'heroSingleImage'}
                                onChange={(e) =>
                                  handleOptimizedImageUpload(e, 'heroSingleImage', 1920, 1080, (url) =>
                                    setEditingProject((prev) => (prev ? { ...prev, heroSingleImage: url, heroImage: url } : null))
                                  )
                                }
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setPresetTargetField('heroSingleImage');
                                setPresetTargetIndex(null);
                              }}
                              className="text-xs bg-white/10 hover:bg-white/20 text-[#C9A24A] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 transition-colors"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                              <span>Presets</span>
                            </button>
                          </div>
                        </div>

                        {/* Single Banner Live Preview */}
                        <div className="relative rounded-xl overflow-hidden aspect-[21/9] sm:aspect-[16/7] bg-[#001D15] border border-[#C9A24A]/40 shadow-inner">
                          <img
                            src={editingProject.heroSingleImage || editingProject.heroImage || ASSETS.heroEntrance}
                            alt={editingProject.heroSingleImageAlt || editingProject.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#00291E]/70 via-transparent to-black/30 pointer-events-none" />

                          <div className="absolute top-3 left-3 bg-[#00291E]/90 text-[#C9A24A] border border-[#C9A24A]/40 text-[10px] font-bold px-2.5 py-1 rounded shadow">
                            SINGLE BANNER (IMAGE ONLY)
                          </div>

                          <div className="absolute bottom-3 left-4 text-white">
                            <span className="font-serif text-lg font-normal drop-shadow">{editingProject.name}</span>
                          </div>

                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                            1920 × 1080 px (16:9)
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                          <div>
                            <label className="block text-white/80 font-semibold mb-1">
                              Banner Image URL / Data
                            </label>
                            <input
                              type="text"
                              value={editingProject.heroSingleImage || editingProject.heroImage || ''}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  heroSingleImage: e.target.value,
                                  heroImage: e.target.value,
                                })
                              }
                              placeholder="https://... or upload photo"
                              className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white font-mono text-[11px] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 font-semibold mb-1">
                              Banner Alt Text (SEO & Accessibility)
                            </label>
                            <input
                              type="text"
                              value={editingProject.heroSingleImageAlt || ''}
                              onChange={(e) =>
                                setEditingProject({ ...editingProject, heroSingleImageAlt: e.target.value })
                              }
                              placeholder={`e.g. ${editingProject.name} Scenic Panoramic Overview`}
                              className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ========================================================
                        SUB-SECTION C: SLIDESHOW BANNER (MULTI-IMAGE CAROUSEL)
                        ======================================================== */}
                    {editingProject.heroMode === 'slideshow-image' && (
                      <div className="space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#00291E]/70 p-4 rounded-xl border border-[#C9A24A]/30">
                          <div>
                            <span className="text-xs font-semibold text-[#C9A24A] block">
                              Slideshow Rotation Timer & Controls
                            </span>
                            <span className="text-[11px] text-white/60 font-light">
                              Banners auto-advance smoothly on the project page with navigation arrows & dot indicators.
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#C9A24A]" />
                              <span className="text-xs font-medium text-white">Interval:</span>
                              <select
                                value={editingProject.heroSlideshowInterval || 5}
                                onChange={(e) =>
                                  setEditingProject({
                                    ...editingProject,
                                    heroSlideshowInterval: Number(e.target.value) || 5,
                                  })
                                }
                                className="bg-[#001D15] border border-[#C9A24A]/40 rounded px-2.5 py-1 text-xs text-white outline-none"
                              >
                                <option value={3}>3 seconds (Fast)</option>
                                <option value={4}>4 seconds</option>
                                <option value={5}>5 seconds (Recommended)</option>
                                <option value={7}>7 seconds</option>
                                <option value={10}>10 seconds</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={handleAddProjectSlide}
                              className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs px-3.5 py-1.5 rounded shadow flex items-center gap-1.5 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Slide</span>
                            </button>
                          </div>
                        </div>

                        {/* Project Slideshow Live Preview Simulator */}
                        {editingProject.heroSlides && editingProject.heroSlides.length > 0 && (
                          <div className="relative rounded-xl overflow-hidden aspect-[21/9] sm:aspect-[16/7] bg-black border border-[#C9A24A]/40 shadow-inner group">
                            {(() => {
                              const activeIdx = projectPreviewSlide % editingProject.heroSlides.length;
                              const slide = editingProject.heroSlides[activeIdx];
                              return (
                                <>
                                  <img
                                    src={slide.image}
                                    alt={slide.caption || 'Slide Preview'}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#00291E]/80 via-transparent to-black/20 pointer-events-none" />

                                  <div className="absolute top-3 left-3 bg-[#00291E]/90 text-[#C9A24A] border border-[#C9A24A]/40 text-[10px] font-bold px-2.5 py-1 rounded shadow">
                                    PROJECT SLIDESHOW: SLIDE #{activeIdx + 1} OF {editingProject.heroSlides.length}
                                  </div>

                                  {slide.caption && (
                                    <div className="absolute bottom-5 left-6 bg-[#00291E]/90 border border-[#C9A24A]/30 text-white font-serif text-xs sm:text-sm px-3.5 py-1.5 rounded-lg shadow-lg">
                                      {slide.caption}
                                    </div>
                                  )}

                                  {/* Left / Right preview controls */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setProjectPreviewSlide((prev) =>
                                        prev === 0 ? editingProject.heroSlides!.length - 1 : prev - 1
                                      )
                                    }
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20"
                                  >
                                    <ChevronLeft className="w-4 h-4 text-[#C9A24A]" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setProjectPreviewSlide((prev) => (prev + 1) % editingProject.heroSlides!.length)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20"
                                  >
                                    <ChevronRight className="w-4 h-4 text-[#C9A24A]" />
                                  </button>

                                  {/* Dots indicator */}
                                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-white/10">
                                    {editingProject.heroSlides.map((_, dotI) => (
                                      <span
                                        key={dotI}
                                        className={`rounded-full transition-all ${
                                          dotI === activeIdx ? 'w-5 h-1.5 bg-[#C9A24A]' : 'w-1.5 h-1.5 bg-white/50'
                                        }`}
                                      />
                                    ))}
                                  </div>

                                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                                    1920 × 1080 px (16:9)
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {/* Individual Project Slides Editor List */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-white uppercase tracking-wider block">
                            Manage Project Slides ({editingProject.heroSlides?.length || 0})
                          </span>

                          {(editingProject.heroSlides || []).map((slide, sIdx) => (
                            <div
                              key={slide.id || sIdx}
                              className="bg-[#00291E]/60 p-4 rounded-xl border border-white/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                            >
                              <div className="flex items-center gap-3.5 w-full md:w-auto">
                                {/* Slide Thumbnail */}
                                <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-black border border-[#C9A24A]/40 shrink-0">
                                  <img
                                    src={slide.image}
                                    alt={`Slide ${sIdx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <span className="absolute bottom-1 left-1 bg-black/80 text-[#C9A24A] text-[9px] font-mono px-1 rounded">
                                    #{sIdx + 1}
                                  </span>
                                </div>

                                <div className="flex-1 min-w-0 space-y-1.5 text-xs">
                                  <div>
                                    <input
                                      type="text"
                                      value={slide.caption || ''}
                                      onChange={(e) => {
                                        const updated = [...(editingProject.heroSlides || [])];
                                        updated[sIdx] = { ...updated[sIdx], caption: e.target.value };
                                        setEditingProject({ ...editingProject, heroSlides: updated });
                                      }}
                                      placeholder="Optional slide caption / subtitle..."
                                      className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1 text-xs text-white outline-none"
                                    />
                                  </div>

                                  <div className="flex items-center gap-2 pt-0.5">
                                    <span className="text-[10px] font-mono font-semibold text-[#C9A24A] bg-[#C9A24A]/20 px-2 py-0.5 rounded border border-[#C9A24A]/30">
                                      1920 × 1080 px (16:9)
                                    </span>
                                    <span className="text-[10px] text-white/60 font-light">
                                      Max 2.5 MB • JPG/PNG/WebP
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions for slide */}
                              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                                <label className="cursor-pointer text-[11px] bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-2.5 py-1.5 rounded shadow flex items-center gap-1 transition-all">
                                  {compressingTarget === `project-slide-${sIdx}` ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Upload className="w-3 h-3" />
                                  )}
                                  <span>Upload</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={compressingTarget === `project-slide-${sIdx}`}
                                    onChange={(e) => handleProjectSlideUpload(e, sIdx)}
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPresetTargetField('projectSlide');
                                    setPresetTargetIndex(sIdx);
                                  }}
                                  className="text-[11px] bg-white/10 hover:bg-white/20 border border-[#C9A24A]/40 text-[#C9A24A] px-2.5 py-1.5 rounded flex items-center gap-1 font-semibold"
                                >
                                  <Sparkles className="w-3 h-3 text-[#C9A24A]" />
                                  <span>Preset</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleMoveProjectSlide(sIdx, 'up')}
                                  disabled={sIdx === 0}
                                  className="p-1.5 bg-white/10 border border-white/20 rounded text-white disabled:opacity-30 hover:bg-white/20"
                                  title="Move slide up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleMoveProjectSlide(sIdx, 'down')}
                                  disabled={sIdx === (editingProject.heroSlides?.length || 0) - 1}
                                  className="p-1.5 bg-white/10 border border-white/20 rounded text-white disabled:opacity-30 hover:bg-white/20"
                                  title="Move slide down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveProjectSlide(sIdx)}
                                  className="p-1.5 bg-red-950/40 border border-red-800/40 rounded text-red-400 hover:text-red-300"
                                  title="Delete slide"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. CARD THUMBNAIL (PROJECT LISTING) */}
                  <div className="bg-[#001D15] p-5 rounded-xl border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A24A] block">
                          PROJECT LISTING & HOMEPAGE CARD
                        </span>
                        <h4 className="font-serif text-base text-[#F8F0D8] font-medium">
                          2. Project Card Thumbnail
                        </h4>
                        <p className="text-xs text-white/60 font-light mt-0.5">
                          Shown on the projects catalog page and in the featured project card on the homepage.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer text-xs bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1.5 rounded shadow flex items-center gap-1.5 transition-all">
                          {compressingTarget === 'thumbnail' ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5" />
                          )}
                          <span>Upload Thumbnail</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={compressingTarget === 'thumbnail'}
                            onChange={(e) =>
                              handleOptimizedImageUpload(e, 'thumbnail', 900, 600, (url) =>
                                setEditingProject((prev) => (prev ? { ...prev, thumbnail: url } : null))
                              )
                            }
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setPresetTargetField('thumbnail');
                            setPresetTargetIndex(null);
                          }}
                          className="text-xs bg-white/10 hover:bg-white/20 text-[#C9A24A] border border-[#C9A24A]/40 font-semibold px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                          <span>Presets</span>
                        </button>
                      </div>
                    </div>

                    <ImageDimensionBadge
                      variant="dark"
                      context="Card Thumbnail"
                      dimensions="800 × 533 px"
                      aspectRatio="3:2 (Landscape)"
                      maxSize="800 KB"
                      formats="JPG, PNG, WebP"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-5 aspect-[16/10] rounded-lg overflow-hidden border border-white/20 bg-black relative">
                        <img
                          src={editingProject.thumbnail || ASSETS.heroEntrance}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] text-white/90">
                          Listing Thumbnail Live Preview
                        </span>
                      </div>

                      <div className="sm:col-span-7">
                        <label className="block text-white/80 font-semibold mb-1 text-xs">
                          Thumbnail Image URL
                        </label>
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={editingProject.thumbnail}
                          onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                          className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Gallery Section Custom Headers */}
                  <div className="p-4 bg-[#001D15] rounded-xl border border-white/10 space-y-3">
                    <span className="text-[#C9A24A] font-semibold block text-xs">Showcase Gallery Section Headers</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-white/70 text-[11px] mb-1">Eyebrow Tag</label>
                        <input
                          type="text"
                          value={editingProject.galleryEyebrow || ''}
                          placeholder="GALLERY SHOWCASE"
                          onChange={(e) => setEditingProject({ ...editingProject, galleryEyebrow: e.target.value })}
                          className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-[11px] mb-1">Section Title</label>
                        <input
                          type="text"
                          value={editingProject.galleryTitle || ''}
                          placeholder="Project Photos & Architecture"
                          onChange={(e) => setEditingProject({ ...editingProject, galleryTitle: e.target.value })}
                          className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-[11px] mb-1">Section Subtitle</label>
                        <input
                          type="text"
                          value={editingProject.gallerySubtitle || ''}
                          placeholder="Real glimpses of development progress..."
                          onChange={(e) => setEditingProject({ ...editingProject, gallerySubtitle: e.target.value })}
                          className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Current Showcase Photos List (Every Photo Can Be Uploaded / Changed / Presets) */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-serif text-base text-[#F8F0D8] font-normal">
                          Current Showcase Photos ({editingProject.galleryPhotos?.length || 0})
                        </h4>
                        <p className="text-[11px] text-white/60">
                          Each photo below has its own direct "Upload Photo" button, library preset chooser, and editable title.
                        </p>
                      </div>
                      <ImageDimensionBadge
                        variant="dark"
                        dimensions="1200 × 800 px"
                        aspectRatio="3:2 Landscape"
                        maxSize="1.5 MB"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(editingProject.galleryPhotos || []).map((photo, pIdx) => (
                        <div
                          key={photo.id || pIdx}
                          className="bg-[#001D15] p-3.5 rounded-xl border border-white/15 space-y-3 shadow-md"
                        >
                          {/* Image Preview & Direct Upload Actions */}
                          <div className="flex items-start gap-3">
                            <div className="w-32 aspect-[4/3] rounded-lg overflow-hidden border border-white/20 bg-black shrink-0 relative">
                              <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                              <div className="absolute top-1 left-1 bg-black/80 text-[#C9A24A] text-[9px] font-bold px-1.5 py-0.5 rounded">
                                #{pIdx + 1}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 space-y-2">
                              {/* Direct Action Buttons */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                <label className="cursor-pointer px-2.5 py-1 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] rounded font-bold text-[10px] flex items-center gap-1 shadow transition-all">
                                  {compressingTarget === `gallery-${pIdx}` ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Upload className="w-3 h-3" />
                                  )}
                                  <span>Upload Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={compressingTarget === `gallery-${pIdx}`}
                                    onChange={(e) =>
                                      handleOptimizedImageUpload(
                                        e,
                                        `gallery-${pIdx}`,
                                        1200,
                                        800,
                                        (url) => handleUpdatePhoto(pIdx, 'image', url)
                                      )
                                    }
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPresetTargetField('galleryPhoto');
                                    setPresetTargetIndex(pIdx);
                                  }}
                                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-[#C9A24A] border border-[#C9A24A]/30 rounded text-[10px] font-medium transition-colors"
                                >
                                  Library Presets
                                </button>
                              </div>

                              <div>
                                <label className="block text-white/50 text-[10px] mb-0.5">Photo Title</label>
                                <input
                                  type="text"
                                  value={photo.title}
                                  onChange={(e) => handleUpdatePhoto(pIdx, 'title', e.target.value)}
                                  placeholder="Photo Title"
                                  className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1 text-white outline-none text-xs font-medium"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Image URL input */}
                          <div>
                            <label className="block text-white/50 text-[10px] mb-0.5">Image URL / Data</label>
                            <input
                              type="url"
                              value={photo.image}
                              onChange={(e) => handleUpdatePhoto(pIdx, 'image', e.target.value)}
                              placeholder="Image URL"
                              className="w-full bg-[#00291E] border border-white/20 rounded px-2 py-1 text-white/80 outline-none text-[10px] font-mono truncate"
                            />
                          </div>

                          {/* Controls Footer */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/10">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-white/40">Reorder:</span>
                              <button
                                type="button"
                                onClick={() => handleMovePhoto(pIdx, 'up')}
                                disabled={pIdx === 0}
                                className="p-1 bg-white/5 hover:bg-white/15 text-white/80 rounded disabled:opacity-20"
                                title="Move Earlier in Gallery"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMovePhoto(pIdx, 'down')}
                                disabled={pIdx === (editingProject.galleryPhotos?.length || 0) - 1}
                                className="p-1 bg-white/5 hover:bg-white/15 text-white/80 rounded disabled:opacity-20"
                                title="Move Later in Gallery"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.id)}
                              className="text-red-400 hover:text-red-300 px-2 py-1 bg-red-950/40 rounded border border-red-800/40 flex items-center gap-1 text-[10px]"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Photo</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Add Another New Showcase Photo Area */}
                  <div className="p-4 bg-[#001D15] rounded-xl border border-[#C9A24A]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm text-[#F8F0D8] font-medium flex items-center gap-1.5">
                        <Plus className="w-4 h-4 text-[#C9A24A]" />
                        <span>Add Another Showcase Photo</span>
                      </h4>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer text-[11px] bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-3 py-1 rounded shadow flex items-center gap-1">
                          {compressingTarget === 'newPhoto' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3" />
                          )}
                          <span>Upload From Computer</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={compressingTarget === 'newPhoto'}
                            onChange={(e) =>
                              handleOptimizedImageUpload(e, 'newPhoto', 1200, 800, (url) => setNewPhotoUrl(url))
                            }
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setPresetTargetField('newPhotoUrl');
                            setPresetTargetIndex(null);
                          }}
                          className="text-[11px] bg-white/10 hover:bg-white/20 text-[#C9A24A] border border-[#C9A24A]/30 px-2.5 py-1 rounded"
                        >
                          Select From Library
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-4">
                        <label className="block text-white/60 text-[10px] mb-0.5">Photo Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Grand Entrance Gate at Twilight"
                          value={newPhotoTitle}
                          onChange={(e) => setNewPhotoTitle(e.target.value)}
                          className="w-full bg-[#00291E] border border-white/20 rounded px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-white/60 text-[10px] mb-0.5">Image URL (or uploaded image)</label>
                        <input
                          type="url"
                          placeholder="https://... or uploaded image data"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          className="w-full bg-[#00291E] border border-white/20 rounded px-3 py-2 text-white outline-none font-mono text-[11px]"
                        />
                      </div>
                      <div className="sm:col-span-3 flex items-end">
                        <button
                          type="button"
                          onClick={handleAddPhoto}
                          disabled={!newPhotoUrl.trim()}
                          className="w-full bg-[#C9A24A] hover:bg-[#DDB75C] disabled:opacity-40 text-[#00291E] py-2 rounded font-bold uppercase text-[11px] shadow transition-all"
                        >
                          + Add to Showcase
                        </button>
                      </div>
                    </div>

                    {newPhotoUrl && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-16 h-12 rounded overflow-hidden border border-white/20 bg-black shrink-0">
                          <img src={newPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Photo ready to add
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECT HIGHLIGHTS */}
              {activeTab === 'highlights' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20">
                    <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 4: Highlights ("Why Invest / Project Highlights")</span>
                    <p className="text-white/60 text-[11px]">
                      Update the highlights grid items that appear with green/gold badges on the project page. You can edit text directly, reorder, or pick popular real estate highlights below!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Section Eyebrow Tag</label>
                      <input
                        type="text"
                        placeholder="WHY INVEST"
                        value={editingProject.highlightsEyebrow || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, highlightsEyebrow: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Section Title</label>
                      <input
                        type="text"
                        placeholder="Project Highlights"
                        value={editingProject.highlightsTitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, highlightsTitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Add Highlight Form */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. 100% NA Sanctioned with immediate individual 7/12 transfer"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      className="flex-1 bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddHighlight()}
                      className="bg-[#C9A24A] text-[#00291E] font-bold px-4 py-2 rounded uppercase text-xs hover:brightness-105"
                    >
                      + Add Highlight
                    </button>
                  </div>

                  {/* Quick Highlight Suggestion Chips */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-white/60 block">Quick 1-Click Suggestions:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Collector Approved NA Plotted Layout',
                        'Clear Title Property with Separate 7/12 for each plot',
                        'Ready Possession with Gated Boundary',
                        'Bank Loan Support from Leading Institutions',
                        'Equipped with 30ft Internal Asphalt Roads, Light & Water',
                        '5 Themed Gardens & Luxury Clubhouse',
                        'Grand Entrance Gate with 24/7 Security Cabin',
                        'Scenic Mountain & Hilltop Views from All Plots',
                      ].map((sugg, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleAddHighlight(sugg)}
                          className="text-[10px] bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 px-2 py-0.5 rounded transition-colors"
                        >
                          + {sugg}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Highlights List with In-Place Editing */}
                  <div className="space-y-2 pt-3">
                    <span className="font-semibold text-white/80 block">
                      Active Highlights ({editingProject.keyHighlights?.length || 0})
                    </span>
                    {(editingProject.keyHighlights || []).map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 bg-[#001D15] rounded-lg border border-white/10"
                      >
                        <CheckCircle className="w-4 h-4 text-[#C9A24A] shrink-0" />
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                          className="flex-1 bg-[#00291E] border border-white/20 rounded px-2.5 py-1 text-white text-xs outline-none"
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveHighlight(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-white/60 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveHighlight(idx, 'down')}
                            disabled={idx === (editingProject.keyHighlights?.length || 0) - 1}
                            className="p-1 text-white/60 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(idx)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: MASTER PLAN */}
              {activeTab === 'masterplan' && (
                <div className="space-y-5 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20">
                    <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 5: Master Layout Plan & Infrastructure</span>
                    <p className="text-white/60 text-[11px]">
                      Change the master layout blueprint graphic, description, internal road specifications, bullet points, and brochure download URL.
                    </p>
                  </div>

                  {/* Master Plan Blueprint Image */}
                  <div className="bg-[#001D15] p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-[#C9A24A] font-semibold block">Master Plan Blueprint Image</label>
                        <ImageDimensionBadge
                          variant="dark"
                          dimensions="1600 × 1000 px"
                          aspectRatio="16:10 / 16:9 Schematic"
                          maxSize="2.0 MB"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <label className="cursor-pointer text-[11px] bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold px-2.5 py-1 rounded shadow flex items-center gap-1">
                          {compressingTarget === 'masterPlan' ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Upload className="w-3 h-3" />
                          )}
                          <span>Upload Blueprint</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={compressingTarget === 'masterPlan'}
                            onChange={(e) =>
                              handleOptimizedImageUpload(e, 'masterPlan', 1600, 1100, (url) =>
                                setEditingProject({ ...editingProject, masterPlanImage: url })
                              )
                            }
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setPresetTargetField('masterPlanImage');
                            setPresetTargetIndex(null);
                          }}
                          className="text-[11px] bg-white/10 hover:bg-white/20 text-[#C9A24A] border border-[#C9A24A]/30 px-2.5 py-1 rounded"
                        >
                          Select Layout Preset
                        </button>
                      </div>
                    </div>

                    <input
                      type="url"
                      value={editingProject.masterPlanImage || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, masterPlanImage: e.target.value })}
                      className="w-full bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none font-mono text-[11px]"
                    />

                    {editingProject.masterPlanImage && (
                      <div className="aspect-[16/10] max-w-lg rounded overflow-hidden border border-white/20 bg-black">
                        <img
                          src={editingProject.masterPlanImage}
                          alt="Master Plan Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Eyebrow Tag</label>
                      <input
                        type="text"
                        placeholder="PLANNED INFRASTRUCTURE"
                        value={editingProject.masterPlanEyebrow || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, masterPlanEyebrow: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Master Plan Title</label>
                      <input
                        type="text"
                        value={editingProject.masterPlanTitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, masterPlanTitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Master Plan Subtitle</label>
                      <input
                        type="text"
                        value={editingProject.masterPlanSubtitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, masterPlanSubtitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-1 font-semibold">Master Plan Architectural Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.masterPlanDescription || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, masterPlanDescription: e.target.value })}
                      className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded p-2.5 text-white outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* DEDICATED BROCHURE UPLOAD FROM COMPUTER SECTION */}
                  <div className="p-4 sm:p-5 bg-[#001D15] rounded-xl border-2 border-[#C9A24A]/40 space-y-4 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <span className="text-xs uppercase font-bold tracking-wider text-[#C9A24A] flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#C9A24A]" />
                          Official Project Brochure (PDF for Customer Download)
                        </span>
                        <p className="text-[11px] text-white/70 mt-0.5">
                          Upload the project brochure directly from your computer. Customers can download this exact PDF from the website.
                        </p>
                      </div>
                      {(editingProject.brochureFileName || editingProject.masterPlanPdfFileName) && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold shrink-0">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          Brochure Active
                        </span>
                      )}
                    </div>

                    {/* Active File Card if uploaded */}
                    {editingProject.brochureFileName || editingProject.masterPlanPdfFileName || editingProject.masterPlanPdfUrl ? (
                      <div className="bg-[#00291E] p-4 rounded-lg border border-[#C9A24A]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#C9A24A]/20 to-[#00291E] border border-[#C9A24A]/50 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-[#C9A24A]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                                {editingProject.brochureFileName || editingProject.masterPlanPdfFileName || 'Attached Brochure PDF'}
                              </span>
                              <span className="text-[10px] bg-[#C9A24A]/20 text-[#C9A24A] font-mono px-2 py-0.5 rounded border border-[#C9A24A]/30">
                                {editingProject.brochureFileSize || editingProject.masterPlanPdfFileSize || 'PDF Document'}
                              </span>
                            </div>
                            <div className="text-[11px] text-white/60 flex items-center gap-3 mt-1 flex-wrap">
                              <span>
                                {editingProject.brochureUploadDate || editingProject.masterPlanPdfUploadDate || 'Attached to project'}
                              </span>
                              <span className="text-emerald-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Ready for Customer Download
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
                          <button
                            type="button"
                            onClick={handleTestDownloadBrochure}
                            className="bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded shadow flex items-center gap-1.5 transition-all"
                            title="Download the file to your computer to inspect"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Test Download</span>
                          </button>

                          <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2 rounded border border-white/20 flex items-center gap-1.5 transition-colors">
                            {uploadingBrochure ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5 text-[#C9A24A]" />
                            )}
                            <span>{uploadingBrochure ? 'Uploading...' : 'Replace File'}</span>
                            <input
                              type="file"
                              accept=".pdf,application/pdf,.doc,.docx"
                              className="hidden"
                              disabled={uploadingBrochure}
                              onChange={handleBrochureUpload}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={handleRemoveBrochure}
                            className="p-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-red-200 rounded transition-colors"
                            title="Remove brochure file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Dropzone Upload UI */
                      <div className="border-2 border-dashed border-[#C9A24A]/40 rounded-xl p-6 text-center bg-[#00241A] space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#C9A24A]/10 border border-[#C9A24A]/30 mx-auto flex items-center justify-center">
                          {uploadingBrochure ? (
                            <Loader2 className="w-6 h-6 text-[#C9A24A] animate-spin" />
                          ) : (
                            <Upload className="w-6 h-6 text-[#C9A24A]" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">
                            {uploadingBrochure ? 'Reading and saving brochure from computer...' : 'Upload Official Brochure from Computer'}
                          </h4>
                          <p className="text-white/60 text-[11px] mt-0.5">
                            Select any PDF brochure file from your device. Supported formats: PDF, DOC, DOCX up to 50MB.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <label className="cursor-pointer bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 text-[#00291E] font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded shadow-lg flex items-center gap-2 transition-all">
                            <Upload className="w-4 h-4" />
                            <span>Upload PDF from Computer</span>
                            <input
                              type="file"
                              accept=".pdf,application/pdf,.doc,.docx"
                              className="hidden"
                              disabled={uploadingBrochure}
                              onChange={handleBrochureUpload}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={handleGenerateOfficialBrochure}
                            disabled={generatingBrochure}
                            className="bg-white/10 hover:bg-white/20 text-[#C9A24A] border border-[#C9A24A]/40 font-semibold text-xs px-4 py-2.5 rounded flex items-center gap-2 transition-all disabled:opacity-50"
                          >
                            {generatingBrochure ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5" />
                            )}
                            <span>{generatingBrochure ? 'Compiling PDF...' : 'Generate Official PDF Brochure'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Button Label and Fallback URL Configuration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div>
                        <label className="block text-white/80 mb-1 font-semibold">
                          Customer Download Button Label (shown on website)
                        </label>
                        <input
                          type="text"
                          placeholder={`Download ${editingProject.name || 'Master Plan'} Brochure`}
                          value={editingProject.brochureDownloadText || editingProject.masterPlanDownloadText || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              brochureDownloadText: e.target.value,
                              masterPlanDownloadText: e.target.value,
                            })
                          }
                          className="w-full bg-[#00241A] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 mb-1 font-semibold">
                          External Brochure Link (Optional Cloud / Drive URL)
                        </label>
                        <input
                          type="url"
                          placeholder="https://.../brochure.pdf (optional if file uploaded above)"
                          value={editingProject.masterPlanPdfUrl || editingProject.brochurePdfUrl || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              masterPlanPdfUrl: e.target.value,
                              brochurePdfUrl: e.target.value,
                            })
                          }
                          className="w-full bg-[#00241A] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Master Plan Key Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <label className="block text-white/80 font-semibold">Master Plan Key Features (Bullet Points)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 30ft Wide Main Internal Roads & Arterials"
                        value={newMasterPlanFeature}
                        onChange={(e) => setNewMasterPlanFeature(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddMasterPlanFeature();
                          }
                        }}
                        className="flex-1 bg-[#001D15] border border-white/20 rounded px-3 py-2 text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddMasterPlanFeature()}
                        className="bg-[#C9A24A] text-[#00291E] font-bold px-4 py-2 rounded uppercase text-xs"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {(editingProject.masterPlanFeatures || []).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-[#001D15] rounded border border-white/10">
                          <span className="w-2 h-2 rounded-full bg-[#C9A24A] shrink-0" />
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => handleUpdateMasterPlanFeature(idx, e.target.value)}
                            className="flex-1 bg-[#00291E] border border-white/20 rounded px-2.5 py-1 text-white text-xs outline-none"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveMasterPlanFeature(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-white/60 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveMasterPlanFeature(idx, 'down')}
                              disabled={idx === (editingProject.masterPlanFeatures?.length || 0) - 1}
                              className="p-1 text-white/60 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveMasterPlanFeature(idx)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: LOCATION & MAP */}
              {activeTab === 'location' && (
                <div className="space-y-5 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20">
                    <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 6: Location Advantages & Google Map Embed</span>
                    <p className="text-white/60 text-[11px]">
                      Change the site location address, distance benefits, highway connectivity markers, and live Google Maps embed.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Section Eyebrow Tag</label>
                      <input
                        type="text"
                        placeholder="STRATEGIC LOCATION"
                        value={editingProject.locationEyebrow || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, locationEyebrow: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Section Title</label>
                      <input
                        type="text"
                        placeholder="Location Advantages"
                        value={editingProject.locationTitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, locationTitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Project Location Address / Landmark *</label>
                      <input
                        type="text"
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-1 font-semibold">Google Maps Embed URL (Iframe)</label>
                      <input
                        type="text"
                        placeholder="https://maps.google.com/maps?q=Mandangad&output=embed"
                        value={editingProject.mapUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, mapUrl: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 focus:border-[#C9A24A] rounded px-3 py-2 text-white outline-none font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Map Preview */}
                  {editingProject.mapUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/20 h-44 bg-slate-900">
                      <iframe
                        title="Location Map Preview"
                        src={editingProject.mapUrl}
                        className="w-full h-full border-0"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Location Advantages List */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <label className="block text-white/80 font-semibold">
                      Location Benefits / Distance Milestones (Checklist)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Direct touch to Pandharpur Highway (0 km)"
                        value={newLocationBenefit}
                        onChange={(e) => setNewLocationBenefit(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddLocationBenefit();
                          }
                        }}
                        className="flex-1 bg-[#001D15] border border-white/20 rounded px-3 py-2 text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddLocationBenefit()}
                        className="bg-[#C9A24A] text-[#00291E] font-bold px-4 py-2 rounded uppercase text-xs"
                      >
                        + Add Benefit
                      </button>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        'Just 2 km from Mandangad Town center',
                        'Direct touch to Pandharpur Highway (0 km)',
                        'Close to Upcoming PAT MIDC (2 km)',
                        '170 km scenic drive from Pune',
                        '190 km smooth connectivity from Mumbai',
                        '15 mins drive from scenic beaches and fortresses',
                      ].map((sugg, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddLocationBenefit(sugg)}
                          className="text-[10px] bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 px-2 py-0.5 rounded"
                        >
                          + {sugg}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 pt-2">
                      {(editingProject.locationBenefits || []).map((benefit, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2.5 bg-[#001D15] rounded border border-white/10"
                        >
                          <MapPin className="w-4 h-4 text-[#C9A24A] shrink-0" />
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => handleUpdateLocationBenefit(idx, e.target.value)}
                            className="flex-1 bg-[#00291E] border border-white/20 rounded px-2.5 py-1 text-white text-xs outline-none"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveLocationBenefit(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-white/60 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLocationBenefit(idx, 'down')}
                              disabled={idx === (editingProject.locationBenefits?.length || 0) - 1}
                              className="p-1 text-white/60 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveLocationBenefit(idx)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: LIFESTYLE SPACES */}
              {activeTab === 'lifestyle' && (
                <div className="space-y-5 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20">
                    <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 7: Lifestyle Spaces (Green Retreat)</span>
                    <p className="text-white/60 text-[11px]">
                      Manage the numbered lifestyle cards (Gazebos, Meditation Gardens, Walking Promenades, Kids Park). You can upload photos directly or choose presets for each card!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Eyebrow Tag</label>
                      <input
                        type="text"
                        placeholder="GREEN RETREAT"
                        value={editingProject.lifestyleEyebrow || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, lifestyleEyebrow: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Section Title</label>
                      <input
                        type="text"
                        placeholder="Lifestyle Spaces"
                        value={editingProject.lifestyleTitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, lifestyleTitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Section Subtitle</label>
                      <input
                        type="text"
                        placeholder="Green Spaces for a Healthy, Happy & Harmonious Life."
                        value={editingProject.lifestyleSubtitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, lifestyleSubtitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-white/80">
                      Lifestyle Spaces Cards ({editingProject.lifestyleSpaces?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextNum = (editingProject.lifestyleSpaces?.length || 0) + 1;
                        setEditingProject({
                          ...editingProject,
                          lifestyleSpaces: [
                            ...(editingProject.lifestyleSpaces || []),
                            {
                              id: `ls-${Date.now()}`,
                              number: nextNum,
                              title: `Lifestyle Space ${nextNum}`,
                              subtitle: 'Green Serenity',
                              image: ASSETS.gazeboGarden,
                            },
                          ],
                        });
                      }}
                      className="bg-[#C9A24A] text-[#00291E] font-bold px-3 py-1.5 rounded uppercase text-[11px]"
                    >
                      + Add Lifestyle Space
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingProject.lifestyleSpaces || []).map((space, idx) => (
                      <div
                        key={space.id || idx}
                        className="bg-[#001D15] p-4 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                      >
                        <div className="sm:col-span-1 text-center font-bold text-[#C9A24A] text-lg">
                          #{space.number}
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-white/50 text-[10px] mb-0.5">Title</label>
                          <input
                            type="text"
                            value={space.title}
                            onChange={(e) => {
                              const updated = [...(editingProject.lifestyleSpaces || [])];
                              updated[idx].title = e.target.value;
                              setEditingProject({ ...editingProject, lifestyleSpaces: updated });
                            }}
                            className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-white/50 text-[10px] mb-0.5">Subtitle</label>
                          <input
                            type="text"
                            value={space.subtitle || ''}
                            onChange={(e) => {
                              const updated = [...(editingProject.lifestyleSpaces || [])];
                              updated[idx].subtitle = e.target.value;
                              setEditingProject({ ...editingProject, lifestyleSpaces: updated });
                            }}
                            className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                          />
                        </div>
                        <div className="sm:col-span-4 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-white/50 text-[10px]">Photo</label>
                            <div className="flex items-center gap-1.5">
                              <label className="cursor-pointer text-[9px] bg-[#C9A24A] text-[#00291E] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                {compressingTarget === `space-${idx}` ? (
                                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                ) : (
                                  <Upload className="w-2.5 h-2.5" />
                                )}
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={compressingTarget === `space-${idx}`}
                                  onChange={(e) =>
                                    handleOptimizedImageUpload(
                                      e,
                                      `space-${idx}`,
                                      1200,
                                      800,
                                      (url) => {
                                        const updated = [...(editingProject.lifestyleSpaces || [])];
                                        updated[idx].image = url;
                                        setEditingProject({ ...editingProject, lifestyleSpaces: updated });
                                      }
                                    )
                                  }
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setPresetTargetField('lifestyleSpace');
                                  setPresetTargetIndex(idx);
                                }}
                                className="text-[9px] text-[#C9A24A] hover:underline"
                              >
                                Presets
                              </button>
                            </div>
                          </div>
                          <input
                            type="url"
                            value={space.image}
                            onChange={(e) => {
                              const updated = [...(editingProject.lifestyleSpaces || [])];
                              updated[idx].image = e.target.value;
                              setEditingProject({ ...editingProject, lifestyleSpaces: updated });
                            }}
                            className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1 text-white outline-none text-[11px] font-mono"
                          />
                        </div>
                        <div className="sm:col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(editingProject.lifestyleSpaces || [])];
                              updated.splice(idx, 1);
                              setEditingProject({ ...editingProject, lifestyleSpaces: updated });
                            }}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: GAMES & FACILITIES */}
              {activeTab === 'facilities' && (
                <div className="space-y-6 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20">
                    <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 8: Games & Club Facilities</span>
                    <p className="text-white/60 text-[11px]">
                      Clubhouse, indoor sports, outdoor courts, and children recreation groups. You can upload custom facility images directly or choose presets.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Eyebrow Tag</label>
                      <input
                        type="text"
                        placeholder="RECREATION & WELLNESS"
                        value={editingProject.facilitiesEyebrow || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, facilitiesEyebrow: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Section Title</label>
                      <input
                        type="text"
                        placeholder="Games & Club Facilities"
                        value={editingProject.facilitiesTitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, facilitiesTitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Section Subtitle</label>
                      <input
                        type="text"
                        placeholder="For Recreation. For Community. For You."
                        value={editingProject.facilitiesSubtitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, facilitiesSubtitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-semibold text-white/80">Facility Groups</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject({
                          ...editingProject,
                          gamesFacilities: [
                            ...(editingProject.gamesFacilities || []),
                            {
                              id: `gf-${Date.now()}`,
                              categoryName: 'Recreation Zone',
                              items: ['Lawn Tennis', 'Table Tennis', 'Badminton Court'],
                              image: ASSETS.outdoorSports,
                            },
                          ],
                        });
                      }}
                      className="bg-[#C9A24A] text-[#00291E] font-bold px-3 py-1.5 rounded uppercase text-[11px]"
                    >
                      + Add Facility Group
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingProject.gamesFacilities || []).map((group, gIdx) => (
                      <div key={group.id || gIdx} className="bg-[#001D15] p-4 rounded-xl border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={group.categoryName}
                            onChange={(e) => {
                              const updated = [...(editingProject.gamesFacilities || [])];
                              updated[gIdx].categoryName = e.target.value;
                              setEditingProject({ ...editingProject, gamesFacilities: updated });
                            }}
                            className="font-serif text-sm font-semibold bg-[#00291E] border border-white/20 rounded px-3 py-1 text-[#C9A24A]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(editingProject.gamesFacilities || [])];
                              updated.splice(gIdx, 1);
                              setEditingProject({ ...editingProject, gamesFacilities: updated });
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-0.5">
                              <label className="text-white/50 text-[10px]">Photo</label>
                              <div className="flex items-center gap-1.5">
                                <label className="cursor-pointer text-[9px] bg-[#C9A24A] text-[#00291E] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                  {compressingTarget === `facility-${gIdx}` ? (
                                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                  ) : (
                                    <Upload className="w-2.5 h-2.5" />
                                  )}
                                  <span>Upload</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={compressingTarget === `facility-${gIdx}`}
                                    onChange={(e) =>
                                      handleOptimizedImageUpload(
                                        e,
                                        `facility-${gIdx}`,
                                        1200,
                                        800,
                                        (url) => {
                                          const updated = [...(editingProject.gamesFacilities || [])];
                                          updated[gIdx].image = url;
                                          setEditingProject({ ...editingProject, gamesFacilities: updated });
                                        }
                                      )
                                    }
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPresetTargetField('facilityGroup');
                                    setPresetTargetIndex(gIdx);
                                  }}
                                  className="text-[9px] text-[#C9A24A] hover:underline"
                                >
                                  Presets
                                </button>
                              </div>
                            </div>
                            <input
                              type="url"
                              value={group.image}
                              onChange={(e) => {
                                const updated = [...(editingProject.gamesFacilities || [])];
                                updated[gIdx].image = e.target.value;
                                setEditingProject({ ...editingProject, gamesFacilities: updated });
                              }}
                              className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none font-mono text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 text-[10px] mb-0.5">
                              Amenities Sub-Items (Comma Separated)
                            </label>
                            <input
                              type="text"
                              value={group.items.join(', ')}
                              onChange={(e) => {
                                const updated = [...(editingProject.gamesFacilities || [])];
                                updated[gIdx].items = e.target.value
                                  .split(',')
                                  .map((s) => s.trim())
                                  .filter(Boolean);
                                setEditingProject({ ...editingProject, gamesFacilities: updated });
                              }}
                              className="w-full bg-[#00291E] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: QUALITY INFRASTRUCTURE & BOTTOM CTA */}
              {activeTab === 'infra' && (
                <div className="space-y-6 text-xs">
                  <div className="p-3 bg-[#001D15] rounded-lg border border-[#C9A24A]/20">
                    <span className="text-[#C9A24A] font-semibold block mb-0.5">Section 9 & 10: Infrastructure Grid & Bottom CTA Banner</span>
                    <p className="text-white/60 text-[11px]">
                      Configure the 8 infrastructure items (Internal Roads, Electricity, Water, Street Lights, Drainage) and the bottom conversion banner.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Infra Eyebrow Tag</label>
                      <input
                        type="text"
                        placeholder="INFRASTRUCTURE"
                        value={editingProject.infraEyebrow || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, infraEyebrow: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Infra Section Title</label>
                      <input
                        type="text"
                        placeholder="Quality Infrastructure"
                        value={editingProject.infraTitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, infraTitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-[11px] mb-1">Infra Subtitle</label>
                      <input
                        type="text"
                        placeholder="Hassle Free Living. Built for a Better Tomorrow."
                        value={editingProject.infraSubtitle || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, infraSubtitle: e.target.value })}
                        className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Add Infra Item */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. 24/7 Gated Security Cabin"
                      value={newInfraTitle}
                      onChange={(e) => setNewInfraTitle(e.target.value)}
                      className="flex-1 bg-[#001D15] border border-white/20 rounded px-3 py-2 text-white outline-none"
                    />
                    <select
                      value={newInfraIcon}
                      onChange={(e) => setNewInfraIcon(e.target.value)}
                      className="bg-[#001D15] border border-white/20 rounded px-3 py-2 text-white outline-none"
                    >
                      <option value="road">Road Icon</option>
                      <option value="zap">Electricity Icon</option>
                      <option value="droplet">Water Icon</option>
                      <option value="lamp">Street Lamp Icon</option>
                      <option value="layers">Drainage/Layers Icon</option>
                      <option value="trees">Trees Icon</option>
                      <option value="shield">Security Shield Icon</option>
                      <option value="check">Checkmark Icon</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddInfra}
                      className="bg-[#C9A24A] text-[#00291E] font-bold px-4 py-2 rounded uppercase text-xs"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {(editingProject.infrastructure || []).map((infra, iIdx) => (
                      <div key={infra.id || iIdx} className="p-2.5 bg-[#001D15] rounded border border-white/10 flex items-center justify-between">
                        <span className="text-white/90 truncate">{infra.title}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInfra(iIdx)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Bottom CTA Banner Customization */}
                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <span className="text-[#C9A24A] font-semibold block text-sm">
                      Section 10: Bottom Booking CTA Banner
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/70 text-[11px] mb-1">Banner Tag</label>
                        <input
                          type="text"
                          placeholder="LIMITED PLOTS AVAILABLE"
                          value={editingProject.ctaBannerTag || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, ctaBannerTag: e.target.value })}
                          className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-[11px] mb-1">Banner Heading</label>
                        <input
                          type="text"
                          placeholder={`Build Your Dream Home in ${editingProject.name}`}
                          value={editingProject.ctaBannerTitle || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, ctaBannerTitle: e.target.value })}
                          className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/70 text-[11px] mb-1">Banner Subtext / Description</label>
                        <input
                          type="text"
                          placeholder="Plots with Collector NA approval and Ready Possession."
                          value={editingProject.ctaBannerText || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, ctaBannerText: e.target.value })}
                          className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-[11px] mb-1">Primary CTA Button Label</label>
                        <input
                          type="text"
                          placeholder="Book a Site Visit →"
                          value={editingProject.ctaBannerButtonText || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, ctaBannerButtonText: e.target.value })}
                          className="w-full bg-[#001D15] border border-white/20 rounded px-2.5 py-1.5 text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-5 border-t border-white/10 bg-[#001D15] -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 p-4 sm:p-5 shrink-0">
                <div className="text-[11px] text-white/60 flex items-center gap-2">
                  <span>Currently editing:</span>
                  <span className="text-[#C9A24A] font-semibold">{editingProject.name || 'New Project'}</span>
                  <span className="text-white/40 font-mono">({editingProject.slug})</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded uppercase text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#C9A24A] hover:bg-[#DDB75C] text-[#00291E] font-bold rounded uppercase text-xs flex items-center gap-1.5 shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preset Library Quick Selector Modal */}
      {presetTargetField && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#00291E] text-white rounded-xl border border-[#C9A24A]/60 max-w-2xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-serif text-lg text-[#F8F0D8]">Choose from Velora Asset Library</h4>
                <p className="text-[11px] text-white/60">
                  Select a high-resolution authentic asset for{' '}
                  <span className="text-[#C9A24A] font-mono">{presetTargetField}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPresetTargetField(null);
                  setPresetTargetIndex(null);
                }}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {PRESET_LIBRARY.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(item.url)}
                  className="bg-[#001D15] rounded-lg overflow-hidden border border-white/10 hover:border-[#C9A24A] cursor-pointer group transition-all"
                >
                  <div className="aspect-[16/10] bg-black">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-2">
                    <span className="text-[10px] text-white/90 font-medium block truncate">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => {
                  setPresetTargetField(null);
                  setPresetTargetIndex(null);
                }}
                className="px-4 py-1.5 bg-white/10 text-white rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
