import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LevelInput, LevelSchema } from '../schemas/levelSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';
import { Level } from '../models';

interface LevelFormProps {
  level?: Level | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const LevelForm: React.FC<LevelFormProps> = ({ level, onSuccess, onCancel }) => {
  const userState = useAuthStore(state => state.user);
  const createLevel = useFormationSchoolStore(state => state.createLevel);
  const updateLevel = useFormationSchoolStore(state => state.updateLevel);
  const isEditing = !!level;
  
  const form = useForm<LevelInput>({
    resolver: zodResolver(LevelSchema) as any,
    defaultValues: {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      order: 1,
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  useEffect(() => {
    if (level) {
      form.reset({
        id: level.id,
        name: level.name,
        description: level.description || '',
        order: level.order,
        createdUser: level.createdUser,
        createdDate: new Date(level.createdDate),
      });
    }
  }, [level]);

  async function onSubmit(data: LevelInput) {
    let success;
    
    if (isEditing) {
      success = await updateLevel({
        id: data.id,
        name: data.name,
        description: data.description,
        order: data.order,
      });
      if (success) {
        toast.success('Nivel actualizado exitosamente');
        onSuccess?.();
      } else {
        toast.error('Error al actualizar el nivel');
      }
    } else {
      success = await createLevel(data);
      if (success) {
        toast.success('Nivel creado exitosamente');
        form.reset({ ...form.getValues(), id: crypto.randomUUID() });
        onSuccess?.();
      } else {
        toast.error('Error al crear el nivel');
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
              <FormLabel>Nombre del Nivel</FormLabel>
              <FormControl>
                <Input placeholder="Básico I, Intermedio, Avanzado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Descripción del nivel..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orden</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Actualizar Nivel' : 'Guardar Nivel'}
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
