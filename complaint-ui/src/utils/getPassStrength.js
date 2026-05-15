export const getStrength = (requirements) => {
    const score = requirements.filter(req => req.met).length;
    if (score === 0) return { label: "Enter password", color: "slate", width: "0%" };
    if (score <= 1) return { label: "Weak", color: "red", width: "25%" };
    if (score === 2) return { label: "Fair", color: "orange", width: "50%" };
    if (score === 3) return { label: "Good", color: "yellow", width: "75%" };
    return { label: "Strong", color: "emerald", width: "100%" };
  };