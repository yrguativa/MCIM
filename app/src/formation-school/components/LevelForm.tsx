import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LevelInput, LevelSchema } from '../schemas/levelSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LevelFormProps {
  onSuccess?: () => void;
}

export const LevelForm: React.FC<LevelFormProps> = ({ onSuccess }) => {
  const userState = useAuthStore(state => state.user);
  const createLevel = useFormationSchoolStore(state => state.createLevel);
  
  const form = useForm<LevelInput>({
    resolver: zodResolver(LevelSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      order: 1,
      type: 'vision',
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  async function onSubmit(data: LevelInput) {
    const success = await createLevel(data);
    
    if (success) {
      toast.success('Nivel creado exitosamente');
      form.reset({ ...form.getValues(), id: crypto.randomUUID() });
      onSuccess?.();
    } else {
      toast.error('Error al crear el nivel');
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

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de nivel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="vision">Visión</SelectItem>
                  <SelectItem value="doctrina">Doctrina</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          Guardar Nivel
        </Button>
      </form>
    </Form>
  );
};
