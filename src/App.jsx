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

const WORK_ORDERS_CANAI = [
  { id: "OT-2024-001", client: "Carlos Méndez", desc: "Instalación eléctrica", status: "En progreso" },
  { id: "OT-2024-002", client: "María López", desc: "Reparación de plomería", status: "Pendiente" },
  { id: "OT-2024-003", client: "Juan Pérez", desc: "Mantenimiento A/C", status: "En progreso" },
];

const PHOTO_TYPES_CANAI = [
  "Promoción en punto de venta", "Fachada del local", "Exhibidor de productos",
  "Anaquel / Estante", "Material POP", "Producto en mostrador",
];

const CONTACTS = [
  { id: "cafexpress", name: "CafExpress Técnicos", avatar: "☕", lastMsg: "Registra tu servicio técnico", time: "ahora", unread: 1, isBot: true },
  { id: "canai", name: "Canai", avatar: "🤖", lastMsg: "Toca para abrir el reporte", time: "10:00", unread: 0, isBot: true },
  { id: "c1", name: "Carlos Méndez", avatar: "👷", lastMsg: "Ok, llego en 10 min", time: "10:32", unread: 0 },
  { id: "c2", name: "María López", avatar: "👩", lastMsg: "¿Ya quedó reparado?", time: "9:15", unread: 2 },
  { id: "c3", name: "Grupo Trabajo", avatar: "👥", lastMsg: "Juan: Buenos días a todos", time: "Ayer", unread: 0 },
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

/* ═══════════════════════════════════════════
   GENERIC FLOW SHELL — shared bottom sheet
   ═══════════════════════════════════════════ */
function FlowShell({ title, managedBy, totalSteps, step, setStep, onClose, canNext, onNext, children }) {
  const [closing, setClosing] = useState(false);
  const contentRef = useRef(null);
  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [step]);

  const doClose = () => { setClosing(true); setTimeout(onClose, 300); };
  const doNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else { setClosing(true); setTimeout(onNext, 300); }
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={doClose} style={{
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)",
        animation: closing ? "fadeOut .3s forwards" : "fadeIn .3s forwards",
      }} />
      <div style={{
        position: "relative", background: "#fff", borderRadius: "16px 16px 0 0",
        maxHeight: "93%", display: "flex", flexDirection: "column",
        boxShadow: "0 -4px 30px rgba(0,0,0,0.3)",
        animation: closing ? "sheetDown .3s cubic-bezier(.4,0,1,1) forwards" : "sheetUp .35s cubic-bezier(.32,.72,0,1) forwards",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 0" }}>
          <div style={{ width: 36, height: 4.5, borderRadius: 3, background: "#ccc" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "10px 14px 6px" }}>
          <div onClick={() => step > 1 ? setStep(step - 1) : doClose()} style={{ cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
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
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "0 18px 8px", WebkitOverflowScrolling: "touch" }}>
          {children}
        </div>
        <div style={{ padding: "10px 18px 8px", flexShrink: 0, borderTop: "1px solid #f0f0f0" }}>
          <button disabled={!canNext} onClick={doNext} style={{
            width: "100%", padding: "14px", border: "none", borderRadius: 12,
            background: canNext ? "#22c55e" : "#e5e7eb", color: canNext ? "#fff" : "#bbb",
            fontWeight: 700, fontSize: 16, cursor: canNext ? "pointer" : "default",
            transition: "background .2s", fontFamily: "inherit",
          }}>{step < totalSteps ? "Siguiente" : "Enviar"}</button>
          <div style={{ textAlign: "center", padding: "8px 0 4px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <span style={{ fontSize: 15 }}>🤖</span>
            <span style={{ fontSize: 12, color: "#aaa" }}>Managed by <strong style={{ color: "#888" }}>{managedBy}</strong>.</span>
            <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, cursor: "pointer" }}>Learn more</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ Shared components ═══ */
function Dropdown({ label, value, displayValue, placeholder, options, open, setOpen, onSelect, onClear, renderOption }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {label && <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 6 }}>{label}</div>}
      <div onClick={() => setOpen(!open)} style={{
        border: `1.5px solid ${open ? "#22c55e" : "#d1d5db"}`, borderRadius: 10, padding: "13px 14px",
        display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "#fff",
      }}>
        <span style={{ color: value ? "#111" : "#9ca3af", fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {displayValue || placeholder}
        </span>
        {value ? (
          <div onClick={e => { e.stopPropagation(); onClear(); }} style={{ cursor: "pointer", display: "flex", flexShrink: 0, marginLeft: 8 }}>
            <svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e5e7eb" /><path d="M8 8l8 8M16 8l-8 8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" /></svg>
          </div>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" style={{ flexShrink: 0, marginLeft: 8 }}><path d="M6 9l6 6 6-6" /></svg>
        )}
      </div>
      {open && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,.08)", marginTop: 4, background: "#fff", maxHeight: 220, overflowY: "auto" }}>
          {options.map((opt, i) => (
            <div key={i} onClick={() => { onSelect(opt); setOpen(false); }}
              style={{ padding: "11px 14px", cursor: "pointer", borderTop: i > 0 ? "1px solid #f3f4f6" : "none", background: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >{renderOption ? renderOption(opt) : <span style={{ fontSize: 14, color: "#111" }}>{opt}</span>}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function RadioGroup({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {label && <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 10 }}>{label}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map(opt => (
          <div key={opt} onClick={() => onChange(opt)} style={{
            border: `1.5px solid ${value === opt ? "#22c55e" : "#d1d5db"}`, borderRadius: 10,
            padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
            background: value === opt ? "#f0fdf4" : "#fff", transition: "all .15s",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: `2px solid ${value === opt ? "#22c55e" : "#d1d5db"}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {value === opt && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />}
            </div>
            <span style={{ fontSize: 15, color: "#111" }}>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SingleSelect({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 4 }}>
      {label && <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 10 }}>{label}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map(opt => (
          <div key={opt} onClick={() => onChange(opt)} style={{
            border: `1.5px solid ${value === opt ? "#22c55e" : "#e5e7eb"}`, borderRadius: 10,
            padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
            background: value === opt ? "#f0fdf4" : "#fff", transition: "all .15s",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: `2px solid ${value === opt ? "#22c55e" : "#d1d5db"}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {value === opt && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />}
            </div>
            <span style={{ fontSize: 15, color: "#111" }}>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, helperText, required, multiline }) {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{label}</span>
        {!required && <span style={{ fontSize: 14, color: "#9ca3af" }}>Optional</span>}
      </div>
      <Tag value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ""}
        rows={multiline ? 3 : undefined}
        style={{
          width: "100%", border: `1.5px solid ${focused ? "#22c55e" : "#d1d5db"}`, borderRadius: 10,
          padding: "12px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", color: "#111",
          boxSizing: "border-box", resize: "none", background: "#fff", transition: "border-color .15s",
        }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      />
      {helperText && <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 3 }}>{helperText}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CAFEXPRESS FLOW
   ═══════════════════════════════════════════ */
function CafExpressFlow({ onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [serviceOpen, setServiceOpen] = useState(false);
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

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      setPhotoSize((file.size / 1024).toFixed(2) + " KB · " + file.name.split(".").pop());
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const canNext = () => {
    if (step === 1) return !!service && !!workType;
    if (step === 2) return usedParts !== null && (usedParts === "No" || (usedParts === "Sí" && partsDetail.trim()));
    if (step === 3) return horaEntrada.trim() && horaSalida.trim() && !!photo;
    if (step === 4) return true;
    return false;
  };

  return (
    <FlowShell
      title="Servicio Técnico"
      managedBy="CafExpress"
      totalSteps={4}
      step={step} setStep={setStep}
      onClose={onClose}
      canNext={canNext()}
      onNext={() => onComplete({ service, workType, usedParts, partsDetail, horaEntrada, horaSalida, observations, photo })}
    >
      {/* STEP 1: Service + Work type */}
      {step === 1 && (
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>
            ☕ Servicio técnico
          </div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px", lineHeight: 1.45 }}>
            Selecciona el servicio asignado y el tipo de trabajo realizado.
          </p>

          <Dropdown
            label="Servicio"
            value={service}
            displayValue={service ? `${service.code} — ${service.client}` : null}
            placeholder="Seleccionar servicio..."
            options={SERVICES}
            open={serviceOpen} setOpen={setServiceOpen}
            onSelect={setService}
            onClear={() => setService(null)}
            renderOption={(s) => (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{s.code}</span>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{s.client} — {s.machine}</div>
              </div>
            )}
          />

          {service && !serviceOpen && (
            <div style={{ marginTop: 8, marginBottom: 16, background: "#f0fdf4", borderRadius: 10, padding: 12, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Servicio seleccionado</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginTop: 3 }}>{service.code}</div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>{service.client} · {service.machine}</div>
            </div>
          )}

          <div style={{ marginTop: serviceOpen ? 4 : 14 }}>
            <SingleSelect
              label="Trabajo realizado"
              options={WORK_TYPES}
              value={workType}
              onChange={setWorkType}
            />
          </div>
        </div>
      )}

      {/* STEP 2: Repuestos */}
      {step === 2 && (
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>
            🔧 Repuestos
          </div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px", lineHeight: 1.45 }}>
            Indica si se utilizaron repuestos en el servicio.
          </p>

          <RadioGroup
            label="¿Se utilizaron repuestos?"
            options={["Sí", "No"]}
            value={usedParts}
            onChange={setUsedParts}
          />

          {usedParts === "Sí" && (
            <div style={{ marginTop: 18 }}>
              <TextInput
                label="Detalle de repuestos"
                value={partsDetail}
                onChange={setPartsDetail}
                placeholder="Ej: Válvula de presión, filtro de agua..."
                helperText="Describe los repuestos utilizados"
                required
                multiline
              />
            </div>
          )}

          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <span style={{ fontSize: 13, color: "#aaa" }}>Incluye modelo o código de los repuestos si es posible</span>
          </div>
        </div>
      )}

      {/* STEP 3: Observaciones + Hora + Foto firma */}
      {step === 3 && (
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>
            📝 Cierre de servicio
          </div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px", lineHeight: 1.45 }}>
            Registra los horarios y la foto de conformidad del cliente.
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <TextInput
                label="Hora de entrada"
                value={horaEntrada}
                onChange={setHoraEntrada}
                placeholder="Ej: 09:30"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextInput
                label="Hora de salida"
                value={horaSalida}
                onChange={setHoraSalida}
                placeholder="Ej: 11:45"
                required
              />
            </div>
          </div>

          <TextInput
            label="Observaciones"
            value={observations}
            onChange={setObservations}
            placeholder="Notas adicionales del servicio..."
            helperText="Cualquier detalle relevante del servicio realizado"
            multiline
          />

          {/* Photo upload for signature */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 2 }}>Foto de conformidad</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 2 }}>Cliente con pulgar arriba junto a la máquina</div>
            {!photo && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>Obligatorio — 1 foto requerida</div>}

            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />

            {!photo ? (
              <div onClick={() => fileRef.current?.click()} style={{
                border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "13px 14px",
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", background: "#22c55e",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <span style={{ color: "#22c55e", fontWeight: 600, fontSize: 15 }}>Tomar foto</span>
              </div>
            ) : (
              <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 12 }}>
                <img src={photo} alt="" style={{ width: 50, height: 50, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{photoName}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{photoSize}</div>
                </div>
                <div onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ""; }} style={{ cursor: "pointer" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <span style={{ fontSize: 13, color: "#aaa" }}>La foto debe mostrar al cliente conforme junto al equipo</span>
          </div>
        </div>
      )}

      {/* STEP 4: Confirmación */}
      {step === 4 && (
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>✅ Confirmación</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px", lineHeight: 1.45 }}>Revisa la información antes de enviar.</p>

          <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Servicio</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginTop: 4 }}>{service?.code}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>{service?.client} · {service?.machine}</div>
          </div>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Trabajo realizado</div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginTop: 4 }}>{workType}</div>
          </div>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Repuestos</div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginTop: 4 }}>{usedParts}</div>
            {usedParts === "Sí" && <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{partsDetail}</div>}
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, background: "#f9fafb", borderRadius: 10, padding: 14, border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Entrada</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginTop: 4 }}>{horaEntrada}</div>
            </div>
            <div style={{ flex: 1, background: "#f9fafb", borderRadius: 10, padding: 14, border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Salida</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginTop: 4 }}>{horaSalida}</div>
            </div>
          </div>
          {observations && (
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Observaciones</div>
              <div style={{ fontSize: 14, color: "#111", marginTop: 4, lineHeight: 1.4 }}>{observations}</div>
            </div>
          )}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Foto de conformidad</div>
            {photo && <img src={photo} alt="" style={{ width: "100%", borderRadius: 8, display: "block" }} />}
          </div>
        </div>
      )}
    </FlowShell>
  );
}

/* ═══════════════════════════════════════════
   CANAI FLOW (existing)
   ═══════════════════════════════════════════ */
function CanaiFlow({ onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [photoType, setPhotoType] = useState(null);
  const [photoTypeOpen, setPhotoTypeOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [photoSize, setPhotoSize] = useState("");
  const [observation, setObservation] = useState("");
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      setPhotoSize((file.size / 1024).toFixed(2) + " KB · " + file.name.split(".").pop());
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const canNext = () => {
    if (step === 1) return !!selectedOrder;
    if (step === 2) return !!photo && !!photoType;
    return true;
  };

  return (
    <FlowShell title="Reporte fotográfico" managedBy="Canai" totalSteps={3}
      step={step} setStep={setStep} onClose={onClose} canNext={canNext()}
      onNext={() => onComplete({ order: selectedOrder, photoType, photo, observation })}
    >
      {step === 1 && (
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>📋 Orden de trabajo</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Selecciona la orden activa.</p>
          <Dropdown label="Orden de trabajo" value={selectedOrder}
            displayValue={selectedOrder ? `${selectedOrder.id} — ${selectedOrder.client}` : null}
            placeholder="Seleccionar orden..." options={WORK_ORDERS_CANAI}
            open={orderOpen} setOpen={setOrderOpen} onSelect={setSelectedOrder} onClear={() => setSelectedOrder(null)}
            renderOption={o => (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{o.id}</span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, fontWeight: 600, background: o.status === "En progreso" ? "#fef3c7" : "#f1f5f9", color: o.status === "En progreso" ? "#92400e" : "#64748b" }}>{o.status}</span>
                </div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{o.client} — {o.desc}</div>
              </div>
            )}
          />
        </div>
      )}
      {step === 2 && (
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>📸 Foto del local</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Reporte fotográfico del día.</p>
          <Dropdown label="Tipo de foto" value={photoType} displayValue={photoType}
            placeholder="Promoción..." options={PHOTO_TYPES_CANAI}
            open={photoTypeOpen} setOpen={setPhotoTypeOpen} onSelect={setPhotoType} onClear={() => setPhotoType(null)}
          />
          <div style={{ marginTop: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Foto</div>
            <div style={{ fontSize: 13, color: "#6b7280", margin: "2px 0" }}>Max file size 25 MB.</div>
            {!photo && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 8 }}>Minimum 1 photo required</div>}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {!photo ? (
              <div onClick={() => fileRef.current?.click()} style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "13px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#22c55e"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                </div>
                <span style={{ color: "#22c55e", fontWeight: 600, fontSize: 15 }}>Take Photo</span>
              </div>
            ) : (
              <div style={{ border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 12 }}>
                <img src={photo} alt="" style={{ width: 50, height: 50, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{photoName}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>{photoSize}</div>
                </div>
                <div onClick={() => { setPhoto(null); if (fileRef.current) fileRef.current.value = ""; }} style={{ cursor: "pointer" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 18 }}>
            <TextInput label="Observación" value={observation} onChange={setObservation}
              helperText="Describe cualquier detalle relevante" multiline />
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <span style={{ fontSize: 13, color: "#aaa" }}>Tip: Mantén la cámara horizontal para mejor calidad</span>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 4 }}>✅ Confirmación</div>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 18px" }}>Revisa la información antes de enviar.</p>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Orden</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#111", marginTop: 4 }}>{selectedOrder?.id}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 1 }}>{selectedOrder?.client} — {selectedOrder?.desc}</div>
          </div>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Tipo de foto</div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#111", marginTop: 4 }}>{photoType}</div>
          </div>
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Foto</div>
            {photo && <img src={photo} alt="" style={{ width: "100%", borderRadius: 8, display: "block" }} />}
          </div>
          {observation && (
            <div style={{ background: "#f9fafb", borderRadius: 10, padding: 14, marginBottom: 10, border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>Observación</div>
              <div style={{ fontSize: 14, color: "#111", marginTop: 4 }}>{observation}</div>
            </div>
          )}
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
      { id: 1, from: "bot", text: "¡Hola técnico! 👋\nSoy el asistente de *CafExpress*.\n\nPresiona el botón para registrar tu servicio técnico.", time: "09:00", type: "text" },
      { id: 2, from: "bot", text: "", time: "09:00", type: "flow-button", label: "Registrar servicio", desc: "Completa el reporte de servicio técnico" },
    ],
    canai: [
      { id: 1, from: "bot", text: "¡Hola! 👋 Soy el asistente de Canai.\n\nPresiona el botón para registrar tu reporte fotográfico.", time: "10:00", type: "text" },
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

  const addMsg = (contactId, msg) => {
    setChatMessages(prev => ({ ...prev, [contactId]: [...(prev[contactId] || []), msg] }));
  };

  const addBotMsg = (contactId, text, delay = 800) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMsg(contactId, { id: Date.now(), from: "bot", text, time: now(), type: "text" });
    }, delay);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !activeContact) return;
    addMsg(activeContact.id, { id: Date.now(), from: "user", text: inputText.trim(), time: now(), type: "text" });
    setInputText("");
    if (activeContact.isBot) {
      addBotMsg(activeContact.id, "Utiliza el botón de *abrir* para completar el formulario ⬆️");
    }
  };

  const openChat = (c) => { setActiveContact(c); setScreen("chat"); setTimeout(() => inputRef.current?.focus(), 100); };

  const handleCafExpressComplete = (data) => {
    setShowFlow(false);
    addMsg("cafexpress", { id: Date.now(), from: "user", text: `✅ Servicio registrado\n☕ ${data.service.code}\n🔧 ${data.workType}\n⏰ ${data.horaEntrada} - ${data.horaSalida}\n${data.usedParts === "Sí" ? "🔩 Repuestos: " + data.partsDetail : "🔩 Sin repuestos"}`, time: now(), type: "text" });
    setTimeout(() => addBotMsg("cafexpress", "🎉 *¡Servicio registrado exitosamente!*\n\nServicio: " + data.service.code + "\nCliente: " + data.service.client + "\nTrabajo: " + data.workType + "\n\nEl supervisor ha sido notificado. ¡Buen trabajo! ☕💪", 1000), 200);
  };

  const handleCanaiComplete = (data) => {
    setShowFlow(false);
    addMsg("canai", { id: Date.now(), from: "user", text: `✅ Reporte enviado\n📋 ${data.order.id}\n📷 ${data.photoType}`, time: now(), type: "text" });
    setTimeout(() => addBotMsg("canai", "🎉 *¡Reporte registrado!*\n\nOrden: " + data.order.id + "\nCliente: " + data.order.client + "\n\n¡Buen trabajo! 💪", 1000), 200);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #0a0f1a 0%, #101828 40%, #0f172a 100%)",
      fontFamily: "-apple-system, 'SF Pro Display', 'Segoe UI', sans-serif", padding: "20px 0",
    }}>
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>
          <span style={{ color: "#25d366" }}>WhatsApp</span> Flow Demo
        </h1>
        <p style={{ color: "#64748b", fontSize: 13, margin: "6px 0 16px" }}>Meta Flows — CafExpress & Canai</p>
        <button onClick={() => {
          if (screen === "chats") { openChat(CONTACTS[0]); setTimeout(() => setShowFlow(true), 500); }
          else if (activeContact?.isBot) setShowFlow(true);
        }} style={{
          background: "linear-gradient(135deg, #25d366, #128c7e)", color: "#fff", border: "none", borderRadius: 28,
          padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 24px rgba(37,211,102,.3)",
          display: "inline-flex", alignItems: "center", gap: 8,
        }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3 20l1.3-3.9C3.5 14.5 3 12.8 3 11c0-5 4-9 9-9s9 4 9 9-4 9-9 9c-1.8 0-3.5-.5-5.1-1.3L3 20z" /></svg>
          Enviar Flow
        </button>
      </div>

      {/* Phone */}
      <div style={{
        width: 370, height: 750, borderRadius: 48, background: "#000",
        boxShadow: "0 25px 80px rgba(0,0,0,.5), inset 0 0 0 2px #2a2a2a",
        position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
      }}>
        <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 126, height: 32, background: "#000", borderRadius: 20, zIndex: 50 }} />
        <div style={{
          height: 52, display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          padding: "0 28px 4px", zIndex: 10, flexShrink: 0, background: screen === "chats" ? "#111b21" : "#1f2c34",
        }}>
          <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{now()}</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="#fff"><rect x="0" y="7" width="3" height="4" rx=".5" /><rect x="4" y="4" width="3" height="7" rx=".5" /><rect x="8" y="1.5" width="3" height="9.5" rx=".5" /><rect x="12" y="0" width="3" height="11" rx=".5" /></svg>
            <svg width="15" height="11" viewBox="0 0 24 24" fill="#fff"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" /></svg>
            <svg width="22" height="11" viewBox="0 0 28 14"><rect x=".5" y=".5" width="23" height="13" rx="2.5" stroke="#fff" strokeOpacity=".35" fill="none" /><rect x="2" y="2" width="10" height="10" rx="1.5" fill="#fff" /></svg>
          </div>
        </div>

        {/* CHATS LIST */}
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
                  onMouseEnter={e => e.currentTarget.style.background = "#202c33"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
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

        {/* CHAT SCREEN */}
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
              {currentMsgs.map((msg) => {
                if (msg.type === "flow-button") {
                  return (
                    <div key={msg.id} style={{ display: "flex", marginBottom: 4 }}>
                      <div style={{ maxWidth: "85%" }}>
                        <div style={{ background: "#1f2c34", borderRadius: "10px 10px 10px 2px", overflow: "hidden" }}>
                          <div style={{ padding: "10px 12px 8px" }}>
                            <div style={{ color: "#e9edef", fontSize: 14, fontWeight: 500 }}>{activeContact.id === "cafexpress" ? "☕" : "📋"} {msg.label}</div>
                            <div style={{ color: "#8696a0", fontSize: 12, marginTop: 2 }}>{msg.desc}</div>
                          </div>
                          <div onClick={() => setShowFlow(true)} style={{ borderTop: "1px solid #2a3942", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#263845"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
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
                }
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
                <circle cx="9" cy="10" r="1.2" fill="#8696a0" /><circle cx="15" cy="10" r="1.2" fill="#8696a0" />
              </svg>
              <div style={{ flex: 1, background: "#2a3942", borderRadius: 22, padding: "9px 14px" }}>
                <input ref={inputRef} value={inputText} onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendMessage(); }} placeholder="Mensaje"
                  style={{ background: "none", border: "none", outline: "none", color: "#e9edef", fontSize: 15, width: "100%", fontFamily: "inherit" }} />
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

            {showFlow && activeContact.id === "cafexpress" && <CafExpressFlow onClose={() => setShowFlow(false)} onComplete={handleCafExpressComplete} />}
            {showFlow && activeContact.id === "canai" && <CanaiFlow onClose={() => setShowFlow(false)} onComplete={handleCanaiComplete} />}
          </div>
        )}
      </div>

      <style>{`
        @keyframes typingDot{0%,60%,100%{opacity:.3;transform:scale(.8)}30%{opacity:1;transform:scale(1)}}
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes sheetDown{from{transform:translateY(0)}to{transform:translateY(100%)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeOut{from{opacity:1}to{opacity:0}}
        *{box-sizing:border-box;margin:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#374045;border-radius:4px}
        input::placeholder,textarea::placeholder{color:#9ca3af}
      `}</style>
    </div>
  );
}
