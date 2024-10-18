import { useAuth0 } from "@auth0/auth0-react";
import BookmarkService from "../services/BookmarksService";
import { useEffect, useState } from "react";
import Bookmark from "../data/responses/Bookmark";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CreateBookmarkRequest from "@/data/requests/CreateBookmarkRequest";
import useUserStore from "@/utils/useUserStore";
import userForm from "@/data/forms/user-form";
import { Trash } from "lucide-react";

const Bookmarks = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { currentUser } = useUserStore();
  const [open, setOpen] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const bookmarkService = new BookmarkService();

  const form = useForm<z.infer<typeof userForm>>({
    resolver: zodResolver(userForm),
    defaultValues: {
      title: "",
      url: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof userForm>) => {
    try {
      const createBookmarkRequest: CreateBookmarkRequest = {
        title: values.title,
        url: values.url,
        userId: currentUser!.id,
        tags: [],
      };

      const token = await getAccessTokenSilently();
      await bookmarkService.create(token, createBookmarkRequest);
      form.reset();
      setOpen(false);
      callApi();
    } catch (error) {
      toast.error("Ocurrió un error al registrar el marcador", {
        duration: 5000,
        description: error.message,
      });
    }
  };

  const callApi = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const bookmarks = await bookmarkService.getBookmarks(token);

      setBookmarks(bookmarks);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      callApi();
    }
  }, [isAuthenticated]);

  if (loading || isLoading) {
    return <div>Cargando ...</div>;
  } else if (!isAuthenticated) {
    return <div>Por favor, inicie sesión</div>;
  }

  return (
    <main className="max-w-6xl mx-auto">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-between">
          <h2 className="text-2xl">Mis marcadores</h2>
          <Button asChild>
            <DialogTrigger>Crear marcador</DialogTrigger>
          </Button>
        </div>
        <section className="flex gap-4 justify-around mt-8">
          {bookmarks.length != 0 ? (
            bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="relative">
                <CardHeader>{bookmark.title}</CardHeader>
                <CardContent>{bookmark.url}</CardContent>
                <Button size="icon" variant="destructive" className="absolute -top-5 -right-2">
                  <Trash />
                </Button>
              </Card>
            ))
          ) : (
            <p>No hay marcadores registrados</p>
          )}
        </section>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar marcador</DialogTitle>
            <DialogDescription>
              Aquí puedes registrar un nuevo marcador indicando el título y la
              URL.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Mi marcador" {...field} />
                    </FormControl>
                    <FormDescription>
                      El título que identificará tu marcador.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      La URL a la que apunta tu marcador.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Guardar</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Bookmarks;
