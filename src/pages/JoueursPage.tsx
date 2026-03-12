import { useState } from "react";

const C = {
  bg:       "rgb(19,19,19)",
  surface:  "rgb(24,24,24)",
  raised:   "rgb(30,30,30)",
  elevated: "rgb(36,36,36)",
  border:   "rgb(40,40,40)",
  muted:    "rgb(82,82,82)",
  sub:      "rgb(115,115,115)",
  dim:      "rgb(150,150,150)",
  text:     "rgb(212,212,212)",
  bright:   "rgb(245,245,245)",
  accent:   "rgb(0,145,255)",
  green:    "rgb(34,197,94)",
};

const players = [
  { id: 1, initials: "AS", color: "#4a7fa5", name: "Abdelmalek Smaili", email: "abdelmalek.smaili@gmail.com", category: "Minime, Minime", poste: "Latéral gauche", dob: "5 juil. 2010" },
  { id: 2, initials: null, color: null, name: "Achref El ghoul", email: "achref@gmail.com", category: "", poste: "Elier", dob: "26 juil. 1994" },
  { id: 3, initials: null, color: null, name: "Adem Bougdiri", email: "adem.bougdiri@gmail.com", category: "Minime, Minime", poste: "Latéral gauche", dob: "14 janv. 2010" },
  { id: 4, initials: null, color: null, name: "Ahmed Ben Jemaa", email: "ahmed.benjemaa@gmail.com", category: "Minime, Minime", poste: "Milieu offensif central", dob: "26 oct. 2010" },
  { id: 5, initials: "AB", color: "#5a6ea5", name: "AHMED BOUTAR", email: "ahmed.boutar@gmail.com", category: "Ecole A", poste: "Milieu défensif central", dob: "9 août 2012" },
  { id: 6, initials: null, color: null, name: "Amen allah Gabssi", email: "amenallah.gabssi@gmail.com", category: "Minime, Minime", poste: "Milieu défensif central", dob: "5 avr. 2010" },
  { id: 7, initials: null, color: null, name: "Bilel Trabelsi", email: "bilel.trabelsi@gmail.com", category: "Senior", poste: "Gardien de but", dob: "12 mars 1998" },
  { id: 8, initials: "KM", color: "#a55a5a", name: "Karim Mansour", email: "karim.mansour@gmail.com", category: "Junior", poste: "Défenseur central", dob: "3 juin 2005" },
];

const AvatarPlaceholder = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="rgb(36,36,36)"/>
    <circle cx="18" cy="14" r="6" fill="rgb(70,70,90)"/>
    <ellipse cx="18" cy="28" rx="10" ry="7" fill="rgb(70,70,90)"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UpDownArrows = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 2V10M3.5 4.5L6 2L8.5 4.5M3.5 7.5L6 10L8.5 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GridIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
    <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
    <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M6.5 2V11M2 6.5H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export default function JoueursPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const toggleAll = () => {
    if (allSelected) {
      setSelected([]);
      setAllSelected(false);
    } else {
      setSelected(players.map(p => p.id));
      setAllSelected(true);
    }
  };

  const toggleOne = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", flex: 1, fontFamily: "'Inter', 'Rubik', sans-serif", color: C.text, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "28px 32px 0" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.bright, marginBottom: 20 }}>Joueurs</h1>

        {/* Filters row 1 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", width: 240 }}>
            <span style={{ color: C.muted }}><SearchIcon /></span>
            <input
              placeholder="Rechercher"
              style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 13, fontFamily: "inherit", width: "100%", "::placeholder": { color: C.muted } } as React.CSSProperties}
            />
          </div>

          {/* Season select */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", minWidth: 140 }}>
            <span style={{ fontSize: 13, color: C.text, flex: 1 }}>2026/2027</span>
            <span style={{ color: C.muted }}><UpDownArrows /></span>
          </div>

          {/* Categories select */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", minWidth: 180 }}>
            <span style={{ fontSize: 13, color: C.text, flex: 1 }}>Toutes les catégories</span>
            <span style={{ color: C.muted }}><ChevronDown /></span>
          </div>

          {/* Add player button */}
          <button style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, background: C.green, border: "none", color: "white", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            <PlusIcon /> Ajouter un joueur
          </button>
        </div>

        {/* Filters row 2 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {/* Position */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", minWidth: 190 }}>
            <span style={{ fontSize: 13, color: C.text, flex: 1 }}>Toutes les positions</span>
            <span style={{ color: C.muted }}><ChevronDown /></span>
          </div>

          {/* Birth year */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer", minWidth: 190 }}>
            <span style={{ fontSize: 13, color: C.text, flex: 1 }}>Année de naissance</span>
            <span style={{ color: C.muted }}><ChevronDown /></span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, padding: "0 32px 32px" }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "44px 44px 1fr 180px 220px 200px 44px", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Checkbox checked={allSelected} onChange={toggleAll} />
            </div>
            <div />
            <ColHeader label="Nom & Email" />
            <ColHeader label="Catégorie" />
            <ColHeader label="Poste" />
            <ColHeader label="Année de naissance" />
            <div style={{ display: "flex", justifyContent: "center", color: C.muted }}>
              <GridIcon />
            </div>
          </div>

          {/* Rows */}
          {players.map((player, idx) => {
            const isSelected = selected.includes(player.id);
            return (
              <div
                key={player.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 44px 1fr 180px 220px 200px 44px",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: idx < players.length - 1 ? `1px solid ${C.border}` : "none",
                  background: isSelected ? "rgba(0,145,255,0.04)" : "transparent",
                  transition: "background 0.1s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Checkbox checked={isSelected} onChange={() => toggleOne(player.id)} />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {player.initials ? (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: player.color!, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "white" }}>
                      {player.initials}
                    </div>
                  ) : (
                    <AvatarPlaceholder />
                  )}
                </div>
                <div style={{ paddingRight: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.bright }}>{player.name}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{player.email}</div>
                </div>
                <div style={{ fontSize: 13, color: C.dim }}>{player.category}</div>
                <div style={{ fontSize: 13, color: C.dim }}>{player.poste}</div>
                <div style={{ fontSize: 13, color: C.dim }}>{player.dob}</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4, borderRadius: 4, display: "flex", alignItems: "center" }}>
                    <DotsIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgb(48,48,48); border-radius: 9999px; }
        input::placeholder { color: rgb(82,82,82); }
      `}</style>
    </div>
  );
}

function ColHeader({ label }: { label: string }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 500, color: "rgb(115,115,115)", paddingRight: 16 }}>
      {label}
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${checked ? "rgb(0,145,255)" : "rgb(82,82,82)"}`,
        background: checked ? "rgb(0,145,255)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.12s",
      }}
    >
      {checked && (
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}
