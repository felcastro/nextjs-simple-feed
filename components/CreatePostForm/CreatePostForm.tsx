import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Stack,
  StackProps,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ColorResult } from "react-color";
import { useForm } from "react-hook-form";
import { FaFillDrip, FaFont } from "react-icons/fa";

import { useAuth } from "../../context";
import { supabase } from "../../supabaseApi";
import { ColorPickerButton } from "../ColorPickerButton";

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
  const [backgroundColor, setBackgroundColor] = useState<string>();
  const [fontColor, setFontColor] = useState<string>();
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

  function handleBackgroundColorChange(color: ColorResult) {
    setBackgroundColor(color.hex);
  }

  function handleFontColorChange(color: ColorResult) {
    setFontColor(color.hex);
  }

  async function onSubmit(data) {
    const { post } = data;

    const { error } = await supabase.from("posts").insert({
      user_uuid: user.id,
      content: post,
      font_color: fontColor,
      background_color: backgroundColor,
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
          bg={backgroundColor ? backgroundColor : "inherit"}
          color={fontColor ? fontColor : "inherit"}
          borderColor={fontColor ? fontColor : "inherit"}
          disabled={isSubmitting}
          {...register("post")}
        />
        <FormHelperText>
          {watchPostContent ? 500 - watchPostContent.length : 500} characters
          left
        </FormHelperText>
        <FormErrorMessage>
          {errors.post && errors.post.message}
        </FormErrorMessage>
      </FormControl>
      <Flex align="center">
        <HStack flex={1}>
          <ColorPickerButton
            icon={<FaFillDrip />}
            aria-label="Select background color"
            color={backgroundColor}
            onColorChange={handleBackgroundColorChange}
            isLoading={isSubmitting}
          />
          <ColorPickerButton
            icon={<FaFont />}
            aria-label="Select font color"
            color={fontColor}
            onColorChange={handleFontColorChange}
            isLoading={isSubmitting}
          />
        </HStack>
        <Button
          type="submit"
          colorScheme="brand"
          size="sm"
          isLoading={isSubmitting}
        >
          Send
        </Button>
      </Flex>
    </Stack>
  );
};
