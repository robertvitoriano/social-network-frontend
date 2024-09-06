import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/api/update-user-profile"; // Replace with your API call
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useAuthStore } from "@/lib/store/authStore";
import { LogOut } from "lucide-react";
import { signOut } from "@/api/sign-out";
import { useRouter } from "next/navigation";

export type UpdateProfileFormInputs = {
  name: string;
  username: string;
};

const UpdateProfileModal: React.FC<{
  onClose: () => void;
  open: boolean;
}> = ({ onClose, open }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateProfileFormInputs>();
  const loggedUser = useAuthStore((state) => state.loggedUser);
  const setLoggedUser = useAuthStore((state) => state.setLoggedUser);

  const router = useRouter();

  useEffect(() => {
    setValue("name", loggedUser.name);
    setValue("username", loggedUser.username);
  }, [loggedUser, setValue]);

  const onSubmit = async (data: UpdateProfileFormInputs) => {
    const { name, username } = data;
    setLoggedUser({ ...loggedUser, name, username });
    updateUserProfile({ ...data })
      .then((updatedUser) => {
        if (updatedUser) {
          setLoggedUser(updatedUser);
        }
      })
      .catch(() => {
        setLoggedUser(loggedUser);
      });

    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => !isOpen && onClose()}
    >
      <DialogContent className="bg-secondary text-white">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border text-primary border-gray-300 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-3 py-2 border text-primary  border-gray-300 rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              <LogOut className="mr-2" />
              Log Out
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;
