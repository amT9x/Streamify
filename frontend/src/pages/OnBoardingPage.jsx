import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeOnboarding } from '../lib/api';

const OnBoardingPage = () => {
  const {authUser} = useAuthUser();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePicture: authUser?.profilePicture || "",
  });

  const {mutate: onboardingMutation, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarding success!");
      queryClient.invalidateQueries({queryKey: ['authUser']});
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // ngăn trình duyệt reload lại trang mặc định khi submit form
    onboardingMutation(formState);
  }

  return (
    <div className="min-h-screen ba-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete your profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile pic */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Image preview */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState?.profilePicture ? 
                (
                  <img 
                    src={formState.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover" />
                ) :
                (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )
                }
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage