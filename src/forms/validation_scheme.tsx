import * as yup from 'yup';


export const validationSchema = yup.object({
    teamName: yup.string().defined(),
    teamCategory: yup.mixed().oneOf(["First", "Second"] as const).defined(),
    playerFirstName: yup.string().defined(),
    playerLastName: yup.string().defined()
})