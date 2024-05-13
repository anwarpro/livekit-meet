import { useDisconnectButton, useMaybeRoomContext } from '@livekit/components-react';
import { Menu, MenuItem } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import meetService from '../../../../service/meet/meetService';

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
        console.log(res?.data);
      })
      .catch((err: any) => {
        console.log(err);
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
            <MenuItem value={'disconnect'} onClick={() => handleDisconnect()}>
              End meeting and leave
            </MenuItem>
          </Menu>
        </>
      ) : (
        <button ref={ref} {...buttonProps}>
          {props.children}
        </button>
      )}
    </>
  );
});
