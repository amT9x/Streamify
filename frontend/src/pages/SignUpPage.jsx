import React, { useState } from 'react'
import {ShipWheelIcon} from 'lucide-react'
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from '../lib/api';

const SignUpPage = () => {

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {mutate: signupMutation, isPending, error} = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["authUser"]}),
  });

  const handleSignup = (eventt) => {
    eventt.preventDefault();
    signupMutation(signupData);
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
      {/* Sign up form - left side */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
            Streamify
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )} 

          {/* Form */}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an account</h2>
                  <p className="text-sm opacity-70">
                    Join Streamify and start your languagelearning adventure!
                  </p>
                </div>
                {/* Fullname */}
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>

                    <input
                      type="text"
                      placeholder="TungHV"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                      required
                      />
                  </div>
                  {/* Email */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <input
                      type="email"
                      placeholder="...@email.com"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      required
                      />
                  </div>
                  {/* Password */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>

                    <input
                      type="password"
                      placeholder="********"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                      />
                    <div className="text-xs opacity-70 mt-1">
                    Passord must be at least 6 characters 
                    </div>
                  </div>
                  {/* Checkbox accept */}
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm"/>
                      <span className="text-xs leading-tight">
                        I agree to the {" "}
                        <span className="text-primary hover:underline">term of services</span> and {" "}
                        <span className="text-primary hover:underline">privacy policy</span>
                      </span>
                    </label>
                  </div>
                  {/* Submit sign up */}
                  <button className="btn btn-primary w-full" type="submit">
                    Create Account
                  </button>
                  {/* Sign in */}
                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Alreadly have an account? {" "}
                      <Link to="/login" className="text-primary hover:underline"> 
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

      {/* Sign up form - right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="../public/signup.png" alt="language connect illustration" className="w-full h-full"/>
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language parter worldwide</h2>
              <p className="opacity-70">
                Practives conversation, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage