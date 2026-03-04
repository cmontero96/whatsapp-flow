import { useState, useRef, useEffect } from "react";

/* ═══ DATA ═══ */
const SERVICES = [
  { code: "S-40128", client: "Café del Centro", machine: "Máquina Espresso X200" },
  { code: "S-40129", client: "Restaurant El Bosque", machine: "Molinillo Industrial M50" },
  { code: "S-40130", client: "Hotel Pacífico", machine: "Cafetera Automática Pro" },
  { code: "S-40131", client: "Oficinas TechHub", machine: "Dispensador Vending V3" },
  { code: "S-40132", client: "Panadería La Rosa", machine: "Espresso Compact C100" },
];
const WORK_TYPES = ["Mantención", "Limpieza", "Reparación", "Programación", "Reseteo", "Otros"];
const LOCALS_CANAI = [
  { id: "l1", name: "Sucursal Providencia", address: "Av. Providencia 1234" },
  { id: "l2", name: "Sucursal Las Condes", address: "Av. Apoquindo 5678" },
  { id: "l3", name: "Sucursal Maipú", address: "Av. Pajaritos 9000" },
  { id: "l4", name: "Sucursal Vitacura", address: "Av. Vitacura 3456" },
  { id: "l5", name: "Bodega", address: "Parque Industrial" },
];
const PHOTO_TYPES_CANAI = ["Fachada del local", "Promoción implementada", "Baños y servicios"];
const CONTACTS = [
  { id: "cafexpress", name: "CafExpress Técnicos", avatar: "☕", lastMsg: "Registra tu servicio técnico", time: "ahora", unread: 1, isBot: true },
  { id: "canai", name: "Canai AI", avatar: "🐤", lastMsg: "Toca para abrir el reporte", time: "10:00", unread: 0, isBot: true },
  { id: "c1", name: "Carlos Méndez", avatar: "👷", lastMsg: "Ok, llego en 10 min", time: "10:32", unread: 0 },
  { id: "c2", name: "María López", avatar: "👩", lastMsg: "¿Ya quedó reparado?", time: "9:15", unread: 2 },
  { id: "c3", name: "Grupo Trabajo", avatar: "👥", lastMsg: "Juan: Buenos días", time: "Ayer", unread: 0 },
];

function CheckIcon({ double = false, read = false }) {
  const c = read ? "#53bdeb" : "#8696a0";
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <path d="M11.07.73L4.51 7.29 1.79 4.58.38 5.99 4.51 10.12 12.48 2.15 11.07.73z" fill={c} />
      {double && <path d="M14.07.73L7.51 7.29 6.79 6.58 5.38 7.99 7.51 10.12 15.48 2.15 14.07.73z" fill={c} />}
    </svg>
  );
}

