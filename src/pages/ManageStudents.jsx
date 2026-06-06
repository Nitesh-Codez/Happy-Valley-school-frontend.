import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  FaUserPlus, FaTrashAlt, FaSearch, FaMicrophone, 
  FaUserGraduate, FaPhoneAlt, FaTimes, 
  FaCheckCircle, FaCamera, FaIdCard, FaMapMarkerAlt,
  FaFileInvoice, FaGraduationCap
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL;

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

  // 3. Register Student with Sections Data Map
  const handleRegister = async () => {
    if (!formData.name || !formData.studentClass || !formData.password) {
      return alert("Name, Class and Password are required!");
    }

    setIsRegistering(true);

    try {
      // Mapping all form fields precisely to match your backend model variables
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

        // Upload Profile Photo if present
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
        
        // Comprehensive Form Reset
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
            <span style={ui.statLab}>Total Enrolled</span>
          </div>
        </div>
      </header>

      {/* --- COMMAND CONTROL BAR --- */}
      <div style={ui.commandBar}>
        <div style={ui.searchCluster}>
          <div style={ui.voiceSearchWrapper}>
            <FaSearch style={ui.searchIcon} />
            <input 
              type="text" placeholder="Search students by name..." style={ui.searchField}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button style={{...ui.micBtn, color: isListening ? '#ef4444' : '#94a3b8'}} onClick={handleVoiceSearch}>
              <FaMicrophone />
            </button>
          </div>
        </div>
        <button style={ui.newRegBtn} onClick={() => setShowSlidePanel(true)}>
          <FaUserPlus /> New Registration Form
        </button>
      </div>

      {/* --- DATA ARCHIVE TABLE --- */}
      <main style={ui.gridWrapper}>
        <div style={ui.scrollContainer}>
          <table style={ui.enterpriseTable}>
            <thead>
              <tr style={ui.tableHeaderRow}>
                <th style={ui.th}>Student Profile</th>
                <th style={ui.th}>Class / Batch</th>
                <th style={ui.th}>Contact Number</th>
                <th style={ui.th}>Residential Address</th>
                <th style={ui.th}>Status</th>
                <th style={ui.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((s) => (
                <tr key={s.id} style={ui.trStyle} className="row-hover">
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
                        <div style={ui.empId}>ID: SCH-{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={ui.td}>
                    <span style={ui.deptBadge}>{s.class} {s.stream ? `(${s.stream})` : ''}</span>
                  </td>
                  <td style={ui.td}>
                    <div style={ui.contactInfo}><FaPhoneAlt size={11} color="#64748b"/> {s.mobile || "N/A"}</div>
                  </td>
                  <td style={ui.td}>
                    <div style={ui.addressInfo}>{s.address || "No Address Provided"}</div>
                  </td>
                  <td style={ui.td}>
                    <span style={ui.statusTag}><FaCheckCircle size={10}/> Verified</span>
                  </td>
                  <td style={ui.td}>
                    <button style={ui.rowActionBtn} onClick={() => handleDelete(s.id)}><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && <div style={ui.loaderStyle}>Syncing records securely...</div>}
        {!loading && students.length === 0 && <div style={ui.loaderStyle}>No student database logs tracked.</div>}
      </main>

      {/* --- EXTENDED FULL-PAGE SLIDE-OVER REGISTRATION FORM --- */}
      <div style={{...ui.sidePanel, transform: showSlidePanel ? 'translateX(0)' : 'translateX(100%)'}}>
        <div style={ui.panelHeader}>
          <div>
            <span style={ui.formBadge}>CLASSIO ERP</span>
            <h2 style={{margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800'}}>Student Admission Form</h2>
          </div>
          <button onClick={() => setShowSlidePanel(false)} style={ui.closePanelBtn}><FaTimes /></button>
        </div>
        
        <div style={ui.panelBody}>
          {/* Avatar Section */}
          <div style={ui.photoUploadSection}>
             <div style={ui.previewCircle}>
                {previewUrl ? <img src={previewUrl} style={ui.avatarImg} alt="Preview" /> : <FaCamera size={26} color="#94a3b8" />}
             </div>
             <label style={ui.uploadLabel}>
                {previewUrl ? "Modify Photo" : "Upload Digital Profile Photo"}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
             </label>
          </div>

          <div style={ui.formStructuredLayout}>
            
            {/* SECTION 1: Personal Specifications */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaUserGraduate /> Section 1: Personal Details</h3>
              
              <label style={ui.labelStyle}>Full Name *</label>
              <input name="name" style={ui.panelInput} value={formData.name} onChange={handleInputChange} placeholder="As per official documents" />
              
              <div style={ui.formFlexRow}>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Father's Name</label>
                  <input name="father_name" style={ui.panelInput} value={formData.father_name} onChange={handleInputChange} placeholder="Father's full name" />
                </div>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Mother's Name</label>
                  <input name="mother_name" style={ui.panelInput} value={formData.mother_name} onChange={handleInputChange} placeholder="Mother's full name" />
                </div>
              </div>

              <div style={ui.formFlexRow}>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Date of Birth</label>
                  <input name="date_of_birth" type="date" style={ui.panelInput} value={formData.date_of_birth} onChange={handleInputChange} />
                </div>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Portal Access Password *</label>
                  <input name="password" type="password" style={ui.panelInput} value={formData.password} onChange={handleInputChange} placeholder="Secure Key" />
                </div>
              </div>
            </div>

            {/* SECTION 2: Academic Allocations */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaGraduationCap /> Section 2: Academic Details</h3>
              
              <div style={ui.formFlexRow}>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Class Allocated *</label>
                  <input name="studentClass" style={ui.panelInput} value={formData.studentClass} onChange={handleInputChange} placeholder="e.g. 11th" />
                </div>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Stream (If Applicable)</label>
                  <input name="stream" style={ui.panelInput} value={formData.stream} onChange={handleInputChange} placeholder="Science, Commerce, Arts" />
                </div>
              </div>

              <div style={ui.formFlexRow}>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Academic Session</label>
                  <input name="session" style={ui.panelInput} value={formData.session} placeholder="e.g. 2026-2027" onChange={handleInputChange} />
                </div>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Admission / Joining Date</label>
                  <input name="joining_date" type="date" style={ui.panelInput} value={formData.joining_date} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* SECTION 3: Compliance & Legal IDs */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaIdCard /> Section 3: Government & Legal Identifiers</h3>
              
              <div style={ui.formFlexRow}>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Aadhaar Number</label>
                  <input name="aadhar_no" style={ui.panelInput} value={formData.aadhar_no} onChange={handleInputChange} placeholder="12-digit UID" />
                </div>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Samagra ID</label>
                  <input name="samagra_id" style={ui.panelInput} value={formData.samagra_id} onChange={handleInputChange} placeholder="State Samagra ID" />
                </div>
              </div>

              <div style={ui.formFlexRow}>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>PAN Card Number</label>
                  <input name="pan_no" style={ui.panelInput} value={formData.pan_no} onChange={handleInputChange} placeholder="Permanent Account Number" />
                </div>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>APAAR ID</label>
                  <input name="apaar_id" style={ui.panelInput} value={formData.apaar_id} onChange={handleInputChange} placeholder="Edu APAAR ID Card" />
                </div>
              </div>
            </div>

            {/* SECTION 4: Contact & Banking Assets */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaFileInvoice /> Section 4: Contact & Financial Matrix</h3>
              
              <div style={ui.formFlexRow}>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>Primary Call Mobile</label>
                  <input name="mobile" style={ui.panelInput} value={formData.mobile} onChange={handleInputChange} placeholder="Calling number" />
                </div>
                <div style={{flex:1}}>
                  <label style={ui.labelStyle}>WhatsApp Alert No</label>
                  <input name="whatsapp_no" style={ui.panelInput} value={formData.whatsapp_no} onChange={handleInputChange} placeholder="For instance notifications" />
                </div>
              </div>

              <label style={ui.labelStyle}>Bank Account Number</label>
              <input name="account_no" style={ui.panelInput} value={formData.account_no} onChange={handleInputChange} placeholder="Scholarship Ledger Bank A/C" />
            </div>

            {/* SECTION 5: Location Parameters */}
            <div style={ui.formBlockSection}>
              <h3 style={ui.sectionDividerTitle}><FaMapMarkerAlt /> Section 5: Localization Coordinates</h3>
              <label style={ui.labelStyle}>Permanent Correspondence Address</label>
              <textarea name="address" style={ui.panelTextarea} value={formData.address} onChange={handleInputChange} placeholder="Complete Street/Village/District Details" />
            </div>

            <button style={ui.submitRegistrationBtn} onClick={handleRegister} disabled={isRegistering}>
              {isRegistering ? "Registering Student Core Base..." : "Finalize & Save Database"}
            </button>
          </div>
        </div>
      </div>
      
      {showSlidePanel && <div style={ui.panelOverlay} onClick={() => setShowSlidePanel(false)} />}
      <style>{`.row-hover:hover { background-color: #f8fafc !important; }`}</style>
    </div>
  );
};

// ------------------ PREMIUM SYSTEM THEMING STYLES --------------------
const ui = {
  appContainer: { background: "#f8fafc", minHeight: "100vh", width: "100vw", overflowX: "hidden", fontFamily: "'Inter', sans-serif" },
  headerSection: { display: "flex", justifyContent: "space-between", padding: "20px 40px", background: "#1e3a8a", color: "#fff", alignItems: "center", boxShadow: "0 4px 12px rgba(30,58,138,0.15)" },
  brandGroup: { display: "flex", alignItems: "center", gap: "15px" },
  logoBox: { width: "48px", height: "48px", background: "linear-gradient(135deg, #b45309 0%, #d97706 100%)", borderRadius: "14px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "22px" },
  appBadgeHeader: { background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: "12px", display: "inline-block", fontSize: "10px", fontWeight: "800", letterSpacing: "1px", marginBottom: "4px" },
  mainTitle: { fontSize: "24px", margin: 0, fontWeight: "900", letterSpacing: "0.5px" },
  subTitle: { fontSize: "12px", opacity: 0.8, margin: "2px 0 0 0", fontWeight: "600", letterSpacing: "1px", color: "#f59e0b" },
  statsContainer: { display: "flex", alignItems: "center" },
  statItem: { textAlign: "right" },
  statVal: { display: "block", fontSize: "26px", fontWeight: "900", color: "#f59e0b" },
  statLab: { fontSize: "11px", opacity: 0.7, textTransform: "uppercase", fontWeight: "700" },
  commandBar: { display: "flex", justifyContent: "space-between", padding: "18px 40px", borderBottom: "1px solid #e2e8f0", background: "#fff", alignItems: "center" },
  searchCluster: { flex: 0.4 },
  voiceSearchWrapper: { position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: "15px", color: "#94a3b8" },
  searchField: { width: "100%", padding: "12px 45px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "#f8fafc", outline: "none", fontSize: "14px", transition: "0.3s" },
  micBtn: { position: "absolute", right: "15px", background: "none", border: "none", cursor: "pointer", fontSize: "16px" },
  newRegBtn: { background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 14px rgba(30, 58, 138, 0.25)" },
  gridWrapper: { width: "100%", padding: "0 20px", boxSizing: "border-box", marginTop: "20px" },
  scrollContainer: { overflowX: "auto", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0" },
  enterpriseTable: { width: "100%", borderCollapse: "collapse", minWidth: "1100px" },
  tableHeaderRow: { background: "#f1f5f9" },
  th: { padding: "16px 25px", textAlign: "left", fontSize: "12px", color: "#475569", textTransform: "uppercase", fontWeight: "800", letterSpacing: "0.5px" },
  td: { padding: "14px 25px", borderBottom: "1px solid #f1f5f9", verticalAlign: "middle" },
  trStyle: { transition: "0.2s" },
  identityGroup: { display: "flex", alignItems: "center", gap: "12px" },
  avatarStyle: { width: "42px", height: "42px", borderRadius: "12px", overflow: "hidden", background: "#eff6ff", border: "1px solid #dbeafe" },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  empName: { fontWeight: "700", color: "#1e293b", fontSize: "14px" },
  empId: { fontSize: "11px", color: "#64748b", marginTop: "2px" },
  deptBadge: { background: "#eff6ff", padding: "6px 14px", borderRadius: "8px", fontSize: "12px", color: "#1e40af", fontWeight: "700", border: "1px solid #bfdbfe" },
  contactInfo: { fontSize: "13px", color: "#334155", display: "flex", alignItems: "center", gap: "8px" },
  addressInfo: { fontSize: "13px", color: "#64748b", maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  statusTag: { padding: "5px 12px", background: "#dcfce7", color: "#166534", borderRadius: "20px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "5px" },
  rowActionBtn: { background: "#fee2e2", border: "none", color: "#dc2626", padding: "9px", borderRadius: "10px", cursor: "pointer", transition: "0.2s" },
  
  // Extended Panel Layout
  sidePanel: { position: "fixed", top: 0, right: 0, width: "520px", height: "100%", background: "#fff", zIndex: 1000, transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)", boxShadow: "-10px 0 40px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" },
  panelHeader: { padding: "20px 25px", background: "#1e3a8a", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" },
  formBadge: { background: "#f59e0b", color: "#1e3a8a", padding: "2px 8px", borderRadius: "10px", fontSize: "9px", fontWeight: "900", letterSpacing: "0.5px" },
  closePanelBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" },
  panelBody: { padding: "25px", overflowY: "auto", background: "#f8fafc" },
  photoUploadSection: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "25px", background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0" },
  previewCircle: { width: "90px", height: "90px", borderRadius: "24px", background: "#f1f5f9", border: "2px dashed #cbd5e1", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", marginBottom: "12px" },
  uploadLabel: { color: "#1e3a8a", fontSize: "13px", fontWeight: "700", cursor: "pointer" },
  formStructuredLayout: { display: "flex", flexDirection: "column", gap: "20px" },
  formBlockSection: { background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "12px" },
  sectionDividerTitle: { margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#1e3a8a", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px", display: "flex", alignItems: "center", gap: "8px" },
  formFlexRow: { display: "flex", gap: "12px" },
  labelStyle: { fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "2px 0 -4px 0" },
  panelInput: { padding: "11px 14px", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "14px", outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" },
  panelTextarea: { padding: "11px 14px", border: "1px solid #cbd5e1", borderRadius: "10px", height: "80px", fontSize: "14px", outline: "none", background: "#fff", resize: "none", width: "100%", boxSizing: "border-box" },
  submitRegistrationBtn: { background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", color: "#fff", border: "none", padding: "15px", borderRadius: "12px", fontWeight: "800", cursor: "pointer", marginTop: "10px", fontSize: "15px", boxShadow: "0 4px 14px rgba(30, 58, 138, 0.3)" },
  panelOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", zIndex: 999 },
  loaderStyle: { textAlign: "center", padding: "50px", color: "#64748b", fontSize: "14px", fontWeight: "600" }
};

export default ManageStudents;