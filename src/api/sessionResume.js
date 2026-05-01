const STORAGE_PREFIX = 'focuspath.resumeSessions';

function storageKey(userId) {
  return `${STORAGE_PREFIX}.${userId}`;
}

function readSessions(userId) {
  if (!userId) return {};

  try {
    return JSON.parse(window.localStorage.getItem(storageKey(userId)) || '{}');
  } catch {
    return {};
  }
}

function writeSessions(userId, sessions) {
  if (!userId) return;
  window.localStorage.setItem(storageKey(userId), JSON.stringify(sessions));
}

export function saveLearningSession(userId, trackId, payload) {
  if (!userId || !trackId) return;

  const sessions = readSessions(userId);
  sessions[trackId] = {
    ...sessions[trackId],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  writeSessions(userId, sessions);
}

export function getSavedLearningSession(userId, trackId) {
  return readSessions(userId)[trackId] || null;
}

export function updateSavedNotesPart(userId, trackId, notesPartIndex) {
  if (!userId || !trackId) return;

  const sessions = readSessions(userId);
  if (!sessions[trackId]) return;

  sessions[trackId] = {
    ...sessions[trackId],
    notesPartIndex,
    updatedAt: new Date().toISOString(),
  };
  writeSessions(userId, sessions);
}
