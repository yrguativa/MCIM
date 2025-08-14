
import React from "react";
import { CreateEventForm } from "@/events/components/CreateEventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";

export default function EventsPage() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                Create a new event. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <CreateEventForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* TODO: Add events list component here */}
    </div>
  );
}
