import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Modal } from '@mui/material';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  editMode?: boolean;
  openModal: { edit: boolean };
  closeModal: { status: boolean };
  customStyle?: any;
  handleCloseModal?: VoidFunction;
  disabled?: boolean;
  customModalCss?: any;
  title?: string;
  shouldCloseOnOverlayClick?: boolean;
  noheading?: boolean;
  noCloseIcon?: boolean;
  iconWhite?: boolean;
  customIconColor?: any;
  children: string | JSX.Element | JSX.Element[];
};

function CustomeModal(props: Props) {
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }

  const customStyles = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    outline: 'none',
    borderRadius: 20,
    padding: "25px",
    ...props.customStyle,
  };

  useEffect(() => {
    if (props.openModal && props.openModal.edit) {
      openModal();
    }
  }, [props.openModal]);

  useEffect(() => {
    const status = props.closeModal?.status;
    if (status === false && modalIsOpen) {
      setIsOpen(status);
    }
  }, [props.closeModal]);

  function closeModal() {
    setIsOpen(false);
    if (props.handleCloseModal) {
      props.handleCloseModal();
    }
  }

  return (
    <div className="custom-modal">
      {props.editMode ? (
        <></>
      ) : (
        <Button
          disabled={props?.disabled ?? false}
          type="button"
          onClick={openModal}
          className={`mt-2 btn custom-modal-button ${props.customModalCss || ''}`}
          //   size="md"
        >
          {props.title}
        </Button>
      )}
      <Modal
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={customStyles}>
          <Box
            onClick={(event) => closeModal()}
            sx={{ position: 'absolute', right: 25, top: 25, cursor: 'pointer' }}
          >
            <CloseIcon />
          </Box>
          {props.children}
        </Box>
      </Modal>
    </div>
  );
}

export default CustomeModal;
