import { useState } from "react";

const C = {
  bg:       "rgb(19,19,19)",
  surface:  "rgb(24,24,24)",
  raised:   "rgb(30,30,30)",
  elevated: "rgb(36,36,36)",
  border:   "rgb(40,40,40)",
  divider:  "rgb(32,32,32)",
  muted:    "rgb(82,82,82)",
  sub:      "rgb(115,115,115)",
  dim:      "rgb(150,150,150)",
  text:     "rgb(212,212,212)",
  bright:   "rgb(245,245,245)",
  accent:   "rgb(0,145,255)",
  accentDim:"rgba(0,145,255,0.12)",
};

const roles = [
  "Préparateur Physique","Responsable Senior","Dirigeant","Directeur Technique",
  "Player","Admin","Secrétaire générale","Parent","Trainer","Trésorier",
];

const permissionGroups = [
  { label: "Gestion des administrateurs", permissions: ["Voir les administrateurs","Créer un administrateur protégé","Modifier un administrateur","Créer un administrateur","Supprimer un administrateur","Bannir un utilisateur"] },
  { label: "Gestion du programme annuel", permissions: ["Voir le programme annuel","Créer un programme annuel","Supprimer un programme annuel","Modifier un programme annuel"] },
  { label: "Gestion des projets de jeu", permissions: ["Voir les projets de jeu","Créer un projet de jeu","Supprimer un projet de jeu","Modifier un projet de jeu"] },
  { label: "Gestion des rôles", permissions: ["Voir les rôles","Créer un rôle","Modifier un rôle","Créer un rôle protégé","Modifier un rôle protégé","Supprimer un rôle","Voir les scopes","Voir les permissions"] },
  { label: "Gestion des transactions", permissions: ["Supprimer une transaction","Modifier une transaction","Créer une configuration de transaction","Créer une transaction","Voir les transactions","Voir la configuration des transactions","Modifier une configuration de transaction"] },
  { label: "Gestion des discussions", permissions: ["Créer un groupe de discussion","Modifier un groupe de discussion","Supprimer un groupe de discussion","Créer un groupe de discussion privé"] },
  { label: "Gestion des saisons", permissions: ["Voir les saisons","Supprimer une saison","Créer une saison","Modifier une saison"] },
  { label: "Gestion des séances d'entraînement", permissions: ["Supprimer une séance d'entraînement","Créer une séance d'entraînement","Voir les séances d'entraînement","Modifier n'importe quelle séance d'entraînement","Modifier une séance d'entraînement","Supprimer n'importe quelle séance d'entraînement","Modifier un modèle d'évaluation","Faire une évaluation de séance d'entraînement","Voir les évaluations","Créer un modèle d'évaluation","Supprimer un modèle d'évaluation","Faire un incident de séance","Faire un rappel de séance","Voir les convocations de séance","Créer un groupe de discussion pour la séance"] },
  { label: "Gestion des joueurs", permissions: ["Voir les joueurs","Modifier un joueur","Créer un joueur","Supprimer un joueur","Genèrer lien d'invitation parent"] },
  { label: "Gestion des éducateurs", permissions: ["Créer un éducateur","Voir les éducateurs","Modifier un éducateur","Supprimer un éducateur"] },
  { label: "Gestion des présences", permissions: ["Supprimer la présence","Supprimer n'importe quelle présence","Modifier n'importe quelle présence","Modifier la présence","Marquer les présences","Voir tous les présences","Voir les présences","Marquer la présence des éducateurs"] },
  { label: "Gestion des catégories", permissions: ["Voir les catégories","Créer une catégorie","Modifier une catégorie","Supprimer une catégorie"] },
  { label: "Gestion des procédés", permissions: ["Modifier n'importe quel procédé","Modifier un procédé","Supprimer n'importe quel procédé","Créer un procédé","Voir les procédés","Supprimer un procédé"] },
  { label: "Gestion des équipes", permissions: ["Voir les équipes","Créer une équipe","Modifier une équipe","Supprimer une équipe"] },
  { label: "Gestion des événements", permissions: ["Voir les événements","Créer un événement","Modifier un événement","Supprimer un événement","Modifier n'importe quel événement","Supprimer n'importe quel événement"] },
  { label: "Gestion des convocations d'événements", permissions: ["Voir les convocations d'événements","Faire une convocation d'événement","Faire une convocation pour n'importe quel événement"] },
  { label: "Gestion des conseils tactiques", permissions: ["Voir les conseils tactiques","Créer un conseil tactique","Modifier un conseil tactique","Supprimer un conseil tactique","Modifier n'importe quel conseil tactique","Supprimer n'importe quel conseil tactique","Assigner un conseil tactique"] },
  { label: "Gestion des collectes", permissions: ["Modifier une collecte","Supprimer une collecte","Modifier n'importe quelle collecte","Supprimer n'importe quelle collecte","Créer une collecte","Voir les collectes","Voir mes collectes"] },
  { label: "Gestion des défis", permissions: ["Voir les défis","Voir mes défis","Créer un défi","Modifier un défi","Supprimer un défi","Modifier n'importe quel défi","Supprimer n'importe quel défi","Répondre à un défi"] },
  { label: "Gestion des questionnaires", permissions: ["Voir les questionnaires","Répondre à un questionnaire","Créer un questionnaire","Modifier un questionnaire","Supprimer un questionnaire","Modifier n'importe quel questionnaire","Supprimer n'importe quel questionnaire","Voir mes questionnaires"] },
  { label: "Gestion de la hiérarchie", permissions: ["Gérer la hiérarchie"] },
  { label: "Gestion de la structure de l'équipe", permissions: ["Gérer la structure de l'équipe"] },
  { label: "Gestion des formations", permissions: ["Voir les formations","Voir mes formations","Répondre à une formation","Créer une formation","Modifier une formation","Supprimer une formation","Modifier n'importe quelle formation","Supprimer n'importe quelle formation"] },
  { label: "Gestion des qualifications", permissions: ["Voir les qualifications","Voir mes qualifications","Créer une qualification","Modifier une qualification","Supprimer une qualification","Modifier n'importe quelle qualification","Supprimer n'importe quelle qualification","Affecter une qualification"] },
  { label: "Gestion des fiches de postes", permissions: ["Voir les fiches de postes","Voir mes fiches de postes","Répondre à une fiche de poste","Créer une fiche de poste","Modifier une fiche de poste","Supprimer une fiche de poste","Modifier n'importe quelle fiche de poste","Supprimer n'importe quelle fiche de poste"] },
  { label: "Gestion des notes de frais", permissions: ["Voir les notes de frais","Voir mes notes de frais","Répondre à une note de frais","Créer une note de frais","Modifier une note de frais","Supprimer une note de frais","Modifier n'importe quelle note de frais","Supprimer n'importe quelle note de frais"] },
  { label: "Gestion des objectifs", permissions: ["Voir les objectifs","Voir mes objectifs","Répondre à un objectif","Créer un objectif","Modifier un objectif"] },
  { label: "Gestion des règlements", permissions: ["Voir les règlements","Voir mes règlements","Répondre à un règlement","Créer un règlement","Modifier un règlement","Supprimer un règlement","Modifier n'importe quel règlement","Supprimer n'importe quel règlement"] },
  { label: "Gestion de la communauté", permissions: ["Voir les ressources","Importer une ressource","Évaluer une ressource","Voir les paramètres de partage de ressources","Modifier les paramètres de partage de ressources","Voir l'historique de partage de ressources","Voir les paramètres de partage","Modifier les paramètres de partage","Envoyer une demande de partenariat","Gérer les demandes de partenariat"] },
  { label: "Gestion des matchs", permissions: ["Voir les matchs","Modifier un match","Supprimer un match","Dupliquer un match","Faire une convocation de match","Faire une composition de match","Faire une évaluation de match","Donner un conseil tactique pour un match","Lancer le match","Créer un groupe de discussion pour le match","Voir les convocations de match","Faire un incident de match"] },
  { label: "Gestion des parents", permissions: ["Créer un parent","Modifier un parent","Supprimer un parent","Voir les parents"] },
  { label: "Gestion des réunions", permissions: ["Voir les réunions","Créer une réunion","Modifier une réunion","Supprimer une réunion","Modifier n'importe quelle réunion","Supprimer n'importe quelle réunion"] },
  { label: "Gestion des dossiers", permissions: ["Gérer ses dossiers"] },
  { label: "Gestion des compétitions", permissions: ["Voir les compétitions","Créer une compétition","Modifier une compétition","Supprimer une compétition","Gérer les phases de compétition","Gérer les équipes de compétition","Gérer les groupes de compétition","Gérer les journées de compétition","Gérer les matchs de compétition","Gérer les résultats de compétition","Valider les résultats de compétition","Contester les résultats de compétition","Calculer le classement de compétition","Voir le classement de compétition","Voir les statistiques de compétition"] },
  { label: "Importation des données", permissions: ["Importer des données"] },
  { label: "Gestion des données ouvertes", permissions: ["Voir les données ouvertes","Importer les données ouvertes"] },
  { label: "Gestion des fédérations", permissions: ["Voir les fédérations","Créer une fédération","Modifier une fédération","Supprimer une fédération"] },
  { label: "Gestion des compositions", permissions: ["Voir les compositions","Créer une composition","Modifier une composition","Supprimer une composition"] },
];

