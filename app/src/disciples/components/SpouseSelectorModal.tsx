import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useDiscipleStore } from '../store/disciple.store';

interface SpouseSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (spouseId: string, spouseName: string) => void;
}

const SpouseSelectorModal: React.FC<SpouseSelectorModalProps> = ({ open, onClose, onSelect }) => {
  const { t } = useTranslation();
  const disciplesState = useDiscipleStore(state => state.Disciples);
  const getDisciples = useDiscipleStore(state => state.getDisciples);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open && (!disciplesState || disciplesState.length === 0)) {
      getDisciples();
    }
  }, [open, disciplesState, getDisciples]);

  const filteredDisciples = disciplesState.filter(d => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.lastName?.toLowerCase().includes(q) ||
      d.identification?.toString().includes(q)
    );
  });

  const handleSelect = (disciple: { id: string; name: string; lastName: string }) => {
    onSelect(disciple.id, `${disciple.name} ${disciple.lastName}`);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { onClose(); setSearchQuery(''); } }}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            {t("disciples.cv.selectSpouse")}
          </DialogTitle>
          <DialogDescription>
            {t("disciples.cv.selectSpouseDescription")}
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t("disciples.cv.spouseSearchPlaceholder")}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>{t("disciples.cv.spouseSearchEmpty")}</CommandEmpty>
            <CommandGroup>
              {filteredDisciples.map((disciple) => (
                <CommandItem
                  key={disciple.id}
                  value={`${disciple.name} ${disciple.lastName}`}
                  onSelect={() => handleSelect(disciple)}
                >
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{disciple.name} {disciple.lastName}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{disciple.identificationType} {disciple.identification}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SpouseSelectorModal;