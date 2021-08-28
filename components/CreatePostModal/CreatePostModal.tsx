import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../../context";
import { CreatePostForm } from "../CreatePostForm";
import { NextLink } from "../NextLink";

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postParentUuid?: string;
  isReply?: boolean;
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  postParentUuid,
  isReply,
}: CreatePostModalProps) => {
  const { user } = useAuth();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isReply ? "New Reply" : "New Post"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {user ? (
            <CreatePostForm
              onSuccess={onClose}
              postParentUuid={postParentUuid}
            />
          ) : (
            <Text as="span">
              Please <NextLink href="/signin">sign in</NextLink> to{" "}
              {isReply ? "reply" : "post"}.
            </Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
