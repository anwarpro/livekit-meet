import { useDisconnectButton, useMaybeRoomContext } from '@livekit/components-react';
import { Menu, MenuItem } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import meetService from '../../../../service/meet/meetService';
import CustomConfirmationModal from '../../CustomConfirmationModal';

/** @public */
export interface DisconnectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  stopTracks?: boolean;
}

/**
 * The `DisconnectButton` is a basic html button with the added ability to disconnect from a LiveKit room.
 * Normally this is the big red button that allows end users to leave the video or audio call.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <DisconnectButton>Leave room</DisconnectButton>
 * </LiveKitRoom>
 * ```
 * @public
 */
export const DisconnectButton = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  DisconnectButtonProps
>(function DisconnectButton(props: DisconnectButtonProps, ref) {
  const { buttonProps } = useDisconnectButton(props);
  const user = useSelector((state: any) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");
  const [modalWork, setModalWork] = React.useState("");
  const room = useMaybeRoomContext();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDisconnect = () => {
    meetService
    // @ts-ignore
      .disconnectRoom(room?.roomInfo?.name)
      .then((res: any) => {
        console.log("Room Disconnected");
        setOpenConfirmModal(false);
      })
      .catch((err: any) => {
        console.log(err);
        setOpenConfirmModal(false);
      });
  };
  const open = Boolean(anchorEl);
  return (
    <>
      {user?.userData?.role === 'admin' ? (
        <>
          <button onClick={(e) => handleClick(e)} className="lk-disconnect-button">
            {props.children}
          </button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            sx={{ zIndex: 1500 }}
          >
            <MenuItem
              value={'leave'}
              onClick={buttonProps.onClick}
            >
              Leave only for you
            </MenuItem>
            <MenuItem value={'disconnect'} onClick={() => {
              setOpenConfirmModal(true);
              setModalMessage("Are you sure you want to disconnect this room? This will remove all participants and end the meeting!");
              setModalWork("Disconnect Room");
              handleClose();
            }}>
              End meeting and leave
            </MenuItem>
          </Menu>
        </>
      ) : (
        <button ref={ref} {...buttonProps}>
          {props.children}
        </button>
      )}
      <CustomConfirmationModal open={openConfirmModal} setOpen={setOpenConfirmModal} message={modalMessage} work={modalWork} confirmClicked={() => handleDisconnect()} />
    </>
  );
});
