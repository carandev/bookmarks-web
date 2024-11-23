import {useAuth0} from "@auth0/auth0-react";
import BookmarkService from "../services/BookmarksService";
import {useEffect, useState} from "react";
import Bookmark from "../data/responses/Bookmark";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
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
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import CreateBookmarkRequest from "@/data/requests/CreateBookmarkRequest";
import useUserStore from "@/utils/useUserStore";
import userForm from "@/data/forms/user-form";
import {LinkIcon, Pencil, Trash2} from "lucide-react";
import UpdateBookmarkRequest from "@/data/requests/UpdateBookmarkRequest.ts";

const Bookmarks = () => {
    const {isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    const {currentUser} = useUserStore();
    const [open, setOpen] = useState<boolean>(false);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
    const bookmarkService = new BookmarkService();

    const form = useForm<z.infer<typeof userForm>>({
        resolver: zodResolver(userForm),
        defaultValues: {
            title: "",
            url: "",
        },
    });
    const onCreateSubmit = async (values: z.infer<typeof userForm>) => {
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
            await callApi();
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Ocurrió un error al registrar el marcador", {
                    duration: 5000,
                    description: error.message,
                });
            } else {
                toast.error("Ocurrió un error al registrar el marcador");
                console.error(error)
            }
        }
    };

    const updateBookmark = async () => {
        if (editingBookmark) {
            try {
                const request: UpdateBookmarkRequest = {
                    title: editingBookmark.title,
                    url: editingBookmark.url,
                    tags: editingBookmark.tags
                }

                await bookmarkService.updateBookmark(editingBookmark.id, request, await getAccessTokenSilently())

                setBookmarks(bookmarks.map(b => b.id === editingBookmark.id ? editingBookmark : b))
                setEditingBookmark(null)
            }
            catch (error) {
                if (error instanceof Error) {
                    toast.error("Ocurrió un error al actualizar el marcador", {
                        duration: 5000,
                        description: error.message,
                    });
                } else {
                    toast.error("Ocurrió un error al actualizar el marcador");
                    console.error(error);
                }
            }
        }
    }

    const deleteBookmark = async (id: number) => {
        try {
            await bookmarkService.removeBookmark(id, await getAccessTokenSilently())
            setBookmarks(bookmarks.filter(b => b.id !== id))

            toast.success("Marcador eliminado correctamente")
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Ocurrió un error al eliminar el marcador", {
                    duration: 5000,
                    description: error.message,
                });
            } else {
                toast.error("Ocurrió un error al eliminar el marcador");
                console.error(error);
            }
        }
    }

    const callApi = async () => {
        try {
            setLoading(true);
            const token = await getAccessTokenSilently();
            const bookmarks = await bookmarkService.getBookmarks(token);

            setBookmarks(bookmarks);
        } catch (error) {
            if (error instanceof Error) {
                toast.error("Ocurrió un error al actualizar el marcador", {
                    duration: 5000,
                    description: error.message,
                });
            } else {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            (async () => await callApi())();
        }
    }, [isAuthenticated]);

    if (loading || isLoading) {
        return <div>Cargando ...</div>;
    } else if (!isAuthenticated) {
        return <div>Por favor, inicie sesión</div>;
    }

    return (
        <main className="container mx-auto">
            <Dialog open={open} onOpenChange={setOpen}>
                <div className="flex justify-between mb-3">
                    <h2 className="text-2xl">Mis marcadores</h2>
                    <Button asChild>
                        <DialogTrigger>Crear marcador</DialogTrigger>
                    </Button>
                </div>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar marcador</DialogTitle>
                        <DialogDescription>
                            Aquí puedes registrar un nuevo marcador indicando el título y la
                            URL.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Mi marcador" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            El título que identificará tu marcador.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            La URL a la que apunta tu marcador.
                                        </FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Guardar</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bookmarks.length != 0 ? (
                    bookmarks.map((bookmark) => (
                        <Card key={bookmark.id}>
                            <CardHeader className="flex flex-col">
                                <CardTitle className="text-2xl">{bookmark.title}</CardTitle>
                                <CardDescription>{bookmark.url}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {editingBookmark && editingBookmark.id === bookmark.id ? (
                                    <div className="grid w-full items-center gap-4">
                                        <Input
                                            placeholder="Título"
                                            value={editingBookmark.title}
                                            onChange={(e) => setEditingBookmark({
                                                ...editingBookmark,
                                                title: e.target.value
                                            })}
                                        />
                                        <Input
                                            placeholder="URL"
                                            value={editingBookmark.url}
                                            onChange={(e) => setEditingBookmark({
                                                ...editingBookmark,
                                                url: e.target.value
                                            })}
                                        />
                                    </div>
                                ) : (
                                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer"
                                       className="flex items-center text-blue-500 hover:underline">
                                        <LinkIcon className="mr-2 h-4 w-4"/> Visitar sitio
                                    </a>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                {editingBookmark && editingBookmark.id === bookmark.id ? (
                                    <Button onClick={updateBookmark}>Guardar</Button>
                                ) : (
                                    <Button variant="outline" onClick={() => setEditingBookmark(bookmark)}>
                                        <Pencil className="mr-2 h-4 w-4"/> Editar
                                    </Button>
                                )}
                                <Button variant="destructive" onClick={async () => await deleteBookmark(bookmark.id)}>
                                    <Trash2 className="mr-2 h-4 w-4"/> Eliminar
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p>No hay marcadores registrados</p>
                )}
            </section>
        </main>
    );
};

export default Bookmarks;
