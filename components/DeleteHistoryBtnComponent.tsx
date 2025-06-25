'use client';

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
} from "@/components/ui/alert-dialog"
import { Trash2 } from 'lucide-react';
import { removeExactLibraryAndChatsDataFromDB } from '@/db/db_Instance';

interface DeleteHistoryBtnComponentProps {
    libraryId: string;
    webSearchInput: string;
    userEmail: string;
    onDelete: () => void
}

export default function DeleteHistoryBtnComponent({
    libraryId,
    webSearchInput,
    userEmail,
    onDelete
}: DeleteHistoryBtnComponentProps) {

    async function removeHistoryData() {
        try {

            await removeExactLibraryAndChatsDataFromDB(libraryId, webSearchInput, userEmail);

            console.log("History data removed successfully");

            // NOTE - Refesh the page to update the UI
            if (onDelete) {
                onDelete();
            }

        } catch (error: unknown) {
            console.error("Error removing history data from db:", error);

            // NOTE - Handle error
            if (error instanceof Error) {
                console.error("Error removing history data from db [message]:", error.message);
                console.error("Error removing history data from db [stack]:", error.stack);
            } else {
                console.error("Unknown error removing history data from db:", error);
            }
        }
    }




    return (
        <div data-delete-button
            onClick={event => event.stopPropagation()}
        >
            <AlertDialog>
                <AlertDialogTrigger asChild>

                    <Trash2
                        size={22}
                        className="text-muted-foreground hover:text-red-400"
                    />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this conversation
                            and remove the history from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={removeHistoryData}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

