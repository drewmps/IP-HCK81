import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/Login.page";
import LoginLayout from "./layouts/Login.layout";
import RegisterPage from "./pages/Register.page";
import RootLayout from "./layouts/Root.layout";
import HomePage from "./pages/Home.page";
import NewsDetailPage from "./pages/NewsDetail.page";
import ProfilePage from "./pages/Profile.page";
import DeleteAccountConfirmationPage from "./pages/DeleteAccountConfirmation.page";
import EditProfilePage from "./pages/EditProfile.page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginLayout />}>
          <Route index element={<LoginPage />} />
        </Route>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          <Route
            path="profile/delete"
            element={<DeleteAccountConfirmationPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
