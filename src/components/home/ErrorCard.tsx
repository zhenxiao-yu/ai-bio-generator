"use client";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

const ErrorCard = ({ message, onRetry }: ErrorCardProps) => (
  <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
    <AlertCircle className="w-10 h-10 text-destructive" aria-hidden="true" />
    <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Try again
      </Button>
    )}
  </div>
);

export default ErrorCard;
