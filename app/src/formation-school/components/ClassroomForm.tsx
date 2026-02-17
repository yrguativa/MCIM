import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ClassroomInput, ClassroomSchema } from '../schemas/classroomSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';

interface ClassroomFormProps {
  onSuccess?: () => void;
}

export const ClassroomForm: React.FC<ClassroomFormProps> = ({ onSuccess }) => {
  const userState = useAuthStore(state => state.user);
  const createClassroom = useFormationSchoolStore(state => state.createClassroom);
  
  const form = useForm<ClassroomInput>({
    resolver: zodResolver(ClassroomSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      name: '',
      capacity: 20,
      location: '',
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  async function onSubmit(data: ClassroomInput) {
    const success = await createClassroom(data);
    
    if (success) {
      toast.success('Salón creado exitosamente');
      form.reset({ ...form.getValues(), id: crypto.randomUUID() });
      onSuccess?.();
    } else {
      toast.error('Error al crear el salón');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Salón</FormLabel>
              <FormControl>
                <Input placeholder="Salón 1, Aula A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidad</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Primer piso, edificio principal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Guardar Salón
        </Button>
      </form>
    </Form>
  );
};
