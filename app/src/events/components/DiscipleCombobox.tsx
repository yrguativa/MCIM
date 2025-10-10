import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDiscipleStore } from "@/src/disciples/store/disciple.store";


interface DiscipleComboboxProps {
  onSelect: (value: string) => void;
  value?: string;
  placeholder?: string;
}

export function DiscipleCombobox({ onSelect, value, placeholder }: DiscipleComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const disciplesState = useDiscipleStore(state => state.Disciples);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {value ? disciplesState.find((x) => x.id === value)?.name : placeholder || "Seleccionar discípulo..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Escribe 2 letras para comenzar la búsqueda..." className="h-9" />
          <CommandList>
            <CommandEmpty>
              <p className="text-lg mb-2">
                No se encontró el discípulo. <br />
                Próximamente agregaremos funcionalidad para agregar un nuevo discípulo
              </p>
              <Button type="button" disabled>Agregar un nuevo discípulo</Button>
            </CommandEmpty>
            <CommandGroup>
              {disciplesState.map((disciple) => (
                <CommandItem
                  value={disciple.name}
                  key={disciple.id}
                  onSelect={() => {
                    onSelect(disciple.id);
                    setOpen(false);
                  }}
                >
                  {disciple.name}
                  <CheckIcon className={cn(
                    "ml-auto h-4 w-4",
                    disciple.id === value ? "opacity-100" : "opacity-0"
                  )} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
