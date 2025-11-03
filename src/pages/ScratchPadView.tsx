import { useEffect, useState, useCallback, useRef } from "react";
import { Scratchpad, Scratch } from "../types/scratchpad";
import RichTextEditor from "../components/editor/texteditor";
import './ScratchPad.css';
import { debounce } from "../utils";
import { FirebaseScratchPadService } from "../data/FirebaseScratchPadService";
import { useAuth } from "../authentication/AuthContext";

export const ScratchPadView: React.FC = () => {
  const [scratchpad, setScratchpad] = useState<Scratchpad | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const scratchPadService = useRef<FirebaseScratchPadService>(new FirebaseScratchPadService());
  const isInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Guard check before async function
    if (!user || isInitialized.current) {
      setLoading(false);
      return;
    }

    const initializeScratchpad = async () => {
      try {
        const data = await scratchPadService.current!.getScratchpad(user.uid);
        if (isMounted) {
          setScratchpad(data);
          isInitialized.current = true;
        } 
      } catch (error) {
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeScratchpad();

    return () => {
      isMounted = false;
      if (!isInitialized.current) {  // Reset if initialization didn't complete
        isInitialized.current = false;
      }
    };
  }, [user]); // Only depend on user changes

  const debouncedSave = useCallback(
    debounce(async (updatedScratchpad: Scratchpad) => {
      if (user) {
        try {
          await scratchPadService.current!.saveScratchpad(updatedScratchpad);
        } catch (error) {
          console.error('Failed to save scratchpad:', error);
        }
      }
    }, 5000),
    [user]
  );

  const handleAddScratch = () => {
    if (scratchpad) {
      const newScratch: Scratch = {
        id: scratchpad.nextId,
        content: '',
        createdAt: new Date()
      };
      
      setScratchpad({
        ...scratchpad,
        scratches: [...scratchpad.scratches, newScratch],
        nextId: scratchpad.nextId + 1
      });
    }
  };

  const handleDeleteScratch = (id: number) => {
    if (scratchpad) {
      setScratchpad({
        ...scratchpad,
        scratches: scratchpad.scratches.filter(scratch => scratch.id !== id)
      });
    }
  };

  const handleUpdateContent = (id: number, content: string) => {
    if (scratchpad) {
      const updatedScratchpad = {
        ...scratchpad,
        scratches: scratchpad.scratches.map(scratch =>
          scratch.id === id ? { ...scratch, content } : scratch
        )
      };
      
      // Update state
      setScratchpad(updatedScratchpad);
      
      // Trigger debounced auto-save
      debouncedSave(updatedScratchpad);
    }
  };

  if (loading) {
    return <div className="scratchpad-view">
      <div className="loading-state">Loading your scratchpad...</div>
    </div>;
  }

  return (
    <div className="scratchpad-view">
      <div className="scratchpad-header">
        <div>
          <h1>Scratchpad</h1>
          <p className="description">
            Got any stray ideas? Jot them down here and save them for later.
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => handleAddScratch()} className="default-button">
            Add New Idea
          </button>
        </div>
      </div>

      {scratchpad ? (
        <div className="scratches-grid">
          {scratchpad.scratches.map((scratch) => (
            <div key={scratch.id} className="scratch-card">
              <div className="scratch-header">
                <span className="scratch-date">
                  {new Date(scratch.createdAt).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => handleDeleteScratch(scratch.id)}
                  className="delete-scratch-button"
                >
                  Delete
                </button>
              </div>
              <RichTextEditor
                content={scratch.content}
                onChange={(content) => handleUpdateContent(scratch.id, content)}
                className="scratch-editor"
                placeholder="Write your ideas here..."
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">No scratches found.</div>
      )}
    </div>
  );
};