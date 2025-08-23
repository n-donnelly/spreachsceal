import { useEffect, useState, useCallback } from "react";
import { Scratchpad, Scratch } from "../types/scratchpad";
import RichTextEditor from "../components/editor/texteditor";
import './ScratchPad.css';
import { debounce } from "../utils";
import { FirebaseScratchPadService } from "../data/FirebaseScratchPadService";
import { useAuth } from "../authentication/AuthContext";

export const ScratchPadView: React.FC = () => {
  const [scratchpad, setScratchpad] = useState<Scratchpad | null>(null);
  const [loading, setLoading] = useState(true);
  const scratchPadService = new FirebaseScratchPadService();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchScratchpad = async () => {
      setLoading(true);
      const data = await scratchPadService.getScratchpad(user.uid);
      setScratchpad(data);
      setLoading(false);
    };

    fetchScratchpad();
  }, []);

  // Create a debounced save function
  const debouncedSave = useCallback(
    debounce(async (updatedScratchpad: Scratchpad) => {
      await scratchPadService.saveScratchpad(updatedScratchpad);
    }, 1000),
    []
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
    return <div>Loading...</div>;
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
          <button onClick={handleAddScratch} className="add-scratch-button">
            Add New Note
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