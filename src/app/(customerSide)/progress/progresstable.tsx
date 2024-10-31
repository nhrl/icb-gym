import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, EyeIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { BoltIcon } from '@heroicons/react/16/solid';
import { Toggle } from "@/components/ui/toggle";
import ProgressAddForm from '@/components/customerComponents/progressForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScaleIcon } from 'lucide-react';

// Define the structure of a progress entry
interface Progress {
  progress_id: number;
  customer_id: number;
  week: number;
  desc: string;
  workout_count: number;
  current_weight: number;
  bodyfat_percentage: number;
  date_added: string;
}


const mockProgressData = [
  {
    progress_id: 1,
    customer_id: 101,
    week: 1,
    desc: "Started the journey strong with consistent workouts and mindful eating.",
    workout_count: 4,
    current_weight: 72,
    bodyfat_percentage: 18,
    date_added: "2024-08-29",
  },
  {
    progress_id: 2,
    customer_id: 101,
    week: 2,
    desc: "Pushed hard this week, focusing on strength training and cardio.",
    workout_count: 5,
    current_weight: 71.5,
    bodyfat_percentage: 17.8,
    date_added: "2024-09-05",
  },
  {
    progress_id: 3,
    customer_id: 101,
    week: 3,
    desc: "Took it easy mid-week but made up with a strong weekend workout.",
    workout_count: 3,
    current_weight: 71,
    bodyfat_percentage: 17.5,
    date_added: "2024-09-12",
  },
  {
    progress_id: 4,
    customer_id: 101,
    week: 4,
    desc: "Focused on core exercises and flexibility this week.",
    workout_count: 4,
    current_weight: 70.8,
    bodyfat_percentage: 17.3,
    date_added: "2024-09-19",
  },
  {
    progress_id: 5,
    customer_id: 101,
    week: 5,
    desc: "Hit a new personal best in strength and improved cardio endurance.",
    workout_count: 5,
    current_weight: 70.5,
    bodyfat_percentage: 17,
    date_added: "2024-09-26",
  },
  {
    progress_id: 6,
    customer_id: 101,
    week: 6,
    desc: "Focused on high-intensity interval training and endurance workouts.",
    workout_count: 4,
    current_weight: 70.2,
    bodyfat_percentage: 16.9,
    date_added: "2024-10-03",
  },
  {
    progress_id: 7,
    customer_id: 101,
    week: 7,
    desc: "Improved overall stamina and maintained workout consistency.",
    workout_count: 5,
    current_weight: 70,
    bodyfat_percentage: 16.8,
    date_added: "2024-10-10",
  },
  {
    progress_id: 8,
    customer_id: 101,
    week: 8,
    desc: "Included more flexibility exercises and cooldown routines.",
    workout_count: 3,
    current_weight: 69.8,
    bodyfat_percentage: 16.7,
    date_added: "2024-10-17",
  },
  {
    progress_id: 9,
    customer_id: 101,
    week: 9,
    desc: "Incorporated more varied cardio activities for endurance.",
    workout_count: 5,
    current_weight: 69.5,
    bodyfat_percentage: 16.5,
    date_added: "2024-10-24",
  },
  {
    progress_id: 10,
    customer_id: 101,
    week: 10,
    desc: "Final week: Strong focus on overall fitness and flexibility.",
    workout_count: 4,
    current_weight: 69.3,
    bodyfat_percentage: 16.3,
    date_added: "2024-10-31",
  },
];



const ITEMS_PER_PAGE = 8;

