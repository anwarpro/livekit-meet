import * as React from 'react';
import { ChatCloseIcon } from '../assets/icons';
import { Box, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { HostControlToggle } from '../controls/HostControlToggle';
import { setControls } from '../../../../lib/Slicers/hostControllSlicer';
import { useDispatch } from 'react-redux';
import meetService from '../../../../service/meet/meetService';
import { useMaybeRoomContext } from '@livekit/components-react';
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from 'livekit-client';

export function HostControlModal({ ...props }) {
  const Router = useRouter();
  const dispatch = useDispatch();
  const { name: roomName } = Router.query as { name: string };
  const { control } = useSelector((state: any) => state.hostControl);
  // console.log("🚀 ~ HostControlModal ~ control:", control)
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const room = useMaybeRoomContext();

  const [state, setState] = React.useState({
    microphone: false,
    camera: false,
    screenShare: false,
    chat: false,
    handRaise: false,
  });
  // console.log('🚀 ~ HostControlModal ~ state:', state);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    
    dispatch(
      setControls({
        ...control,
        [event.target.name]: event.target.checked,
      }),
    );

    // meetService
    //   .updateControl(roomName, { [event.target.name]: event.target.checked })
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  };

  React.useEffect(() => {
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
  }, [room, encoder, state]);

  // room &&
  //   room.on(
  //     RoomEvent.DataReceived,
  //     (
  //       payload: Uint8Array,
  //       participant?: RemoteParticipant,
  //       kind?: DataPacket_Kind,
  //       topic?: string,
  //     ) => {
  //       if (topic === 'hostControl') {
  //         console.log('payload==>', payload);
  //         const eachHandRaisedInfo = decoder.decode(payload);
  //         console.log("payload==>", eachHandRaisedInfo)
  //         let parsedHandRaisedInfo = JSON.parse(eachHandRaisedInfo);
  //         console.log("payload==>", parsedHandRaisedInfo)
  //       }
  //     },
  //   );
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
              control={<Switch checked={control.microphone} onChange={handleChange} />}
              label="Turn of their microphone"
              name="microphone"
            />
            <FormControlLabel
              control={<Switch checked={control.camera} onChange={handleChange} />}
              label="Turn of their video"
              name="camera"
            />
            <FormControlLabel
              control={<Switch checked={control.screenShare} onChange={handleChange} />}
              label="Turn of Share their screen"
              name="screenShare"
            />
            <FormControlLabel
              control={<Switch checked={control.chat} onChange={handleChange} />}
              label="Turn of chat messages"
              name="chat"
            />
            <FormControlLabel
              control={<Switch checked={control.handRaise} onChange={handleChange} />}
              label="Turn of their hand"
              name="handRaise"
            />
          </FormGroup>
        </Box>
      </div>
    </div>
  );
}
