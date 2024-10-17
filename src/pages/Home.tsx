import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Link } from "wouter";

const Home = () => {
  return (
    <main className="flex gap-4 p-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Marcadores</h2>
        </CardHeader>
        <CardContent>
          <p>Lista de marcadores</p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="secondary">
            <Link href="/bookmarks">Ver marcadores</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Home;
