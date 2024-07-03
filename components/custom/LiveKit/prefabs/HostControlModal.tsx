import * as React from 'react';
import { ChatCloseIcon } from '../assets/icons';
import { Box, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { useRouter } from 'next/router';
import { HostControlToggle } from '../controls/HostControlToggle';
import { useDispatch } from 'react-redux';
import meetService from '../../../../service/meet/meetService';
import { useMaybeRoomContext, useParticipants } from '@livekit/components-react';
import { useSelector } from 'react-redux';
import CustomToastAlert from '../../CustomToastAlert';
import CustomConfirmationModal from '../../CustomConfirmationModal';

export function HostControlModal({ ...props }) {
  const Router = useRouter();
  const dispatch = useDispatch();
  const { name: roomName } = Router.query as { name: string };
  const participants = useParticipants();
  const encoder = new TextEncoder();
  const room = useMaybeRoomContext();
  const { userData } = useSelector((state: any) => state.auth);
  const [success, setSuccess] = React.useState(false);
  const [fail, setIsFail] = React.useState(false);
  const [disableRecordBtn, setDisableRecordBtn] = React.useState(false);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);

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
      })
      .catch((err) => console.log('err', err));

    //mute all participant
    if (event.target.name === 'microphone') {
      const state = { [event.target.name]: event.target.checked };
      if (state && state.microphone) {
        const filteredParticipant = (participants || [])
          .map((pr) => pr.identity)
          .filter((identity) => identity !== userData.email);

        meetService
          .muteParticipant(room?.name || '', filteredParticipant)
          .then((res: any) => {
            console.log('🚀 ~ .then ~ res:', res);
          })
          .catch((err: any) => {
            console.log('🚀 ~ handleChange ~ err:', err);
          });
      }
    }

    // if (event.target.name === 'camera') {
    //   const state = { [event.target.name]: event.target.checked };
    //   if (state && state.camera) {
    //     console.log('true camera ');

    //     const filteredParticipant = (participants || [])
    //       .map((pr) => pr.identity)
    //       .filter((identity) => identity !== userData.email);

    //     if (room) {
    //       const videoTrack = participants.forEach((publication) => {
    //         const vTrack = publication.getTrackPublication(Track.Source.Camera);
    //         console.log('🚀 ~ videoTrack ~ vTrack:', vTrack);
    //         if (vTrack) {
    //           vTrack.setEnabled(false);
    //         }
    //       });
    //       console.log('🚀 ~ videoTrack ~ videoTrack:', videoTrack);
    //     }
    //   }
    // }
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

  const handleRecordingSession = async () => {
    setSuccess(false);
    setIsFail(false);
    meetService
      .meetingRecording({ roomId: roomName, hostId: userData?._id })
      .then((res) => {
        setDisableRecordBtn(true);
        setSuccess(true);
      })
      .catch((error) => {
        setIsFail(true);
        setDisableRecordBtn(false);
        console.log('error', error);
      });
  };

  const handleStopRecording = () => {
    meetService
      .meetingRecordingStop({ roomId: roomName })
      .then((res) => {
        setDisableRecordBtn(false);
        setOpenConfirmModal(false);
      })
      .catch((error) => {
        console.log('error', error);
        setOpenConfirmModal(false);
      });
  };

  React.useEffect(() => {
    meetService
      .recordingStatus()
      .then((res: any) => {
        const egressLists = res?.data?.egressList;
        const roomEgress = egressLists.find((egress: any) => egress.roomName === roomName);
        if (roomEgress && roomEgress.status === 0) {
          setDisableRecordBtn(true);
        } else {
          setDisableRecordBtn(false);
        }
      })
      .catch((err) => {
        setDisableRecordBtn(false);
        console.log(err);
      });
  }, [roomName]);

  const confirmClicked = () => {
    handleStopRecording();
  };

  return (
    <>
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
                label="Turn off their microphone"
                name="microphone"
              />
              <FormControlLabel
                control={<Switch checked={state.camera} onChange={handleChange} />}
                label="Turn off their video"
                name="camera"
              />
              <FormControlLabel
                control={<Switch checked={state.screenShare} onChange={handleChange} />}
                label="Turn off Share their screen"
                name="screenShare"
              />
              <FormControlLabel
                control={<Switch checked={state.chat} onChange={handleChange} />}
                label="Turn off chat messages"
                name="chat"
              />
              <FormControlLabel
                control={<Switch checked={state.handRaise} onChange={handleChange} />}
                label="Turn off their hand"
                name="handRaise"
              />
            </FormGroup>
          </Box>

          <div className="p-2">
            <p>##Recording Session</p>
            {disableRecordBtn ? (
              <button
                // disabled={disableRecordBtn}
                onClick={() => {
                  setOpenConfirmModal(true);
                }}
                className=" btn btn-primary"
              >
                Stop Recording
              </button>
            ) : (
              <button
                // disabled={disableRecordBtn}
                onClick={() => handleRecordingSession()}
                className=" btn btn-primary"
              >
                Start Recording
              </button>
            )}
          </div>
        </div>
      </div>

      {success && (
        <CustomToastAlert
          open={success}
          setOpen={setSuccess}
          duration={2000}
          status={'info'}
          message="Session recording starting"
          vertical="top"
        />
      )}
      {fail && (
        <CustomToastAlert
          open={fail}
          setOpen={setIsFail}
          duration={2000}
          status={'danger'}
          message="failed to start recording"
          vertical="top"
        />
      )}

      <CustomConfirmationModal
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        message="Are You Sure Want To Stop Recording ?"
        work="stop recording"
        confirmClicked={confirmClicked}
      />
    </>
  );
}
