import { NextApiRequest, NextApiResponse } from 'next';
// Import LiveKit server SDK
import { RoomServiceClient, ParticipantInfo } from 'livekit-server-sdk';
import cors from '../../lib/cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await cors(req, res);
    try {
        // Initialize the RoomServiceClient with your LiveKit API details
        const roomService = new RoomServiceClient(
            process.env.NEXT_PUBLIC_LIVEKIT_URL!,
            process.env.NEXT_PUBLIC_LIVEKIT_API_KEY!,
            process.env.NEXT_PUBLIC_LIVEKIT_API_SECRET!
        );

        // Replace 'your-room-name' with the actual room name
        const participants: ParticipantInfo[] = await roomService.listParticipants('66608a56d3d347fe2bbcda45');
        console.log("🚀 ~ handler ~ participants:", participants)

        // Format participants data to fit your frontend requirements
        const formattedParticipants = participants.map(participant => ({
            name: participant.name,
            // isScreenShare: participant.isScreenShare,
            displayName: true, // Add more details if needed
            placeholder: {
                metadata: participant.metadata,
                text: participant.identity,
                color: '#fff',
                backgroundColor: '#333',
            },
            stream: null, // You might need to handle streams differently
        }));

        res.status(200).json({ participants: formattedParticipants });
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ error: 'Failed to fetch participants' });
    }
}
