import { z } from 'zod';

import { OFFICIAL_ACADEMIC_CALENDAR } from '@/data/academic-calendar';
import { DEMO_CATALOG, DEMO_LIBRARY, DEMO_LOCATION, DEMO_PROFILE, DEMO_STUDENT_CARD } from '@/data/demo';
import type { AcademicCalendar, CampusLocation, Catalog, LibraryInfo, Profile, StudentCard } from '@/types/domain';

const API_ROOT = (process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:8641/api').replace(/\/$/, '');

const profileSchema = z.object({
  name: z.string(),
  role: z.string(),
  emplid: z.string(),
  transactions: z.number(),
  appointments: z.number(),
  holds: z.number(),
  holdsNote: z.string(),
  balanceDue: z.string(),
  webcentralId: z.string(),
  email: z.string(),
  wifiUser: z.string(),
  wifiNote: z.string(),
  helpPhone: z.string(),
  helpUrl: z.string(),
});

const courseSchema = z.object({
  no: z.string(),
  ti: z.string(),
  mode: z.enum(['In person', 'Hybrid', 'Online']).optional(),
  seats: z.number().optional(),
  detailData: z.any().optional(),
});

const catalogSchema = z.object({
  dept: z.string(),
  term: z.string(),
  count: z.number(),
  courses: z.array(courseSchema),
});

const locationSchema = z.object({
  name: z.string(),
  room: z.string(),
  building: z.string(),
  buildingLabel: z.string(),
  floor: z.string(),
});

const libraryResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  icon: z.enum(['search', 'database', 'guides', 'help', 'hours']),
});

const librarySchema = z.object({
  name: z.string(),
  location: z.string(),
  website: z.string(),
  libraryId: z.string(),
  resources: z.array(libraryResourceSchema),
});

const studentCardSchema = z.object({
  college: z.string(),
  name: z.string(),
  role: z.string(),
  emplid: z.string(),
  hotline: z.string(),
  security: z.object({
    lamp: z.string(),
    mode: z.string(),
    periodMs: z.number(),
    issuedAt: z.number(),
    reason: z.string(),
  }),
});

const academicEntryKindSchema = z.enum(['classes', 'deadline', 'closed', 'exams', 'registration']);

const academicEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  endDate: z.string().optional(),
  label: z.string(),
  kind: academicEntryKindSchema,
  priority: z.literal('high').optional(),
});

const academicCalendarSchema = z.object({
  source: z.object({
    name: z.string(),
    url: z.string(),
    verifiedOn: z.string(),
    sourceUpdatedAt: z.string(),
    notice: z.string(),
  }),
  terms: z.array(z.object({
    id: z.string(),
    name: z.string(),
    span: z.string(),
    entries: z.array(academicEntrySchema),
  })),
});

async function fetchValidated<T>(path: string, schema: z.ZodType<T>, fallback: T): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(`${API_ROOT}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    return schema.parse(await response.json());
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

export function getProfile(): Promise<Profile> {
  return fetchValidated('/info/profile', profileSchema, DEMO_PROFILE);
}

export function getCatalog(): Promise<Catalog> {
  return fetchValidated('/catalog/courses', catalogSchema, DEMO_CATALOG);
}

export function getCampusLocation(): Promise<CampusLocation> {
  return fetchValidated('/map/location', locationSchema, DEMO_LOCATION);
}

export function getLibraryResources(): Promise<LibraryInfo> {
  return fetchValidated('/library/resources', librarySchema, DEMO_LIBRARY);
}

export function getStudentCard(): Promise<StudentCard> {
  return fetchValidated('/student-id/card', studentCardSchema, DEMO_STUDENT_CARD);
}

export function getAcademicCalendar(): Promise<AcademicCalendar> {
  return fetchValidated('/calendar/terms', academicCalendarSchema, OFFICIAL_ACADEMIC_CALENDAR);
}

export { API_ROOT };
