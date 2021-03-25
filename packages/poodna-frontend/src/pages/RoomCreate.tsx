import { useHistory } from "react-router-dom";
import { Button } from "poodna-design-system";
import { useAppContext } from "../App";

export const RoomCreate = () => {
  const app = useAppContext();
  const history = useHistory();
  return (
    <>
      <div>
        {app.userId}
        <Button
          onClick={async () => {
            const roomId = await app.gun?.createRoom();
            history.push(`/room/${roomId}`);
          }}
        >
          สร้างห้อง
        </Button>
      </div>
    </>
  );
};
