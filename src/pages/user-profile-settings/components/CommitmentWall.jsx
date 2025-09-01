import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommitmentWall = ({ commitments, onAddCommitment }) => {
  const [isAddingCommitment, setIsAddingCommitment] = useState(false);
  const [newCommitment, setNewCommitment] = useState('');

  const handleAddCommitment = () => {
    if (newCommitment?.trim()) {
      onAddCommitment({
        id: Date.now(),
        text: newCommitment,
        date: new Date()?.toLocaleDateString(),
        likes: 0,
        comments: 0,
        isPublic: true
      });
      setNewCommitment('');
      setIsAddingCommitment(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Public Commitment Wall
        </h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
          onClick={() => setIsAddingCommitment(true)}
        >
          Add Commitment
        </Button>
      </div>
      {/* Add New Commitment */}
      {isAddingCommitment && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium text-foreground mb-3">
            Make a Public Commitment
          </h3>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="I commit to..."
              value={newCommitment}
              onChange={(e) => setNewCommitment(e?.target?.value)}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleAddCommitment}
                disabled={!newCommitment?.trim()}
              >
                Post Commitment
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAddingCommitment(false);
                  setNewCommitment('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Commitments List */}
      <div className="space-y-4">
        {commitments?.length > 0 ? (
          commitments?.map((commitment, index) => (
            <div
              key={commitment?.id}
              className="border border-border rounded-lg p-4 hover:shadow-warm transition-smooth"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Target" size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground mb-2 font-medium">
                    "{commitment?.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Posted on {commitment?.date}
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-smooth">
                        <Icon name="Heart" size={14} />
                        {commitment?.likes}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-smooth">
                        <Icon name="MessageCircle" size={14} />
                        {commitment?.comments}
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-smooth">
                        <Icon name="Share2" size={14} />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Target" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="font-heading font-medium text-foreground mb-2">
              No Public Commitments Yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Make your first public commitment to increase accountability and inspire others.
            </p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              onClick={() => setIsAddingCommitment(true)}
            >
              Make Your First Commitment
            </Button>
          </div>
        )}
      </div>
      {/* Engagement Stats */}
      {commitments?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-medium text-foreground mb-3">Engagement Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-foreground mb-1">
                {commitments?.reduce((sum, c) => sum + c?.likes, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Likes</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-foreground mb-1">
                {commitments?.reduce((sum, c) => sum + c?.comments, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Comments</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-foreground mb-1">
                {commitments?.length}
              </div>
              <div className="text-xs text-muted-foreground">Commitments Made</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitmentWall;