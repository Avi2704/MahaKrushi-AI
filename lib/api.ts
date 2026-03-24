/**
 * MahaKrushi AI – Centralized API Client
 * All API calls go through this with JWT auth header auto-injection
 */

const API_BASE = "http://localhost:8000";

// ── Token management ────────────────────────────────────────────
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mk_access_token");
};

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem("mk_access_token", access);
  localStorage.setItem("mk_refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("mk_access_token");
  localStorage.removeItem("mk_refresh_token");
  localStorage.removeItem("mk_user");
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("mk_user");
  return u ? JSON.parse(u) : null;
};

export const setUser = (user: any) => {
  localStorage.setItem("mk_user", JSON.stringify(user));
};

// ── Core fetch wrapper ──────────────────────────────────────────
async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    const refreshToken = localStorage.getItem("mk_refresh_token");
    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setTokens(data.access_token, data.refresh_token);
        return apiFetch<T>(path, options, false);
      }
    }
    clearTokens();
    if (typeof window !== "undefined") window.location.href = "/auth";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errData.detail || "API error");
  }

  return res.json();
}

// ── Auth API ────────────────────────────────────────────────────
export const authApi = {
  register: (data: { full_name: string; mobile: string; email?: string; password: string; role: string; preferred_language?: string }) =>
    apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (mobile: string, password: string) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ mobile, password }) }),

  requestOtp: (mobile: string) =>
    apiFetch("/auth/request-otp", { method: "POST", body: JSON.stringify({ mobile }) }),

  verifyOtp: (mobile: string, otp: string) =>
    apiFetch("/auth/verify-otp", { method: "POST", body: JSON.stringify({ mobile, otp }) }),

  me: () => apiFetch("/auth/me"),
};

// ── Weather API ─────────────────────────────────────────────────
export const weatherApi = {
  getDistrict: (district: string) => apiFetch(`/weather/${district}`),
  getForecast: (district: string) => apiFetch(`/weather/${district}/forecast`),
  getAlerts: (district: string) => apiFetch(`/weather/${district}/alerts`),
  getAllDistricts: () => apiFetch("/weather"),
};

// ── Mandi API ───────────────────────────────────────────────────
export const mandiApi = {
  getPrices: (params?: { crop?: string; district?: string; limit?: number }) => {
    const q = new URLSearchParams(params as any).toString();
    return apiFetch(`/mandi/prices${q ? `?${q}` : ""}`);
  },
  getCropPrices: (crop: string, district?: string) =>
    apiFetch(`/mandi/prices/${crop}${district ? `?district=${district}` : ""}`),
  getTrend: (crop: string, days = 7) => apiFetch(`/mandi/trend/${crop}?days=${days}`),
  getBestMandi: (crop: string, district?: string) =>
    apiFetch(`/mandi/best/${crop}${district ? `?district=${district}` : ""}`),
  getCrops: () => apiFetch("/mandi/crops"),
  getMandis: (district?: string) => apiFetch(`/mandi/mandis${district ? `?district=${district}` : ""}`),
};

// ── Farmer API ──────────────────────────────────────────────────
export const farmerApi = {
  getProfile: () => apiFetch("/farmers/me"),
  createProfile: (data: any) =>
    apiFetch("/farmers/profile", { method: "POST", body: JSON.stringify(data) }),
  updateProfile: (data: any) =>
    apiFetch("/farmers/profile", { method: "PUT", body: JSON.stringify(data) }),
  getDashboard: () => apiFetch("/farmers/dashboard"),
};

// ── Equipment API ───────────────────────────────────────────────
export const equipmentApi = {
  list: (params?: { category?: string; district?: string; max_price?: number; search?: string; lat?: number; lon?: number; limit?: number }) => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]))).toString();
    return apiFetch(`/equipment${q ? `?${q}` : ""}`);
  },
  getById: (id: number) => apiFetch(`/equipment/${id}`),
  create: (data: any) =>
    apiFetch("/equipment", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: any) =>
    apiFetch(`/equipment/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deactivate: (id: number) =>
    apiFetch(`/equipment/${id}`, { method: "DELETE" }),
  inquire: (id: number, data: any) =>
    apiFetch(`/equipment/${id}/inquire`, { method: "POST", body: JSON.stringify(data) }),
  ownerListings: () => apiFetch("/equipment/owner/listings"),
  nearby: (lat: number, lon: number, category?: string, limit = 10) =>
    apiFetch(`/equipment/nearby?lat=${lat}&lon=${lon}&limit=${limit}${category ? `&category=${category}` : ""}`),
};

// ── Labs API ────────────────────────────────────────────────────
export const labsApi = {
  list: (params?: { district?: string; lab_type?: string; ownership?: string; search?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return apiFetch(`/labs${q ? `?${q}` : ""}`);
  },
  getById: (id: number) => apiFetch(`/labs/${id}`),
  nearest: (lat: number, lon: number, lab_type?: string, radius_km = 100) =>
    apiFetch(`/labs/nearest?lat=${lat}&lon=${lon}&radius_km=${radius_km}${lab_type ? `&lab_type=${lab_type}` : ""}`),
};

// ── Storage API ─────────────────────────────────────────────────
export const storageApi = {
  list: (params?: { district?: string; storage_type?: string; crop?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return apiFetch(`/storage${q ? `?${q}` : ""}`);
  },
  getById: (id: number) => apiFetch(`/storage/${id}`),
  nearest: (lat: number, lon: number, crop?: string, radius_km = 150) =>
    apiFetch(`/storage/nearest?lat=${lat}&lon=${lon}&radius_km=${radius_km}${crop ? `&crop=${crop}` : ""}`),
};

// ── Geography API ───────────────────────────────────────────────
export const geoApi = {
  districts: (region?: string) => apiFetch(`/geo/districts${region ? `?region=${region}` : ""}`),
  talukas: (district_id?: number, district_name?: string) => {
    const q = district_id ? `?district_id=${district_id}` : district_name ? `?district_name=${district_name}` : "";
    return apiFetch(`/geo/talukas${q}`);
  },
  villages: (taluka_id?: number, search?: string) => {
    const q = taluka_id ? `?taluka_id=${taluka_id}` : search ? `?search=${search}` : "";
    return apiFetch(`/geo/villages${q}`);
  },
};

// ── Notifications API ───────────────────────────────────────────
export const notificationsApi = {
  list: (unread_only = false) => apiFetch(`/notifications${unread_only ? "?unread_only=true" : ""}`),
  unreadCount: () => apiFetch("/notifications/unread-count"),
  markRead: (id: number) => apiFetch(`/notifications/read/${id}`, { method: "POST" }),
  markAllRead: () => apiFetch("/notifications/read-all", { method: "POST" }),
};

export default apiFetch;
