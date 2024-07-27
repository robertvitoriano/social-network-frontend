import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/api/update-user-profile"; // Replace with your API call
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { LoggedUser, useAuthStore } from "@/lib/store/authStore";

export type UpdateProfileFormInputs = {
  name: string;
  email: string;
  username: string;
  password: string;
  avatar: FileList;
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

  const [avatarURL, setAvatarURL] = useState<string | null>(
    loggedUser.avatar || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue("name", loggedUser.name);
    setValue("email", loggedUser.email);
    setValue("username", loggedUser.username);
  }, [loggedUser, setValue]);

  const onSubmit = async (data: UpdateProfileFormInputs) => {
    const avatar = fileInputRef.current?.files;

    const { name, username, email } = data;
    if (!avatar) return;
    setLoggedUser({ ...loggedUser, name, username, email, avatar: avatarURL! });
    updateUserProfile({ ...data, avatar })
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

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setAvatarURL(url);
      }
    }
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
              {...register("username", { required: "Username is required" })}
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
          <div className="mb-4 relative">
            <div
              style={{
                backgroundImage: `url(${avatarURL})`,
              }}
              className="h-32 w-32 bg-cover bg-center bg-black rounded-full border-4 border-secondary border-solid cursor-pointer"
            >
              <div
                className=" w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
                onClick={handleOpenFilePicker}
              >
                <span className="text-white text-lg text-center">
                  Change avatar
                </span>
                <label htmlFor="avatar">
                  <input
                    ref={fileInputRef}
                    id="avatar"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
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
