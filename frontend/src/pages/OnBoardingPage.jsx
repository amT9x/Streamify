import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeOnboarding } from '../lib/api';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheel, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants';

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePicture: authUser?.profilePicture || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarding success!");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // ngăn trình duyệt reload lại trang mặc định khi submit form
    onboardingMutation(formState);
  }

  const handleRandomAvartar = () => {}

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
              {/* Generation random avatar Button */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvartar} className="btn btn-accent" style={{backgroundColor: "#20b6aa", borderColor: "#20b6aa"}}>
                  <span>{<ShuffleIcon className="size-4 mr-2"/>}</span>Generate Random Avatar
                </button>
              </div>
            </div>
              {/* Full name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Your full name"
                  value={formState.fullName}
                  onChange={(e) => setFormState({...formState, fullName: e.target.value})}
                  className="input input-bordered w-full" />
              </div>
              {/* Bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <input
                  type="text"
                  name="bio"
                  placeholder="Tell others about yourself and your language learning goals"
                  value={formState.bio}
                  onChange={(e) => setFormState({...formState, bio: e.target.value})}
                  className="textarea textarea-bordered h-24" />
              </div>
              {/* Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Native Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({...formState, nativeLanguage: e.target.value})}
                    className="select select-bordered w-full">
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </select>
                </div>
                {/* Learning Language */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Learn Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState({...formState, learningLanguage: e.target.value})}
                    className="select select-bordered w-full">
                    <option value="">Select your learning language</option>
                    {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Locations */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-70" />
                  <input
                  type="text"
                  name="location"
                  placeholder="City, Country"
                  value={formState.location}
                  onChange={(e) => setFormState({...formState, location: e.target.value})}
                  className="input input-bordered w-full pl-10" />
                </div>
              </div>
              {/* Submit Button */}
              <button
                className="btn btn-primary w-full"
                disabled={isPending}
                type="submit">
                {!isPending ?
                (
                  <>
                    <ShipWheel className="size-4 mr-2" />
                    Complete Onboarding
                  </>
                ) :
                (
                  <>
                    <LoaderIcon className="size-4 mr-2" />
                    OnBoarding...
                  </>
                )
                }
              </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnBoardingPage