import { useState } from "react";
import { readJSON, writeJSON } from "../utils/storage";

const PROFILE_KEY = "profile";

// Same pattern as learn_japanese: no auth, just a self-chosen display name
// that namespaces all progress data — lets multiple people share one URL
// with fully independent data, or one person keep separate named profiles.
export function useProfile() {
  const [profileName, setProfileNameState] = useState(() => readJSON(PROFILE_KEY, null));

  function setProfileName(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    writeJSON(PROFILE_KEY, trimmed);
    setProfileNameState(trimmed);
  }

  function clearProfile() {
    // Deliberately don't delete the underlying state_v1_<name> data —
    // re-entering the same name later restores it right where it left off.
    writeJSON(PROFILE_KEY, null);
    setProfileNameState(null);
  }

  return { profileName, setProfileName, clearProfile };
}
