import {AlertDialog,AlertDialogAction,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertCircle } from 'lucide-react'


interface AlertProps {
  todo: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Alert({ todo, open, onOpenChange }: AlertProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="text-yellow-500" size={24} />
              <AlertDialogTitle>Todo Already Exists</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              The todo {todo} already exists in your list. Please enter a unique todo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}