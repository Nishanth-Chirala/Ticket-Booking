// client/src/pages/admin/Layout.jsx
import { Outlet } from "react-router-dom"
import AdminNavbar from "../../components/admin/AdminNavbar"
import AdminSideBar from "../../components/admin/AdminSideBar"
import { useAppContext } from "../../context/AppContextInstance"
import { useEffect } from "react"
import Loading from "../../components/Loading"
import { useAuth } from "@clerk/react"

const Layout = () => {
  const { isAdmin, fetchIsAdmin } = useAppContext()
  const { isLoaded, isSignedIn } = useAuth()

  // Only call fetchIsAdmin when auth is fully loaded and user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchIsAdmin()
    }
  }, [isLoaded, isSignedIn, fetchIsAdmin])

  // While Clerk is still loading, show loading spinner
  if (!isLoaded) {
    return <Loading />
  }

  // If user is not signed in at all, show sign-in message
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Please sign in to access the admin dashboard.</p>
      </div>
    )
  }

  // User is signed in — isAdmin check has been triggered.
  // If isAdmin is still false, it means either:
  // 1. The check is still in flight (show Loading)
  // 2. The user is not an admin (show unauthorized message)
  // We can't distinguish these without a separate loading state,
  // but fetchIsAdmin is fast. For now, show Loading briefly.
  if (isAdmin === null || isAdmin === undefined) {
    return <Loading />
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">
          You are not authorized to access the admin dashboard.
        </p>
      </div>
    )
  }

  return (
    <>
      <AdminNavbar />
      <div className="flex">
        <AdminSideBar />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Layout