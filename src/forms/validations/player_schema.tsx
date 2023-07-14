import * as yup from 'yup';


export const validationSchema = yup.object({
    playerFirstName: yup.string().defined(),
    playerLastName: yup.string().defined()
})
