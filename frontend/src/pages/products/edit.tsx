import EditProduct from '@/components/products/editProduct'
import { useNavigate } from 'react-router'

function EditProductPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/products')
  }

  return (
    <div className="h-full w-full overflow-auto p-6">
      <div className="mx-auto max-w-2xl">
        <EditProduct onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default EditProductPage