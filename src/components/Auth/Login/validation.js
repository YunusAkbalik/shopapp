import * as yup from 'yup'

const validationSchema = yup.object().shape({
  email: yup
  .string()
  .email('Geçersiz E-posta')
  .required('Zorunlu alan'),

  password: yup
  .string()
  .min(5, 'Minimum 5 karakter olmalı')
  .required('Zorunlu alan'),
})

export default validationSchema