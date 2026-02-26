import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ClassroomInput, ClassroomSchema } from '../schemas/classroomSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';
import { Classroom } from '../models';

interface ClassroomFormProps {
  classroom?: Classroom | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ClassroomForm: React.FC<ClassroomFormProps> = ({ classroom, onSuccess, onCancel }) => {
  const userState = useAuthStore(state => state.user);
  const createClassroom = useFormationSchoolStore(state => state.createClassroom);
  const updateClassroom = useFormationSchoolStore(state => state.updateClassroom);
  const isEditing = !!classroom;
  
  const form = useForm<ClassroomInput>({
    resolver: zodResolver(ClassroomSchema) as never,
    defaultValues: {
      id: crypto.randomUUID(),
      name: '',
      capacity: 20,
      location: '',
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  useEffect(() => {
    if (classroom) {
      form.reset({
        id: classroom.id,
        name: classroom.name,
        capacity: classroom.capacity,
        location: classroom.location,
        createdUser: classroom.createdUser,
        createdDate: new Date(classroom.createdDate),
      });
    }
  }, [classroom]);

  async function onSubmit(data: ClassroomInput) {
    let success;
    
    if (isEditing) {
      success = await updateClassroom({
        id: data.id,
        name: data.name,
        capacity: data.capacity,
        location: data.location,
      });
      if (success) {
        toast.success('Salón actualizado exitosamente');
        onSuccess?.();
      } else {
        toast.error('Error al actualizar el salón');
      }
    } else {
      success = await createClassroom(data);
      if (success) {
        toast.success('Salón creado exitosamente');
        form.reset({ ...form.getValues(), id: crypto.randomUUID() });
        onSuccess?.();
      } else {
        toast.error('Error al crear el salón');
      }
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
                <Input 
                  type="number" 
                  min="1" 
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                />
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
        
        <div className="flex gap-2">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Actualizar Salón' : 'Guardar Salón'}
          </Button>
          {isEditing && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
