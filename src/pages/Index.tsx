
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Database, FileText, Settings } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const Index: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-dragndrop-dark-gray">
      <header className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <FileText className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                FormBuilder
              </span>
            </a>
            <nav className="flex items-center gap-6 text-sm">
              <Link to="/forms" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Formulaires
              </Link>
              <Link to="/db-connections" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Connexions BDD
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Créez des formulaires en quelques clics
                </h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Notre constructeur de formulaires drag-and-drop vous permet de créer rapidement des formulaires interactifs pour votre site web ou votre application.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800">
                <FileText className="h-10 w-10 text-dragndrop-primary" />
                <h2 className="text-2xl font-bold">
                  Formulaires Standard
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Créez des formulaires simples et efficaces qui stockent les données directement dans notre base de données intégrée, idéal pour des sondages, inscriptions et collectes de feedback.
                </p>
                <Link to="/form/new">
                  <Button className="bg-dragndrop-primary hover:bg-dragndrop-secondary">
                    Créer un formulaire
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800">
                <Database className="h-10 w-10 text-dragndrop-primary" />
                <h2 className="text-2xl font-bold">
                  Connexion Base de Données
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Connectez-vous à vos propres bases de données (PostgreSQL, MySQL, Microsoft SQL Server) et créez des formulaires qui interagissent directement avec vos tables existantes.
                </p>
                <div className="flex gap-4">
                  <Link to="/db-connections">
                    <Button className="bg-dragndrop-primary hover:bg-dragndrop-secondary">
                      Gérer les connexions
                    </Button>
                  </Link>
                  <Link to="/dbform/new">
                    <Button variant="outline">
                      Créer un formulaire DB
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
