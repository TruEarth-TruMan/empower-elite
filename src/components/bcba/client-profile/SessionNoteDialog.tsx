import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format, addHours } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from "@/hooks/useAuth";
import { BillingCode, BillingModifier } from '@/types/billing';
import { getBillingCodesByRole, getModifiersByRole, calculateUnitsFromDuration, getBillingUnitDisplay } from '@/utils/billing/billingCodes';
import { UserRole as BillingUserRole } from '@/types/billing';

interface SessionNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (sessionData: any) => void;
  initialData?: any;
  clientId: string;
  clientName: string;
}

export function SessionNoteDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  clientId, 
  clientName 
}: SessionNoteDialogProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('note');
  const [confirmClose, setConfirmClose] = useState(false);
  
  // Session state
  const [sessionDate, setSessionDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(addHours(new Date(), 1));
  const [location, setLocation] = useState('clinic');
  const [sessionNotes, setSessionNotes] = useState('');
  const [goalsAddressed, setGoalsAddressed] = useState<string[]>([]);
  const [inSecureLocation, setInSecureLocation] = useState(true);
  
  // Billing state
  const [billingCodes, setBillingCodes] = useState<BillingCode[]>([]);
  const [modifiers, setModifiers] = useState<BillingModifier[]>([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [units, setUnits] = useState(0);
  const [rate, setRate] = useState('');
  
  useEffect(() => {
    if (!user) return;
    
    // Convert user.role to a BillingUserRole type
    const userRole = user.role as BillingUserRole;
    const codes = getBillingCodesByRole(userRole);
    setBillingCodes(codes);
    
    const availableModifiers = getModifiersByRole(userRole);
    setModifiers(availableModifiers);
  }, [user]);

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setSessionDate(new Date(initialData.date));
      setStartTime(new Date(initialData.startTime));
      setEndTime(new Date(initialData.endTime));
      setLocation(initialData.location);
      setSessionNotes(initialData.notes);
      setGoalsAddressed(initialData.goalsAddressed || []);
      setInSecureLocation(initialData.inSecureLocation !== false);
      
      // Set billing data if available
      if (initialData.billing) {
        setSelectedCode(initialData.billing.codeId);
        setSelectedModifiers(initialData.billing.modifiers || []);
        setUnits(initialData.billing.units);
        setRate(initialData.billing.rate ? initialData.billing.rate.toString() : '');
      }
    }
  }, [initialData]);

  // Update units when code or duration changes
  useEffect(() => {
    if (!selectedCode) return;
    
    const code = billingCodes.find(c => c.id === selectedCode);
    if (!code) return;
    
    const sessionDuration = calculateSessionDuration();
    if (sessionDuration > 0) {
      const calculatedUnits = calculateUnitsFromDuration(code.billingUnit, sessionDuration);
      setUnits(calculatedUnits);
    }
  }, [selectedCode, startTime, endTime, billingCodes]);

  const calculateSessionDuration = () => {
    if (!startTime || !endTime) return 0;
    const durationMs = endTime.getTime() - startTime.getTime();
    return Math.round(durationMs / (1000 * 60)); // Duration in minutes
  };

  const handleSave = () => {
    // Basic validation
    if (!sessionDate || !startTime || !endTime || !sessionNotes) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Create session data object
    const sessionData = {
      clientId,
      clientName,
      date: format(sessionDate, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm'),
      endTime: format(endTime, 'HH:mm'),
      duration: calculateSessionDuration(),
      location,
      notes: sessionNotes,
      goalsAddressed,
      inSecureLocation,
      billing: selectedCode ? {
        codeId: selectedCode,
        modifiers: selectedModifiers,
        units,
        rate: rate ? parseFloat(rate) : undefined
      } : undefined
    };

    onSave?.(sessionData);
    onClose();
  };

  const handleCloseAttempt = () => {
    // If there are unsaved changes, show confirm dialog
    if (sessionNotes || selectedCode) {
      setConfirmClose(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Edit Session Note' : 'New Session Note'}
            </DialogTitle>
            <DialogDescription>
              {clientName} - {format(sessionDate, 'PP')}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="note">Session Note</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="note" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Session Date</Label>
                  <DatePicker 
                    id="date"
                    selected={sessionDate} 
                    onSelect={setSessionDate}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="telehealth">Telehealth</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <TimePicker 
                    id="start-time" 
                    className="w-full"
                    date={startTime}
                    setDate={setStartTime}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <TimePicker 
                    id="end-time" 
                    className="w-full"
                    date={endTime}
                    setDate={setEndTime}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="session-notes">Session Notes</Label>
                  <span className="text-xs text-muted-foreground">
                    Duration: {calculateSessionDuration()} minutes
                  </span>
                </div>
                <Textarea 
                  id="session-notes"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Enter detailed notes about the session..."
                  className="min-h-[150px]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="secure-location"
                  checked={inSecureLocation}
                  onCheckedChange={(checked) => setInSecureLocation(!!checked)}
                />
                <Label htmlFor="secure-location">
                  I confirm this note was written in a secure location
                </Label>
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="billing-code">Billing Code</Label>
                <Select value={selectedCode} onValueChange={setSelectedCode}>
                  <SelectTrigger id="billing-code">
                    <SelectValue placeholder="Select billing code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {billingCodes.map(code => (
                      <SelectItem key={code.id} value={code.id}>
                        {code.code} - {code.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCode && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="units">Units</Label>
                      <Input
                        id="units"
                        type="number"
                        min="0"
                        step="1"
                        value={units}
                        onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rate">Rate (Optional)</Label>
                      <Input
                        id="rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder="Leave blank for default rate"
                      />
                    </div>
                  </div>
                  
                  {modifiers.length > 0 && (
                    <div className="space-y-2">
                      <Label>Modifiers</Label>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-2">
                            {modifiers.map(modifier => (
                              <div key={modifier.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`modifier-${modifier.id}`}
                                  checked={selectedModifiers.includes(modifier.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedModifiers([...selectedModifiers, modifier.id]);
                                    } else {
                                      setSelectedModifiers(selectedModifiers.filter(id => id !== modifier.id));
                                    }
                                  }}
                                />
                                <Label htmlFor={`modifier-${modifier.id}`} className="text-sm">
                                  {modifier.code} - {modifier.description}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAttempt}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {initialData ? 'Update' : 'Save'} Session Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without saving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={onClose}>Discard Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
