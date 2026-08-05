// ---- Collaboration AI service interface ----
// A single seam for the "AI-powered matching" experience. The prototype uses a
// local rule-based parser + matcher and works with NO API key. A production
// build can implement `CollabAiAdapter` against a SECURE BACKEND that proxies an
// NLP provider — the frontend must never hold a provider key.
//
// Security: never import or read a provider API key here, never persist keys to
// localStorage, never commit keys. The provider is never named to end users.

import type { CollaborationRequirement, CollaborationMatch } from './types'
import { parseRequirement } from './parse'
import { matchCreators, explainMatch } from './match'

export interface CollabAiAdapter {
  parseCollaborationRequirement(text: string): Promise<Omit<CollaborationRequirement, 'id' | 'createdByUserId' | 'createdAt'>>
  findCreatorMatches(req: CollaborationRequirement): Promise<CollaborationMatch[]>
  explainMatch(match: CollaborationMatch): string
}

// Local, key-free prototype adapter (default).
export const localCollabAdapter: CollabAiAdapter = {
  async parseCollaborationRequirement(text) { return parseRequirement(text) },
  async findCreatorMatches(req) { return matchCreators(req) },
  explainMatch,
}

// Swap point for a future secure-backend adapter. Falls back to local on error.
let adapter: CollabAiAdapter = localCollabAdapter
export function setCollabAdapter(a: CollabAiAdapter) { adapter = a }

export async function parseCollaborationRequirement(text: string) {
  try { return await adapter.parseCollaborationRequirement(text) }
  catch { return localCollabAdapter.parseCollaborationRequirement(text) }
}
export async function findCreatorMatches(req: CollaborationRequirement) {
  try { return await adapter.findCreatorMatches(req) }
  catch { return localCollabAdapter.findCreatorMatches(req) }
}
export { explainMatch }
