import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { api } from "../lib/api.js";

const StudioContext = createContext(null);

// Loads the studio content once and shares it with every section.
export function StudioProvider({ children }) {
    const [state, setState] = useState({
        status: "loading",
        classes: [],
        coaches: [],
        plans: [],
    });

    const load = useCallback(() => {
        setState((s) => ({ ...s, status: "loading" }));
        Promise.all([api("/classes"), api("/coaches"), api("/plans")])
            .then(([classes, coaches, plans]) =>
                setState({ status: "ready", classes, coaches, plans }),
            )
            .catch(() => setState((s) => ({ ...s, status: "error" })));
    }, []);

    useEffect(load, [load]);

    return (
        <StudioContext.Provider value={{ ...state, reload: load }}>
            {children}
        </StudioContext.Provider>
    );
}

export function useStudio() {
    const value = useContext(StudioContext);
    if (!value)
        throw new Error("useStudio must be used inside <StudioProvider>");
    return value;
}
