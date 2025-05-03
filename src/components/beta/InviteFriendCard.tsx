import React, { useState } from 'react';
import { Users, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { generateBetaInvite } from '@/utils/betaStorage';

interface InviteFriendCardProps {
  compact?: boolean;
}

const InviteFriendCard = ({ compact = false }: InviteFriendCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [copied, setCopied] = useState(false);
  
  const generateInvite = async () => {
    if (!user) return;
    
    try {
      const invite = await generateBetaInvite(user.email, friendEmail || undefined);
      setGeneratedCode(invite.code);
      
      toast({
        title: "Invite code generated",
        description: `Share this code with your friend: ${invite.code}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invite code",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const inviteLink = `${window.location.origin}/join-beta?code=${generatedCode}`;
  
  if (compact) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-forest-50 pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Invite to Beta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground mb-2">
            Share Empower + Elite with friends and colleagues
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowInviteDialog(true)}
          >
            Generate Invite
          </Button>
          
          {renderInviteDialog()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Invite a Friend to the Beta
        </CardTitle>
        <CardDescription>
          Share Empower + Elite with friends and colleagues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Generate a unique invite code that your friend can use to join our private beta program.
        </p>
        <Button 
          onClick={() => setShowInviteDialog(true)}
          className="w-full"
        >
          Generate Invite Code
        </Button>
        
        {renderInviteDialog()}
      </CardContent>
    </Card>
  );
  
  function renderInviteDialog() {
    return (
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a Friend</DialogTitle>
            <DialogDescription>
              Generate a unique code for your friend to join the Empower + Elite beta.
            </DialogDescription>
          </DialogHeader>
          
          {!generatedCode ? (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="friend-email">Friend's Email (Optional)</Label>
                <Input
                  id="friend-email"
                  placeholder="Their email address"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Including their email will help us track the invitation
                </p>
              </div>
              
              <Button onClick={generateInvite} className="w-full">
                Generate Invite Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-code">Invite Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="invite-code"
                    readOnly
                    value={generatedCode}
                    className="font-mono"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyToClipboard}
                    title="Copy code"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invite-link">Invite Link</Label>
                <div className="flex space-x-2">
                  <Input
                    id="invite-link"
                    readOnly
                    value={inviteLink}
                    className="text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink);
                      toast({
                        title: "Link copied",
                        description: "Invite link copied to clipboard",
                      });
                    }}
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  This code will remain active until it's used by someone.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowInviteDialog(false);
                setGeneratedCode('');
                setFriendEmail('');
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
};

export default InviteFriendCard;
