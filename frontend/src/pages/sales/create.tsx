import CreateSale from '@/components/sales/createSale'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

function CreateSalePage() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    toast.success('Sale created successfully')
    navigate('/sales')
  }

  return (
    <div className="h-full w-full overflow-auto p-6">
      <div className="mx-auto max-w-4xl">
        <CreateSale onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default CreateSalePage

