import type { CavemanLevel } from "./types";

export const CAVEMAN_PROMPTS: Record<Exclude<CavemanLevel, 0>, string> = {
  1: "Reply concise. Cut filler and throat-clearing. Keep technical precision.",
  2: "Reply short. No preamble, no recap. Prefer lists and code over prose.",
  3: "Caveman mode. Speak terse like senior in a hurry. Drop articles when safe. Keep types, names, numbers exact. No joke voice. Substance over grammar.",
  4: "Ultra caveman. Fragments OK. Verbs first. Zero hedging. Code > words. If one line enough, one line.",
  5: "Telegraph. Max density. Abbreviations OK. No greetings, no closings, no 'here is'. Facts and diffs only.",
};

export function cavemanSystem(level: CavemanLevel): string | null {
  if (level === 0) return null;
  return CAVEMAN_PROMPTS[level];
}

const FILLER =
  /\b(in order to|as well as|it is important to note that|please note that|keep in mind that|at this point in time|due to the fact that|in the event that|a number of|the fact that|basically|actually|really|just|very|quite|simply put|needless to say)\b/gi;

export function compressProse(text: string, level: CavemanLevel): string {
  if (level === 0) return text;
  let out = text.replace(FILLER, "").replace(/[ \t]{2,}/g, " ");
  if (level >= 2) {
    out = out
      .replace(/\b(I think|I believe|it seems|perhaps|maybe|sort of|kind of)\b/gi, "")
      .replace(/\n{3,}/g, "\n\n");
  }
  if (level >= 3) {
    out = out
      .replace(/\b(the|a|an)\b /gi, "")
      .replace(/\b(you should|we should|one should)\b/gi, "do")
      .replace(/\bhowever\b/gi, "but")
      .replace(/\btherefore\b/gi, "so");
  }
  if (level >= 4) {
    out = out
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0)
      .map((s) => s.replace(/\.$/, ""))
      .join(". ");
  }
  if (level >= 5) {
    out = out
      .replace(/\b(function|functions)\b/gi, "fn")
      .replace(/\b(javascript|typescript)\b/gi, "ts")
      .replace(/\b(repository)\b/gi, "repo")
      .replace(/\b(configuration)\b/gi, "cfg");
  }
  return out.replace(/ +\n/g, "\n").replace(/ {2,}/g, " ").trim();
}

export const CAVEMAN_SAMPLE = `I think we should probably go ahead and refactor the authentication middleware in order to make sure that we are not leaking the user id from the client. It is important to note that we should keep in mind that the session cookie is already signed. Therefore, the handler can simply read the verified user from context. Needless to say, we should also add a couple of tests around the happy path and the expired-token case.`;
