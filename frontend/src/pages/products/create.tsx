import CreateProduct from '@/components/products/createProduct'
import { useNavigate } from 'react-router'

function CreateProductPage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/products')
  }

  return (
    <div className="h-full w-full overflow-auto p-6">
      <div className="mx-auto max-w-2xl">
        <CreateProduct onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default CreateProductPage