function ProgressTable() {
  const [progressData, setProgressData] = useState<Progress[]>(mockProgressData);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // State to control the add form dialog visibility
  const previousWeek = progressData.length > 0 ? Math.max(...progressData.map(p => p.week)) : 0;

  useEffect(() => {
    async function fetchProgressData() {
      try {
        const response = await fetch("/api/progress?customer_id=your_customer_id");
        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    }
    fetchProgressData();
  }, []);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  // Sort data based on sortOrder
  const sortedData = [...progressData].sort((a, b) => {
    const dateA = new Date(a.date_added).getTime();
    const dateB = new Date(b.date_added).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Calculate pagination indices
  const lastIndex = currentPage * ITEMS_PER_PAGE;
  const firstIndex = lastIndex - ITEMS_PER_PAGE;
  const currentData = sortedData.slice(firstIndex, lastIndex);  // Now using sortedData
  const totalPages = Math.ceil(progressData.length / ITEMS_PER_PAGE);

    // Function to handle closing the form dialog
    const handleCloseForm = () => {
      setIsAddFormOpen(false);
    };

  return (
    <div className='p-4 flex flex-col gap-4'>
      <div className='flex flex-row justify-between items-center mb-4'>
        <p className='text-xl font-semibold'>Weekly Progress</p>

        {/* Sort and Add Progress Buttons */}
        <div className='flex flex-row gap-2'>
          <Toggle onClick={toggleSortOrder} className='flex flex-row gap-2' variant="outline">
            <ArrowsUpDownIcon className='h-3 w-3 '/>
            <p>Order:</p>
            <p>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</p>
          </Toggle>
          <Button
            className='text-xs'
            size="sm"
            onClick={() => setIsAddFormOpen(true)} // Open the form dialog
          >
            <PlusCircleIcon className='h-4 w-4' /> 
            Add Progress 
          </Button>

          <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
            <DialogContent>
            <ProgressAddForm onClose={handleCloseForm} onAdd={() => setProgressData([...progressData])} previousWeek={previousWeek} />
            </DialogContent>
          </Dialog>
          </div>
      </div>

      {/* Dynamic Progress Entries */}
      {currentData.map((progress) => (
        <Dialog key={progress.progress_id}>
          <DialogTrigger className='w-full rounded-md flex flex-row justify-between border p-2 px-4 items-center'>
              <div className="flex flex-row items-center gap-4">
                Week {progress.week}
                <div className="flex text-xs text-muted-foreground flex-row items-center">
                  {progress.date_added}
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex flex-row items-center">
                <EyeIcon className='h-3 w-3 mr-2' />
                View Progress
              </p>
          </DialogTrigger>
          <DialogContent className="gap-4 flex flex-col">
            <DialogHeader className="h-48 bg-cover bg-center border rounded-lg mt-6" />
            <DialogTitle className='flex flex-row justify-between items-center align-top'> 
              <div>Week {progress.week}</div>
              <div className='flex flex-row gap-2 rounded-full border text-xs p-2 px-4 items-center font-thin'>
                <BoltIcon className='h-3 w-3 text-yellow-400' />
                <p>Workouts</p>
                <p>{progress.workout_count}</p>
              </div>
            </DialogTitle>
            
            <div className='font-regular text-xs'>
                <p>Date Added</p>
                <p className='text-muted-foreground'>{progress.date_added}</p>
            </div>

            <DialogDescription className="flex flex-col gap-4 mt-3">
              <div className="flex flex-col justify-between">
                <p>{progress.desc}</p>
              </div>
            </DialogDescription>

            {/* Progress Details */}
            <div className='flex flex-row justify-between gap-4'>
              <div className='flex flex-row gap-2 w-full rounded-full justify-between border text-xs p-2 px-4 items-center font-thin'>
                  <p className='flex flex-row items-center'><ScaleIcon className='h-3 w-3 mr-2' />Weight</p>
                  <p>{progress.current_weight}</p>
              </div>
              <div className='flex flex-row gap-2 w-full rounded-full justify-between border text-xs p-2 px-4 items-center font-thin'>
                  <p>Est. Bodyfat %</p>
                  <p>{progress.bodyfat_percentage}</p>
              </div>
            </div>

            <DialogFooter className='mt-4'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="flex ml-auto flex-row gap-2 text-xs font-normal">
                    <TrashIcon className="h-3 w-3" />
                    Delete Progress
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Progress?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this progress? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='text-background'>Yes, Delete This</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> 
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default ProgressTable;
