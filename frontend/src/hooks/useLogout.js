import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            toast.success("Logged out successfully");
        },
    });

    return { logoutMutation: mutate };
}

export default useLogout