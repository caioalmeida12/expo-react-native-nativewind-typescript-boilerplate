import z from "zod";

export const TShift = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export const TMeal = z.object({
  id: z.number(),
  description: z.string(),
  qtdTimeReservationEnd: z.number(),
  qtdTimeReservationStart: z.number(),
  timeEnd: z.string(),
  timeStart: z.string(),
  campus_id: z.literal(1),
});

export const TMealWithShift = TMeal.extend({
  turno: TShift,
});

export const TMenu = z.object({
  agendado: z.boolean(),
  date: z.string(),
  description: z.string(),
  permission: z.number(),
  id: z.number(),
  campus_id: z.number(),
  canceled_by_student: z.boolean().optional(),
  absenceJustification: z.string().nullable().optional(),
  meal_id: z.number().optional(),
});

export const TMealAndMenu = z.object({
  meal: TMeal,
  menu: TMenu,
});

export const TMenuSchema = z.object({
  id: z.number(),
  date: z.string(),
  description: z.string(),
  campus_id: z.number(),
});

export const TMealSchema = z.object({
  id: z.number(),
  description: z.string(),
  timeEnd: z.string(),
  timeStart: z.string(),
  qtdTimeReservationEnd: z.string(),
  qtdTimeReservationStart: z.string(),
});

export const TMealHistorySchema = z.object({
  id: z.number(),
  date: z.string(),
  dateInsert: z.string(),
  time: z.string(),
  wasPresent: z.number(),
  meal_id: z.number(),
  student_id: z.number(),
  user_id: z.number().nullable(),
  campus_id: z.number(),
  absenceJustification: z.string().nullable(),
  canceled_by_student: z.number(),
  ticketCode: z.string().nullable(),
  menu_id: z.number(),
  studentJustification: z.string().nullable(),
  menu: z.object({
    id: z.number(),
    date: z.string(),
    description: z.string(),
    campus_id: z.number(),
    meal_id: z.number(),
  }),
  meal: z.object({
    id: z.number(),
    description: z.string(),
    timeEnd: z.string(),
    timeStart: z.string(),
    campus_id: z.number(),
    qtdTimeReservationEnd: z.number(),
    qtdTimeReservationStart: z.number(),
  }),
});

export const TAllowedMealSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  type: z.string(),
  enabled: z.boolean(),
});

export const TAllowedMealResponseSchema = z.object({
  sucesso: z.boolean(),
  message: z.string().optional(),
  resposta: z.array(
    z.object({
      id: z.number(),
      friday: z.number(),
      monday: z.number(),
      saturday: z.number(),
      thursday: z.number(),
      tuesday: z.number(),
      wednesday: z.number(),
      meal_id: z.number(),
      student_id: z.number(),
      comentario: z.string().nullable(),
      meal: TMeal,
      student: z.object({
        id: z.number(),
        active: z.number(),
        dateValid: z.string(),
        mat: z.string(),
        name: z.string(),
        semRegular: z.number(),
        course_id: z.number(),
        shift_id: z.number(),
        photo: z.null(),
        campus_id: z.number(),
        observation: z.null(),
        republic: z.null(),
        block: z.null(),
        hasKey: z.number(),
        cabinet: z.null(),
        key: z.null(),
        course: z.object({
          id: z.number(),
          description: z.string(),
          initials: z.string(),
          campus_id: z.number(),
        }),
      }),
    })
  ),
});

export type TMeal = z.infer<typeof TMeal>;
export type TMenu = z.infer<typeof TMenu>;
export type TMenuAndMeal = z.infer<typeof TMealAndMenu>;
export type TShift = z.infer<typeof TShift>;
export type TMealHistory = z.infer<typeof TMealHistorySchema>;
export type TAllowedMeal = z.infer<typeof TAllowedMealSchema>;
export type TAllowedMealsResponse = TAllowedMeal[];
export type TAllowedMealResponse = z.infer<typeof TAllowedMealResponseSchema>;
