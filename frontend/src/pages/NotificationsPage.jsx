import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { acceptFriendRequest, getFriendRequests } from "../lib/api"

const NotificationsPage = () => {

  const queryClient = useQueryClient()

  const {data: friendRquests, isLoading} = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests
  })

  const {mutate: acceptRequestMutation, isPending} = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"])
      queryClient.invalidateQueries(["myFriends"])
    }
  })

  const incomingRequests = friendRquests?.inComingRequests || []
  const acceptedRequests = friendRquests?.acceptedRequests || []

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8 max-w-4xl">
        <h1 className="text-2x sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"/>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="card bg-base-200 hover:shadow-sm transition-shadow shadow-sm"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="avatar w-14 h-14 rounded-full bg-base-300">
                            <img
                              src={request.sender.profilePicture}
                              alt={request.sender.fullName}
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold">{request.sender.fullName}</h3>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className="badge badge-secondary badge-sm">
                                Native: {request.sender.nativeLanguage}
                              </span>
                              <span className="badge badge-secondary badge-sm">
                                Learning: {request.sender.learningLanguage}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={isPending}
                          className="btn btn-primary btn-sm"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage