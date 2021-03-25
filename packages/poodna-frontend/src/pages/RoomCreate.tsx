import { useHistory } from "react-router-dom";
import { useAppContext } from "../App";

export const RoomCreate = () => {
  const app = useAppContext();
  const history = useHistory();
  return (
    <>
      <div>
        {app.userId}
        <button
          onClick={async () => {
            const roomId = await app.gun?.createRoom();
            history.push(`/room/${roomId}`);
          }}
        >
          สร้างห้อง
        </button>
      </div>
    </>
  );
};
