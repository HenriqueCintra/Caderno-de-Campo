"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CaptureGps({
  onCapture,
}: {
  onCapture: (lat: number, lng: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada neste dispositivo.");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onCapture(pos.coords.latitude, pos.coords.longitude);
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Permissão de localização negada."
            : "Não foi possível obter GPS. Tente novamente."
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={capture}
        disabled={loading}
      >
        <MapPin className="h-5 w-5" />
        {loading ? "Capturando GPS…" : "Capturar GPS"}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
