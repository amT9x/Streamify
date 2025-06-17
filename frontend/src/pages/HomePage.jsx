import { useState, useEffect } from "react";
import { getMyFriends, getOutgoingFriendRequests, getRecommendedUsers, sendFriendRequest } from "../lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { MapPinIcon, UserIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

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
      setOutgoingRequestsIds(outGoingIds)
    } else {
      //console.log("No outgoing friend requests found")
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

        {loadingMyFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : myFriends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myFriends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Users */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet new learners</h2>
                <p className="opacity-70">
                  Discover new friends to practice languages with.
                </p>
              </div>
            </div>
          </div>

          {loadingRecommendedUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new users to connect with!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBentSent = outgoingRequestsIds.has(user._id); // Check if request has been sent
                return (
                  <div
                    key={user._id} 
                    className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-200">
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="avatar size-12 rounded-full">
                          <img src={user.profilePicture} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              )})}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage