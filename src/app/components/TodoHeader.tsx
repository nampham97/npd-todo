// app/components/TodoHeader.tsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TodoHeaderProps {
  listTitle: string;
  setListTitle: (title: string) => void;
  isClient: boolean;  // Nhận thêm props isClient
}

export default function TodoHeader({ listTitle, setListTitle, isClient }: TodoHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleInput, setEditTitleInput] = useState(listTitle);

  const saveTitle = () => {
    setListTitle(editTitleInput);
    setIsEditingTitle(false);
  };

  const cancelEditTitle = () => {
    setEditTitleInput(listTitle);
    setIsEditingTitle(false);
  };

  return (
    <div className="todo-header">
      {isEditingTitle ? (
        <div className="edit-title">
          <input
            value={editTitleInput}
            onChange={(e) => setEditTitleInput(e.target.value)}
            placeholder="Edit list title"
          />
          <FontAwesomeIcon icon={faCheck} className="save-icon" onClick={saveTitle} />
          <FontAwesomeIcon icon={faTimes} className="cancel-icon" onClick={cancelEditTitle} />
        </div>
      ) : (
        <h1>
          {listTitle}
          {isClient && ( // Kiểm tra isClient để render faEdit
            <FontAwesomeIcon icon={faEdit} className="edit-icon" onClick={() => setIsEditingTitle(true)} />
          )}
        </h1>
      )}
    </div>
  );
}
