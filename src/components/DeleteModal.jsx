// src/components/DeleteModal.jsx
const DeleteModal = ({ isOpen, onClose, onConfirm, customer }) => {
  if (!isOpen) return null

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete {customer?.companyName}? This action cannot be undone.</p>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="button_secondary">Cancel</button>
          <button 
            type="button" 
            onClick={onConfirm}
            className="button_primary bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal