"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Input } from "@/components/ui/input"
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

  

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">


      {(user?.role == "TEACHER" )&& <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">

          <AlertDialog>
          <AlertDialogTrigger asChild>
          <SidebarMenuButton
              tooltip="Create a New Note"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
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

        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your classroom or test" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Type</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Classroom</SelectItem>
                  <SelectItem value="sveltekit">Test</SelectItem>
                
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
                <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Create</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>



          </SidebarMenuItem>
        </SidebarMenu>

}

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