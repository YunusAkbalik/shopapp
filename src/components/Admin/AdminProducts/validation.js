import * as yup from 'yup'

const validationSchema = yup.object().shape({
  title: yup
  .string()
  .required('Zorunlu alan'),
  price: yup
  .number()
  .min(0, 'Minimum 0 olmalı')
  .required('Zorunlu alan'),
  description: yup
  .string()
  .required('Zorunlu alan'),
  categoryId: yup
  .number()
  .min(0, 'Geçersiz Kategori')
  .required('Zorunlu alan'),
})

export default validationSchema