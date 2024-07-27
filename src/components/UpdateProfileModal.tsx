"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { updateUserProfile } from "@/api/update-user-profile"; // Replace with your API call
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export type UpdateProfileFormInputs = {
  name: string;
  email: string;
  username: string;
  password: string;
  avatar: FileList;
};
export type UserFields = {
  name: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
};
const UpdateProfileModal: React.FC<{
  user: UserFields;
  onClose: () => void;
  open: boolean;
}> = ({ user, onClose, open }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdateProfileFormInputs>();

  useEffect(() => {
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("username", user.username);
  }, [user]);

  const onSubmit = async (data: UpdateProfileFormInputs) => {
    await updateUserProfile({ ...data });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => !isOpen && onClose()}
    >
      <DialogContent>
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
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", {
                required: "Username is required",
              })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="avatar">
              Avatar
            </label>
            <input
              id="avatar"
              type="file"
              {...register("avatar")}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded"
            />
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
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;
