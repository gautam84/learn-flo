"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"; // Add this import

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
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
import Link from 'next/link';
import { useAuth } from "@/lib/contexts/auth-context"
import { useState } from "react"
import { classroomsService } from "@/lib/api/classrooms"
import { Button } from "./ui/button";
import { toast } from "sonner";


export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  const { user } = useAuth();
  const [open, setOpen] = useState(false)

  const [name, setName] = useState("");
  const [type, setType] = useState<"classroom" | "test" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


   const router = useRouter();

const handleCreate = async () => {
  if (!name || !type) {
    setError("Please fill out all fields.");
    return;
  }

  setLoading(true);
  setError("");

  if (type === "classroom") {
    const result = await classroomsService.createClassroom(name);

    if (!result.success) {
      setError(result.error || "Failed to create classroom.");
    } else {
      setName("");
      setType("");
      setOpen(false);
      toast.success("Classroom created successfully!");
      // optionally close the dialog or refresh UI
    }
  } else if (type === "test") {
    router.push(`/teacher/create-test?name=${encodeURIComponent(name)}`);
  }

  setLoading(false);
};
  

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">


           {user?.role === "TEACHER" && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <SidebarMenuButton
                        onClick={() => setOpen(true)}

                    tooltip="Create a New Note"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 ease-linear"
                  >
                    <IconCirclePlusFilled />
                    <span>Create</span>
                  </SidebarMenuButton>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Create New</AlertDialogTitle>
                    <AlertDialogDescription>
                      Create a new classroom or test
                    </AlertDialogDescription>
                  </AlertDialogHeader>
    <form onSubmit={(e) => e.preventDefault()}>

                  <div className="grid w-full items-center gap-4 py-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Name of your classroom or test"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={type}
                        onValueChange={(val: "classroom" | "test") =>
                          setType(val)
                        }
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classroom">Classroom</SelectItem>
                          <SelectItem value="test">Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                  </div>
                </form>


                  {/* <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)} disabled={loading}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreate} disabled={loading} asChild>
                       <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded"
        >
                                {loading ? "Creating..." : "Create"}

        </button>
                    </AlertDialogAction>
                  </AlertDialogFooter> */}

                    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
      {/* <AlertDialogAction disabled={true} asChild> */}
        <Button
          onClick={handleCreate}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create"}
        </Button>
      {/* </AlertDialogAction> */}
    </AlertDialogFooter>
  </AlertDialogContent>
                {/* </AlertDialogContent> */}
              </AlertDialog>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        <SidebarMenu>
          {items.map((item) => (
            <Link
            key={item.title}
            href={item.url}

            >
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}