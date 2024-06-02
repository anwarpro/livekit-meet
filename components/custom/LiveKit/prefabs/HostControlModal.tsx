import * as React from 'react';
import { ChatCloseIcon } from '../assets/icons';
import { Box, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useRouter } from 'next/router';
import { HostControlToggle } from '../controls/HostControlToggle';
import { useDispatch } from 'react-redux';
import meetService from '../../../../service/meet/meetService';
import { useMaybeRoomContext } from '@livekit/components-react';

export function HostControlModal({ ...props }) {
  const Router = useRouter();
  const dispatch = useDispatch();
  const { name: roomName } = Router.query as { name: string };
  const encoder = new TextEncoder();
  const room = useMaybeRoomContext();

  const [state, setState] = React.useState({
    microphone: false,
    camera: false,
    screenShare: false,
    chat: false,
    handRaise: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    meetService
      .updateControl(roomName, { ...state, [event.target.name]: event.target.checked })
      .then((res) => {
        console.log('🚀 ~ handleChange ~ res:', res?.data);
      }).catch((err) => console.log('err', err));
  };

  React.useEffect(() => {
    // dispatch(setControls(state));
    if (room && room.state === 'connected') {
      const data = encoder.encode(
        JSON.stringify({
          topic: 'hostControl',
          control: state,
        }),
      );

      room.localParticipant.publishData(data, {
        reliable: true,
        topic: 'hostControl',
      });
    }
  }, [room, state, dispatch]);

  React.useEffect(() => {
    meetService
      .getHostControl(roomName)
      .then((res: any) => setState(res?.data?.control))
      .catch((error) => console.log(error));
  }, [roomName]);

  return (
    <div {...props} className="lk-chat participant-modal">
      <div className="lk-chat-header d-flex justify-content-between align-items-center border-bottom border-dark border-2">
        <p className="participant-title m-0">Host Control</p>
        <HostControlToggle className="lk-close-button">
          <ChatCloseIcon />
        </HostControlToggle>
      </div>
      <div className="p-2">
        <p>
          Use these host settings to keep control of your meeting. Only hosts have access to these
          controls.
        </p>
        <Box
          sx={{
            p: 2,
            '.MuiFormControlLabel-root': {
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
            },
          }}
        >
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={state.microphone} onChange={handleChange} />}
              label="Turn of their microphone"
              name="microphone"
            />
            <FormControlLabel
              control={<Switch checked={state.camera} onChange={handleChange} />}
              label="Turn of their video"
              name="camera"
            />
            <FormControlLabel
              control={<Switch checked={state.screenShare} onChange={handleChange} />}
              label="Turn of Share their screen"
              name="screenShare"
            />
            <FormControlLabel
              control={<Switch checked={state.chat} onChange={handleChange} />}
              label="Turn of chat messages"
              name="chat"
            />
            <FormControlLabel
              control={<Switch checked={state.handRaise} onChange={handleChange} />}
              label="Turn of their hand"
              name="handRaise"
            />
          </FormGroup>
        </Box>
      </div>
    </div>
  );
}
