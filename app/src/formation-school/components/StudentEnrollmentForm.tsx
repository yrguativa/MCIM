import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { StudentEnrollmentInput, StudentEnrollmentSchema } from '../schemas/enrollmentSchema';
import { useFormationSchoolStore } from '../store/formation-school.store';
import { useAuthStore } from '@/src/app/stores';
import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StudentEnrollmentFormProps {
  courseId: string;
  onSuccess?: () => void;
}

export const StudentEnrollmentForm: React.FC<StudentEnrollmentFormProps> = ({ courseId, onSuccess }) => {
  const userState = useAuthStore(state => state.user);
  const { searchByName, searchResults } = useDiscipleStore();
  const { enrollStudent } = useFormationSchoolStore();
  
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null);
  
  const form = useForm<StudentEnrollmentInput>({
    resolver: zodResolver(StudentEnrollmentSchema),
    defaultValues: {
      id: crypto.randomUUID(),
      studentId: '',
      courseId,
      enrollmentDate: new Date(),
      status: 'active',
      createdUser: userState?.id || '',
      createdDate: new Date(),
    },
  });

  async function onSubmit(data: StudentEnrollmentInput) {
    const success = await enrollStudent({
      ...data,
      courseId,
    });
    
    if (success) {
      toast.success('Estudiante inscrito exitosamente');
      form.reset({ ...form.getValues(), id: crypto.randomUUID() });
      setSelectedStudent(null);
      onSuccess?.();
    } else {
      toast.error('Error al inscribir al estudiante');
    }
  }

  const handleStudentSearch = (value: string) => {
    if (value.length >= 2) {
      searchByName(value);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Estudiante</FormLabel>
              <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(!field.value && "text-muted-foreground")}
                    >
                      {selectedStudent ? `${selectedStudent.name}` : "Buscar estudiante..."}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar estudiante..." onValueChange={handleStudentSearch} />
                    <CommandEmpty>No se encontró el estudiante</CommandEmpty>
                    <CommandGroup>
                      {searchResults.map((disciple) => (
                        <CommandItem
                          value={`${disciple.name} ${disciple.lastName}`}
                          key={disciple.id}
                          onSelect={() => {
                            form.setValue("studentId", disciple.id);
                            setSelectedStudent({ id: disciple.id, name: `${disciple.name} ${disciple.lastName}` });
                            setStudentSearchOpen(false);
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
          Inscribir Estudiante
        </Button>
      </form>
    </Form>
  );
};
