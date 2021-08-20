import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Stack,
  StackProps,
  Textarea,
  useToast,
  Progress,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

import { useAuth } from "../../context";
import { supabase } from "../../supabaseApi";

export interface ICreatePostFormInput {
  post: string;
}

const createPostFormSchema = yup.object().shape({
  post: yup.string().min(1).max(500).required(),
});

export interface CreatePostFormProps extends StackProps {
  postParentUuid?: string;
  onSuccess?: () => void;
}

export const CreatePostForm = ({
  postParentUuid,
  onSuccess = () => {},
  ...props
}: CreatePostFormProps) => {
  const { user } = useAuth();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ICreatePostFormInput>({
    resolver: yupResolver(createPostFormSchema),
  });
  const watchPostContent = watch("post", "");

  async function onSubmit(data) {
    const { post } = data;

    const { error } = await supabase.from("posts").insert({
      user_uuid: user.id,
      content: post,
      parent_uuid: postParentUuid,
    });

    if (error) {
      toast({
        isClosable: true,
        position: "top-right",
        title: `Error creating post`,
        description: error.message,
        status: "error",
      });
    } else {
      setValue("post", "");
      onSuccess();
    }
  }

  return (
    <Stack as="form" {...props} onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="post" isInvalid={!!errors.post}>
        <Textarea
          placeholder="Post something!"
          maxLength={500}
          maxH="xs"
          disabled={isSubmitting}
          {...register("post")}
        />
        <Progress
          value={watchPostContent ? watchPostContent.length / 5 : 0}
          size="xs"
          colorScheme="brand"
          mt="2"
        />
        <FormErrorMessage>
          {errors.post && errors.post.message}
        </FormErrorMessage>
      </FormControl>
      <Flex align="center" justifyContent="flex-end">
        <Button
          type="submit"
          colorScheme="brand"
          size="sm"
          isLoading={isSubmitting}
          isDisabled={!watchPostContent}
        >
          Send
        </Button>
      </Flex>
    </Stack>
  );
};
