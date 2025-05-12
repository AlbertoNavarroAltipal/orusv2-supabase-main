import type React from "react"
import { requireGuest } from "@/lib/auth/auth-utils"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireGuest()

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img className="h-12 w-auto" src="/logo.png" alt="ORUS" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">ORUS</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">{children}</div>
      </div>
    </div>
  )
}
