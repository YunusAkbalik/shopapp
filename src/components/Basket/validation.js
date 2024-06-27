import * as yup from 'yup'

const validationSchema = yup.object().shape({
  address: yup
  .string()
  .required('Zorunlu alan'),
})

export default validationSchema