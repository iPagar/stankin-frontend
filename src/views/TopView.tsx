import { Panel } from "@vkontakte/vkui";
import Top from "../panels/Top";
import TopOld from "../panels/Top-old";

const TopView = ({
  id,
  onCancelClick,
}: {
  id: string;
  onCancelClick: () => void;
}) => {
  return (
    <Panel id={id} separator={false}>
      <TopOld onCancelClick={onCancelClick} />
    </Panel>
  );
};

export default TopView;