/* ═══ SUB-SCREEN — slides in from right like NavigationList ═══ */
function SubScreen({ title, onBack, children }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 10, display: "flex", flexDirection: "column", animation: "slideIn .25s ease" }}>
      <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 0" }}>
        <div style={{ width: 36, height: 4.5, borderRadius: 3, background: "#ccc" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 14px 14px" }}>
        <div onClick={onBack} style={{ cursor: "pointer", padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
        </div>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 16, color: "#111" }}>{title}</div>
        <div style={{ padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#999"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
    </div>
  );
}

/* ═══ NavigationList row — tap to open sub-screen ═══ */
function NavRow({ label, value, placeholder, onClick, onClear }) {
  return (
    <div onClick={onClick} style={{ background: "#fff", borderRadius: 12, padding: "15px 16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
      <span style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
        <span style={{ color: value ? "#111" : "#9ca3af", fontSize: 15, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>
          {value || placeholder || "Optional"}
        </span>
        {value && onClear ? (
          <div onClick={e => { e.stopPropagation(); onClear(); }} style={{ cursor: "pointer", display: "flex", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e5e7eb" /><path d="M8 8l8 8M16 8l-8 8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" strokeWidth="2.5" style={{ flexShrink: 0 }}><path d="M9 5l7 7-7 7" /></svg>
        )}
      </div>
    </div>
  );
}

/* ═══ List item for sub-screens ═══ */
function ListItem({ children, onClick, selected, subtitle, icon }) {
  return (
    <div
      onClick={onClick}
      style={{ padding: "14px 20px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", background: "#fff", display: "flex", alignItems: "center", gap: 12 }}
      onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
      onMouseLeave={e => e.currentTarget.style.background = "#fff"}
    >
      {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, color: "#111", fontWeight: selected ? 600 : 400 }}>{children}</div>
        {subtitle && <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {selected && <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
    </div>
  );
}

/* ═══ RadioButtonsGroup ═══ */
function RadioGroup({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginBottom: 10 }}>{label}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map(opt => (
          <div
            key={opt}
            onClick={() => onChange(opt)}
            style={{ background: "#fff", border: `1.5px solid ${value === opt ? "#22c55e" : "#e5e7eb"}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
          >
            <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${value === opt ? "#22c55e" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {value === opt && <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />}
            </div>
            <span style={{ fontSize: 15, color: "#111" }}>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ TextInput ═══ */
function FlowTextInput({ label, value, onChange, placeholder, helperText, optional, multiline }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>{label}</span>
        {optional && <span style={{ fontSize: 13, color: "#9ca3af" }}>Optional</span>}
      </div>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ width: "100%", border: "none", outline: "none", fontSize: 14, fontFamily: "inherit", color: "#111", resize: "none", background: "transparent", boxSizing: "border-box" }} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", border: "none", outline: "none", fontSize: 15, fontFamily: "inherit", color: "#111", background: "transparent" }} />
      )}
      {helperText && <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{helperText}</div>}
    </div>
  );
}

/* ═══ PhotoPicker ═══ */
function PhotoPicker({ photo, photoName, photoSize, onPick, onClear, fileRef, label, helperText, required }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>{label || "Foto"}</div>
      {helperText && <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{helperText}</div>}
      <div style={{ fontSize: 13, color: "#9ca3af", margin: "2px 0" }}>Max file size 25 MB.</div>
      {required && !photo && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 6 }}>Minimum 1 photo required</div>}
      <input ref={fileRef} type="file" accept="image/*" onChange={onPick} style={{ display: "none" }} />
      {!photo ? (
        <div onClick={() => fileRef.current?.click()} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </div>
          <span style={{ color: "#22c55e", fontWeight: 600, fontSize: 15 }}>Take Photo</span>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
          <img src={photo} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{photoName}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{photoSize}</div>
          </div>
          <div onClick={onClear} style={{ cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   FLOW SHELL — bottom sheet
═══════════════════════════════════════════ */
function FlowShell({ title, managedBy, managedIcon, totalSteps, step, setStep, onClose, canNext, onNext, btnLabel, children }) {
  const [closing, setClosing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [step]);

  const doClose = () => { setClosing(true); setTimeout(onClose, 300); };
  const doNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else { setClosing(true); setTimeout(onNext, 300); }
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={doClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", animation: closing ? "fadeOut .3s forwards" : "fadeIn .3s forwards" }} />
      <div style={{ position: "relative", background: "#f5f5f5", borderRadius: "16px 16px 0 0", maxHeight: "93%", display: "flex", flexDirection: "column", boxShadow: "0 -4px 30px rgba(0,0,0,0.3)", overflow: "hidden", animation: closing ? "sheetDown .3s cubic-bezier(.4,0,1,1) forwards" : "sheetUp .35s cubic-bezier(.32,.72,0,1) forwards" }}>
        {/* Header */}
        <div style={{ background: "#fff", flexShrink: 0, zIndex: 5 }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 0" }}>
            <div style={{ width: 36, height: 4.5, borderRadius: 3, background: "#ccc" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", padding: "10px 14px 6px" }}>
            <div onClick={() => step > 1 ? setStep(step - 1) : doClose()} style={{ cursor: "pointer", padding: 4, color: step === 1 ? "#22c55e" : "#111", fontSize: 15, fontWeight: step === 1 ? 500 : 400 }}>
              {step === 1 ? "Cancel" : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>}
            </div>
            <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontSize: 16, color: "#111" }}>{title}</div>
            <div style={{ padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#999"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
            </div>
          </div>
          <div style={{ padding: "0 16px 14px" }}>
            <div style={{ height: 4, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#22c55e", borderRadius: 4, width: `${(step / totalSteps) * 100}%`, transition: "width .4s cubic-bezier(.4,0,.2,1)" }} />
            </div>
          </div>
        </div>
        {/* Content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "0 18px 8px", WebkitOverflowScrolling: "touch", position: "relative" }}>
          {children}
        </div>
        {/* Footer */}
        <div style={{ padding: "10px 18px 8px", flexShrink: 0, background: "#fff", borderTop: "1px solid #f0f0f0" }}>
          <button
            disabled={!canNext}
            onClick={doNext}
            style={{ width: "100%", padding: "14px", border: "none", borderRadius: 12, background: canNext ? "#22c55e" : "#e5e7eb", color: canNext ? "#fff" : "#bbb", fontWeight: 700, fontSize: 16, cursor: canNext ? "pointer" : "default", transition: "background .2s", fontFamily: "inherit" }}
          >{btnLabel || (step < totalSteps ? "Siguiente" : "Enviar")}</button>
          <div style={{ textAlign: "center", padding: "8px 0 4px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <span style={{ fontSize: 15 }}>{managedIcon || "🤖"}</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>Managed by <strong style={{ color: "#888" }}>{managedBy}</strong>.</span>
            <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, cursor: "pointer" }}>Learn more</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Confirmation card ═══ */
function ConfirmCard({ label, value, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 14, marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>{label}</div>
      {value && <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginTop: 4 }}>{value}</div>}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CAFEXPRESS FLOW — 5 screens
   1. Bienvenida (intro)
   2. Servicio + Trabajo (NavigationList)
   3. Repuestos (RadioButtonsGroup + conditional TextArea)
   4. Cierre (TextInput x2 + TextArea + PhotoPicker)
   5. Confirmación
═══════════════════════════════════════════ */
function CafExpressFlow({ onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [subScreen, setSubScreen] = useState(null);
  const [service, setService] = useState(null);
  const [workType, setWorkType] = useState(null);
  const [usedParts, setUsedParts] = useState(null);
  const [partsDetail, setPartsDetail] = useState("");
  const [horaEntrada, setHoraEntrada] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [observations, setObservations] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoSize, setPhotoSize] = useState("");
  const fileRef = useRef(null);

  const handleFile = e => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      setPhotoSize((file.size / 1024).toFixed(2) + " KB · " + file.name.split(".").pop());
      const reader = new FileReader();
      reader.onload = ev => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) return !!service && !!workType;
    if (step === 3) return usedParts !== null && (usedParts === "No" || partsDetail.trim());
    if (step === 4) return horaEntrada.trim() && horaSalida.trim() && !!photo;
    return true;
  };

  const btnLabel = step === 1 ? "Comenzar" : step < 5 ? "Siguiente" : "Enviar";

  return (
    <FlowShell
      title={step === 1 ? "Bienvenido" : step === 2 ? "Servicio" : step === 3 ? "Repuestos" : step === 4 ? "Cierre" : "Confirmación"}
      managedBy="CafExpress"
      managedIcon="☕"
      totalSteps={5}
      step={step}
      setStep={setStep}
      onClose={onClose}
      canNext={canNext()}
      btnLabel={btnLabel}
      onNext={() => onComplete({ service, workType, usedParts, partsDetail, horaEntrada, horaSalida, observations, photo })}
    >
      {/* SCREEN 1 — Welcome */}
      {step === 1 && (
        <div style={{ paddingTop: 16, textAlign: "left" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8, lineHeight: 1.2 }}>
            ☕ Reporte de servicio técnico
          </div>
          <div style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
            Completa el formulario para registrar el servicio técnico realizado. Incluye:
          </div>
          <div style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
            - Servicio asignado y trabajo realizado<br />
            - Repuestos utilizados<br />
            - Horarios de entrada y salida<br />
            - Foto de conformidad del cliente
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, padding: "12px 0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <span style={{ fontSize: 14, color: "#9ca3af" }}>Tiempo estimado: 2 minutos</span>
          </div>
        </div>
      )}

      {/* SCREEN 2 — Servicio + Trabajo */}
      {step === 2 && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>📋 Selecciona el servicio</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px", lineHeight: 1.45 }}>Elige el servicio asignado y el tipo de trabajo.</p>
          <NavRow label="Servicio" value={service ? service.code : null} placeholder="Seleccionar..." onClick={() => setSubScreen("service")} onClear={() => setService(null)} />
          {service && (
            <div style={{ background: "#fff", borderRadius: 12, padding: "10px 16px", marginBottom: 10, marginTop: -4 }}>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{service.client} · {service.machine}</div>
            </div>
          )}
          <NavRow label="Trabajo" value={workType} placeholder="Seleccionar..." onClick={() => setSubScreen("workType")} onClear={() => setWorkType(null)} />
          {subScreen === "service" && (
            <SubScreen title="Servicio" onBack={() => setSubScreen(null)}>
              {SERVICES.map(s => (
                <ListItem key={s.code} selected={service?.code === s.code} subtitle={`${s.client} · ${s.machine}`} onClick={() => { setService(s); setSubScreen(null); }}>
                  {s.code}
                </ListItem>
              ))}
            </SubScreen>
          )}
          {subScreen === "workType" && (
            <SubScreen title="Trabajo realizado" onBack={() => setSubScreen(null)}>
              {WORK_TYPES.map(w => (
                <ListItem key={w} selected={workType === w} onClick={() => { setWorkType(w); setSubScreen(null); }}>
                  {w}
                </ListItem>
              ))}
            </SubScreen>
          )}
        </div>
      )}

      {/* SCREEN 3 — Repuestos */}
      {step === 3 && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>🔧 Repuestos</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px", lineHeight: 1.45 }}>¿Se utilizaron repuestos en este servicio?</p>
          <RadioGroup label="¿Se utilizaron repuestos?" options={["Sí", "No"]} value={usedParts} onChange={setUsedParts} />
          {usedParts === "Sí" && (
            <FlowTextInput
              label="Detalle de repuestos"
              value={partsDetail}
              onChange={setPartsDetail}
              placeholder="Ej: Válvula de presión, filtro de agua..."
              helperText="Incluye modelo o código si es posible"
              multiline
            />
          )}
        </div>
      )}

      {/* SCREEN 4 — Cierre */}
      {step === 4 && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>📝 Cierre de servicio</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px", lineHeight: 1.45 }}>Registra horarios y la foto de conformidad del cliente.</p>
          <div style={{ display: "flex", gap: 10, marginBottom: 0 }}>
            <div style={{ flex: 1 }}>
              <FlowTextInput label="Hora entrada" value={horaEntrada} onChange={setHoraEntrada} placeholder="09:30" />
            </div>
            <div style={{ flex: 1 }}>
              <FlowTextInput label="Hora salida" value={horaSalida} onChange={setHoraSalida} placeholder="11:45" />
            </div>
          </div>
          <FlowTextInput label="Observaciones" value={observations} onChange={setObservations} placeholder="Notas adicionales del servicio..." helperText="Cualquier detalle relevante" optional multiline />
          <PhotoPicker
            photo={photo} photoName={photoName} photoSize={photoSize} fileRef={fileRef}
            onPick={handleFile}
            onClear={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ""; }}
            label="Foto de conformidad"
            helperText="Cliente con pulgar arriba junto a la máquina"
            required
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <span style={{ fontSize: 13, color: "#aaa" }}>La foto debe mostrar al cliente conforme junto al equipo</span>
          </div>
        </div>
      )}

      {/* SCREEN 5 — Confirmación */}
      {step === 5 && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>✅ Confirmación</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Revisa la información antes de enviar.</p>
          <ConfirmCard label="Servicio">
            <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginTop: 4 }}>{service?.code}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>{service?.client} · {service?.machine}</div>
          </ConfirmCard>
          <ConfirmCard label="Trabajo realizado" value={workType} />
          <ConfirmCard label="Repuestos">
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginTop: 4 }}>{usedParts}</div>
            {usedParts === "Sí" && <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{partsDetail}</div>}
          </ConfirmCard>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, background: "#fff", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Entrada</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginTop: 4 }}>{horaEntrada}</div>
            </div>
            <div style={{ flex: 1, background: "#fff", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Salida</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginTop: 4 }}>{horaSalida}</div>
            </div>
          </div>
          {observations && <ConfirmCard label="Observaciones" value={observations} />}
          <ConfirmCard label="Foto de conformidad">
            {photo && <img src={photo} alt="" style={{ width: "100%", borderRadius: 8, display: "block", marginTop: 8 }} />}
          </ConfirmCard>
        </div>
      )}
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════
   CANAI FLOW — 4 screens
   1. Bienvenida
   2. Identificación (NavigationList local)
   3. Reporte fotográfico (Dropdown tipo + PhotoPicker + TextArea)
   4. Confirmación
═══════════════════════════════════════════ */
function CanaiFlow({ onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [subScreen, setSubScreen] = useState(null);
  const [local, setLocal] = useState(null);
  const [photoType, setPhotoType] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoSize, setPhotoSize] = useState("");
  const [observation, setObservation] = useState("");
  const fileRef = useRef(null);

  const handleFile = e => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      setPhotoSize((file.size / 1024).toFixed(2) + " KB · " + file.name.split(".").pop());
      const reader = new FileReader();
      reader.onload = ev => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) return !!local;
    if (step === 3) return !!photo;
    return true;
  };

  const btnLabel = step === 1 ? "Comenzar Demo" : step < 4 ? "Siguiente" : "Enviar";

  return (
    <FlowShell
      title={step === 1 ? "Bienvenido" : step === 2 ? "Identificación" : step === 3 ? "Reporte fotográfico" : "Confirmación"}
      managedBy="Canai"
      managedIcon="🐤"
      totalSteps={4}
      step={step}
      setStep={setStep}
      onClose={onClose}
      canNext={canNext()}
      btnLabel={btnLabel}
      onNext={() => onComplete({ local, photoType, photo, observation })}
    >
      {/* SCREEN 1 — Welcome */}
      {step === 1 && (
        <div style={{ paddingTop: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8, lineHeight: 1.2 }}>
            🚀 Coordina tus tiendas con Canai
          </div>
          <div style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6, marginBottom: 16 }}>
            Si estás constantemente pidiendo reportes a tus sucursales por WhatsApp. Automatízalo con Canai.
          </div>
          <div style={{ color: "#374151", fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
            - Envío de tareas específicas<br />
            - Seguimiento proactivo de tus locales<br />
            - Reportes mucho más ordenados
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, padding: "12px 0" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            <span style={{ fontSize: 14, color: "#9ca3af" }}>Tiempo estimado: 2 minutos</span>
          </div>
        </div>
      )}

      {/* SCREEN 2 — Identificación */}
      {step === 2 && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>📍 Elige tu local</div>
          <NavRow label="Local" value={local?.name} placeholder="Optional" onClick={() => setSubScreen("local")} onClear={() => setLocal(null)} />
          <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 2, paddingLeft: 2 }}>Estos datos se pueden integrar a Canai, y este paso no sería necesario.</div>
          {subScreen === "local" && (
            <SubScreen title="Local" onBack={() => setSubScreen(null)}>
              {LOCALS_CANAI.map(l => (
                <ListItem key={l.id} selected={local?.id === l.id} icon="📍" subtitle={l.address} onClick={() => { setLocal(l); setSubScreen(null); }}>
                  {l.name}
                </ListItem>
              ))}
              <ListItem icon="🏭" subtitle="Parque Industrial" selected={local?.id === "bodega"} onClick={() => { setLocal({ id: "bodega", name: "Bodega", address: "Parque Industrial" }); setSubScreen(null); }}>
                Bodega
              </ListItem>
            </SubScreen>
          )}
        </div>
      )}

      {/* SCREEN 3 — Reporte fotográfico */}
      {step === 3 && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>🖼️ Foto del local</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Reporte fotográfico del día.</p>
          <NavRow label="Tipo de foto" value={photoType} placeholder="Optional" onClick={() => setSubScreen("photoType")} onClear={() => setPhotoType(null)} />
          <PhotoPicker
            photo={photo} photoName={photoName} photoSize={photoSize} fileRef={fileRef}
            onPick={handleFile}
            onClear={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ""; }}
            required
          />
          <FlowTextInput label="Observación" value={observation} onChange={setObservation} placeholder="Describe cualquier detalle relevante" optional multiline />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <span style={{ fontSize: 13, color: "#aaa" }}>Tip: Mantén la cámara horizontal para mejor calidad</span>
          </div>
          {subScreen === "photoType" && (
            <SubScreen title="Tipo de foto" onBack={() => setSubScreen(null)}>
              {PHOTO_TYPES_CANAI.map(pt => (
                <ListItem key={pt} selected={photoType === pt} onClick={() => { setPhotoType(pt); setSubScreen(null); }}>
                  {pt}
                </ListItem>
              ))}
            </SubScreen>
          )}
        </div>
      )}

      {/* SCREEN 4 — Confirmación */}
      {step === 4 && (
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>✅ Confirmación</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Revisa la información.</p>
          <ConfirmCard label="Local">
            <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginTop: 4 }}>📍 {local?.name}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>{local?.address}</div>
          </ConfirmCard>
          {photoType && <ConfirmCard label="Tipo de foto" value={photoType} />}
          <ConfirmCard label="Foto">
            {photo && <img src={photo} alt="" style={{ width: "100%", borderRadius: 8, display: "block", marginTop: 8 }} />}
          </ConfirmCard>
          {observation && <ConfirmCard label="Observación" value={observation} />}
        </div>
      )}
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function WhatsAppPhone() {
  const [screen, setScreen] = useState("chats");
  const [activeContact, setActiveContact] = useState(null);
  const [showFlow, setShowFlow] = useState(false);

  const initMsgs = {
    cafexpress: [
      { id: 1, from: "bot", text: "¡Hola técnico! 👋\nSoy el asistente de CafExpress.\n\nPresiona el botón para registrar tu servicio.", time: "09:00", type: "text" },
      { id: 2, from: "bot", text: "", time: "09:00", type: "flow-button", label: "Registrar servicio", desc: "Completa el reporte de servicio técnico" },
    ],
    canai: [
      { id: 1, from: "bot", text: "¡Hola! 👋 Soy el asistente de Canai.\n\nPresiona el botón para tu reporte fotográfico.", time: "10:00", type: "text" },
      { id: 2, from: "bot", text: "", time: "10:00", type: "flow-button", label: "Reporte fotográfico", desc: "Completa tu reporte del día" },
    ],
  };

  const [chatMessages, setChatMessages] = useState(initMsgs);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  const currentMsgs = activeContact ? (chatMessages[activeContact.id] || []) : [];
  useEffect(scrollToBottom, [currentMsgs, typing]);

  const now = () => {
    const d = new Date();
    return d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
  };

  const addMsg = (cid, m) => setChatMessages(p => ({ ...p, [cid]: [...(p[cid] || []), m] }));
  const addBotMsg = (cid, t, d = 800) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMsg(cid, { id: Date.now(), from: "bot", text: t, time: now(), type: "text" });
    }, d);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !activeContact) return;
    addMsg(activeContact.id, { id: Date.now(), from: "user", text: inputText.trim(), time: now(), type: "text" });
    setInputText("");
    if (activeContact.isBot) addBotMsg(activeContact.id, "Utiliza el botón de abrir para completar el formulario ⬆️");
  };

  const openChat = c => {
    setActiveContact(c);
    setScreen("chat");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCafComplete = d => {
    setShowFlow(false);
    addMsg("cafexpress", { id: Date.now(), from: "user", text: `✅ Servicio registrado\n☕ ${d.service.code}\n🔧 ${d.workType}\n⏰ ${d.horaEntrada} - ${d.horaSalida}`, time: now(), type: "text" });
    setTimeout(() => addBotMsg("cafexpress", "🎉 ¡Servicio registrado!\n\n" + d.service.code + " · " + d.service.client + "\nTrabajo: " + d.workType + "\n\nSupervisor notificado. ☕💪", 1000), 200);
  };

  const handleCanaiComplete = d => {
    setShowFlow(false);
    addMsg("canai", { id: Date.now(), from: "user", text: `✅ Reporte enviado\n📍 ${d.local.name}\n📷 ${d.photoType || "Sin tipo"}`, time: now(), type: "text" });
    setTimeout(() => addBotMsg("canai", "🎉 ¡Reporte registrado!\n\n" + d.local.name + "\n\n¡Buen trabajo! 💪", 1000), 200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#0a0f1a,#101828 40%,#0f172a)", fontFamily: "-apple-system,'SF Pro Display','Segoe UI',sans-serif", padding: "20px 0" }}>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}><span style={{ color: "#25d366" }}>WhatsApp</span> Flow Demo</h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: "6px 0 16px" }}>Meta Flows — CafExpress & Canai</p>
        <button
          onClick={() => {
            if (screen === "chats") { openChat(CONTACTS[0]); setTimeout(() => setShowFlow(true), 500); }
            else if (activeContact?.isBot) setShowFlow(true);
          }}
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", color: "#fff", border: "none", borderRadius: 28, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 24px rgba(37,211,102,.3)", display: "inline-flex", alignItems: "center", gap: 8 }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3 20l1.3-3.9C3.5 14.5 3 12.8 3 11c0-5 4-9 9-9s9 4 9 9-4 9-9 9c-1.8 0-3.5-.5-5.1-1.3L3 20z" /></svg>
          Enviar Flow
        </button>
      </div>

      <div style={{ width: 370, height: 750, borderRadius: 48, background: "#000", boxShadow: "0 25px 80px rgba(0,0,0,.5),inset 0 0 0 2px #2a2a2a", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 126, height: 32, background: "#000", borderRadius: 20, zIndex: 50 }} />
        <div style={{ height: 52, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 28px 4px", zIndex: 10, flexShrink: 0, background: screen === "chats" ? "#111b21" : "#1f2c34" }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{now()}</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="#fff"><rect x="0" y="7" width="3" height="4" rx=".5" /><rect x="4" y="4" width="3" height="7" rx=".5" /><rect x="8" y="1.5" width="3" height="9.5" rx=".5" /><rect x="12" y="0" width="3" height="11" rx=".5" /></svg>
            <svg width="15" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" /></svg>
            <svg width="22" height="11" viewBox="0 0 28 14"><rect x=".5" y=".5" width="23" height="13" rx="2.5" stroke="#fff" strokeOpacity=".35" fill="none" /><rect x="2" y="2" width="10" height="10" rx="1.5" fill="#fff" /></svg>
          </div>
        </div>

        {screen === "chats" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#111b21" }}>
            <div style={{ padding: "14px 16px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>WhatsApp</span>
              <div style={{ display: "flex", gap: 18 }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="#aebac1" strokeWidth="2" /><path d="M21 21l-4-4" stroke="#aebac1" strokeWidth="2" strokeLinecap="round" /></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#aebac1"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
              </div>
            </div>
            <div style={{ display: "flex", padding: "0 12px", gap: 6, marginBottom: 10 }}>
              {["Todos", "No leídos", "Grupos"].map((t, i) => (
                <div key={t} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, background: i === 0 ? "#00a884" : "#222e35", color: i === 0 ? "#111b21" : "#8696a0", cursor: "pointer" }}>{t}</div>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {CONTACTS.map((c, i) => (
                <div key={i} onClick={() => openChat(c)} style={{ display: "flex", alignItems: "center", padding: "10px 16px", gap: 12, cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#202c33"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#2a3942", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{c.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0, borderBottom: "1px solid #222d35", paddingBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#e9edef", fontSize: 16 }}>{c.name}</span>
                      <span style={{ color: c.unread ? "#00a884" : "#8696a0", fontSize: 12 }}>{c.time}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                      <span style={{ color: "#8696a0", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 210 }}>{c.lastMsg}</span>
                      {c.unread > 0 && <span style={{ background: "#00a884", color: "#111b21", borderRadius: 12, minWidth: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, padding: "0 5px" }}>{c.unread}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === "chat" && activeContact && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0b141a", position: "relative" }}>
            <div style={{ background: "#1f2c34", padding: "8px 10px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, zIndex: 5, boxShadow: "0 1px 3px rgba(0,0,0,.2)" }}>
              <svg onClick={() => setScreen("chats")} width="22" height="22" viewBox="0 0 24 24" fill="#aebac1" style={{ cursor: "pointer", flexShrink: 0 }}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#2a3942", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{activeContact.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#e9edef", fontSize: 15, fontWeight: 500 }}>{activeContact.name}</div>
                <div style={{ color: "#8696a0", fontSize: 12 }}>{typing ? "escribiendo..." : "en línea"}</div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#aebac1"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" /></svg>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <span style={{ background: "#182229", color: "#8696a0", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500 }}>HOY</span>
              </div>
              {currentMsgs.map(msg => {
                if (msg.type === "flow-button") return (
                  <div key={msg.id} style={{ display: "flex", marginBottom: 4 }}>
                    <div style={{ maxWidth: "85%" }}>
                      <div style={{ background: "#1f2c34", borderRadius: "10px 10px 10px 2px", overflow: "hidden" }}>
                        <div style={{ padding: "10px 12px 8px" }}>
                          <div style={{ color: "#e9edef", fontSize: 14, fontWeight: 500 }}>{activeContact.id === "cafexpress" ? "☕" : "📋"} {msg.label}</div>
                          <div style={{ color: "#8696a0", fontSize: 12, marginTop: 2 }}>{msg.desc}</div>
                        </div>
                        <div
                          onClick={() => setShowFlow(true)}
                          style={{ borderTop: "1px solid #2a3942", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#263845"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00a884" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                          <span style={{ color: "#00a884", fontSize: 14, fontWeight: 600 }}>Abrir</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 3, marginTop: 2 }}>
                        <span style={{ color: "#8696a0", fontSize: 11 }}>{msg.time}</span>
                      </div>
                    </div>
                  </div>
                );
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: 3 }}>
                    <div style={{ maxWidth: "85%", background: msg.from === "user" ? "#005c4b" : "#1f2c34", borderRadius: msg.from === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px", padding: "6px 8px 4px" }}>
                      <div style={{ color: "#e9edef", fontSize: 14, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                        {msg.text.split("*").map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)}
                      </div>
                      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 3, marginTop: 2 }}>
                        <span style={{ color: "#8696a0", fontSize: 11 }}>{msg.time}</span>
                        {msg.from === "user" && <CheckIcon double read />}
                      </div>
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div style={{ display: "flex", marginBottom: 3 }}>
                  <div style={{ background: "#1f2c34", borderRadius: "10px 10px 10px 2px", padding: "10px 14px", display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#8696a0", animation: `typingDot 1.2s infinite ${i * .2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ background: "#1f2c34", padding: "8px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ flexShrink: 0, cursor: "pointer" }}>
                <circle cx="12" cy="12" r="10" fill="none" stroke="#8696a0" strokeWidth="1.5" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#8696a0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <circle cx="9" cy="10" r="1.2" fill="#8696a0" />
                <circle cx="15" cy="10" r="1.2" fill="#8696a0" />
              </svg>
              <div style={{ flex: 1, background: "#2a3942", borderRadius: 22, padding: "9px 14px" }}>
                <input
                  ref={inputRef}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                  placeholder="Mensaje"
                  style={{ background: "none", border: "none", outline: "none", color: "#e9edef", fontSize: 15, width: "100%", fontFamily: "inherit" }}
                />
              </div>
              {inputText.trim() ? (
                <div onClick={sendMessage} style={{ width: 40, height: 40, borderRadius: "50%", background: "#00a884", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </div>
              ) : (
                <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#8696a0"><path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v7c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" /></svg>
                </div>
              )}
            </div>

            {showFlow && activeContact.id === "cafexpress" && <CafExpressFlow onClose={() => setShowFlow(false)} onComplete={handleCafComplete} />}
            {showFlow && activeContact.id === "canai" && <CanaiFlow onClose={() => setShowFlow(false)} onComplete={handleCanaiComplete} />}
          </div>
        )}
      </div>

      <style>{`
        @keyframes typingDot { 0%,60%,100%{opacity:.3;transform:scale(.8)} 30%{opacity:1;transform:scale(1)} }
        @keyframes sheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes sheetDown { from{transform:translateY(0)} to{transform:translateY(100%)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeOut { from{opacity:1} to{opacity:0} }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #374045; border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: #9ca3af; }
      `}</style>
    </div>
  );
}
