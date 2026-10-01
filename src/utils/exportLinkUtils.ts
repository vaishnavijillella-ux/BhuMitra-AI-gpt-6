/**
 * Utilities for generating and parsing shareable export links for BhuMitra AI.
 *
 * Uses URL-safe Base64 and TextEncoder/TextDecoder to safely encode complex
 * multilingual Unicode text (Tamil and English) into self-contained URL query parameters.
 */

import { Language } from '../data/translations';

export interface ExportAdvisoryPayload {
  type: 'advisory';
  cropName: string;
  question: string;
  answer: string;
  sources?: Array<{ title: string; uri: string }>;
  language: Language;
  timestamp?: string;
}

export interface ExportDiagnosisPayload {
  type: 'diagnosis';
  cropName: string;
  notes?: string;
  report: string;
  language: Language;
  timestamp?: string;
}

export interface ExportWeatherPayload {
  type: 'weather';
  locationName: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  sprayAdvisory: string;
  irrigationAdvisory: string;
  forecastDays: Array<{
    day: string;
    condition: string;
    maxTemp: number;
    minTemp: number;
    rainChance: number;
  }>;
  language: Language;
  cropName?: string;
  timestamp?: string;
}

export type ExportPayload = ExportAdvisoryPayload | ExportDiagnosisPayload | ExportWeatherPayload;

/**
 * Safely encode a JavaScript object into a URL-safe Base64 string supporting Unicode.
 */
export function encodeExportPayload(payload: ExportPayload): string {
  try {
    const json = JSON.stringify(payload);
    const utf8Bytes = new TextEncoder().encode(json);
    let binary = '';
    utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (err) {
    console.error('Failed to encode export payload:', err);
    return '';
  }
}

/**
 * Safely decode a URL-safe Base64 string back into an ExportPayload.
 */
export function decodeExportPayload(encoded: string): ExportPayload | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as ExportPayload;
  } catch (err) {
    console.error('Failed to decode export payload:', err);
    return null;
  }
}

/**
 * Generates the full absolute URL for sharing or exporting.
 */
export function buildExportUrl(payload: ExportPayload): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const encoded = encodeExportPayload(payload);
  const cropParam = encodeURIComponent(payload.cropName || 'Agriculture');
  return `${origin}${pathname}?export=${payload.type}&crop=${cropParam}&d=${encoded}`;
}

/**
 * Parses the current window.location for export query parameters.
 */
export function parseCurrentExportUrl(): ExportPayload | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d');
    if (!encoded) return null;
    return decodeExportPayload(encoded);
  } catch (err) {
    console.error('Error parsing current export URL:', err);
    return null;
  }
}
