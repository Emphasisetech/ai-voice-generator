//  Local Storage Helpers 

export const setDataIntoLc = (key: string, value: any, isJson: boolean = false): void => {
    if (isJson) {
        sessionStorage.setItem(key, JSON.stringify(value));
    } else {
        sessionStorage.setItem(key, value);
    }
};
export const formatDate = (isoDate:any) => {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
export const getDataFromLc = <T = any>(key: string, isJson: boolean = false): T | string | null => {
    const item = sessionStorage.getItem(key);

    if (!item) return null;

    if (isJson) {
        try {
            return JSON.parse(item) as T;
        } catch {
            return null; // fallback if JSON parse fails
        }
    }
    return item;
};

export const removeDataFromLc = (key: string): void => {
    sessionStorage.removeItem(key);
};
