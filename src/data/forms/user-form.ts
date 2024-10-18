import { z } from "zod";

const userForm = z.object({
    title: z.string()
        .min(2, "El título debe tener al menos 2 caracteres")
        .max(50, "El título debe tener como máximo 50 caracteres"),
    url: z.string()
        .min(2, "La URL debe tener al menos 2 caracteres")
        .max(50, "La URL debe tener como máximo 50 caracteres")
        .url("La URL no es válida"),
});

export default userForm;