import { create } from "zustand";

interface FormData {
	[key: string]: any; // Generic form data
}

interface FormStore {
	formData: FormData;
	setFormData: (data: FormData) => void;
	resetFormData: () => void;
}

const useFormStore = create<FormStore>((set) => ({
	formData: {},
	setFormData: (data) =>
		set((state) => ({
			formData: { ...state.formData, ...data },
		})),
	resetFormData: () => set({ formData: {} }),
}));

export default useFormStore;
