import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router'
import { PlusCircle, History } from 'lucide-react'

function Sales() {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="container max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sale Card */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/sales/create')}
          >
            <CardHeader className="flex flex-col items-center justify-center py-12">
              <PlusCircle className="w-16 h-16 mb-4 text-primary" />
              <CardTitle className="text-center">Create New Sale</CardTitle>
            </CardHeader>
          </Card>

          {/* Sales History Card */}
          <Card 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate('/sales/history')}
          >
            <CardHeader className="flex flex-col items-center justify-center py-12">
              <History className="w-16 h-16 mb-4 text-primary" />
              <CardTitle className="text-center">Sales History</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Sales