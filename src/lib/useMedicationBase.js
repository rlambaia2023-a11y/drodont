import { useEffect, useState } from "react";
import {
  loadMedicationBase,
  subscribeBase,
  isBaseLoaded,
} from "@/lib/medicationsDatabase";

// Carrega a base gerenciada (entidade Medication) uma única vez por sessão e
// notifica os componentes quando o dataset estruturado fica disponível.
let loadPromise = null;

export function useMedicationBase() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!loadPromise) loadPromise = loadMedicationBase();
    const unsub = subscribeBase(() => setVersion((v) => v + 1));
    if (isBaseLoaded()) setVersion((v) => v + 1);
    return unsub;
  }, []);

  return { ready: isBaseLoaded(), version };
}