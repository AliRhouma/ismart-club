import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';
import { Search, Shield, Calendar, Users, AlertTriangle, ChevronRight, X, Scale } from 'lucide-react';

interface ReglementData {
  id: number;
  title: string;
  category: string;
  description: string;
  effectiveDate: string;
  appliesTo: string[];
  status: 'Active' | 'Draft' | 'Archived';
  priority: 'High' | 'Medium' | 'Low';
  articles: ArticleData[];
}

interface ArticleData {
  num: string;
  title: string;
  content: string;
}

const SAMPLE_REGLEMENTS: ReglementData[] = [
  {
    id: 1,
    title: 'Code de Conduite des Joueurs',
    category: 'Discipline',
    description: 'Regles de comportement attendues de tous les joueurs du club, incluant la ponctualite, le respect des coequipiers et du staff, et la representation du club.',
    effectiveDate: '1 Jan 2026',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Academie'],
    status: 'Active',
    priority: 'High',
    articles: [
      { num: 'Art. 1', title: 'Ponctualite', content: 'Tout joueur doit se presenter au minimum 30 minutes avant le debut de chaque entrainement et 90 minutes avant chaque match officiel. Tout retard non justifie sera sanctionne selon le bareme en vigueur.' },
      { num: 'Art. 2', title: 'Tenue vestimentaire', content: 'Le port de la tenue officielle du club est obligatoire lors de toutes les activites collectives: entrainements, matchs, deplacements et evenements mediatiques.' },
      { num: 'Art. 3', title: 'Respect mutuel', content: 'Les joueurs doivent faire preuve de respect envers leurs coequipiers, le staff technique, les arbitres et les supporters. Tout comportement irrespectueux fera l\'objet de sanctions disciplinaires.' },
      { num: 'Art. 4', title: 'Usage des installations', content: 'Les joueurs s\'engagent a utiliser les installations du club avec soin et a signaler toute degradation. L\'acces aux locaux est strictement reserve aux horaires autorises.' },
    ],
  },
  {
    id: 2,
    title: 'Reglement Interieur du Personnel',
    category: 'Administratif',
    description: 'Conditions de travail, horaires, conges, et obligations du personnel administratif et technique du club.',
    effectiveDate: '1 Jan 2026',
    appliesTo: ['Staff Technique', 'Staff Administratif', 'Staff Medical'],
    status: 'Active',
    priority: 'High',
    articles: [
      { num: 'Art. 1', title: 'Horaires de travail', content: 'Les horaires de travail sont fixes par le directeur general. Le personnel administratif travaille du lundi au vendredi de 9h a 17h. Le staff technique adapte ses horaires selon le calendrier sportif.' },
      { num: 'Art. 2', title: 'Conges', content: 'Chaque employe beneficie de 25 jours ouvrables de conges payes par an. Les demandes de conges doivent etre soumises au minimum 15 jours a l\'avance.' },
      { num: 'Art. 3', title: 'Confidentialite', content: 'Tout membre du personnel est tenu au secret professionnel concernant les informations strategiques, medicales et financieres du club.' },
    ],
  },
  {
    id: 3,
    title: 'Politique Anti-Dopage',
    category: 'Sante',
    description: 'Engagement du club contre le dopage, procedures de controle, et sanctions en cas de non-respect.',
    effectiveDate: '1 Sep 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs'],
    status: 'Active',
    priority: 'High',
    articles: [
      { num: 'Art. 1', title: 'Interdiction absolue', content: 'L\'utilisation de toute substance figurant sur la liste des produits interdits par l\'AMA (Agence Mondiale Antidopage) est formellement interdite. Cela inclut les stimulants, les anabolisants, les hormones de croissance et les diuretiques.' },
      { num: 'Art. 2', title: 'Controles', content: 'Les joueurs peuvent etre soumis a des controles antidopage a tout moment, tant en competition qu\'en dehors. Le refus de se soumettre a un controle est considere comme un resultat positif.' },
      { num: 'Art. 3', title: 'Sanctions', content: 'Tout joueur controle positif sera suspendu immediatement. Les sanctions vont de 2 ans de suspension pour une premiere infraction a une exclusion definitive en cas de recidive.' },
      { num: 'Art. 4', title: 'Supplements nutritionnels', content: 'Les joueurs doivent obtenir l\'approbation du service medical avant de consommer tout supplement nutritionnel. Le club decline toute responsabilite en cas de prise de supplements non valides.' },
    ],
  },
  {
    id: 4,
    title: 'Utilisation des Installations',
    category: 'Infrastructures',
    description: 'Regles d\'acces et d\'utilisation des vestiaires, terrains d\'entrainement, salle de musculation et autres installations du club.',
    effectiveDate: '1 Aug 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Academie', 'Staff Technique'],
    status: 'Active',
    priority: 'Medium',
    articles: [
      { num: 'Art. 1', title: 'Acces aux terrains', content: 'Les terrains d\'entrainement sont reserves aux seances planifiees. Toute utilisation en dehors des horaires prevus doit etre autorisee par le directeur sportif.' },
      { num: 'Art. 2', title: 'Salle de musculation', content: 'L\'utilisation de la salle de musculation se fait exclusivement sous la supervision d\'un preparateur physique certifie. Les horaires d\'acces libre sont affiches mensuellement.' },
      { num: 'Art. 3', title: 'Vestiaires', content: 'Chaque joueur est responsable de la proprete de son espace. Les objets de valeur doivent etre deposes dans les casiers securises. Le club ne peut etre tenu responsable des pertes ou vols.' },
    ],
  },
  {
    id: 5,
    title: 'Politique des Reseaux Sociaux',
    category: 'Communication',
    description: 'Directives sur l\'utilisation des reseaux sociaux par les joueurs et le personnel, protection de l\'image du club.',
    effectiveDate: '1 Jul 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Staff Technique', 'Staff Administratif'],
    status: 'Active',
    priority: 'Medium',
    articles: [
      { num: 'Art. 1', title: 'Contenu autorise', content: 'Les publications personnelles ne doivent pas porter atteinte a l\'image du club, de ses partenaires ou de ses membres. Les informations tactiques et medicales sont strictement confidentielles.' },
      { num: 'Art. 2', title: 'Periodes de restriction', content: 'L\'utilisation des reseaux sociaux est interdite dans les 2 heures precedant un match et jusqu\'a 1 heure apres la fin de la rencontre. Pendant les stages, les horaires sont definis par le staff.' },
      { num: 'Art. 3', title: 'Partenariats personnels', content: 'Tout partenariat ou collaboration sur les reseaux sociaux doit etre prealablement valide par le service communication du club afin d\'eviter tout conflit d\'interet.' },
    ],
  },
  {
    id: 6,
    title: 'Gestion des Blessures',
    category: 'Sante',
    description: 'Protocole de declaration et de suivi des blessures, droits et devoirs des joueurs blesses.',
    effectiveDate: '1 May 2025',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Staff Medical'],
    status: 'Active',
    priority: 'High',
    articles: [
      { num: 'Art. 1', title: 'Declaration obligatoire', content: 'Toute douleur ou gene physique doit etre signalee immediatement au staff medical. Un joueur ne peut pas decider seul de poursuivre un entrainement ou un match en cas de blessure.' },
      { num: 'Art. 2', title: 'Protocole de soins', content: 'Le joueur blesse doit suivre scrupuleusement le protocole de soins etabli par le staff medical. Toute consultation externe doit etre validee par le medecin du club.' },
      { num: 'Art. 3', title: 'Reprise progressive', content: 'La reprise de l\'entrainement collectif est conditionnee par l\'aval du staff medical. Un protocole de reprise individuelle sera mis en place avant tout retour avec le groupe.' },
    ],
  },
  {
    id: 7,
    title: 'Sanctions Disciplinaires',
    category: 'Discipline',
    description: 'Echelle des sanctions en cas de manquement aux reglements, procedure d\'appel.',
    effectiveDate: '1 Jan 2026',
    appliesTo: ['Joueurs Senior', 'Joueurs Espoirs', 'Staff Technique'],
    status: 'Active',
    priority: 'High',
    articles: [
      { num: 'Art. 1', title: 'Avertissement verbal', content: 'Premier niveau de sanction pour les infractions mineures. L\'avertissement est consigne dans le dossier du joueur mais n\'entraine pas de sanction financiere.' },
      { num: 'Art. 2', title: 'Avertissement ecrit', content: 'En cas de recidive ou d\'infraction moderee, un avertissement ecrit est emis. Trois avertissements ecrits sur une saison entrainent automatiquement une mise a pied.' },
      { num: 'Art. 3', title: 'Amendes', content: 'Les amendes sont fixees selon un bareme proportionnel au salaire du joueur. Le montant varie de 5% a 25% du salaire mensuel selon la gravite de l\'infraction.' },
      { num: 'Art. 4', title: 'Mise a pied', content: 'La mise a pied temporaire peut aller de 1 a 30 jours. Durant cette periode, le joueur est exclu de toutes les activites du club et sa remuneration est suspendue.' },
      { num: 'Art. 5', title: 'Procedure d\'appel', content: 'Tout joueur sanctionne dispose d\'un delai de 5 jours ouvrables pour faire appel devant la commission disciplinaire. L\'appel est suspensif pour les sanctions superieures a 7 jours.' },
    ],
  },
];

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  'Discipline':   { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', icon: '#dc2626' },
  'Administratif': { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', icon: '#2563eb' },
  'Sante':        { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', icon: '#16a34a' },
  'Infrastructures': { bg: '#f8fafc', text: '#334155', border: '#e2e8f0', icon: '#64748b' },
  'Communication': { bg: '#fffbeb', text: '#92400e', border: '#fde68a', icon: '#d97706' },
};

const getCatStyle = (cat: string) =>
  CATEGORY_STYLES[cat] || { bg: '#f8fafc', text: '#334155', border: '#e2e8f0', icon: '#64748b' };

const SelectionModal = ({
  onSelect,
  onClose,
}: {
  onSelect: (r: ReglementData) => void;
  onClose: () => void;
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const categories = [...new Set(SAMPLE_REGLEMENTS.map((r) => r.category))];

  const filtered = SAMPLE_REGLEMENTS.filter((r) => {
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCat || r.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="rgl-modal-backdrop" onMouseDown={onClose}>
      <div className="rgl-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="rgl-modal-header">
          <div className="rgl-modal-header-left">
            <Scale size={20} />
            <h2 className="rgl-modal-title">Inserer un Reglement</h2>
          </div>
          <button className="rgl-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="rgl-modal-search-bar">
          <Search size={16} className="rgl-modal-search-icon" />
          <input
            className="rgl-modal-search-input"
            placeholder="Rechercher un reglement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="rgl-modal-filters">
          <button
            className={`rgl-filter-chip ${!selectedCat ? 'active' : ''}`}
            onClick={() => setSelectedCat(null)}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`rgl-filter-chip ${selectedCat === cat ? 'active' : ''}`}
              onClick={() => setSelectedCat(cat === selectedCat ? null : cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="rgl-modal-list">
          {filtered.length === 0 && (
            <div className="rgl-modal-empty">Aucun reglement trouve</div>
          )}
          {filtered.map((r) => {
            const style = getCatStyle(r.category);
            return (
              <button
                key={r.id}
                className="rgl-modal-item"
                onClick={() => onSelect(r)}
              >
                <div
                  className="rgl-modal-item-icon"
                  style={{ background: style.bg, color: style.icon }}
                >
                  <Shield size={18} />
                </div>
                <div className="rgl-modal-item-body">
                  <div className="rgl-modal-item-top">
                    <span className="rgl-modal-item-title">{r.title}</span>
                    <span
                      className="rgl-modal-item-cat"
                      style={{
                        background: style.bg,
                        color: style.text,
                        borderColor: style.border,
                      }}
                    >
                      {r.category}
                    </span>
                  </div>
                  <p className="rgl-modal-item-desc">{r.description}</p>
                  <div className="rgl-modal-item-meta">
                    <span>
                      <Calendar size={12} />
                      {r.effectiveDate}
                    </span>
                    <span>
                      <Users size={12} />
                      {r.appliesTo.length} groupe{r.appliesTo.length > 1 ? 's' : ''}
                    </span>
                    <span>{r.articles.length} articles</span>
                  </div>
                </div>
                <ChevronRight size={16} className="rgl-modal-item-arrow" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RenderedReglement = ({ data }: { data: ReglementData }) => {
  const style = getCatStyle(data.category);

  return (
    <div className="rgl-rendered">
      <div className="rgl-rendered-header" style={{ borderLeftColor: style.icon }}>
        <div className="rgl-rendered-header-top">
          <div className="rgl-rendered-icon" style={{ background: style.bg, color: style.icon }}>
            <Shield size={20} />
          </div>
          <div className="rgl-rendered-header-text">
            <h3 className="rgl-rendered-title">{data.title}</h3>
            <div className="rgl-rendered-meta-row">
              <span
                className="rgl-rendered-cat"
                style={{ background: style.bg, color: style.text, borderColor: style.border }}
              >
                {data.category}
              </span>
              <span className={`rgl-rendered-priority rgl-priority--${data.priority.toLowerCase()}`}>
                {data.priority === 'High' && <AlertTriangle size={12} />}
                {data.priority}
              </span>
              <span className="rgl-rendered-status">{data.status}</span>
            </div>
          </div>
        </div>
        <p className="rgl-rendered-desc">{data.description}</p>
        <div className="rgl-rendered-info-bar">
          <span className="rgl-rendered-info">
            <Calendar size={13} />
            En vigueur: {data.effectiveDate}
          </span>
          <span className="rgl-rendered-info">
            <Users size={13} />
            {data.appliesTo.join(', ')}
          </span>
        </div>
      </div>

      <div className="rgl-rendered-articles">
        {data.articles.map((a, i) => (
          <div key={i} className="rgl-rendered-article">
            <div className="rgl-rendered-article-num" style={{ color: style.icon }}>
              {a.num}
            </div>
            <div className="rgl-rendered-article-body">
              <h4 className="rgl-rendered-article-title">{a.title}</h4>
              <p className="rgl-rendered-article-text">{a.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ReglementBlockComponent = ({ node, updateAttributes }: any) => {
  const attrs = node.attrs;
  const [showModal, setShowModal] = useState(!attrs.reglementId);

  const hasReglement = !!attrs.reglementId;

  const handleSelect = (r: ReglementData) => {
    updateAttributes({
      reglementId: r.id,
      reglementTitle: r.title,
      reglementCategory: r.category,
      reglementDescription: r.description,
      reglementEffectiveDate: r.effectiveDate,
      reglementAppliesTo: r.appliesTo,
      reglementStatus: r.status,
      reglementPriority: r.priority,
      reglementArticles: r.articles,
    });
    setShowModal(false);
  };

  const selectedData: ReglementData | null = hasReglement
    ? {
        id: attrs.reglementId,
        title: attrs.reglementTitle,
        category: attrs.reglementCategory,
        description: attrs.reglementDescription,
        effectiveDate: attrs.reglementEffectiveDate,
        appliesTo: attrs.reglementAppliesTo || [],
        status: attrs.reglementStatus,
        priority: attrs.reglementPriority,
        articles: attrs.reglementArticles || [],
      }
    : null;

  return (
    <NodeViewWrapper as="div" className="rgl-block-wrapper">
      {showModal && (
        <SelectionModal
          onSelect={handleSelect}
          onClose={() => {
            if (hasReglement) setShowModal(false);
          }}
        />
      )}

      {selectedData ? (
        <div className="rgl-block-selected">
          <button
            className="rgl-change-btn print:hidden"
            onClick={() => setShowModal(true)}
          >
            Changer le reglement
          </button>
          <RenderedReglement data={selectedData} />
        </div>
      ) : (
        <div className="rgl-block-empty" onClick={() => setShowModal(true)}>
          <Scale size={32} strokeWidth={1.5} />
          <span className="rgl-block-empty-title">Inserer un Reglement</span>
          <span className="rgl-block-empty-sub">
            Cliquez pour selectionner un reglement du club
          </span>
        </div>
      )}
    </NodeViewWrapper>
  );
};

export const ReglementBlock = Node.create({
  name: 'reglementBlock',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      reglementId: { default: null },
      reglementTitle: { default: '' },
      reglementCategory: { default: '' },
      reglementDescription: { default: '' },
      reglementEffectiveDate: { default: '' },
      reglementAppliesTo: { default: [] },
      reglementStatus: { default: '' },
      reglementPriority: { default: '' },
      reglementArticles: { default: [] },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="reglement-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'reglement-block' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ReglementBlockComponent);
  },

  addCommands() {
    return {
      setReglementBlock:
        () =>
        ({ commands }: any) =>
          commands.insertContent({
            type: this.name,
            attrs: {
              reglementId: null,
              reglementTitle: '',
              reglementCategory: '',
              reglementDescription: '',
              reglementEffectiveDate: '',
              reglementAppliesTo: [],
              reglementStatus: '',
              reglementPriority: '',
              reglementArticles: [],
            },
          }),
    } as any;
  },
});
