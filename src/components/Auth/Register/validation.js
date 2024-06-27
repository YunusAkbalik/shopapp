import * as yup from 'yup'

const validationSchema = yup.object().shape({
  name: yup
  .string()
  .required('Zorunlu alan'),

  email: yup
  .string()
  .email('Geçersiz E-posta')
  .required('Zorunlu alan'),

  password: yup
  .string()
  .min(5, 'Minimum 5 karakter olmalı')
  .required('Zorunlu alan'),

  passwordConfirm: yup
  .string()
  .oneOf([yup.ref('password')],'Parolalar uyuşmuyor')
  .required('Zorunlu alan'),
})

export default validationSchema