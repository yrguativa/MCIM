import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TeacherAssignmentInput, TeacherAssignmentSchema } from '../schemas/teacherAssignmentSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TeacherEnrollmentFormProps {
  courseId: string;
  onSuccess?: () => void;
}

export const TeacherEnrollmentForm: React.FC<TeacherEnrollmentFormProps> = ({ courseId, onSuccess }) => {
  const userState = useAuthStore(state => state.user);
  const { searchByName, searchResults } = useDiscipleStore();
  const { enrollTeacher } = useFormationSchoolStore();
  
  const [teacherSearchOpen, setTeacherSearchOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<{id: string, name: string} | null>(null);
  
  const form = useForm<TeacherAssignmentInput>({
    resolver: zodResolver(TeacherAssignmentSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      teacherId: '',
      courseId,
      assignedDate: new Date(),
      active: true,
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  async function onSubmit(data: TeacherAssignmentInput) {
    const success = await enrollTeacher({
      ...data,
      courseId,
    });
    
    if (success) {
      toast.success('Maestro asignado exitosamente');
      form.reset({ ...form.getValues(), id: crypto.randomUUID() });
      setSelectedTeacher(null);
      onSuccess?.();
    } else {
      toast.error('Error al asignar el maestro');
    }
  }

  const handleTeacherSearch = (value: string) => {
    if (value.length >= 2) {
      searchByName(value);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Maestro</FormLabel>
              <Popover open={teacherSearchOpen} onOpenChange={setTeacherSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(!field.value && "text-muted-foreground")}
                    >
                      {selectedTeacher ? `${selectedTeacher.name}` : "Buscar maestro..."}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar maestro..." onValueChange={handleTeacherSearch} />
                    <CommandEmpty>No se encontró el maestro</CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((disciple) => (
                        <CommandItem
                          value={`${disciple.name} ${disciple.lastName}`}
                          key={disciple.id}
                          onSelect={() => {
                            form.setValue("teacherId", disciple.id);
                            setSelectedTeacher({ id: disciple.id, name: `${disciple.name} ${disciple.lastName}` });
                            setTeacherSearchOpen(false);
                          }}
                        >
                          {disciple.name} {disciple.lastName} - {disciple.identification}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">
          <UserPlus className="mr-2 h-4 w-4" />
          Asignar Maestro
        </Button>
      </form>
    </Form>
  );
};
