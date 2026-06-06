import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  FaUserPlus, FaTrashAlt, FaSearch, FaMicrophone, 
  FaUserGraduate, FaPhoneAlt, FaTimes, 
  FaCheckCircle, FaCamera, FaIdCard, FaMapMarkerAlt,
  FaFileInvoice, FaGraduationCap, FaCalendarAlt, FaUniversity
} from "react-icons/fa";

const API_URL = "https://happy-valley-school.onrender.com/api/students";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showSlidePanel, setShowSlidePanel] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // All backend fields initialized safely
  const [formData, setFormData] = useState({
    name: "",
    studentClass: "",
    password: "",
    father_name: "",
    mother_name: "",
    date_of_birth: "",
    aadhar_no: "",
    samagra_id: "",
    pan_no: "",
    apaar_id: "",
    account_no: "",
    whatsapp_no: "",
    mobile: "",
    address: "",
    joining_date: "",
    session: "",
    stream: ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // 1. Fetch Students
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const data = res.data.success ? res.data.students : (Array.isArray(res.data) ? res.data : []);
      setStudents(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchStudents(); 
  }, [fetchStudents]);

  // 2. Handle Inputs
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 3. Register Student
  const handleRegister = async () => {
    if (!formData.name || !formData.studentClass || !formData.password) {
      return alert("Name, Class and Password are required!");
    }

    setIsRegistering(true);

    try {
      const studentPayload = {
        name: formData.name,
        class: formData.studentClass,
        password: formData.password,
        father_name: formData.father_name || null,
        mother_name: formData.mother_name || null,
        date_of_birth: formData.date_of_birth || null,
        aadhar_no: formData.aadhar_no || null,
        samagra_id: formData.samagra_id || null,
        pan_no: formData.pan_no || null,
        apaar_id: formData.apaar_id || null,
        account_no: formData.account_no || null,
        whatsapp_no: formData.whatsapp_no || null,
        mobile: formData.mobile || null,
        address: formData.address || null,
        joining_date: formData.joining_date || null,
        session: formData.session || null,
        stream: formData.stream || null
      };

      const res = await axios.post(API_URL, studentPayload);

      if (res.data.success) {
        const newId = res.data.id;

        if (selectedFile) {
          const photoData = new FormData();
          photoData.append("photo", selectedFile); 

          await axios.post(`${API_URL}/${newId}/profile-photo`, photoData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }

        alert("Student Registered Successfully!");
        setShowSlidePanel(false);
        fetchStudents();
        
        setFormData({
          name: "", studentClass: "", password: "", father_name: "", mother_name: "",
          date_of_birth: "", aadhar_no: "", samagra_id: "", pan_no: "", apaar_id: "",
          account_no: "", whatsapp_no: "", mobile: "", address: "", joining_date: "",
          session: "", stream: ""
        });
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        alert("Registration Failed: " + res.data.message);
      }
    } catch (err) {
      console.error("Error Detail:", err.response?.data || err);
      alert("Error: " + (err.response?.data?.message || "Server error. Check console."));
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanent deletion of record. Proceed?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchStudents();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => setSearchTerm(e.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div style={ui.appContainer}>
      
      {/* --- REUSABLE SYSTEM & SCHOOL BRANDING HEADER --- */}
      <header style={ui.headerSection}>
        <div style={ui.brandGroup}>
          <div style={ui.logoBox}><FaUserGraduate /></div>
          <div>
            <div style={ui.appBadgeHeader}>CLASSIO PLATFORM</div>
            <h1 style={ui.mainTitle}>THE HAPPY VALLEY</h1>
            <p style={ui.subTitle}>INTERNATIONAL SCHOOL • CORE REGISTRY</p>
          </div>
        </div>
        <div style={ui.statsContainer}>
          <div style={ui.statItem}>
            <span style={ui.statVal}>{students.length}</span>
            <span style={ui.statLab}>Total Enrolled Logs</span>
          </div>
        </div>
      </header>

      {/* --- COMMAND CONTROL BAR --- */}
      <div style={ui.commandBar}>
        <div style={ui.searchCluster}>
          <div style={ui.voiceSearchWrapper}>
            <FaSearch style={ui.searchIcon} />
            <input 
              type="text" placeholder="Search across all dynamic rows by name..." style={ui.searchField}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button style={{...ui.micBtn, color: isListening ? '#ef4444' : '#94a3b8'}} onClick={handleVoiceSearch}>
              <FaMicrophone />
            </button>
          </div>
        </div>
        <button style={ui.newRegBtn} onClick={() => setShowSlidePanel(true)}>
          <FaUserPlus /> Open Wide Registration Form
        </button>
      </div>

      {/* --- EXCEL SPREADSHEET ARCHIVE GRID --- */}
      <main style={ui.gridWrapper}>
        <div style={ui.scrollContainer}>
          <table style={ui.enterpriseTable}>
            <thead>
              <tr style={ui.tableHeaderRow}>
                <th style={{...ui.th, width: '220px'}}>Student Core Details</th>
                <th style={{...ui.th, width: '110px'}}>Class / Stream</th>
                <th style={{...ui.th, width: '160px'}}>Family Lineage</th>
                <th style={{...ui.th, width: '130px'}}>Dynamic Identity Matrix</th>
                <th style={{...ui.th, width: '150px'}}>Contact Matrix</th>
                <th style={{...ui.th, width: '160px'}}>Financial Ledger</th>
                <th style={{...ui.th, width: '200px'}}>Correspondence Address</th>
                <th style={{...ui.th, width: '100px'}}>Status</th>
                <th style={{...ui.th, width: '80px', textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((s) => (
                <tr key={s.id} style={ui.trStyle} className="row-hover">
                  {/* Student Core Details */}
                  <td style={ui.td}>
                    <div style={ui.identityGroup}>
                      <div style={ui.avatarStyle}>
                        <img 
                          src={s.profile_photo || `https://ui-avatars.com/api/?name=${s.name}&background=1e3a8a&color=fff`} 
                          alt="" style={ui.avatarImg}
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${s.name}&background=1e3a8a&color=fff`; }}
                        />
                      </div>
                      <div>
                        <div style={ui.empName}>{s.name}</div>
                        <div style={ui.empId}>UID: SCH-{s.id}</div>
                        {s.date_of_birth && <div style={ui.excelSubText}>DOB: {s.date_of_birth}</div>}
                      </div>
                    </div>
                  </td>
                  
                  {/* Class / Stream */}
                  <td style={ui.td}>
                    <span style={ui.deptBadge}>{s.class}</span>
                    {s.stream && <div style={{...ui.excelSubText, marginTop: '4px', fontWeight: '600'}}>{s.stream}</div>}
                  </td>

                  {/* Family Lineage */}
                  <td style={ui.td}>
                    <div style={ui.excelMainText}>F: {s.father_name || "—"}</div>
                    <div style={ui.excelSubText}>M: {s.mother_name || "—"}</div>
                  </td>

                  {/* Identity Tracker */}
                  <td style={ui.td}>
                    <div style={ui.excelSubText}><b>Aadhaar:</b> {s.aadhar_no || "—"}</div>
                    <div style={ui.excelSubText}><b>Samagra:</b> {s.samagra_id || "—"}</div>
                    <div style={ui.excelSubText}><b>APAAR:</b> {s.apaar_id || "—"}</div>
                  </td>
                  
                  {/* Contact Matrix */}
                  <td style={ui.td}>
                    <div style={ui.contactInfo}><FaPhoneAlt size={10} color="#3b82f6"/> {s.mobile || "—"}</div>
                    {s.whatsapp_no && <div style={{...ui.excelSubText, color: '#16a34a', fontWeight: '600'}}>WA: {s.whatsapp_no}</div>}
                  </td>

                  {/* Financial Ledger */}
                  <td style={ui.td}>
                    <div style={ui.excelMainText}>A/C: {s.account_no || "—"}</div>
                    {s.pan_no && <div style={ui.excelSubText}>PAN: {s.pan_no}</div>}
                  </td>

                  {/* Address */}
                  <td style={ui.td}>
                    <div style={ui.addressInfo} title={s.address}>{s.address || "No Address Saved"}</div>
                  </td>

                  {/* Status */}
                  <td style={ui.td}>
                    <span style={ui.statusTag}>Active</span>
                  </td>

                  {/* Action */}
                  <td style={{...ui.td, textAlign: 'center'}}>
                    <button style={ui.rowActionBtn} onClick={() => handleDelete(s.id)}><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div style={ui.loaderStyle}>Syncing records from secure server...</div>}
        {!loading && students.length === 0 && <div style={ui.loaderStyle}>No database logs found.</div>}
      </main>

      {/* --- EXTENDED 85% WIDE FULL-PAGE SLIDE-OVER REGISTRATION FORM --- */}
      <div style={{...ui.sidePanel, transform: showSlidePanel ? 'translateX(0)' : 'translateX(100%)'}}>
        <div style={ui.panelHeader}>
          <div>
            <span style={ui.formBadge}>CLASSIO ADVANCED REGISTRY</span>
            <h2 style={{margin: '4px 0 0 0', fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px'}}>New Student Enrollment Framework</h2>
          </div>
          <button onClick={() => setShowSlidePanel(false)} style={ui.closePanelBtn}><FaTimes size={18} /></button>
        </div>
        
        <div style={ui.panelBody}>
          {/* Avatar Area */}
          <div style={ui.photoUploadSection}>
             <div style={ui.previewCircle}>
                {previewUrl ? <img src={previewUrl} style={ui.avatarImg} alt="Preview" /> : <FaCamera size={32} color="#94a3b8" />}
             </div>
             <label style={ui.uploadLabel}>
                {previewUrl ? "Change Profile Picture" : "Upload Secure Digital Passport Photo"}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
             </label>
          </div>

          <div style={ui.formStructuredLayout}>
            
            {/* GRID LAYER 1: Core Credentials */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaUserGraduate /> Section 1: Core System Personal Records</h3>
              
              <div style={ui.grid3Column}>
                <div>
                  <label style={ui.labelStyle}>Full Name *</label>
                  <input name="name" style={ui.panelInput} value={formData.name} onChange={handleInputChange} placeholder="Legal Name" />
                </div>
                <div>
                  <label style={ui.labelStyle}>Date of Birth</label>
                  <input name="date_of_birth" type="date" style={ui.panelInput} value={formData.date_of_birth} onChange={handleInputChange} />
                </div>
                <div>
                  <label style={ui.labelStyle}>Secure Portal Password *</label>
                  <input name="password" type="password" style={ui.panelInput} value={formData.password} onChange={handleInputChange} placeholder="Access Key" />
                </div>
              </div>

              <div style={ui.grid2Column}>
                <div>
                  <label style={ui.labelStyle}>Father's Name</label>
                  <input name="father_name" style={ui.panelInput} value={formData.father_name} onChange={handleInputChange} placeholder="Father's full name" />
                </div>
                <div>
                  <label style={ui.labelStyle}>Mother's Name</label>
                  <input name="mother_name" style={ui.panelInput} value={formData.mother_name} onChange={handleInputChange} placeholder="Mother's full name" />
                </div>
              </div>
            </div>

            {/* GRID LAYER 2: Academic Structures */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaGraduationCap /> Section 2: Institutional Academic Allocation</h3>
              
              <div style={ui.grid4Column}>
                <div>
                  <label style={ui.labelStyle}>Class Allocation *</label>
                  <input name="studentClass" style={ui.panelInput} value={formData.studentClass} onChange={handleInputChange} placeholder="e.g. 11th" />
                </div>
                <div>
                  <label style={ui.labelStyle}>Stream Matrix</label>
                  <input name="stream" style={ui.panelInput} value={formData.stream} onChange={handleInputChange} placeholder="Science, Commerce, Arts" />
                </div>
                <div>
                  <label style={ui.labelStyle}>Academic Session</label>
                  <input name="session" style={ui.panelInput} value={formData.session} placeholder="e.g. 2026-2027" onChange={handleInputChange} />
                </div>
                <div>
                  <label style={ui.labelStyle}>Joining/Admission Date</label>
                  <input name="joining_date" type="date" style={ui.panelInput} value={formData.joining_date} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* GRID LAYER 3: Legal Trackers */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaIdCard /> Section 3: Statutory Government Identifiers</h3>
              
              <div style={ui.grid4Column}>
                <div>
                  <label style={ui.labelStyle}>Aadhaar Number</label>
                  <input name="aadhar_no" style={ui.panelInput} value={formData.aadhar_no} onChange={handleInputChange} placeholder="12-Digit UID" />
                </div>
                <div>
                  <label style={ui.labelStyle}>Samagra ID</label>
                  <input name="samagra_id" style={ui.panelInput} value={formData.samagra_id} onChange={handleInputChange} placeholder="State ID String" />
                </div>
                <div>
                  <label style={ui.labelStyle}>PAN Card Number</label>
                  <input name="pan_no" style={ui.panelInput} value={formData.pan_no} onChange={handleInputChange} placeholder="Alphanumeric PAN" />
                </div>
                <div>
                  <label style={ui.labelStyle}>APAAR ID</label>
                  <input name="apaar_id" style={ui.panelInput} value={formData.apaar_id} onChange={handleInputChange} placeholder="Edu Cloud ID" />
                </div>
              </div>
            </div>

            {/* GRID LAYER 4: Contact, Comms & Financial Ledger */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaFileInvoice /> Section 4: Communication Matrix & Banking Asset Node</h3>
              
              <div style={ui.grid3Column}>
                <div>
                  <label style={ui.labelStyle}>Primary Call Number</label>
                  <input name="mobile" style={ui.panelInput} value={formData.mobile} onChange={handleInputChange} placeholder="Calling Mobile" />
                </div>
                <div>
                  <label style={ui.labelStyle}>WhatsApp Alerts No</label>
                  <input name="whatsapp_no" style={ui.panelInput} value={formData.whatsapp_no} onChange={handleInputChange} placeholder="Instant messaging number" />
                </div>
                <div>
                  <label style={ui.labelStyle}>Scholarship Bank Account</label>
                  <input name="account_no" style={ui.panelInput} value={formData.account_no} onChange={handleInputChange} placeholder="Ledger Bank A/C Number" />
                </div>
              </div>
            </div>

            {/* GRID LAYER 5: Coordinates */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaMapMarkerAlt /> Section 5: Localization Coordinates</h3>
              <label style={ui.labelStyle}>Permanent Correspondence Address</label>
              <textarea name="address" style={ui.panelTextarea} value={formData.address} onChange={handleInputChange} placeholder="Complete Street Address/Village/Tehsil/District Details..." />
            </div>

            <button style={ui.submitRegistrationBtn} onClick={handleRegister} disabled={isRegistering}>
              {isRegistering ? "Processing Framework Enrollment Logs..." : "Commit Structure To Core Database Engine"}
            </button>
          </div>
        </div>
      </div>
      
      {showSlidePanel && <div style={ui.panelOverlay} onClick={() => setShowSlidePanel(false)} />}
      <style>{`
        .row-hover:hover { background-color: #f1f5f9 !important; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

// ------------------ PREMIUM SYSTEMS ULTRA-WIDE THEME DESIGN --------------------
const ui = {
  appContainer: { background: "#f8fafc", minHeight: "100vh", width: "100vw", overflowX: "hidden", fontFamily: "'Inter', sans-serif" },
  headerSection: { display: "flex", justifyContent: "space-between", padding: "16px 40px", background: "#1e3a8a", color: "#fff", alignItems: "center", boxShadow: "0 4px 20px rgba(30,58,138,0.2)" },
  brandGroup: { display: "flex", alignItems: "center", gap: "18px" },
  logoBox: { width: "52px", height: "52px", background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)", borderRadius: "16px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "24px" },
  appBadgeHeader: { background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: "12px", display: "inline-block", fontSize: "10px", fontWeight: "800", letterSpacing: "1px", marginBottom: "2px" },
  mainTitle: { fontSize: "26px", margin: 0, fontWeight: "900", letterSpacing: "0.5px" },
  subTitle: { fontSize: "12px", opacity: 0.8, margin: "2px 0 0 0", fontWeight: "700", letterSpacing: "1px", color: "#f59e0b" },
  statsContainer: { display: "flex", alignItems: "center" },
  statItem: { textAlign: "right", background: "rgba(255,255,255,0.06)", padding: "8px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" },
  statVal: { display: "block", fontSize: "24px", fontWeight: "900", color: "#f59e0b", lineHeight: "1" },
  statLab: { fontSize: "10px", opacity: 0.8, textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px", marginTop: "4px" },
  commandBar: { display: "flex", justifyContent: "space-between", padding: "16px 40px", borderBottom: "1px solid #e2e8f0", background: "#fff", alignItems: "center" },
  searchCluster: { flex: 0.5 },
  voiceSearchWrapper: { position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: "16px", color: "#94a3b8", fontSize: "15px" },
  searchField: { width: "100%", padding: "12px 48px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", outline: "none", fontSize: "14px", transition: "0.2s" },
  micBtn: { position: "absolute", right: "16px", background: "none", border: "none", cursor: "pointer", fontSize: "16px" },
  newRegBtn: { background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 14px rgba(30, 58, 138, 0.25)" },
  gridWrapper: { width: "100%", padding: "24px 40px", boxSizing: "border-box" },
  scrollContainer: { overflowX: "auto", background: "#fff", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0" },
  enterpriseTable: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
  tableHeaderRow: { background: "#f8fafc", borderBottom: "2px solid #e2e8f0" },
  th: { padding: "16px 20px", textAlign: "left", fontSize: "11px", color: "#475569", textTransform: "uppercase", fontWeight: "800", letterSpacing: "0.5px" },
  td: { padding: "14px 20px", borderBottom: "1px solid #e2e8f0", verticalAlign: "middle", overflow: "hidden", textOverflow: "ellipsis" },
  trStyle: { transition: "0.2s" },
  identityGroup: { display: "flex", alignItems: "center", gap: "12px" },
  avatarStyle: { width: "46px", height: "46px", borderRadius: "12px", overflow: "hidden", background: "#eff6ff", border: "1px solid #dbeafe", flexShrink: 0 },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  empName: { fontWeight: "700", color: "#0f172a", fontSize: "14px", lineHeight: "1.2" },
  empId: { fontSize: "11px", color: "#3b82f6", marginTop: "2px", fontWeight: "700" },
  excelMainText: { fontSize: "13px", fontWeight: "600", color: "#334155" },
  excelSubText: { fontSize: "11px", color: "#64748b", marginTop: '2px' },
  deptBadge: { background: "#eff6ff", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", color: "#1e40af", fontWeight: "800", border: "1px solid #bfdbfe", display: "inline-block" },
  contactInfo: { fontSize: "13px", color: "#1e293b", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" },
  addressInfo: { fontSize: "12px", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  statusTag: { padding: "4px 10px", background: "#dcfce7", color: "#15803d", borderRadius: "6px", fontSize: "11px", fontWeight: "800", display: "inline-flex", alignItems: "center" },
  rowActionBtn: { background: "#fee2e2", border: "none", color: "#dc2626", padding: "10px", borderRadius: "10px", cursor: "pointer", transition: "0.2s", display: "inline-flex", alignItems: "center", justifyContent: "center" },
  
  // ULTRA-WIDE 85% SCREEN OVERLAY PANEL
  sidePanel: { position: "fixed", top: 0, right: 0, width: "85vw", height: "100%", background: "#fff", zIndex: 1000, transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "-15px 0 50px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" },
  panelHeader: { padding: "20px 40px", background: "#1e3a8a", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" },
  formBadge: { background: "#f59e0b", color: "#1e3a8a", padding: "3px 10px", borderRadius: "8px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.5px" },
  closePanelBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", transition: "0.2s" },
  panelBody: { padding: "40px", overflowY: "auto", background: "#f8fafc" },
  photoUploadSection: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "30px", background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", maxWidth: "320px", margin: "0 auto 30px auto", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" },
  previewCircle: { width: "100px", height: "100px", borderRadius: "28px", background: "#f1f5f9", border: "2px dashed #cbd5e1", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", marginBottom: "14px" },
  uploadLabel: { color: "#1e3a8a", fontSize: "13px", fontWeight: "800", cursor: "pointer" },
  formStructuredLayout: { display: "flex", flexDirection: "column", gap: "24px" },
  formBlockSection: { background: "#fff", padding: "25px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.01)" },
  sectionDividerTitle: { margin: "0 0 4px 0", fontSize: "15px", fontWeight: "800", color: "#1e3a8a", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px", display: "flex", alignItems: "center", gap: "8px", letterSpacing: "-0.2px" },
  
  // HIGH-TECH RESPONSIVE LAYOUT GRIDS
  grid2Column: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  grid3Column: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  grid4Column: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
  
  labelStyle: { fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" },
  panelInput: { padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px", outline: "none", background: "#fff", width: "100%", boxSizing: "border-box", transition: "0.2s" },
  panelTextarea: { padding: "14px", border: "1px solid #cbd5e1", borderRadius: "10px", height: "90px", fontSize: "14px", outline: "none", background: "#fff", resize: "none", width: "100%", boxSizing: "border-box" },
  submitRegistrationBtn: { background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", color: "#fff", border: "none", padding: "16px", borderRadius: "12px", fontWeight: "800", cursor: "pointer", marginTop: "15px", fontSize: "16px", boxShadow: "0 8px 24px rgba(30, 58, 138, 0.35)", letterSpacing: "0.5px" },
  panelOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(5px)", zIndex: 999 },
  loaderStyle: { textAlign: "center", padding: "60px", color: "#64748b", fontSize: "14px", fontWeight: "700" }
};

export default ManageStudents;