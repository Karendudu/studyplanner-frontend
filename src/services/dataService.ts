import { apiRequest } from "./api";
import {
  mockFaculties,
  mockHeadquarters,
  mockNotices,
  mockPrograms,
  mockSchedules,
  mockSubjects,
  mockAudits,
} from "./mockData";

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === "true";

export async function getPrograms() {
  if (useMockData) {
    return mockPrograms;
  }

  return apiRequest<any[]>("/programas");
}

export async function getFaculties() {
  if (useMockData) {
    return mockFaculties;
  }

  return apiRequest<any[]>("/facultades");
}

export async function getHeadquarters() {
  if (useMockData) {
    return mockHeadquarters;
  }

  return apiRequest<any[]>("/sedes");
}

export async function getSubjects() {
  if (useMockData) {
    return mockSubjects;
  }

  return apiRequest<any[]>("/materias");
}

export async function getSchedules() {
  if (useMockData) {
    return mockSchedules;
  }

  return apiRequest<any[]>("/horarios");
}

export async function getNotices() {
  if (useMockData) {
    return mockNotices;
  }

  return apiRequest<any[]>("/avisos");
}

export async function getAudits() {
  if (useMockData) {
    return mockAudits;
  }

  return apiRequest<any[]>("/auditoria");
}
