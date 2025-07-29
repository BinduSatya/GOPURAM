import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("User Created Successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      console.log("on success");
    },
    onError: (e) => {
      toast.error(e.response.data.message);
    },
  });

  return { isPending, error, signupMutation: mutate, isSuccess };
};
export default useSignUp;
