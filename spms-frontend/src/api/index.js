import api from './axiosInstance'

// ── AUTH ──────────────────────────────────────────
export const authAPI = {
  login:          (data) => api.post('/auth/login', data),
  register:       (data) => api.post('/auth/register', data),
  refresh:        (data) => api.post('/auth/refresh', data),
  logout:         ()     => api.post('/auth/logout'),
  changePassword: (data) => api.post('/auth/change-password', data),
}

// ── STUDENTS ──────────────────────────────────────
export const studentAPI = {
  getAll:      (params) => api.get('/students', { params }),
  getById:     (id)     => api.get(`/students/${id}`),
  create:      (data)   => api.post('/students', data),
  update:      (id, data) => api.put(`/students/${id}`, data),
  delete:      (id)     => api.delete(`/students/${id}`),
  search:      (name)   => api.get('/students/search', { params: { name } }),
  filter:      (params) => api.get('/students/filter', { params }),
  eligible:    (companyId) => api.get('/students/eligible', { params: { companyId } }),
}

// ── COMPANIES ─────────────────────────────────────
export const companyAPI = {
  getAll:   (params) => api.get('/companies', { params }),
  getById:  (id)     => api.get(`/companies/${id}`),
  create:   (data)   => api.post('/companies', data),
  update:   (id, data) => api.put(`/companies/${id}`, data),
  delete:   (id)     => api.delete(`/companies/${id}`),
  search:   (name)   => api.get('/companies/search', { params: { name } }),
  filter:   (params) => api.get('/companies/filter', { params }),
}

// ── JOB APPLICATIONS ──────────────────────────────
export const applicationAPI = {
  getAll:          (params) => api.get('/applications', { params }),
  getById:         (id)     => api.get(`/applications/${id}`),
  getByStudent:    (id)     => api.get(`/applications/student/${id}`),
  getByCompany:    (id)     => api.get(`/applications/company/${id}`),
  create:          (data)   => api.post('/applications', data),
  updateStatus:    (id, status) => api.put(`/applications/${id}/status`, { status }),
  delete:          (id)     => api.delete(`/applications/${id}`),
}

// ── INTERVIEW ROUNDS ──────────────────────────────
export const interviewAPI = {
  getAll:          (params) => api.get('/interviews', { params }),
  getById:         (id)     => api.get(`/interviews/${id}`),
  getByApplication:(id)     => api.get(`/interviews/application/${id}`),
  create:          (data)   => api.post('/interviews', data),
  update:          (id, data) => api.put(`/interviews/${id}`, data),
  delete:          (id)     => api.delete(`/interviews/${id}`),
}

// ── PLACEMENTS ────────────────────────────────────
export const placementAPI = {
  getAll:      (params) => api.get('/placements', { params }),
  getById:     (id)     => api.get(`/placements/${id}`),
  getByStudent:(id)     => api.get(`/placements/student/${id}`),
  create:      (data)   => api.post('/placements', data),
  update:      (id, data) => api.put(`/placements/${id}`, data),
  delete:      (id)     => api.delete(`/placements/${id}`),
}

// ── REPORTS ───────────────────────────────────────
export const reportAPI = {
  getSummary: () => api.get('/reports/summary'),
}

// ── EXPORT ────────────────────────────────────────
export const exportAPI = {
  studentsExcel:   () => api.get('/export/students/excel',   { responseType: 'blob' }),
  placementsExcel: () => api.get('/export/placements/excel', { responseType: 'blob' }),
  placementsPdf:   () => api.get('/export/placements/pdf',   { responseType: 'blob' }),
}

// ── RESUME ────────────────────────────────────────
export const resumeAPI = {
  upload:   (studentId, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/resumes/upload/${studentId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  download: (studentId) => api.get(`/resumes/download/${studentId}`, { responseType: 'blob' }),
  delete:   (studentId) => api.delete(`/resumes/${studentId}`),
}

// ── PROFILE PICTURE ───────────────────────────────
export const profilePicAPI = {
  upload:   (studentId, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/profile-pictures/upload/${studentId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  get:      (studentId) => api.get(`/profile-pictures/${studentId}`, { responseType: 'blob' }),
  delete:   (studentId) => api.delete(`/profile-pictures/${studentId}`),
}

// ── OFFER LETTERS ─────────────────────────────────
export const offerLetterAPI = {
  upload:   (placementId, file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/offer-letters/upload/${placementId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  download: (placementId) => api.get(`/offer-letters/download/${placementId}`, { responseType: 'blob' }),
  delete:   (placementId) => api.delete(`/offer-letters/${placementId}`),
}
