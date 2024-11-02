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
import CryptoJS from 'crypto-js';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import useSWR, { mutate } from 'swr';

// Define the structure of a progress entry
interface Progress {
  progress_id: number;
  customer_id: number;
  week_number: number;
  desc: string;
  workout_count: number;
  weight: number;
  bodyfat_percentage: number;
  date_added: string;
  photo: string;
}

const ITEMS_PER_PAGE = 8;
const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ProgressTable() {
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false); // State to control the add form dialog visibility
  const previousWeek = progressData.length > 0 ? Math.max(...progressData.map(p => p.week_number)) : 0;
  const { toast } = useToast();
  const api = process.env.NEXT_PUBLIC_API_URL;
  const fetchUserFromCookie = () => {
    if (typeof window === "undefined") return null; // Prevent running on server
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "lhS7aOXRUPGPDId6mmHJdA00p39HAfU4";
      const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});
  
    const userCookie = cookies["user"];
    if (!userCookie) return null;
  
    try {
      const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
      const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser.id;
    } catch (error) {
      console.error("Error decrypting user cookie:", error);
      return null;
    }
};

const userId = fetchUserFromCookie();

const { data, mutate } = useSWR(`${api}/api/customer/progress?id=${userId}`, fetcher);

useEffect(() => {
  if (data?.data) {
    setProgressData(data.data || []);
  }
}, [data]);


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

  const deleteProgress =  async (progress_id : any) => {
    const id = fetchUserFromCookie();
    const response = await fetch(`${api}/api/customer/progress`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress_id }),
    })

    const message = await response.json();
    if(message.success) {
      toast({
        title: "Progress Deleted",
        description: "Your progress has been successfully deleted.",
        duration: 3000,
      });
      mutate(`${api}/api/customer/progress?id=${id}`);
    } else {
      toast({
        title: "Deleting Progress Failed",
        description: "Failed to delete your progress.",
        duration: 3000,
      });
    }
  }

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
            <ProgressAddForm onClose={handleCloseForm} onAdd={() => setProgressData([...progressData])} previousWeek={previousWeek} mutate={mutate}/>
            </DialogContent>
          </Dialog>
          </div>
      </div>

      {/* Dynamic Progress Entries */}
      {currentData.map((progress) => (
        <Dialog key={progress.progress_id} >
          <DialogTrigger className='w-full rounded-md flex flex-row justify-between border p-2 px-4 items-center'>
              <div className="flex flex-row items-center gap-4">
                Week {progress.week_number}
                <div className="flex text-xs text-muted-foreground flex-row items-center">
                  {new Date(progress.date_added).toISOString().slice(0, 10)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex flex-row items-center">
                <EyeIcon className='h-3 w-3 mr-2' />
                View Progress
              </p>
          </DialogTrigger>
          <DialogContent className="gap-4 flex flex-col">
            <DialogHeader className="h-48 bg-cover bg-center border rounded-lg mt-6" 
              style={{
                backgroundImage: `url(${progress.photo || fallbackImage})`,
              }}
            />
            <DialogTitle className='flex flex-row justify-between items-center align-top'> 
              <div>Week {progress.week_number}</div>
              <div className='flex flex-row gap-2 rounded-full border text-xs p-2 px-4 items-center font-thin'>
                <BoltIcon className='h-3 w-3 text-yellow-400' />
                <p>Workouts</p>
                <p>{progress.workout_count}</p>
              </div>
            </DialogTitle>
            
            <div className='font-regular text-xs'>
                <p>Date Added</p>
                <p className='text-muted-foreground'>{new Date(progress.date_added).toISOString().slice(0, 10)}</p>
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
                  <p>{progress.weight}</p>
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
                    <AlertDialogAction className='text-background' onClick={() => deleteProgress(progress.progress_id)}>Yes, Delete This</AlertDialogAction>
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
      <Toaster />
    </div>
  );
}

export default ProgressTable;
