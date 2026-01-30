import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "food_delivery_session_id";

export function getSessionId(): string {
    const storedSessionId = localStorage.getItem(SESSION_KEY);

    if (storedSessionId) {
        return storedSessionId;
    }

    const newSessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, newSessionId);
    return newSessionId;
}
