"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/actions/user";
import { UserType } from "@/types/UserType";

interface SettingsFormProps {
  user: UserType;
}

const inputClass =
  "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm";

const labelClass = "block text-sm font-medium text-gray-700";

export default function SettingsForm({ user }: SettingsFormProps) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);

  const val = (field: string, fallback?: string) =>
    state?.fields?.[field] ?? fallback ?? "";

  return (
    <form action={action} className="flex flex-col gap-8">
      {state?.error && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded text-sm">
          {state.success}
        </div>
      )}

      {/* Profile info */}
      <div className="border rounded-lg p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-base">Profile Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              defaultValue={val("firstName", user.firstName)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              defaultValue={val("lastName", user.lastName)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={val("email", user.email)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Change password */}
      <div className="border rounded-lg p-6 flex flex-col gap-4">
        <div>
          <h2 className="font-semibold text-base">Change Password</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Leave blank to keep your current password.
          </p>
        </div>

        <div>
          <label htmlFor="currentPassword" className={labelClass}>
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="newPassword" className={labelClass}>
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className={labelClass}>
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
