import { useState } from "react";

/* ─── Design Tokens (mapped from your Tailwind palette) ─── */
const T = {
  bg:       "#131313",
  surface:  "#181818",
  raised:   "#1f1f1f",
  elevated: "#252525",
  border:   "#2a2a2a",
  muted:    "#525252",
  sub:      "#737373",
  dim:      "#a3a3a3",
  text:     "#d4d4d4",
  bright:   "#fafafa",
  accent:   "#0091ff",
  accentHover: "#367eff",
  green:    "#4eaf60",
};

/* ─── Data ─── */
const players = [
  { id: 1, initials: "AS", color: "#1a3a5c", name: "Abdelmalek Smaili",   email: "abdelmalek.smaili@gmail.com",  category: "Minime",    poste: "Latéral gauche",           dob: "5 juil. 2010" },
  { id: 2, initials: null, color: null,      name: "Achref El Ghoul",      email: "achref@gmail.com",             category: "—",         poste: "Ailier",                   dob: "26 juil. 1994" },
  { id: 3, initials: null, color: null,      name: "Adem Bougdiri",        email: "adem.bougdiri@gmail.com",      category: "Minime",    poste: "Latéral gauche",           dob: "14 janv. 2010" },
  { id: 4, initials: null, color: null,      name: "Ahmed Ben Jemaa",      email: "ahmed.benjemaa@gmail.com",     category: "Minime",    poste: "Milieu offensif central",  dob: "26 oct. 2010" },
  { id: 5, initials: "AB", color: "#252545", name: "Ahmed Boutar",         email: "ahmed.boutar@gmail.com",       category: "École A",   poste: "Milieu défensif central",  dob: "9 août 2012" },
  { id: 6, initials: null, color: null,      name: "Amen Allah Gabssi",    email: "amenallah.gabssi@gmail.com",   category: "Minime",    poste: "Milieu défensif central",  dob: "5 avr. 2010" },
  { id: 7, initials: null, color: null,      name: "Bilel Trabelsi",       email: "bilel.trabelsi@gmail.com",     category: "Senior",    poste: "Gardien de but",           dob: "12 mars 1998" },
  { id: 8, initials: "KM", color: "#4a1a1a", name: "Karim Mansour",        email: "karim.mansour@gmail.com",      category: "Junior",    poste: "Défenseur central",        dob: "3 juin 2005" },
];

const BADGE_BLUE = { bg: "rgba(0,145,255,0.12)", color: "#52a9ff" };
const BADGE_EMPTY = { bg: "transparent", color: "#525252" };
const getBadge = (cat: string) => cat === "—" ? BADGE_EMPTY : BADGE_BLUE;

/* ─── Icons ─── */
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M2.5 4L5.5 7L8.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const UpDownArrows = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 2V9M3 4.5L5.5 2L8 4.5M3 6.5L5.5 9L8 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
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
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1.5V10.5M1.5 6H10.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);
const SortIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
    <path d="M4.5 1.5L6.5 3.5H2.5L4.5 1.5Z" fill="currentColor" opacity=".5"/>
    <path d="M4.5 7.5L2.5 5.5H6.5L4.5 7.5Z" fill="currentColor" opacity=".5"/>
  </svg>
);

/* ─── Checkbox ─── */
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: `1.5px solid ${checked ? T.accent : T.muted}`,
        background: checked
          ? `linear-gradient(135deg, ${T.accent} 0%, ${T.accentHover} 100%)`
          : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.13s ease",
        boxShadow: checked ? `0 0 0 3px rgba(0,145,255,0.14)` : "none",
      }}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1.5 3.5L3.5 5.5L7.5 1.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

/* ─── Column Header ─── */
function ColHeader({ label }: { label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 5, paddingRight: 14,
        fontSize: 11, fontWeight: 600, letterSpacing: "0.055em",
        textTransform: "uppercase", color: hov ? T.dim : T.sub,
        cursor: "pointer", userSelect: "none", transition: "color 0.12s",
      }}
    >
      {label}
      <span style={{ opacity: hov ? 0.8 : 0.3, transition: "opacity 0.12s" }}>
        <SortIcon/>
      </span>
    </div>
  );
}

/* ─── Filter Pill ─── */
function FilterSelect({ label, icon }: { label: string; icon: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        background: hov ? T.raised : T.surface,
        border: `1px solid ${hov ? T.elevated : T.border}`,
        borderRadius: 8, padding: "7.5px 12px", cursor: "pointer",
        transition: "all 0.14s ease",
      }}
    >
      <span style={{ fontSize: 13, color: T.text, flex: 1, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ color: T.muted }}>{icon}</span>
    </div>
  );
}

/* ─── Avatar Placeholder ─── */
const AvatarPlaceholder = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill={T.elevated}/>
    <circle cx="18" cy="14" r="5.5" fill={T.muted} opacity=".45"/>
    <ellipse cx="18" cy="28" rx="9" ry="6.5" fill={T.muted} opacity=".35"/>
  </svg>
);

/* ─────────────────── Main Component ─────────────────── */
export default function JoueursPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const allSelected = players.length > 0 && selected.length === players.length;
  const toggleAll   = () => setSelected(allSelected ? [] : players.map(p => p.id));
  const toggleOne   = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      background: T.bg, minHeight: "100vh", width: "100%",
      fontFamily: "'Rubik', sans-serif", color: T.text,
      display: "flex", flexDirection: "column",
    }}>

      {/* ── Top accent rule ── */}
      <div style={{
        height: 1,
        background: `linear-gradient(90deg, transparent 0%, ${T.accent}66 35%, ${T.accentHover}88 65%, transparent 100%)`,
      }}/>

      <div style={{ padding: "32px 36px 0" }}>

        {/* Page heading */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 26 }}>
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent, marginBottom: 5 }}>
              Gestion de l'équipe
            </p>
            <h1 style={{ fontSize: 25, fontWeight: 700, color: T.bright, letterSpacing: "-0.015em" }}>
              Joueurs
            </h1>
          </div>
          <p style={{ fontSize: 12, color: T.sub, paddingBottom: 2 }}>
            <span style={{ color: T.accent, fontWeight: 600 }}>{filtered.length}</span>
            {" "}joueur{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filter row 1 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search input */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 8, padding: "7.5px 12px", width: 228,
          }}>
            <span style={{ color: T.muted, flexShrink: 0 }}><SearchIcon/></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un joueur…"
              style={{
                background: "none", border: "none", outline: "none",
                color: T.text, fontSize: 13, fontFamily: "inherit", width: "100%",
              }}
            />
          </div>

          <FilterSelect label="2026 / 2027"           icon={<UpDownArrows/>}/>
          <FilterSelect label="Toutes les catégories" icon={<ChevronDown/>}/>

          <div style={{ flex: 1 }}/>

          {/* Add button */}
          <button
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: `linear-gradient(135deg, ${T.green} 0%, #3c9a50 100%)`,
              border: "none", color: "white",
              padding: "8px 18px", borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", letterSpacing: "0.01em",
              boxShadow: "0 2px 14px rgba(78,175,96,0.22)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              const b = e.currentTarget;
              b.style.boxShadow = "0 4px 22px rgba(78,175,96,0.42)";
              b.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              const b = e.currentTarget;
              b.style.boxShadow = "0 2px 14px rgba(78,175,96,0.22)";
              b.style.transform = "translateY(0px)";
            }}
          >
            <PlusIcon/> Ajouter un joueur
          </button>
        </div>

        {/* Filter row 2 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <FilterSelect label="Toutes les positions"  icon={<ChevronDown/>}/>
          <FilterSelect label="Année de naissance"    icon={<ChevronDown/>}/>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ flex: 1, padding: "0 36px 40px", width: "100%" }}>
        <div style={{
          borderRadius: 12, overflow: "hidden",
          border: `1px solid ${T.border}`,
          background: T.surface,
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}>

          {/* Header row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "48px 52px minmax(0,1fr) 150px 210px 170px 52px",
            alignItems: "center",
            padding: "10px 6px",
            background: `linear-gradient(180deg, ${T.raised} 0%, ${T.surface} 100%)`,
            borderBottom: `1px solid ${T.border}`,
          }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Checkbox checked={allSelected} onChange={toggleAll}/>
            </div>
            <div/>
            <ColHeader label="Joueur"/>
            <ColHeader label="Catégorie"/>
            <ColHeader label="Position"/>
            <ColHeader label="Naissance"/>
            <div/>
          </div>

          {/* Body */}
          {filtered.length === 0 ? (
            <div style={{ padding: "52px 0", textAlign: "center", color: T.sub, fontSize: 13 }}>
              Aucun joueur trouvé
            </div>
          ) : filtered.map((player, idx) => {
            const isSelected = selected.includes(player.id);
            const isHovered  = hoveredRow === player.id;
            const isLast     = idx === filtered.length - 1;
            const badge      = getBadge(player.category);

            /* gradient composition */
            let rowBg = "transparent";
            if (isSelected && isHovered)
              rowBg = "linear-gradient(90deg, rgba(0,145,255,0.12) 0%, rgba(0,145,255,0.05) 50%, transparent 100%)";
            else if (isSelected)
              rowBg = "linear-gradient(90deg, rgba(0,145,255,0.09) 0%, rgba(0,145,255,0.03) 55%, transparent 100%)";
            else if (isHovered)
              rowBg = "linear-gradient(90deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.012) 55%, transparent 100%)";

            return (
              <div
                key={player.id}
                onMouseEnter={() => setHoveredRow(player.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 52px minmax(0,1fr) 150px 210px 170px 52px",
                  alignItems: "center",
                  padding: "12px 6px",
                  borderBottom: isLast ? "none" : `1px solid ${T.border}`,
                  background: rowBg,
                  position: "relative",
                  transition: "background 0.14s ease",
                }}
              >
                {/* Left selection stripe */}
                <div style={{
                  position: "absolute", left: 0, top: "10%", bottom: "10%",
                  width: 2, borderRadius: 1,
                  background: `linear-gradient(180deg, transparent, ${T.accent}, transparent)`,
                  opacity: isSelected ? 1 : 0,
                  transition: "opacity 0.14s ease",
                }}/>

                {/* Checkbox */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Checkbox checked={isSelected} onChange={() => toggleOne(player.id)}/>
                </div>

                {/* Avatar */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {player.initials ? (
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: `radial-gradient(circle at 35% 35%, ${player.color}dd, ${player.color}55)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,0.88)",
                      letterSpacing: "0.04em",
                      boxShadow: isHovered
                        ? `0 0 0 2px ${T.border}, 0 0 0 3.5px rgba(0,145,255,0.25)`
                        : `0 0 0 1.5px ${T.border}`,
                      transition: "box-shadow 0.15s",
                    }}>
                      {player.initials}
                    </div>
                  ) : (
                    <div style={{
                      borderRadius: "50%",
                      boxShadow: isHovered ? `0 0 0 2px ${T.border}, 0 0 0 3.5px rgba(255,255,255,0.06)` : `0 0 0 1.5px ${T.border}`,
                      transition: "box-shadow 0.15s",
                    }}>
                      <AvatarPlaceholder/>
                    </div>
                  )}
                </div>

                {/* Name + Email */}
                <div style={{ paddingRight: 14 }}>
                  <div style={{
                    fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.005em",
                    color: isHovered ? T.bright : T.text,
                    transition: "color 0.12s",
                  }}>
                    {player.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: T.sub, marginTop: 2.5 }}>
                    {player.email}
                  </div>
                </div>

                {/* Category badge */}
                <div>
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.025em",
                    background: badge.bg, color: badge.color,
                    padding: "3px 9px", borderRadius: 20,
                  }}>
                    {player.category}
                  </span>
                </div>

                {/* Position */}
                <div style={{
                  fontSize: 13, paddingRight: 14,
                  color: isHovered ? T.dim : T.sub,
                  transition: "color 0.12s",
                }}>
                  {player.poste}
                </div>

                {/* DOB */}
                <div style={{
                  fontSize: 13, fontVariantNumeric: "tabular-nums",
                  color: isHovered ? T.dim : T.sub,
                  transition: "color 0.12s",
                }}>
                  {player.dob}
                </div>

                {/* Dots menu */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    style={{
                      background: isHovered ? T.elevated : "none",
                      border: `1px solid ${isHovered ? T.border : "transparent"}`,
                      cursor: "pointer",
                      color: isHovered ? T.dim : T.muted,
                      padding: "5px 7px", borderRadius: 6,
                      display: "flex", alignItems: "center",
                      transition: "all 0.13s ease",
                    }}
                  >
                    <DotsIcon/>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Footer */}
          {filtered.length > 0 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 18px",
              borderTop: `1px solid ${T.border}`,
              background: `linear-gradient(180deg, ${T.surface} 0%, ${T.raised} 100%)`,
            }}>
              <span style={{ fontSize: 12, color: T.sub }}>
                {selected.length > 0 ? (
                  <><span style={{ color: T.accent, fontWeight: 600 }}>{selected.length}</span> sélectionné{selected.length > 1 ? "s" : ""}</>
                ) : (
                  `${filtered.length} joueurs au total`
                )}
              </span>
              <div style={{ display: "flex", gap: 5 }}>
                {[1, 2, 3].map(n => (
                  <button key={n} style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: n === 1
                      ? `linear-gradient(135deg, ${T.elevated}, ${T.border})`
                      : "transparent",
                    border: `1px solid ${n === 1 ? T.muted : T.border}`,
                    color: n === 1 ? T.text : T.sub,
                    fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.12s",
                  }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 9999px; }
        input::placeholder { color: #525252; }
        button { outline: none; }
      `}</style>
    </div>
  );
}