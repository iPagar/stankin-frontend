import { Panel } from "@vkontakte/vkui";
import Top from "../panels/Top";

const TopView = ({
  id,
  onCancelClick,
}: {
  id: string;
  onCancelClick: () => void;
}) => {
  return (
    <Panel id={id} separator={false}>
      <Top onCancelClick={onCancelClick} />
    </Panel>
  );
};

export default TopView;
