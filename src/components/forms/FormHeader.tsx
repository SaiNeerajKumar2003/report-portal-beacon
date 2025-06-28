
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FormHeaderProps {
  isEditing: boolean;
  onBackClick: () => void;
}

const FormHeader = ({ isEditing, onBackClick }: FormHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Report' : 'Configure New Report'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update report configuration' : 'Add a new Power BI report to the portal'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
