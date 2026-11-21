import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Camera, Megaphone, Share2, Search, Calendar, Copy, Check, 
  Image as ImageIcon, RefreshCw, MessageSquare, Star, Settings, Award, 
  Utensils, BedDouble, Heart, Globe, MapPin, ChevronRight, Download, Eye, AlertCircle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('social');
  const [copiedId, setCopiedId] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  // Quick Notification
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Texte copié dans le presse-papier !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper function to call Gemini API
  const callGeminiText = async (prompt, systemInstruction = "") => {
    const key = apiKey.trim();
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${key}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Réponse inattendue de l'API");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans flex flex-col md:flex-row">
      {/* Toast message */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-amber-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-stone-950 border-r border-stone-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/40 border border-amber-500/30">
              <Utensils className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-amber-100 leading-tight">Auberge Ramstein</h1>
              <p className="text-xs text-stone-400 font-sans tracking-wide uppercase">Scherwiller • Alsace</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('social')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'social' 
                  ? 'bg-amber-700/20 text-amber-400 border border-amber-600/30 shadow-inner' 
                  : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Studio Réseaux Sociaux</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'seo' 
                  ? 'bg-amber-700/20 text-amber-400 border border-amber-600/30 shadow-inner' 
                  : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              }`}
            >
              <Search className="w-5 h-5" />
              <span>Référencement SEO & Google</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'reviews' 
                  ? 'bg-amber-700/20 text-amber-400 border border-amber-600/30 shadow-inner' 
                  : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              }`}
            >
              <Star className="w-5 h-5" />
              <span>Réponses Avis Client</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'planner' 
                  ? 'bg-amber-700/20 text-amber-400 border border-amber-600/30 shadow-inner' 
                  : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Planificateur Meta</span>
            </button>
          </nav>
        </div>

        {/* API Key configuration section */}
        <div className="pt-6 border-t border-stone-800">
          <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Clé API Gemini
              </span>
              <span className={`w-2 h-2 rounded-full ${isApiKeySet ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </div>
            <input 
              type="password" 
              placeholder="Clé optionnelle (par défaut auto)"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setIsApiKeySet(e.target.value.length > 5);
              }}
              className="w-full text-xs bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-300 placeholder-stone-600 focus:outline-none focus:border-amber-600"
            />
            <p className="text-[10px] text-stone-500 mt-1.5">
              Si laissée vide, l'application fonctionnera avec des modèles prédéfinis optimisés pour Scherwiller.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-stone-900 overflow-y-auto">
        <header className="px-8 py-6 bg-stone-950/40 border-b border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-500 mb-1">
              <MapPin className="w-3.5 h-3.5" /> Scherwiller, Route des Vins d'Alsace
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-100">
              {activeTab === 'social' && "Créateur de Contenu Social (Instagram & Facebook)"}
              {activeTab === 'seo' && "Optimisation SEO Local & Site Web"}
              {activeTab === 'reviews' && "Gestionnaire de Réputation & Avis Google"}
              {activeTab === 'planner' && "Planning & Export Meta Business"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full text-xs bg-amber-950/60 text-amber-300 border border-amber-800/40 flex items-center gap-1.5 font-medium">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Gastronomie & Hôtel 3★
            </span>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'social' && <SocialStudio callGeminiText={callGeminiText} handleCopy={handleCopy} copiedId={copiedId} showToast={showToast} />}
          {activeTab === 'seo' && <SeoTool callGeminiText={callGeminiText} handleCopy={handleCopy} copiedId={copiedId} />}
          {activeTab === 'reviews' && <ReviewResponder callGeminiText={callGeminiText} handleCopy={handleCopy} copiedId={copiedId} />}
          {activeTab === 'planner' && <MetaPlanner handleCopy={handleCopy} copiedId={copiedId} />}
        </div>
      </main>
    </div>
  );
}

// ----------------------------------------------------------------------
// TAB 1: STUDIO RÉSEAUX SOCIAUX
// ----------------------------------------------------------------------
function SocialStudio({ callGeminiText, handleCopy, copiedId, showToast }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [contentType, setContentType] = useState('food');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState('');
  const [hashtags, setHashtags] = useState([
    '#AubergeRamstein', '#Scherwiller', '#GastronomieAlsace', '#RoutedesVins',
    '#FaitMaison', '#AlsaceGourmande', '#HotelAlsace', '#LogisdeFrance'
  ]);
  const [selectedHashtags, setSelectedHashtags] = useState([
    '#AubergeRamstein', '#Scherwiller', '#GastronomieAlsace'
  ]);

  const presets = {
    food: "Assiette gastronomique, filet de cerf, spaetzles maison, jus réduit et morilles. Présentation élégante.",
    room: "Chambre supérieure rénovée avec vue sur les vignes de Scherwiller, ambiance cocooning, literie haut de gamme.",
    spa: "Espace détente avec spa, sauna et jacuzzi pour se ressourcer au cœur du vignoble Alsacien.",
    event: "Menu spécial Fête des Mères / Événement spécial autour des cépages locaux (Riesling de Scherwiller)."
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleHashtag = (tag) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
    } else {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const generateSocialPost = async () => {
    setIsGenerating(true);
    const details = customPrompt || presets[contentType];

    const systemInstruction = `Tu es l'assistant marketing de l'Auberge Ramstein à Scherwiller (Alsace). 
L'auberge propose une cuisine gastronomique authentique, des chambres douillettes et un cadre chaleureux au cœur des vignes de Scherwiller.
Rédige un post engageant, convivial et gourmand pour Instagram & Facebook. 
Inclus des emojis adaptés et termine avec une incitation chaleureuse à la réservation (ex: lien en bio / réservation sur notre site).
Conserve un ton raffiné mais accessible.`;

    const prompt = `Crée un post pour les réseaux sociaux sur le sujet suivant : ${details}. Type de contenu : ${contentType}.`;

    try {
      const result = await callGeminiText(prompt, systemInstruction);
      setGeneratedCaption(result);
    } catch (err) {
      // Fallback response if API key is not present or offline
      let fallbackText = "";
      if (contentType === 'food') {
        fallbackText = `✨ Gourmandise & Savoir-faire à l'Auberge Ramstein ✨\n\nLaissez-vous tenter par la création du Chef : un savoureux plat mijoté avec passion, mettant à l'honneur les produits locaux de notre belle région d'Alsace. 🍷🍴\n\nQue ce soit pour un déjeuner en terrasse au cœur de Scherwiller ou un dîner chaleureux, notre équipe vous attend pour un moment d'exception.\n\n📍 Réservez votre table directement sur notre site internet ou au 03 88 92 15 54.`;
      } else if (contentType === 'room') {
        fallbackText = `🌿 Douce nuit au cœur des vignes 🍇\n\nBesoin d'une parenthèse de sérénité ? Nos chambres chaleureuses et confortables vous accueillent pour une escapade relaxante à Scherwiller, sur la célèbre Route des Vins d'Alsace.\n\nAprès un délicieux repas gastronomique, profitez du calme absolu et de notre espace détente.\n\n👉 Offres et réservations sur notre site web (Lien en bio).`;
      } else {
        fallbackText = `🥂 Un moment d'exception à l'Auberge Ramstein 🍷\n\nToute notre équipe est heureuse de vous accueillir pour partager des moments de joie et de haute gastronomie alsacienne.\n\nVenez célébrer les beaux jours avec nous à Scherwiller !\n\n📞 Réservations recommandées via notre site officiel.`;
      }
      setGeneratedCaption(fallbackText);
      showToast("Généré à partir des modèles prédéfinis optimisés");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Input Column */}
      <div className="lg:col-span-6 space-y-6">
        {/* Photo Upload Box */}
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-md">
          <label className="block text-sm font-medium text-stone-300 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-500" /> Photo du Plat ou de l'Hôtel
            </span>
            <span className="text-xs text-stone-500">JPG, PNG supportés</span>
          </label>

          <div className="relative group border-2 border-dashed border-stone-800 hover:border-amber-600/50 rounded-xl p-4 transition-all duration-300 text-center bg-stone-900/50">
            {selectedImage ? (
              <div className="relative rounded-lg overflow-hidden max-h-72">
                <img src={selectedImage} alt="Aperçu" className="w-full object-cover h-64 rounded-lg" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-stone-950/80 text-stone-300 px-3 py-1 rounded-full text-xs hover:bg-stone-900 border border-stone-700"
                >
                  Changer
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center py-8">
                <div className="w-14 h-14 rounded-full bg-amber-950/40 text-amber-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium text-stone-200">Cliquez pour importer une photo</p>
                <p className="text-xs text-stone-500 mt-1">Prenez directement une photo de votre plat ou de votre chambre</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Content Type Selector */}
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-md space-y-4">
          <label className="block text-sm font-medium text-stone-300">Type d'annonce</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'food', label: 'Plat / Gastronomie', icon: Utensils },
              { id: 'room', label: 'Séjour / Chambre', icon: BedDouble },
              { id: 'spa', label: 'Spa / Bien-être', icon: Heart },
              { id: 'event', label: 'Événement / Offre', icon: Megaphone }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setContentType(item.id)}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  contentType === item.id 
                    ? 'bg-amber-950/40 border-amber-600/60 text-amber-200' 
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <item.icon className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2">
              Détails complémentaires (Ingrédients, nom du plat, vin suggéré...)
            </label>
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={`Ex: ${presets[contentType]}`}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Hashtags Selection */}
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-2">Hashtags recommandés (cliquer pour activer/désactiver)</label>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag) => {
                const isActive = selectedHashtags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleHashtag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-all border ${
                      isActive 
                        ? 'bg-amber-600/20 text-amber-300 border-amber-600/40' 
                        : 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={generateSocialPost}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium rounded-xl shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Rédaction par l'IA en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Générer la Légende Sociale</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Output Preview Column */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-md flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
              <span className="text-sm font-serif font-bold text-stone-200 flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-500" /> Aperçu du Post Instagram / Facebook
              </span>
              <span className="text-xs bg-stone-900 text-amber-400 px-2.5 py-1 rounded-md border border-stone-800 font-mono">
                @aubergeramstein
              </span>
            </div>

            {/* Social Card Preview */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden mb-6 shadow-inner">
              {/* Card Header */}
              <div className="p-3 bg-stone-900 border-b border-stone-800/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-700 text-stone-100 flex items-center justify-center font-serif text-xs font-bold">
                  AR
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-200">Auberge Ramstein</p>
                  <p className="text-[10px] text-stone-400">Scherwiller, Alsace</p>
                </div>
              </div>

              {/* Card Image */}
              {selectedImage ? (
                <img src={selectedImage} alt="Post" className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-48 bg-stone-950 flex flex-col items-center justify-center text-stone-600 gap-2">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                  <span className="text-xs">Aucune image chargée</span>
                </div>
              )}

              {/* Card Content Text */}
              <div className="p-4 space-y-3">
                {generatedCaption ? (
                  <div className="text-xs text-stone-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {generatedCaption}
                    <div className="mt-3 text-amber-400/90 font-medium">
                      {selectedHashtags.join(' ')}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    Cliquez sur "Générer la Légende Sociale" pour voir le rendu de votre publication ici...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {generatedCaption && (
            <div className="pt-4 border-t border-stone-800 flex gap-3">
              <button
                onClick={() => handleCopy(`${generatedCaption}\n\n${selectedHashtags.join(' ')}`, 'caption')}
                className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all"
              >
                {copiedId === 'caption' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-400" />}
                <span>Copier le texte complet</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// TAB 2: RÉFÉRENCEMENT SEO & GOOGLE
// ----------------------------------------------------------------------
function SeoTool({ callGeminiText, handleCopy, copiedId }) {
  const [seoType, setSeoType] = useState('meta');
  const [pageSubject, setPageSubject] = useState('Restaurant gastronomique & spécialités alsaciennes');
  const [seoOutput, setSeoOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateSeoContent = async () => {
    setIsLoading(true);

    let systemInstruction = "Tu es un expert en référencement local (SEO) pour l'hôtellerie-restauration en Alsace (France).";
    let prompt = "";

    if (seoType === 'meta') {
      prompt = `Génère une Balise Meta Title (max 60 caractères) et une Meta Description (max 155 caractères) hautement optimisées SEO pour le site internet de l'Auberge Ramstein à Scherwiller. Sujet de la page : "${pageSubject}". Inclus des mots clés comme Scherwiller, Route des Vins, Gastronomie, Hôtel Alsace.`;
    } else if (seoType === 'gbp') {
      prompt = `Rédige une mise à jour d'actualité pour la fiche Google Business Profile de l'Auberge Ramstein à Scherwiller concernant : "${pageSubject}". Rends le texte incitatif pour inciter les voyageurs et clients locaux à venir réserver.`;
    } else if (seoType === 'faq') {
      prompt = `Rédige 3 questions-réponses optimisées pour la FAQ du site web de l'Auberge Ramstein sur le thème : "${pageSubject}". Exemples d'infos : Parking privé, terrasse avec vue sur les vignes, borne de recharge, animaux acceptés.`;
    }

    try {
      const res = await callGeminiText(prompt, systemInstruction);
      setSeoOutput(res);
    } catch (err) {
      // Fallback SEO text
      if (seoType === 'meta') {
        setSeoOutput(`📌 META TITLE OPTIMISÉ :\nAuberge Ramstein | Restaurant Gastronomique & Hôtel à Scherwiller\n\n📌 META DESCRIPTION OPTIMISÉE :\nDécouvrez l'Auberge Ramstein à Scherwiller sur la Route des Vins d'Alsace. Cuisine gastronomique raffinée, chambres de charme et espace détente au cœur du vignoble.`);
      } else if (seoType === 'gbp') {
        setSeoOutput(`🍷 Nouveauté à l'Auberge Ramstein à Scherwiller ! 🍽️\n\nNous sommes ravis de vous présenter notre nouvelle carte de saison au restaurant ! Le Chef met à l'honneur les vignerons de Scherwiller et les producteurs régionaux.\n\nVenez passer un moment convivial en terrasse ou dans notre salle de restaurant chaleureuse.\n\n📍 Réservez directement en ligne sur notre site officiel ou appelez-nous au 03 88 92 15 54.`);
      } else {
        setSeoOutput(`❓ Q: Proposez-vous un parking à l'Auberge Ramstein ?\n💡 R: Oui, nous mettons à disposition un parking privé gratuit pour l'ensemble de nos clients résidents et de notre restaurant.\n\n❓ Q: L'hôtel dispose-t-il d'équipements de bien-être ?\n💡 R: Absolument, notre établissement dispose d'un espace spa détente réservé à nos clients pour prolonger votre séjour sur la Route des Vins.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-md space-y-5">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-200 mb-1">Boîte à Outils SEO Local</h3>
            <p className="text-xs text-stone-400">Optimisez la visibilité de l'Auberge sur Google Maps et les moteurs de recherche.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-300">Type de contenu SEO</label>
            <div className="space-y-2">
              {[
                { id: 'meta', title: 'Balises Meta (Title & Description)', desc: 'Pour le site internet de l\'auberge' },
                { id: 'gbp', title: 'Publication Google Business', desc: 'Pour la fiche Google Maps' },
                { id: 'faq', title: 'FAQ Optimisée SEO', desc: 'Questions récurrentes des clients' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSeoType(item.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                    seoType === item.id 
                      ? 'bg-amber-950/40 border-amber-600/60 text-amber-200' 
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-200">{item.title}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-2">
              Sujet ou Page Ciblée
            </label>
            <input
              type="text"
              value={pageSubject}
              onChange={(e) => setPageSubject(e.target.value)}
              placeholder="Ex: Soirée accors mets & vins Riesling de Scherwiller"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            onClick={generateSeoContent}
            disabled={isLoading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Générer le contenu SEO</span>
          </button>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-md h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
              <span className="text-sm font-serif font-bold text-stone-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-500" /> Résultat Rédactionnel SEO
              </span>
              {seoOutput && (
                <button
                  onClick={() => handleCopy(seoOutput, 'seo')}
                  className="text-xs bg-stone-900 hover:bg-stone-800 text-amber-400 px-3 py-1.5 rounded-lg border border-stone-700 flex items-center gap-1.5"
                >
                  {copiedId === 'seo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copier</span>
                </button>
              )}
            </div>

            {seoOutput ? (
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-xs text-stone-300 whitespace-pre-wrap leading-relaxed font-mono">
                {seoOutput}
              </div>
            ) : (
              <div className="text-center py-16 text-stone-500">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-xs">Choisissez un type de contenu et cliquez sur générer.</p>
              </div>
            )}
          </div>

          <div className="mt-6 bg-amber-950/20 border border-amber-800/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-stone-400">
              <strong className="text-stone-200">Conseil Référencement Scherwiller :</strong> Mentionnez toujours le terme <em>"Scherwiller"</em> et <em>"Route des Vins d'Alsace"</em> dans vos fiches et articles. Ce sont les mots-clés locaux les plus recherchés par les touristes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// TAB 3: RÉPONSES AVIS CLIENTS GOOGLE
// ----------------------------------------------------------------------
function ReviewResponder({ callGeminiText, handleCopy, copiedId }) {
  const [reviewRating, setReviewRating] = useState(5);
  const [clientReview, setClientReview] = useState(
    "Un séjour merveilleux à l'Auberge Ramstein ! La cuisine du restaurant est un vrai régal et le service est très attentionné. Nous avons adoré le cadre au milieu des vignes de Scherwiller."
  );
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const generateReply = async () => {
    setIsReplying(true);

    const systemInstruction = `Tu es le propriétaire de l'Auberge Ramstein à Scherwiller. 
Rédige une réponse chaleureuse, professionnelle et personnalisée à l'avis laissé par un client.
Si l'avis est très positif (4-5 étoiles), remercie-le et réinvite-le à revenir goûter les prochaines créations du Chef.
Si l'avis présente des réserves (1-3 étoiles), reste courtois, compréhensif et propose d'échanger en privé pour améliorer l'expérience.`;

    const prompt = `Avis client (${reviewRating}/5 étoiles) : "${clientReview}"`;

    try {
      const res = await callGeminiText(prompt, systemInstruction);
      setReply(res);
    } catch (err) {
      if (reviewRating >= 4) {
        setReply(`Un grand merci pour ce chaleureux commentaire ! Nous sommes ravis que vous ayez apprécié notre cuisine gastronomique ainsi que le cadre reposant de notre auberge à Scherwiller.\n\nToute l'équipe de l'Auberge Ramstein espère avoir le plaisir de vous accueillir à nouveau très bientôt sur la Route des Vins ! 🍇🍷`);
      } else {
        setReply(`Bonjour, nous vous remercions d'avoir pris le temps de partager votre avis. Nous sommes désolés que votre expérience n'ait pas été totalement à la hauteur de vos attentes.\n\nLa satisfaction de nos hôtes est notre priorité absolue à l'Auberge Ramstein. N'hésitez pas à nous contacter directement par téléphone afin d'échanger ensemble.\n\nCordialement, La Direction.`);
      }
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-md space-y-4">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-200 mb-1">Réponse Automatique aux Avis Google</h3>
            <p className="text-xs text-stone-400">Collez l'avis reçu sur Google Maps pour obtenir une réponse sur-mesure.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">Note attribuée par le client</label>
            <div className="flex gap-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    reviewRating === star
                      ? 'bg-amber-600/20 border-amber-600 text-amber-300'
                      : 'bg-stone-900 border-stone-800 text-stone-500'
                  }`}
                >
                  <span>{star}</span>
                  <Star className={`w-3.5 h-3.5 ${reviewRating >= star ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">Texte de l'avis client</label>
            <textarea
              rows={4}
              value={clientReview}
              onChange={(e) => setClientReview(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-600"
            />
          </div>

          <button
            onClick={generateReply}
            disabled={isReplying}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isReplying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            <span>Générer la Réponse Professionnelle</span>
          </button>
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-md h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
              <span className="text-sm font-serif font-bold text-stone-200 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" /> Réponse Prête à Publier
              </span>
              {reply && (
                <button
                  onClick={() => handleCopy(reply, 'reply')}
                  className="text-xs bg-stone-900 hover:bg-stone-800 text-amber-400 px-3 py-1.5 rounded-lg border border-stone-700 flex items-center gap-1.5"
                >
                  {copiedId === 'reply' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copier pour Google</span>
                </button>
              )}
            </div>

            {reply ? (
              <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-xs text-stone-300 whitespace-pre-wrap leading-relaxed">
                {reply}
              </div>
            ) : (
              <div className="text-center py-16 text-stone-500">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-xs">Cliquez sur générer pour créer la réponse.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// TAB 4: PLANIFICATEUR & META BUSINESS
// ----------------------------------------------------------------------
function MetaPlanner({ handleCopy, copiedId }) {
  const posts = [
    {
      id: 1,
      day: 'Vendredi',
      date: '12:00',
      type: 'Gastronomie',
      text: "Weekend gourmand à Scherwiller ! 🍷 Venez découvrir notre suggestion du Chef accompagnée d'un cru d'Alsace d'exception.",
      hashtags: '#AubergeRamstein #GastronomieAlsace #Scherwiller'
    },
    {
      id: 2,
      day: 'Dimanche',
      date: '18:30',
      type: 'Séjour & Spa',
      text: "Prolongez le week-end au calme... Une nuit au cœur du vignoble suivie d'un petit-déjeuner alsacien. 🛌✨",
      hashtags: '#HotelAlsace #WeekendVignoble #AubergeRamstein'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
          <div>
            <h3 className="text-base font-serif font-bold text-stone-200">Planificateur Semaine</h3>
            <p className="text-xs text-stone-400">Préparez vos publications puis collez-les directement dans Meta Business Suite.</p>
          </div>
          <a
            href="https://business.facebook.com/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-medium text-xs rounded-xl shadow flex items-center gap-2 w-fit"
          >
            <Share2 className="w-4 h-4" /> Ouvrir Meta Business Suite
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-800/40">
                  {post.day} • {post.date}
                </span>
                <span className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                  {post.type}
                </span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">{post.text}</p>

              <div className="text-[11px] text-amber-500 font-mono">{post.hashtags}</div>

              <button
                onClick={() => handleCopy(`${post.text}\n\n${post.hashtags}`, `plan-${post.id}`)}
                className="w-full py-2 bg-stone-950 hover:bg-stone-800 text-stone-300 text-xs rounded-lg border border-stone-800 flex items-center justify-center gap-2 transition-all"
              >
                {copiedId === `plan-${post.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copier pour Meta Suite</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
