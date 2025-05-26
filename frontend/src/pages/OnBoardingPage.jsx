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
    <div>OnBoardingPage</div>
  )
}

export default OnBoardingPage