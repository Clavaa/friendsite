import type { StateSlug } from "../../site.config";
import schoolsJson from "../data/schools.json";

/**
 * School-district layer (scripts/build_schools.py → src/data/schools.json):
 * every KS/CO district with 3,000+ students, with its open schools from
 * NCES CCD 2022. Pages: /{state}/schools (index) and /{state}/schools/{slug}.
 */

export interface SchoolRow {
  name: string;
  grades: string | null;
  zip: string;
  city: string;
  enrollment: number;
  charter: boolean;
  prek: boolean;
  /** ZIP area page or town page for the school's location. */
  href: string | null;
}

export interface District {
  name: string;
  leaid: string;
  enrollment: number;
  hqCity: string;
  county: string | null;
  countyFull: string | null;
  teachers: number | null;
  counselors: number | null;
  psychologists: number | null;
  schools: SchoolRow[];
}

export interface ZipSchool {
  name: string;
  grades: string | null;
  district: string | null;
  districtName: string | null;
}

const data = schoolsJson as unknown as {
  districts: Record<StateSlug, Record<string, District>>;
  zipSchools: Record<string, ZipSchool[]>;
};

export function districtsIn(state: StateSlug): [string, District][] {
  return Object.entries(data.districts[state]).sort((a, b) => b[1].enrollment - a[1].enrollment);
}

export function getDistrict(state: StateSlug, slug: string): District | undefined {
  return data.districts[state]?.[slug];
}

export function schoolsForPage(path: string): ZipSchool[] {
  return data.zipSchools[path] ?? [];
}

/** Districts whose schools sit on a given page path (ZIP/town/city links). */
export function districtsLinkingTo(state: StateSlug, pathPrefix: string): [string, District][] {
  return districtsIn(state).filter(([, d]) => d.schools.some((s) => s.href?.startsWith(pathPrefix)));
}
