import React from "react";
import Button from "../button/Button";
import "./DecisionModal.css"

const Modal = ({ question="", isOpen, onClose, onSave }) => {
    if (!isOpen) return null;
  
 
  return (
    <div className="decisionmodal-overlay">
      <div className="decisionmodal-container">
        <h2 className="decisionmodal-title">{question}</h2>

        <div className="decisionmodal-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              onSave();
              onClose();
            }}
          >
            Sí
          </button>
          <button className="btn" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
