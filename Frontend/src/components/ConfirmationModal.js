import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./ConfirmationModal.css"; // Import the CSS file for styles

export default function ConfirmationModal({
  show,
  onClose,
  onConfirm,
  message = "Are you sure?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel"
}) {
  return (
    <>
      <div className={`blur-background ${show ? "active" : ""}`}></div>
      <Modal show={show} onHide={onClose} centered backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="warning-text">{message}</p>
          <p className="mt-3">This action cannot be undone. Deleting a task will permanently remove it.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
