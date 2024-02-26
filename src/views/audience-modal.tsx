import {
  Button,
  Group,
  InfoRow,
  ModalPage,
  ModalPageHeader,
  ModalRoot,
  SimpleCell,
} from "@vkontakte/vkui";
import { useAppSelector } from "../api/store";
import { Audience } from "../panels/audience";

export function AudienceModal({
  onClose,
  activeModal,
}: {
  activeModal: string | null;
  onClose?: () => void;
}) {
  const audience = useAppSelector((state) => state.schedule.selectedAudience);

  if (!audience) {
    return (
      <ModalRoot
        activeModal={activeModal}
        onClose={() => {
          onClose && onClose();
        }}
      >
        <ModalPage id="audience">Аудитория не найдена</ModalPage>
      </ModalRoot>
    );
  }

  return (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => {
        onClose && onClose();
      }}
    >
      <ModalPage
        id="audience"
        header={<ModalPageHeader>{audience}</ModalPageHeader>}
        dynamicContentHeight
      >
        <Audience name={audience} />
      </ModalPage>
    </ModalRoot>
  );
}
