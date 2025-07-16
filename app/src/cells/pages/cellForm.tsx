import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useAuthStore, useCellStore, useDiscipleStore } from '@/src/stores';
import { Cell, CellSchema } from '../schemas/cellSchema';
import { Neighborhood } from "@/src/cells/schemas/neighborhood.enum";
import { RecordCellComponent } from '../components/recordCellComponent';
import { Save } from 'lucide-react';
const CellForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userState = useAuthStore(state => state.user);
    const addCellState = useCellStore(state => state.addCell);
    const addUpdateState = useCellStore(state => state.updateCell);
    const getCellState = useCellStore(state => state.getCell);
    const disciplesState = useDiscipleStore(state => state.Disciples);

    const cellDefault: Cell = {
        id: crypto.randomUUID(),
        createdUser: userState,
        createdDate: new Date(),
        address: "",
        leader: "",
        host: "",
        network: 0,
        neighborhood: Neighborhood[0].value,
    }
    if (id) {
        const cellForUpdate = getCellState(id);
        if (cellForUpdate) {
            cellDefault.id = cellForUpdate.id as typeof cellDefault.id;
            cellDefault.createdUser = cellForUpdate.createdUser;
            cellDefault.createdDate = cellForUpdate.createdDate ? new Date(cellForUpdate.createdDate) : new Date();
            cellDefault.network = cellForUpdate.network;
            cellDefault.neighborhood = cellForUpdate.neighborhood;
            cellDefault.address = cellForUpdate.address;
            cellDefault.leader = cellForUpdate.leader;
            cellDefault.host = cellForUpdate.host;
        }
    }

    const form = useForm<Cell>({
        resolver: zodResolver(CellSchema),
        defaultValues: cellDefault,
    });

    const onSubmit = (data: Cell) => {
        if (id) {
            addUpdateState(data);
        } else {
            addCellState(data);
        }

        navigate('/');
    }

    return <>
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Editar Celula</h1>
        </div>
        <div className="flex items-center items-center justify-center text-start rounded-lg border border-dashed p-4 shadow-sm">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 grid-flow-row gap-2 w-full">
                    <FormField
                        control={form.control}
                        name="network"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Red Celula</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Jovenes, Mujres, Hombres, Kids, etc." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Mujeres</SelectItem>
                                        <SelectItem value="2">Hombres</SelectItem>
                                        <SelectItem value="3">Prejuveniles</SelectItem>
                                        <SelectItem value="4">Mixta</SelectItem>
                                        <SelectItem value="5">Jovenes</SelectItem>
                                        <SelectItem value="6">Kids</SelectItem>
                                        <SelectItem value="7">Rocas</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="mt-1 mb-1">Barrio</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? Neighborhood.find((x) => x.value === field.value)?.label : "Alejandria, Alicante, Porvenir, Trebol, etc."}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Escribe 2 letras para comentar la busqueda..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <p className="text-lg mb-2">
                                                        No se encontró el barrio. <br></br>
                                                        ! Próximamente agregaremos funcionalidad para agregar un nuevo barrio
                                                    </p>
                                                    <Button type="button" disabled>Agregar un nuevo barrio</Button>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {
                                                        Neighborhood.map((x) => (
                                                            <CommandItem
                                                                value={x.label}
                                                                key={x.value}
                                                                onSelect={() => {
                                                                    console.log('sdfsdf', x)
                                                                    form.setValue("neighborhood", x.value);
                                                                }}
                                                            >
                                                                {x.label}
                                                                <CheckIcon className={cn("ml-auto h-4 w-4",
                                                                    x.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0")}
                                                                />
                                                            </CommandItem>
                                                        ))
                                                    }
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección</FormLabel>
                                <FormControl>
                                    <Input placeholder="Calle 12 A N 2 - 4 Torre 2 Apartamento 301" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Ingresa la dirección completa con el complemento, torre, piso, interior, etc.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="leader"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="mt-1 mb-1">Lider</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? disciplesState.find((x) => x.id == field.value)?.name : "Andrea Rodriguez"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Escribe 2 letras para comentar la busqueda..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>
                                                    <p className="text-lg mb-2">
                                                        No se encontró el lider. <br></br>
                                                        ! Próximamente agregaremos funcionalidad para agregar un lider
                                                    </p>
                                                    <Button type="button" disabled>Agregar un nuevo lider</Button>
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {
                                                        disciplesState.map((x) => (
                                                            <CommandItem
                                                                value={x.name}
                                                                key={x.id}
                                                                onSelect={() => {
                                                                    form.setValue("leader", x.id);
                                                                }}
                                                            >
                                                                {x.name}
                                                                <CheckIcon className={cn("ml-auto h-4 w-4",
                                                                    x.id == field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0")}
                                                                />
                                                            </CommandItem>
                                                        ))
                                                    }
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="host"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Anfitrion</FormLabel>
                                <FormControl>
                                    <Input placeholder="David Rodriguez" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Ingrese el nombre del anfitrión que recibirá la celula en su hogar.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Values:
                    <pre className="col-span-2 text-sm">{JSON.stringify(form.watch(), null, 2)}</pre>
                    Errores:
                    <pre className="col-span-2 text-sm">{JSON.stringify(form.formState.errors, null, 2)}</pre> */}

                    <Button type="submit" className="col-span-2">
                        <Save className='mr-2' /> Guardr cambios
                    </Button>
                </form>
            </Form>
        </div>
        {
            id && <RecordCellComponent idCell={id}></RecordCellComponent>
        }
    </>;
}

export default CellForm;