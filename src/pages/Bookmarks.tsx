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

const Bookmarks = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { currentUser } = useUserStore();
  const [open, setOpen] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const bookmarkService = new BookmarkService();
  const formSchema = z.object({
    title: z.string().min(2).max(50),
    url: z.string().min(2).max(50),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="m-4">
        <CardHeader className="justify-between items-center">
          <h2>Mis marcadores</h2>
          <DialogTrigger>Crear marcador</DialogTrigger>
        </CardHeader>
        <CardContent className="flex gap-4">
          {bookmarks.length != 0 ? (
            bookmarks.map((bookmark) => (
              <Card key={bookmark.id}>
                <CardHeader>{bookmark.title}</CardHeader>
                <CardContent>{bookmark.url}</CardContent>
              </Card>
            ))
          ) : (
            <p>No hay marcadores registrados</p>
          )}
        </CardContent>
      </Card>
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
  );
};

export default Bookmarks;