function buildInitialState() {
  const state: Record<string, Record<string, boolean>> = {};
  roles.forEach(role => {
    state[role] = {};
    permissionGroups.forEach(g => g.permissions.forEach(p => { state[role][p] = false; }));
  });
  const seed = (role: string, perms: string[]) => perms.forEach(p => { if (state[role]) state[role][p] = true; });
  seed("Admin", ["Voir les administrateurs","Créer un administrateur","Voir les rôles","Créer un rôle","Modifier un rôle","Voir les saisons","Créer une saison","Voir les joueurs","Modifier un joueur","Créer un joueur","Supprimer un joueur","Voir les équipes","Créer une équipe","Voir les matchs","Modifier un match","Voir les présences","Marquer les présences","Voir les évaluations","Bannir un utilisateur","Supprimer un administrateur","Voir les transactions","Créer une transaction","Voir les compétitions","Créer une compétition"]);
  seed("Trainer", ["Voir les joueurs","Voir les séances d'entraînement","Créer une séance d'entraînement","Marquer les présences","Voir les présences","Voir les évaluations","Faire une évaluation de séance d'entraînement","Voir les équipes","Voir les matchs","Faire un rappel de séance","Voir les convocations de séance"]);
  seed("Player", ["Voir les séances d'entraînement","Voir les présences","Voir mes défis","Répondre à un défi","Voir mes questionnaires","Voir les matchs","Voir mes formations","Voir mes collectes","Voir mes objectifs"]);
  return state;
}

const CheckIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const DashIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path d="M1.5 4H6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <circle cx="5.5" cy="5.5" r="3.8" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
    style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.18s ease" }}>
    <path d="M2.5 4L5.5 7L8.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M7.5 1.5L2 4v3.5C2 10.8 4.5 13.6 7.5 14.3c3-0.7 5.5-3.5 5.5-6.8V4L7.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);

function Checkbox({ checked, indeterminate, onClick, size = 14 }: {
  checked: boolean;
  indeterminate: boolean;
  onClick: () => void;
  size?: number;
}) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onClick(); }}
      style={{
        width: size, height: size, borderRadius: 3, flexShrink: 0,
        border: `1.5px solid ${checked || indeterminate ? C.accent : C.muted}`,
        background: checked ? C.accent : indeterminate ? C.accentDim : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: checked ? "white" : C.accent,
        transition: "border-color 0.12s, background 0.12s",
      }}
    >
      {checked && <CheckIcon />}
      {!checked && indeterminate && <DashIcon />}
    </div>
  );
}

export default function ProfilesPage() {
  const [permissions, setPermissions] = useState(buildInitialState);
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(permissionGroups.map(g => [g.label, true]))
  );
  const [search, setSearch] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const togglePerm = (perm: string) => {
    setPermissions(p => ({ ...p, [selectedRole]: { ...p[selectedRole], [perm]: !p[selectedRole][perm] } }));
    setHasChanges(true);
  };

  const toggleGroup = (label: string, value: boolean) => {
    const perms = permissionGroups.find(g => g.label === label)?.permissions || [];
    setPermissions(p => ({ ...p, [selectedRole]: { ...p[selectedRole], ...Object.fromEntries(perms.map(pp => [pp, value])) } }));
    setHasChanges(true);
  };

  const getCount = (group: typeof permissionGroups[number]) => {
    const enabled = group.permissions.filter(p => permissions[selectedRole]?.[p]).length;
    return { enabled, total: group.permissions.length };
  };

  const totalEnabled = Object.values(permissions[selectedRole] || {}).filter(Boolean).length;
  const totalAll = Object.values(permissions[selectedRole] || {}).length;
  const pct = Math.round((totalEnabled / totalAll) * 100);

  const filteredGroups = permissionGroups
    .map(g => ({ ...g, permissions: g.permissions.filter(p => !search || p.toLowerCase().includes(search.toLowerCase()) || g.label.toLowerCase().includes(search.toLowerCase())) }))
    .filter(g => !search || g.permissions.length > 0);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Rubik', sans-serif", color: C.text, display: "flex", flexDirection: "column", flex: 1 }}>

      {/* Top bar */}
      <div style={{ height: 52, borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: C.accent, opacity: 0.85 }}><ShieldIcon /></span>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.bright }}>Rôles & Permissions</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {hasChanges && <span style={{ fontSize: 11, color: C.sub }}>Modifications non sauvegardées</span>}
          <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: C.elevated, border: `1px solid ${C.border}`, color: C.text, padding: "5px 11px", borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
            <PlusIcon /> Nouveau rôle
          </button>
          <button
            onClick={() => setHasChanges(false)}
            style={{
              background: hasChanges ? C.accent : C.elevated,
              border: `1px solid ${hasChanges ? C.accent : C.border}`,
              color: hasChanges ? "white" : C.sub,
              padding: "5px 13px", borderRadius: 7, fontSize: 12,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
            }}>
            Sauvegarder
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "14px", gap: 14 }}>

        {/* Sidebar */}
        <div style={{
          width: 210, flexShrink: 0,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          alignSelf: "flex-start",
          position: "sticky",
          top: 0,
          maxHeight: "calc(100vh - 80px)",
        }}>
          <div style={{ padding: "12px 14px 6px", fontSize: 10, fontWeight: 500, color: C.muted, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            Rôles
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {roles.map(role => {
              const active = selectedRole === role;
              const count = Object.values(permissions[role] || {}).filter(Boolean).length;
              return (
                <button
                  key={role}
                  onClick={() => { setSelectedRole(role); setHasChanges(false); }}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "8px 14px",
                    background: active ? C.elevated : "transparent",
                    borderLeft: `2px solid ${active ? C.accent : "transparent"}`,
                    borderTop: "none", borderRight: "none", borderBottom: "none",
                    color: active ? C.bright : C.sub,
                    cursor: "pointer", fontFamily: "inherit", fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "background 0.12s, color 0.12s",
                  }}
                >
                  <span style={{ fontWeight: active ? 500 : 400 }}>{role}</span>
                  <span style={{
                    fontSize: 10,
                    color: active ? C.dim : C.muted,
                    background: active ? C.raised : "transparent",
                    padding: "1px 6px", borderRadius: 4, fontWeight: 500,
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

          {/* Role header */}
          <div style={{ padding: "14px 22px 12px", borderBottom: `1px solid ${C.border}`, background: C.bg, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: C.elevated, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: C.text }}>
                {selectedRole.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.bright }}>{selectedRole}</div>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                  {totalEnabled} / {totalAll} permissions
                  <span style={{ color: C.accent, marginLeft: 5, fontSize: 11 }}>· {pct}%</span>
                </div>
              </div>
              <div style={{ width: 100, height: 3, borderRadius: 9999, background: C.elevated, marginLeft: 4 }}>
                <div style={{ height: "100%", borderRadius: 9999, width: `${pct}%`, background: C.accent, transition: "width 0.25s" }} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 7, background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 10px", width: 200 }}>
              <span style={{ color: C.muted }}><SearchIcon /></span>
              <input
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 12, fontFamily: "inherit", width: "100%" }}
              />
            </div>
          </div>

          {/* Permission groups */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {filteredGroups.map(group => {
                const { enabled, total } = getCount(group);
                const allOn = enabled === total && total > 0;
                const someOn = enabled > 0 && !allOn;
                const open = expandedGroups[group.label] !== false;

                return (
                  <div key={group.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
                    <div
                      onClick={() => setExpandedGroups(p => ({ ...p, [group.label]: !p[group.label] }))}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 13px", cursor: "pointer", borderBottom: open ? `1px solid ${C.divider}` : "none" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <Checkbox checked={allOn} indeterminate={someOn} onClick={() => toggleGroup(group.label, !allOn)} />
                        <span style={{ fontSize: 12, fontWeight: 500, color: C.bright }}>{group.label}</span>
                        <span style={{ fontSize: 10, color: enabled > 0 ? C.dim : C.muted, background: C.raised, padding: "1px 6px", borderRadius: 20, fontWeight: 500 }}>
                          {enabled}/{total}
                        </span>
                      </div>
                      <span style={{ color: C.muted }}><ChevronIcon open={open} /></span>
                    </div>

                    {open && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 1, padding: 6 }}>
                        {group.permissions.map(perm => {
                          const on = permissions[selectedRole]?.[perm];
                          return (
                            <button
                              key={perm}
                              onClick={() => togglePerm(perm)}
                              style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "6px 9px", borderRadius: 5,
                                background: on ? C.raised : "transparent",
                                border: `1px solid ${on ? C.border : "transparent"}`,
                                cursor: "pointer", textAlign: "left",
                                fontFamily: "inherit", transition: "background 0.1s",
                              }}
                            >
                              <Checkbox checked={!!on} indeterminate={false} onClick={() => togglePerm(perm)} size={13} />
                              <span style={{ fontSize: 12, color: on ? C.text : C.sub, transition: "color 0.1s" }}>
                                {perm}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              width: 420,
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "18px 20px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: C.elevated, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
                  <PlusIcon />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: C.bright }}>Nouveau rôle</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div style={{ padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.dim }}>
                  Nom du rôle <span style={{ color: C.accent }}>*</span>
                </label>
                <input
                  placeholder="Ex : Responsable marketing"
                  style={{
                    background: C.elevated,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 13,
                    color: C.bright,
                    fontFamily: "inherit",
                    outline: "none",
                    width: "100%",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.target.style.borderColor = C.accent)}
                  onBlur={e => (e.target.style.borderColor = C.border)}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.dim }}>Description</label>
                <textarea
                  placeholder="Décrivez les responsabilités de ce rôle…"
                  rows={3}
                  style={{
                    background: C.elevated,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 13,
                    color: C.bright,
                    fontFamily: "inherit",
                    outline: "none",
                    resize: "none",
                    width: "100%",
                    lineHeight: "1.5",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.target.style.borderColor = C.accent)}
                  onBlur={e => (e.target.style.borderColor = C.border)}
                />
              </div>
            </div>

            <div style={{ padding: "16px 20px 18px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: C.elevated, border: `1px solid ${C.border}`, color: C.sub, padding: "7px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                Annuler
              </button>
              <button
                style={{ background: C.accent, border: `1px solid ${C.accent}`, color: "white", padding: "7px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 500 }}
              >
                Créer le rôle
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgb(48,48,48); border-radius: 9999px; }
      `}</style>
    </div>
  );
}
