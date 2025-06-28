
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface FormActionsProps {
  isLoading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions = ({ isLoading, isEditing, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4 pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {isEditing ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Report' : 'Create Report'}
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
