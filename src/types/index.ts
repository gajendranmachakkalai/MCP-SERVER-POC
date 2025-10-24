import z from "zod";

export const EmployeeSchema = z.object({
    id: z.number().int().positive(),
    first_Name: z.string().min(1),
    last_Name: z.string().min(1),
    email: z.string(),
    gender: z.string(),
    address: z.string(),
    phoneNumber: z.string(),
    password: z.string()
});

// export const EmployeeListSchema = z.array(EmployeeSchema);
export const EmployeeListSchema = z.object({
    employees: z.array(EmployeeSchema)
});
