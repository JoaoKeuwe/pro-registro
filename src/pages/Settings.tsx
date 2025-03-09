
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Settings: React.FC = () => {
  const { user, updateUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  
  const [name, setName] = useState(user?.name || "");
  const [organization, setOrganization] = useState(user?.organization || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    updateUser({
      name,
      organization,
      avatar,
    });
  };
  
  if (!user) return null;
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e informações de perfil
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="profile-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="link" className="mt-2" type="button">
                    Alterar foto
                  </Button>
                </div>

                <div className="flex-1 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="organization">Organização</Label>
                    <Input
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Sua organização"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="avatar">URL da Imagem de Perfil</Label>
                    <Input
                      id="avatar"
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="URL da sua foto de perfil"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button form="profile-form" type="submit">
              Salvar alterações
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>
              Personalize sua experiência de uso
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Tema Escuro</h3>
                <p className="text-sm text-muted-foreground">
                  Ativar o modo escuro para reduzir o cansaço visual
                </p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notificações</h3>
                <p className="text-sm text-muted-foreground">
                  Receber notificações sobre novas atas e assinaturas pendentes
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">E-mails de resumo</h3>
                <p className="text-sm text-muted-foreground">
                  Receber e-mails com resumo das atividades recentes
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
