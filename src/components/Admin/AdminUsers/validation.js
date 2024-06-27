import * as yup from 'yup'

const validationSchema = yup.object().shape({
  email: yup
  .string()
  .email()
  .required('Zorunlu alan'),
  password: yup
  .string()
  .min(5)
  .required('Zorunlu alan'),
  name: yup
  .string()
  .required('Zorunlu alan'),
  role: yup
  .string()
  .required('Zorunlu alan'),
})

export default validationSchema