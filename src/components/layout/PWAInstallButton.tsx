import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from '../ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/Dialog';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <Button
        variant="outline"
        size={compact ? 'sm' : 'md'}
        onClick={install}
        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Install App</span>
      </Button>
    );
  }

  if (isIOS) {
    return (
      <>
        <Button
          variant="outline"
          size={compact ? 'sm' : 'md'}
          onClick={() => setShowIOSGuide(true)}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Install on iOS</span>
        </Button>

        <Dialog open={showIOSGuide} onOpenChange={setShowIOSGuide}>
          <DialogContent>
            <DialogTitle>Install ProjectHub on iPhone or iPad</DialogTitle>
            <DialogDescription>
              Add ProjectHub to your Home Screen for standalone app launch and shell caching.
            </DialogDescription>
            <ol className="mt-4 space-y-2.5 text-sm text-[var(--ph-text-secondary)]">
              <li>1. Tap the Share button in the Safari browser toolbar.</li>
              <li>2. Scroll down and select Add to Home Screen.</li>
              <li>3. Confirm the name ProjectHub and tap Add.</li>
            </ol>
            <div className="mt-5 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShowIOSGuide(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return null;
};
