import * as yup from 'yup'

const validationSchema = yup.object().shape({
  name: yup
  .string()
  .required('Zorunlu alan'),

  email: yup
  .string()
  .email('Geçersiz E-posta')
  .required('Zorunlu alan'),

  role: yup
  .string()
  .equals(['admin','customer'])
  .required('Zorunlu alan'),

})

export default validationSchema