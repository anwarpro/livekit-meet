import { EgressClient, EncodedFileOutput, EncodedFileType, RoomCompositeOptions, S3Upload } from 'livekit-server-sdk';
import { template } from 'lodash';
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';


// room composite 
export default async function meetingRecord(req: NextApiRequest, res: NextApiResponse) {
    try {
        const date = moment().format('DD-MM-YYYY')
        const { roomName: roomId } = req.body;
        const egressClient = new EgressClient(process.env.NEXT_PUBLIC_LIVEKIT_URL!, process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!, process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!);

        const fileOutput = new EncodedFileOutput({
            fileType: EncodedFileType.MP4,
            filepath: `livekit-demo/record_${date}_${roomId}.mp4`,
            output: {
                case: 's3',
                value: new S3Upload({
                    accessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
                    secret: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
                    region: process.env.NEXT_PUBLIC_AWS_REGION,
                    bucket: process.env.NEXT_PUBLIC_BUCKET_NAME,
                }),
            },
        });

        // Define room composite options with custom layout
        const roomCompositeOptions: RoomCompositeOptions = {
            layout: JSON.stringify({
                type: 'grid',
                participants: [
                    {
                        width: 1,
                        height: 1,
                        x: 0,
                        y: 0,
                        border: true,
                        displayName: true,
                        name: true,
                        metadata: true,
                        placeholder: {
                            type: "text",
                            text: "No Video", // Placeholder text
                            color: "#000000",
                            backgroundColor: "#f0f0f0"
                        }
                    }
                ],
                backgroundColor: "#ffffff"
            })
        };

        const info = await egressClient.startRoomCompositeEgress(roomId, { file: fileOutput }, {
            layout: 'single-speaker',
        });
        console.log("🚀 ~ meetingRecord ~ info:", info)
        const egressID = info.egressId;
        console.log("🚀 ~ meetingRecord ~ egressID:", egressID)
        res.status(200).json({ success: true });
    } catch (e) {
        console.log("🚀 ~ meetingRecord ~ e:", e)
        res.statusMessage = (e as Error).message;
        res.status(500).end();
    }

}

