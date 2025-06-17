import { useState, useEffect } from "react";
import { getMyFriends, getOutgoingFriendRequests, getRecommendedUsers, sendFriendRequest } from "../lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { UserIcon } from "lucide-react";

const HomePage = () => {
  const queryClient = useQueryClient()
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set())

  const {data: myFriends, isLoading: loadingMyFriends} = useQuery({
    queryKey: ["myFriends"],
    queryFn: getMyFriends
  })

  const {data: recommendedUsers, isLoading: loadingRecommendedUsers} = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers
  })

  const {data: outgoingFriendRequests} = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests
  })

  const {mutate: sendRequestMutation, isPending} = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries(["outgoingFriendRequests"]),
  })

  useEffect(() => {
    const outGoingIds = new Set()
    
    if (outgoingFriendRequests && outgoingFriendRequests.length > 0) {
      outgoingFriendRequests.forEach(request => {
        outGoingIds.add(request.id)
      })
    }
  }, [outgoingFriendRequests])

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UserIcon className="size-4 ms-2" />
            Friend Requests
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage