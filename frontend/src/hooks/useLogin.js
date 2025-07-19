// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { login } from "../lib/api";
// import { useAuthStore } from "../store/useAuthStore";

// const { checkAuth } = useAuthStore;

// const useLogin = (data) => {
// const loginFn = login(data);
// const queryClient = useQueryClient();
// const { mutate, isPending, error, isSuccess } = useMutation({
//   mutationFn: login,
//   onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
// });
// if (isSuccess) {
//   checkAuth();
// }
// return { error, isPending, loginMutation: mutate };
// };

// export default useLogin;
