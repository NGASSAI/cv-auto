"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { jouerSonNotification } from "@/features/notifications/lib/son-notification";

interface Notification {
  id: string;
  titre: string;
  message: string;
  lien: string | null;
  lu: boolean;
  creeLe: string;
}

const INTERVALLE_POLLING_MS = 15000;

export function ClocheNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [nonLues, setNonLues] = useState(0);
  const premierChargement = useRef(true);
  const nonLuesPrecedentes = useRef(0);

  const recharger = useCallback(async () => {
    try {
      const reponse = await fetch("/api/notifications");
      if (!reponse.ok) return;

      const donnees = await reponse.json();
      setNotifications(donnees.notifications);

      // Ne joue le son que si le nombre de non-lues a AUGMENTÉ,
      // et jamais au tout premier chargement de la page.
      if (!premierChargement.current && donnees.nonLues > nonLuesPrecedentes.current) {
        jouerSonNotification();
      }

      nonLuesPrecedentes.current = donnees.nonLues;
      setNonLues(donnees.nonLues);
      premierChargement.current = false;
    } catch {
      // Échec silencieux : le polling réessaiera au prochain intervalle
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(recharger, 0);
    const intervalle = setInterval(recharger, INTERVALLE_POLLING_MS);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalle);
    };
  }, [recharger]);

  async function marquerLue(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications((precedent) =>
      precedent.map((n) => (n.id === id ? { ...n, lu: true } : n))
    );
    setNonLues((precedent) => Math.max(0, precedent - 1));
  }

  async function toutMarquerLu() {
    await fetch("/api/notifications/tout-lire", { method: "PATCH" });
    setNotifications((precedent) => precedent.map((n) => ({ ...n, lu: true })));
    setNonLues(0);
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            {nonLues > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center">
                {nonLues > 9 ? "9+" : nonLues}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-medium">Notifications</span>
          {nonLues > 0 && (
            <button
              type="button"
              onClick={toutMarquerLu}
              className="text-xs text-secondary hover:underline flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Tout marquer lu
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune notification
            </p>
          ) : (
            notifications.map((notification) => {
              const contenu = (
                <div
                  className={`px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors ${
                    !notification.lu ? "bg-primary/5" : ""
                  }`}
                  onClick={() => !notification.lu && marquerLue(notification.id)}
                >
                  <div className="flex items-start gap-2">
                    {!notification.lu && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{notification.titre}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );

              return notification.lien ? (
                <Link key={notification.id} href={notification.lien} className="block">
                  {contenu}
                </Link>
              ) : (
                <div key={notification.id}>{contenu}</div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}