import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCookieConsent, type CookiePreferences } from '@/hooks/useCookieConsent';
import { Cookie, Settings, X } from 'lucide-react';
import { useState } from 'react';

function CustomizeModal({
  open,
  onOpenChange,
  onSave,
  initialPreferences,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (prefs: CookiePreferences) => void;
  initialPreferences: CookiePreferences;
}) {
  const [prefs, setPrefs] = useState(initialPreferences);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="w-5 h-5 text-amber-500" />
            Cookie Preferences
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Customize which cookies you want to allow. Necessary cookies are always enabled.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="necessary" className="text-white font-medium">
                Necessary Cookies
              </Label>
              <p className="text-sm text-neutral-500">
                Required for the website to function properly
              </p>
            </div>
            <Switch
              id="necessary"
              checked={prefs.necessary}
              disabled
              className="data-[state=checked]:bg-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="analytics" className="text-white font-medium">
                Analytics Cookies
              </Label>
              <p className="text-sm text-neutral-500">
                Help us understand how visitors interact with our website
              </p>
            </div>
            <Switch
              id="analytics"
              checked={prefs.analytics}
              onCheckedChange={(checked) =>
                setPrefs((p) => ({ ...p, analytics: checked }))
              }
              className="data-[state=checked]:bg-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="marketing" className="text-white font-medium">
                Marketing Cookies
              </Label>
              <p className="text-sm text-neutral-500">
                Used to deliver personalized advertisements
              </p>
            </div>
            <Switch
              id="marketing"
              checked={prefs.marketing}
              onCheckedChange={(checked) =>
                setPrefs((p) => ({ ...p, marketing: checked }))
              }
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-neutral-700 text-white hover:bg-neutral-800"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(prefs)}
            className="flex-1 bg-amber-500 text-black hover:bg-amber-600"
          >
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CookieConsentBanner() {
  const {
    showBanner,
    acceptAll,
    rejectAll,
    saveCustom,
    openCustomize,
    showCustomize,
    setShowCustomize,
    preferences,
  } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Cookie className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-neutral-300">
                      We use cookies to improve your experience and analyze website traffic. 
                      Your data helps us understand how our site is used.{" "}
                      <a
                        href="/policy.html"
                        className="text-amber-500 hover:text-amber-400 underline underline-offset-2"
                      >
                        Learn more about our cookie policy
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openCustomize}
                    className="border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Customize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rejectAll}
                    className="border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject All
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="bg-amber-500 text-black hover:bg-amber-600"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CustomizeModal
        open={showCustomize}
        onOpenChange={setShowCustomize}
        onSave={saveCustom}
        initialPreferences={preferences}
      />
    </>
  );
}
